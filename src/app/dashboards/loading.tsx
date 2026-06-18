export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-cool-white" />
        ))}
      </div>
    </div>
  )
}
