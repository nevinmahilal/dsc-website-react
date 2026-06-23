export default function Loading() {
  return (
    <main>
      {/* Header skeleton */}
      <div className="pt-24 pb-12 bg-cool-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-48 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter row skeleton */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-10 w-28 animate-pulse rounded bg-neutral-200" />
            ))}
          </div>

          {/* Card skeletons — mirrors ContentCard layout */}
          <div className="space-y-4">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="border border-cool-charcoal/10 rounded-lg bg-white p-6 lg:p-8"
              >
                {/* Title line */}
                <div className="h-5 w-2/5 animate-pulse rounded bg-neutral-200 mb-4" />
                {/* 3-column body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map(col => (
                    <div key={col}>
                      <div className="h-3 w-16 animate-pulse rounded bg-neutral-200 mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-3 animate-pulse rounded bg-neutral-200" />
                        <div className="h-3 animate-pulse rounded bg-neutral-200" />
                        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
