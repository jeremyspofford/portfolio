export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo/spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Loading text with typing animation */}
        <div className="flex items-center gap-1 text-muted-foreground font-mono text-sm">
          <span>Loading</span>
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-100">.</span>
          <span className="animate-pulse delay-200">.</span>
        </div>
      </div>

      {/* Skeleton content preview */}
      <div className="w-full max-w-5xl mx-auto px-6 mt-16 space-y-8 animate-pulse">
        {/* Hero skeleton */}
        <div className="text-center space-y-4">
          <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto" />
          <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto" />
        </div>

        {/* Content skeletons */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
