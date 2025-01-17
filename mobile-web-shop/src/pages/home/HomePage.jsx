import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserStore } from '../../store';
import ProductCard from './ProductCard';

function HomePage() {
  const user = useUserStore.getState().user;
  return (
    <div>
      <h1>Home Page</h1>
      <Button><Link to="/login">Login</Link></Button>
      <p>user: {user ? user.email : 'nil'}</p>
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
