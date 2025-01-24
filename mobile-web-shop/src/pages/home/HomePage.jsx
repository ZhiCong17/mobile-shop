import ProductDisplay from './ProductDisplay';
import SearchBar from './SearchBar';
import CategoryFilterMenu from './CategoryFilterMenu';
import NavBar from '@/components/NavBar';

function HomePage() {
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
