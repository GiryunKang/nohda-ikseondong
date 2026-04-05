export default function ArticleLoading() {
  return (
    <div className="flex-1">
      <div className="px-5 pb-6 pt-12">
        <div className="mx-auto max-w-3xl">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-muted" />
          <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-4 flex gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
      <div className="px-5 py-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
