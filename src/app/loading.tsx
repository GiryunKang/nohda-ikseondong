export default function Loading() {
  return (
    <div className="flex-1">
      {/* Hero skeleton */}
      <div className="min-h-[70vh] animate-pulse bg-muted" />
      {/* Content skeleton */}
      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-5 md:grid-cols-5 md:grid-rows-2">
          <div className="h-64 animate-pulse rounded-lg bg-muted md:col-span-3 md:row-span-2" />
          <div className="h-28 animate-pulse rounded-lg bg-muted md:col-span-2" />
          <div className="h-28 animate-pulse rounded-lg bg-muted md:col-span-2" />
        </div>
      </div>
    </div>
  )
}
