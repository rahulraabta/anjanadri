"use client";

export default function Error({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 text-center">
      <h1 className="font-heading text-2xl font-bold text-[#2E7D32]">
        We couldn&apos;t load this page
      </h1>
      <p className="mt-4">Please try again shortly.</p>
      <button
        onClick={retry}
        className="mt-6 rounded-xl bg-[#F57C00] px-6 py-3 font-semibold text-white"
      >
        Try again
      </button>
    </main>
  );
}
