import ProductCard from './ProductCard';
import SearchBar from './SearchBar';

function HomePage() {
  return (
    <div className='mx-5'>
      <SearchBar className='my-5'/>
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
}

export default HomePage;
