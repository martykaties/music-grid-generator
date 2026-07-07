"use client";

import { useState } from "react";

type Song = {
  artist: string;
  song: string;
};

export default function Home() {
  const [theme, setTheme] = useState("Boybands");
  const [grid, setGrid] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateGrid() {
  
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    });
   

    const data = await response.json();

    if (data.songs) {
      setGrid(data.songs);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Music Grid Generator</h1>

        <p className="mb-6 text-gray-300">
          Type a theme and let AI create a 20-square music grid.
        </p>

        <div className="flex gap-3 mb-6">
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="flex-1 p-3 rounded bg-white text-black"
            placeholder="Enter a theme, e.g. Boybands"
          />

          <button
            onClick={generateGrid}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded font-bold"
          >
            {loading ? "Generating..." : "Generate Grid"}
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Theme: {theme}</h2>

        <div className="grid grid-cols-5 gap-3">
          {grid.map((item, index) => (
            <div
              key={index}
              className="border border-white rounded p-4 min-h-28 flex flex-col justify-center text-center"
            >
              <div className="font-bold">{item.artist}</div>
              <div className="text-sm text-gray-300 mt-2">{item.song}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}