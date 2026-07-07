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
  const [error, setError] = useState("");

  async function generateGrid() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      setGrid([]);
    } else if (data.songs) {
      setGrid(data.songs);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 no-print">
          Music Grid Generator
        </h1>

        <p className="mb-6 text-gray-300 no-print">
          Type a theme and let AI create a 20-square music grid.
        </p>

        <div className="flex gap-3 mb-6 no-print">
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

        {error && (
          <div className="bg-red-900 border border-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Theme: {theme}</h2>

        <div className="grid grid-cols-5 gap-3 print-grid">
          {grid.map((item, index) => (
            <div
              key={index}
              className="border border-white rounded p-4 min-h-28 flex flex-col justify-center text-center print-card"
            >
              <div className="font-bold">{item.artist}</div>
              <div className="text-sm text-gray-300 mt-2">{item.song}</div>
            </div>
          ))}
        </div>

        {grid.length > 0 && (
          <div className="mt-6 no-print">
            <button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded font-bold"
            >
              Print Grid
            </button>
          </div>
        )}
      </div>
    </main>
  );
}