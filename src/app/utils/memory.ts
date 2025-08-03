import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: PineconeClient | SupabaseClient | Pool;

  public constructor() {
    try {
      this.history = Redis.fromEnv();
      if (process.env.VECTOR_DB === "pinecone") {
        this.vectorDBClient = new PineconeClient();
      } else {
        // Используем PostgreSQL Railway с pgvector
        const url = process.env.DATABASE_URL;
        if (!url) {
          console.error("ERROR: DATABASE_URL is not set");
          throw new Error("DATABASE_URL is required");
        }
        this.vectorDBClient = new Pool({
          connectionString: url,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });
      }
    } catch (error) {
      console.error("ERROR: Failed to initialize MemoryManager:", error);
      throw error;
    }
  }

  public async init() {
    if (this.vectorDBClient instanceof PineconeClient) {
      await this.vectorDBClient.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
    } else if (this.vectorDBClient instanceof Pool) {
      // Инициализация PostgreSQL с pgvector
      try {
        const client = await this.vectorDBClient.connect();
        await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
        await client.query(`
          CREATE TABLE IF NOT EXISTS documents (
            id bigserial primary key,
            content text,
            metadata jsonb,
            embedding vector(1536)
          );
        `);
        await client.query(`
          CREATE OR REPLACE FUNCTION match_documents (
            query_embedding vector(1536),
            match_count int DEFAULT null,
            filter jsonb DEFAULT '{}'
          ) returns table (
            id bigint,
            content text,
            metadata jsonb,
            similarity float
          )
          language plpgsql
          as $$
          #variable_conflict use_column
          begin
            return query
            select
              id,
              content,
              metadata,
              1 - (documents.embedding <=> query_embedding) as similarity
            from documents
            where metadata @> filter
            order by documents.embedding <=> query_embedding
            limit match_count;
          end;
          $$;
        `);
        client.release();
        console.log("INFO: PostgreSQL with pgvector initialized successfully.");
      } catch (error) {
        console.error("ERROR: Failed to initialize PostgreSQL:", error);
      }
    }
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    if (process.env.VECTOR_DB === "pinecone") {
      console.log("INFO: using Pinecone for vector search.");
      const pineconeClient = <PineconeClient>this.vectorDBClient;

      const pineconeIndex = pineconeClient.Index(
        process.env.PINECONE_INDEX! || ""
      );

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
        { pineconeIndex }
      );

      const similarDocs = await vectorStore
        .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
        .catch((err) => {
          console.log("WARNING: failed to get vector search results.", err);
        });
      return similarDocs;
    } else {
      console.log("INFO: using PostgreSQL Railway for vector search.");
      const pool = <Pool>this.vectorDBClient;
      
      try {
        const embeddings = new OpenAIEmbeddings({ 
          openAIApiKey: process.env.OPENAI_API_KEY 
        });
        
        const queryEmbedding = await embeddings.embedQuery(recentChatHistory);
        
        const client = await pool.connect();
        const result = await client.query(
          `SELECT id, content, metadata, 
           1 - (embedding <=> $1) as similarity 
           FROM documents 
           WHERE metadata @> $2 
           ORDER BY embedding <=> $1 
           LIMIT 3`,
          [queryEmbedding, JSON.stringify({ fileName: companionFileName })]
        );
        client.release();
        
        return result.rows.map(row => ({
          pageContent: row.content,
          metadata: row.metadata,
          similarity: row.similarity
        }));
      } catch (err) {
        console.log("WARNING: failed to get vector search results from PostgreSQL.", err);
        return [];
      }
    }
  }

  public static async getInstance(): Promise<MemoryManager> {
    try {
      if (!MemoryManager.instance) {
        MemoryManager.instance = new MemoryManager();
        await MemoryManager.instance.init();
      }
      return MemoryManager.instance;
    } catch (error) {
      console.error("ERROR: Failed to get MemoryManager instance:", error);
      throw error;
    }
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      return;
    }
    const key = this.generateRedisCompanionKey(companionKey);
    await this.history.lpush(key, text);
    // Keep only the last 50 messages
    await this.history.ltrim(key, 0, 49);
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      return "";
    }
    const key = this.generateRedisCompanionKey(companionKey);
    const chatHistory = await this.history.lrange(key, 0, 49);
    return chatHistory.reverse().join("\n");
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    companionKey: CompanionKey
  ) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      return;
    }
    const key = this.generateRedisCompanionKey(companionKey);
    const lines = seedContent.split(delimiter);
    for (const line of lines) {
      if (line.trim() !== "") {
        await this.history.lpush(key, line.trim());
      }
    }
    // Keep only the last 50 messages
    await this.history.ltrim(key, 0, 49);
  }
}

export default MemoryManager;
