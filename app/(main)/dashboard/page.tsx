import SearchMusic from "../../components/Search/page";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Buscar Músicas
      </h1>
      <div className="max-w-5xl mx-auto">
        <SearchMusic />
      </div>
    </div>
  );
}
