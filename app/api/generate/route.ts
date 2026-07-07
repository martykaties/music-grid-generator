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
      input: `You are creating a music game for a UK bar audience.
      Generate exactly 20 songs based on this theme: "${theme}".
      
      Choose songs that are:
      - Well known and recognisable to a general UK audience.
      - Clearly and accurately connected to the requested theme.
      - Suitable for use in a fun music quiz or bingo-style game.
      - A good mix of artists where the theme allows.
      - Not duplicated.
      - Not different versions, remixes or covers of the same song unless specifically requested by the theme.

      Accuracy is extremely important. Do not invent songs, artists or collaborations.

      Return only valid JSON in this exact format:
      [

      {"artist":"Artist Name","song":"Song Title"}
      ]

      Rules:
      - Return exactly 20 items.
      - Every item must contain an artist and song.
      - Do not include explanations.
      - Do not include markdown.
      - Do not include numbering.
      - Do not include any text before or after the JSON.`,
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