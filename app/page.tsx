import MapWrapper from "@/components/MapWrapper";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col bg-[#0d0d0d]">
      {/* Header */}
      <header className="shrink-0 px-6 py-3 flex items-center justify-between border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <span className="text-[#c9b78a] font-serif text-xl tracking-widest uppercase">
            ABOW
          </span>
          <span className="text-[#444] text-xs tracking-[0.2em] uppercase mt-0.5">
            Ancient Boats · Overwhelmed Waters
          </span>
        </div>
        <div className="text-[#444] text-xs tracking-widest uppercase">
          Atlas · Prototype
        </div>
      </header>

      {/* Map fills remaining space */}
      <div className="flex-1 relative">
        <MapWrapper />
      </div>
    </main>
  );
}
