import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="flex items-center gap-2 min-[425px]:gap-6 pb-4">
      <Skeleton className="w-4 h-4 rounded" />
      <div className="flex w-full max-w-xs border rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-24 h-24" />
        <div className="relative h-24 flex-grow mx-2">
          <Skeleton className="mt-1 w-28 h-6" />
          <div className="absolute bottom-1 left-0 flex justify-between w-full">
            <Skeleton className="w-12 h-6 my-auto" />
            <div className="flex gap-3">
              <Skeleton className="w-7 h-7" />
              <Skeleton className="w-2 h-7" />
              <Skeleton className="w-7 h-7" />
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
