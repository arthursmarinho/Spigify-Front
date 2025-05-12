"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../button";
import { Input } from "../input";
import { toast } from "react-toastify";

interface Album {
  id: number;
  title: string;
  cover_big: string;
}

export default function SearchMusic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearchAlbum(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!searchTerm.trim()) {
      toast.error("Search something to start...");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/music/search/${searchTerm}`
      );
      const data = await response.json();
      setResults(data);

      if (data.length === 0) {
        toast.error("Nothing found...");
      }
    } catch (error) {
      toast.error("Search something to start...");
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
          Search..
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {results.slice(0, 6).map((album) => (
          <Link key={album.id} href={`/music/${album.id}`}>
            <div
              key={album.id}
              className="bg-white/25 rounded-2xl shadow-md p-4 hover:shadow-lg transition"
            >
              <Image
                src={album.cover_big}
                alt={album.title}
                className="mb-2"
                width={50}
                height={50}
                unoptimized
              />
              <h3 className="text-sm font-medium text-center text-black">
                {album.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
