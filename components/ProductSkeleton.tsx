export default function ProductSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-[#F0E2C4] bg-white shadow-sm motion-reduce:animate-none"
    >
      <div className="aspect-square w-full bg-gray-200" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mt-2 min-h-[3.5rem] space-y-2">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-5 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="mt-1 h-7 w-24 rounded bg-gray-200" />
        <div className="mt-1 space-y-1">
          <div className="h-5 w-full rounded bg-gray-100" />
          <div className="h-5 w-4/5 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
