import ProductDisplay from './ProductDisplay';
import SearchBar from './SearchBar';
import CategoryFilterMenu from './CategoryFilterMenu';
import NavBar from '@/components/NavBar';

import { useEffect } from 'react';

import useProductStore from '@/store/useProductStore';

function HomePage() {
  const { fetchProducts, hasFetched, clearCategoryFilter } = useProductStore();

  useEffect(() => {
    if (!hasFetched) {
      fetchProducts();
    }
  }, [fetchProducts, hasFetched]);

  useEffect(() => {
    return () => {
      clearCategoryFilter();
    }
  }, [clearCategoryFilter]);

  return (
    <div className='pb-20'>
      <SearchBar className='m-5'/>

      <div className='grid grid-cols-4'>
        <div className='col-span-1'>
          <CategoryFilterMenu />
        </div>

        <div className='col-span-3 mr-5'>
          <ProductDisplay />
        </div>
      </div>

      <NavBar />
    </div>
  );
}

export default HomePage;
