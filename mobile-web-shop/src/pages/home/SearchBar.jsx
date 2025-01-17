import { Search } from 'lucide-react';

function SearchBar({ className }) {
  return (
    <div className={`relative ${className}`}>
      <input className='w-full bg-gray-200 pl-9 py-2 pr-4 rounded-full' type="text" placeholder="Search..." />
      <Search className='absolute top-1/2 left-3 transform -translate-y-1/2' size={16} />
    </div>
  )
}

export default SearchBar;
