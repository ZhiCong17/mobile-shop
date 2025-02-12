import ProductDisplay from './ProductDisplay';
import SearchBar from './SearchBar';
import CategoryFilterMenu from './CategoryFilterMenu';
import NavBar from '@/components/NavBar';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/store';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const clearCategory = useCategoryStore(state => state.clearCategory);

  useEffect(() => {
    return () => {
      clearCategory();
    }
  }, [clearCategory])

  return (
    <div className='pb-20'>
      {loading ? (
        <div className='m-5'>
          <Skeleton className="w-full h-10 rounded-full" />
        </div>
      ) : (
        <SearchBar className='m-5'/>
      )}

      <div className='grid grid-cols-4'>
        <div className='col-span-1'>
          {loading ? (
            <Skeleton className="h-lvh rounded-r-lg" />
          ) : (
            <CategoryFilterMenu />
          )}
        </div>
        <div className='col-span-3 mr-5'>
          <ProductDisplay loading={loading} setLoading={setLoading} />
        </div>
      </div>
      <NavBar />
    </div>
  );
}

export default HomePage;
