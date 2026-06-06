import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Image
          src="/assets/logo-wordmark-noir.svg"
          alt="Drone Network"
          width={320}
          height={48}
          priority
          className="h-12 w-auto mx-auto mb-8"
        />
        <p className="eyebrow mb-3">Carte interactive</p>
        <h1 className="text-3xl mb-4">L&apos;écosystème centralisé</h1>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--fg2)" }}
        >
          Repo scaffold prêt. Port du prototype en cours. Lancement public fin août 2026
          au Drone Fan Canada à Beauce.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime text-sap-700 font-[var(--font-display)] text-xs uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-sap-700 animate-pulse" />
          En développement
        </div>
      </div>
    </main>
  );
}
