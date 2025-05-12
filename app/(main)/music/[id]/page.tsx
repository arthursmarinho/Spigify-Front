import { notFound } from "next/navigation";
import Link from "next/link";

interface Album {
  id: number;
  title: string;
  cover_big: string;
  duration: number;
  release_date: number;
}

interface Track {
  id: number;
  title: string;
  preview: string;
  duration: number;
}

export default async function AlbumPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`http://localhost:3000/music/album/${params.id}`);

  if (!res.ok) return notFound();

  const data: Album = await res.json();

  const durationMinutes = (data.duration / 60).toFixed(1);

  const tracksRes = await fetch(
    `https://api.deezer.com/album/${params.id}/tracks`
  );
  const tracksData = await tracksRes.json();
  const tracks: Track[] = tracksData.data;

  return (
    <div className="mt-8 px-4 text-black bg-white">
      <Link href="/dashboard" className="text-lg underline">
        Back to search
      </Link>
      <h2 className="text-base font-semibold mt-6 mb-4">Músicas</h2>
      <ul className="space-y-2 max-w-2xl">
        {tracks.map((track) => (
          <li
            key={track.id}
            className="border border-black rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <span className="text-sm">{track.title}</span>
            <audio controls className="mt-2">
              <source src={track.preview} type="audio/mpeg" />
              Seu navegador não suporta áudio.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
}
