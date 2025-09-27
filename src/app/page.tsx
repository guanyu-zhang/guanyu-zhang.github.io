import ThreeScene from '@/components/ThreeScene';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <ThreeScene />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Guanyu Zhang
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mt-4 max-w-2xl mx-auto">
            Crafting intelligent and scalable distributed systems.
          </p>
        </div>
      </div>
    </main>
  );
}
