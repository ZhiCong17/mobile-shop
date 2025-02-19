import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className='flex items-center gap-4 pb-4'>
      <Skeleton className='w-4 h-4 rounded' />
      <Skeleton className='w-24 h-24 rounded' />
      <div className='relative h-24 flex-grow'>
        <Skeleton className='mt-2 w-28 h-6' />
        <div className='absolute bottom-2 left-0 flex justify-between w-full'>
          <Skeleton className='w-12 h-6 my-auto' />
          <div className='flex gap-3'>
            <Skeleton className='w-7 h-7' />
            <Skeleton className='w-2 h-7' />
            <Skeleton className='w-7 h-7' />
          </div>        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
