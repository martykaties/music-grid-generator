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
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  async function generateGrid() {
    setLoading(true);
    setError("");

    try {
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
    } catch {
      setError("Something went wrong. Please try again.");
      setGrid([]);
    }

    setLoading(false);
  }

  async function replaceGridSong(indexToReplace: number) {
    setReplacingIndex(indexToReplace);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          replaceSong: true,
          existingSongs: grid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not replace the song. Please try again.");
      } else if (data.songs && data.songs[0]) {
        const updatedGrid = [...grid];
        updatedGrid[indexToReplace] = data.songs[0];
        setGrid(updatedGrid);
      }
    } catch {
      setError("Could not replace the song. Please try again.");
    }

    setReplacingIndex(null);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 no-print">
          Katie&apos;s Karaoke Challenge Generator
        </h1>

        <p className="mb-6 text-gray-300 no-print">
          Enter this week&apos;s advertised theme to generate a 20-song karaoke
          challenge. You can edit any artist or song manually, or use Replace to
          generate a new suggestion. Once you&apos;re happy with the list, print
          it for the karaoke host.
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
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Grid"}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-500 text-white p-4 rounded mb-6 no-print">
            {error}
          </div>
        )}

        {grid.length > 0 && (
          <>
            <div className="mb-4 text-center">
              <h2 className="text-3xl font-bold">Karaoke Challenge</h2>
              <p className="text-xl mt-1">Theme: {theme}</p>
            </div>

            <div className="grid grid-cols-5 gap-3 print-grid">
              {grid.map((item, index) => (
                <div
                  key={index}
                  className="border border-white rounded p-4 min-h-28 flex flex-col justify-center text-center print-card"
                >
                  <input
                    value={item.artist}
                    onChange={(e) => {
                      const updatedGrid = [...grid];
                      updatedGrid[index].artist = e.target.value;
                      setGrid(updatedGrid);
                    }}
                    className="font-bold text-center bg-transparent border-none outline-none w-full no-print"
                  />

                  <div className="hidden print:block font-bold">
                    {item.artist}
                  </div>

                  <input
                    value={item.song}
                    onChange={(e) => {
                      const updatedGrid = [...grid];
                      updatedGrid[index].song = e.target.value;
                      setGrid(updatedGrid);
                    }}
                    className="text-sm text-gray-300 mt-2 text-center bg-transparent border-none outline-none w-full no-print"
                  />

                  <div className="hidden print:block text-sm mt-2">
                    {item.song}
                  </div>

                  <button
                    onClick={() => replaceGridSong(index)}
                    disabled={replacingIndex !== null}
                    className="mt-3 text-xs border border-gray-500 rounded px-2 py-1 hover:bg-gray-800 no-print disabled:opacity-50"
                  >
                    {replacingIndex === index ? "Replacing..." : "Replace"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 no-print">
              <button
                onClick={() => window.print()}
                className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded font-bold"
              >
                Print Grid
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}