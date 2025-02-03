import ProductCard from './ProductCard';
import { useSearchStore, useCategoryStore } from '../../store';
import { useEffect, useState } from 'react';
import PaginationSection from './PaginationSection';

function ProductDisplay() {
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
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }

    fetchProducts();
  }, []);

  // Filter products by search and category
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
