import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container as="main" className="py-10 sm:py-14">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="mb-6 h-11 w-full" />
      <ProductGridSkeleton />
    </Container>
  );
}
