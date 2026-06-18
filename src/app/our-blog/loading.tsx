export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="flex flex-col gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-cool-white" />
        ))}
      </div>
    </div>
  )
}
