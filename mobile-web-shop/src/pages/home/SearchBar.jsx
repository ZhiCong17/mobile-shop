import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import useProductStore from '@/store/useProductStore';

function SearchBar({ className }) {
  const { loading, setSearchInput } = useProductStore();

  const handleSearchInput = (e) => setSearchInput(e.target.value.toLowerCase());

  if (loading) {
    return (
      <div className={className}>
        <Skeleton className="w-full h-10 rounded-full" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <input
        className='w-full bg-gray-200 pl-9 py-2 pr-4 rounded-full'
        onChange={handleSearchInput}
        type='text'
        placeholder='Search...'
        name='searchProducts'
      />
      <Search className='absolute top-1/2 left-3 transform -translate-y-1/2' size={16} />
    </div>
  )
}

export default SearchBar;
