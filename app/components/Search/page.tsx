"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../button";
import { Input } from "../input";
import { toast } from "react-toastify";

interface Album {
  id: number;
  title: string;
  cover_big: string;
}

interface Track {
  id: number;
  title: string;
  preview: string;
  duration: number;
}

export default function SearchMusic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  async function handleSearchAlbum(e: React.FormEvent) {
    e.preventDefault();
    setSelectedAlbum(null);
    setTracks([]);

    if (!searchTerm.trim()) {
      toast.error("Search something to start...");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://spigify-back.onrender.com/music/search/${searchTerm}`
      );
      const data = await response.json();
      setResults(data);

      if (data.length === 0) {
        toast.error("Nothing found...");
      }
    } catch (error) {
      toast.error("Error during search.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectAlbum(album: Album) {
    setSelectedAlbum(album);
    setTracks([]);
    try {
      const response = await fetch(
        `https://spigify-back.onrender.com/music/album/${album.id}/tracks`
      );
      const data = await response.json();
      setTracks(data.data);
    } catch (error) {
      toast.error("Failed to fetch album tracks.");
      console.error("Tracks fetch error:", error);
    }
  }

  return (
    <div className="max-w-4xl p-6">
      <form onSubmit={handleSearchAlbum} className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-full bg-gray-800/30 backdrop-blur-lg border-0"
        />
        <Button variant="default" type="submit">
          {loading ? "Loading..." : "Search"}
        </Button>
      </form>

      {!selectedAlbum && (
        <div className="grid grid-cols-2 gap-4">
          {results.slice(0, 6).map((album) => (
            <button
              key={album.id}
              onClick={() => handleSelectAlbum(album)}
              className="bg-white/25 rounded-2xl shadow-md p-4 hover:shadow-lg transition text-left"
            >
              <Image
                src={album.cover_big}
                alt={album.title}
                className="mb-2"
                width={100}
                height={100}
                unoptimized
              />
              <h3 className="text-sm font-medium text-center text-black">
                {album.title}
              </h3>
            </button>
          ))}
        </div>
      )}

      {selectedAlbum && (
        <div className="mt-8">
          <button
            onClick={() => {
              setSelectedAlbum(null);
              setTracks([]);
            }}
            className="text-blue-600 underline mb-4 block"
          >
            ← Back to results
          </button>

          <h2 className="text-lg font-semibold mb-4 text-black">
            {selectedAlbum.title}
          </h2>

          <ul className="space-y-2 max-w-2xl">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="border border-black rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <span className="text-sm text-black">{track.title}</span>
                <audio controls className="mt-2 sm:mt-0">
                  <source src={track.preview} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
