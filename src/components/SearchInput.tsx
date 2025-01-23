import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl transform group-hover:scale-105 transition-transform duration-300"></div>
      <input
        type="text"
        placeholder="Search papers..."
        className="royal-input"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <button type="submit" className="absolute right-3 top-3.5">
        <Search className="h-5 w-5 text-purple-400" />
      </button>
    </form>
  );
}