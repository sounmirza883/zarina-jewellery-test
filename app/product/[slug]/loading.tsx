import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-6 sm:py-10">
      <Skeleton className="mb-6 h-4 w-56" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12" role="status" aria-label="Loading product">
        <div>
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-14" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="mt-16">
        <ProductGridSkeleton count={4} />
      </div>
    </Container>
  );
}
