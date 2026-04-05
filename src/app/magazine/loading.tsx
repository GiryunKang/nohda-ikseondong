export default function MagazineLoading() {
  return (
    <div className="flex-1">
      <div className="px-5 pb-6 pt-12">
        <div className="mx-auto max-w-5xl">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-9 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 w-16 shrink-0 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-64 animate-pulse rounded-lg bg-muted md:h-80" />
          <div className="mt-14 grid gap-5 md:grid-cols-5">
            <div className="h-48 animate-pulse rounded-lg bg-muted md:col-span-3" />
            <div className="h-48 animate-pulse rounded-lg bg-muted md:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
