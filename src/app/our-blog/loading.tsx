export default function Loading() {
  return (
    <main>
      {/* Header skeleton */}
      <section className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-40 animate-pulse rounded bg-cool-charcoal/10" />
        </div>
      </section>

      {/* Card list skeleton */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border border-cool-charcoal/10 rounded-lg bg-white p-6 lg:p-8"
              >
                {/* Category + date row */}
                <div className="flex gap-3 mb-3">
                  <div className="h-5 w-28 animate-pulse rounded bg-cool-charcoal/10" />
                  <div className="h-5 w-24 animate-pulse rounded bg-cool-charcoal/10" />
                </div>
                {/* Title */}
                <div className="h-6 w-3/4 animate-pulse rounded bg-cool-charcoal/10 mb-2" />
                {/* Excerpt */}
                <div className="space-y-1.5">
                  <div className="h-4 animate-pulse rounded bg-cool-charcoal/5" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-cool-charcoal/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
