"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Album {
  id: number;
  title: string;
  cover: string;
}

export default function Album() {
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const response = await fetch(
          `http://localhost:3000/music/album/689331`
        );
        const data = await response.json();

        const albumData: Album = {
          id: data.id,
          title: data.title,
          cover: data.cover,
        };

        setAlbum(albumData);
      } catch (error) {
        console.error("Erro ao carregar álbum:", error);
      }
    }

    fetchAlbum();
  }, []);

  if (!album) return <div>Carregando...</div>;

  return (
    <div>
      <h2>{album.title}</h2>
      <Image src={album.cover} alt={album.title} width={200} height={100} />
    </div>
  );
}
