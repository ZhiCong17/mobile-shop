import { Search } from 'lucide-react';
import { useSearchStore } from '../../store';

function SearchBar({ className }) {
  const setSearch = useSearchStore(state => state.setSearch);
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  return (
    <div className={`relative ${className}`}>
      <input
        className='w-full bg-gray-200 pl-9 py-2 pr-4 rounded-full'
        onChange={handleSearch}
        type="text"
        placeholder="Search..."
      />
      <Search className='absolute top-1/2 left-3 transform -translate-y-1/2' size={16} />
    </div>
  )
}

export default SearchBar;
