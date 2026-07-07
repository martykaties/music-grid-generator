import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { theme, replaceSong, existingSongs } = await request.json();

    const prompt = replaceSong
      ? `You are creating a karaoke game for a UK bar audience.

Generate exactly 1 replacement song based on this theme: "${theme}".

Do not use any of these existing songs:
${JSON.stringify(existingSongs)}

Choose a song that is:
- Well known and recognisable to a general UK audience.
- Clearly and accurately connected to the requested theme.
- Suitable for karaoke.
- Not duplicated.

Return only valid JSON in this exact format:
[
  {"artist":"Artist Name","song":"Song Title"}
]

Rules:
- Return exactly 1 item.
- Do not include explanations.
- Do not include markdown.
- Do not include numbering.`
      : `You are creating a karaoke game for a UK bar audience.

Generate exactly 20 songs based on this theme: "${theme}".

Choose songs that are:
- Well known and recognisable to a general UK audience.
- Clearly and accurately connected to the requested theme.
- Suitable for karaoke.
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
- Do not include any text before or after the JSON.`;

    const response = await client.responses.create({
      model: "gpt-5.4-nano",
      input: prompt,
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