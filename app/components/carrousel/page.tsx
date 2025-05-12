"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

interface Album {
  id: number;
  title: string;
  cover: string;
}

const CompanyCarousel = () => {
  const [data, setData] = useState<Album[]>([]);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const albumIds = [390984, 91973, 620594, 708679, 11666166, 64572632];

        const responses = await Promise.all(
          albumIds.map((id) =>
            fetch(`http://localhost:3000/music/album/${id}`).then((res) =>
              res.json()
            )
          )
        );

        const albums: Album[] = responses.map((album) => ({
          id: album.id,
          title: album.title,
          cover: album.cover,
        }));

        setData(albums);
      } catch (error) {
        console.error("Erro ao carregar álbuns:", error);
      }
    }

    fetchAlbums();
  }, []);

  if (data.length === 0) return <div>Carregando...</div>;

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 1000,
        }),
      ]}
      className="w-full bg-white text-black py-8"
    >
      <div className="mb-4">
        <h1 className="text-xl font-medium flex justify-start">
          Popular Albums
        </h1>
      </div>
      <CarouselContent>
        {data.map((item) => (
          <Link key={item.id} href={`/music/${item.id}`}>
            <CarouselItem>
              <div className="flex flex-col items-center">
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={300}
                  height={300}
                  className="rounded-full transition-transform duration-700 hover:scale-105"
                  quality={100}
                />
                <h2 className="mt-2 text-sm text-black">{item.title}</h2>
              </div>
            </CarouselItem>
          </Link>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarousel;
