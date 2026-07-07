import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { theme } = await request.json();

    const response = await client.responses.create({
      model: "gpt-5.4-nano",
      input: `Generate exactly 20 well-known songs for this music quiz theme: "${theme}".

Return only valid JSON in this exact format:
[
  {"artist":"Artist Name","song":"Song Title"}
]

Rules:
- Exactly 20 items.
- Use a good mix of recognisable songs.
- No explanations.
- No markdown.
- No numbering.`,
    });

    const text = response.output_text;
    const songs = JSON.parse(text);

    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not generate songs. Please try again." },
      { status: 500 }
    );
  }
}