import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a crypto analyst named CoinVista AI",
      },
      { role: "user", content: prompt },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: false,
    reasoning_effort: "medium",
  });

  return NextResponse.json({
    data: chatCompletion.choices[0]?.message?.content || "",
  });
}
