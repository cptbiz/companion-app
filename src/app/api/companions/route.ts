import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const companionsPath = path.join(process.cwd(), 'companions', 'companions.json');
    const data = fs.readFileSync(companionsPath, 'utf8');
    const companions = JSON.parse(data);
    
    return NextResponse.json(companions);
  } catch (error) {
    console.error('Error reading companions:', error);
    
    // Return fallback data
    return NextResponse.json([
      {
        name: "Alice",
        title: "AI Assistant",
        imageUrl: "/alice.jpg",
        llm: "GPT-4",
        phone: "",
        telegramLink: null
      }
    ]);
  }
} 