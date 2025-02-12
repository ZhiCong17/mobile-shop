import ProductCard from './ProductCard';
import PaginationSection from './PaginationSection';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchStore, useCategoryStore } from '../../store';
import { useEffect, useState } from 'react';


function ProductDisplay({ loading, setLoading }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          method: 'GET',
        });

        if (!response.ok) {
          const errorResult = await response.json();
          console.error('Failed to fetch products:', errorResult.message);
          return;
        }

        const result = await response.json();

        if (result.data) {
          setProducts(result.data);
        } else {
          console.error('Products not found');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }

    fetchProducts();
  }, []);

  // Filter products by search input and selected category
  const search = useSearchStore(state => state.search);
  const category = useCategoryStore(state => state.category);
  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(search) && product.category.includes(category);
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const lastItemIndex = currentPage * productsPerPage;
  const firstItemIndex = lastItemIndex - productsPerPage;
  const currentItems = filteredProducts.slice(firstItemIndex, lastItemIndex);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Display products after filtering and pagination
  const display = currentItems.map((product) => {
    return <ProductCard key={product.id} product={product} />
  });

  // Display skeleton loading while fetching products
  if (loading) {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    )
  }

  return (
    <>
      {display}
      {filteredProducts.length > productsPerPage && (
        <PaginationSection
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        />
      )}
    </>
  );
}

export default ProductDisplay;

const ProductCardSkeleton = () => {
  return (
    <div className='flex pl-4 pb-4 pr-0 gap-2'>
      <Skeleton className='h-24 w-24 rounded flex-shrink-0' />
      <div className='relative w-full'>
        <Skeleton className='h-6 w-32 mt-2' />
        <div className='absolute bottom-2 left-0 flex justify-between w-full'>
          <Skeleton className='h-6 w-12 my-auto' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </div>
    </div>
  )
}
