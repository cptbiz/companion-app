import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: PineconeClient | SupabaseClient;

  public constructor() {
    this.history = Redis.fromEnv();
    if (process.env.VECTOR_DB === "pinecone") {
      this.vectorDBClient = new PineconeClient();
    } else {
      // Используем PostgreSQL Railway вместо Supabase
      const auth = {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      };
      
      // Используем DATABASE_URL из Railway PostgreSQL
      const url = process.env.DATABASE_URL || process.env.SUPABASE_URL!;
      const privateKey = process.env.SUPABASE_PRIVATE_KEY || "postgres";
      
      this.vectorDBClient = createClient(url, privateKey, { auth });
    }
  }

  public async init() {
    if (this.vectorDBClient instanceof PineconeClient) {
      await this.vectorDBClient.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
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
      const supabaseClient = <SupabaseClient>this.vectorDBClient;
      const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
        {
          client: supabaseClient,
          tableName: "documents",
          queryName: "match_documents",
        }
      );
      const similarDocs = await vectorStore
        .similaritySearch(recentChatHistory, 3)
        .catch((err) => {
          console.log("WARNING: failed to get vector search results.", err);
        });
      return similarDocs;
    }
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
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
