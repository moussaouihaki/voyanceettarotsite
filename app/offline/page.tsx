export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-6xl">🌙</div>
      <h1 className="font-serif text-3xl text-[#e8c875]">Hors connexion</h1>
      <p className="max-w-sm text-[#b8a89a]">
        Les étoiles sont temporairement voilées. Reconnectez-vous à Internet pour
        accéder aux arts divinatoires de Madame Céleste.
      </p>
      <a
        href="/"
        className="mt-2 rounded-full border border-[#e8c875]/40 px-6 py-2 text-sm text-[#e8c875] transition hover:bg-[#e8c875]/10"
      >
        Réessayer
      </a>
    </main>
  );
}
