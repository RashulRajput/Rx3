import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Search, Loader, Calendar, Tag } from 'lucide-react';
import debounce from 'lodash.debounce';
import PapersTable from './PapersTable';
import { searchPapers, Paper, getSourceInfo, getSearchSuggestions, expandQueryWithSynonyms } from '../lib/searchService';

interface SearchBarProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery, onSearch }) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedFetchSuggestions = useCallback(
    debounce((value: string) => {
      const results = getSearchSuggestions(value);
      setSuggestions(results);
    }, 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !inputRef.current?.contains(event.target as Node) &&
        !suggestionsRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(inputValue);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for research papers..."
          className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ACADEMIC_SOURCES = [
  'Google Scholar',
  'PubMed',
  'ResearchGate',
  'CORE',
  'DOAJ',
  'Semantic Scholar',
  'arXiv',
  'Sci-Hub',
  'Academia.edu',
  'Open Access Button',
  'Zenodo',
  'LibGen',
  'PLOS',
  'BASE',
  'ScienceOpen'
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const currentYear = new Date().getFullYear();

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    }
  };

  useEffect(() => {
    const fetchPapers = async () => {
      if (query) {
        setLoading(true);
        try {
          // Get expanded terms before search
          const expanded = expandQueryWithSynonyms(query);
          const expandedArray = Array.from(new Set(expanded.split(' '))) as string[];
          setExpandedTerms(expandedArray.filter(term => term !== query));
          
          const results = await searchPapers(query);
          setPapers(results);
        } catch (error) {
          console.error('Error fetching papers:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPapers();
  }, [query]);

  const searchView = (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <SearchBar initialQuery={query} onSearch={handleSearch} />
        {expandedTerms.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2">
            <span className="text-gray-400">Including results for:</span>
            {expandedTerms.map((term, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-purple-900 text-purple-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {term}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {searchView}
            <div className="royal-card p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Please enter a search query</h2>
              <p className="text-gray-300">
                Search across multiple academic sources with our advanced search system.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {searchView}
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Search Results for "{query}"
            </h2>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <Calendar className="h-5 w-5 text-purple-400" />
              <p>Showing recent papers from top sources</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-4 text-purple-400">
                <Loader className="h-8 w-8 animate-spin" />
                <span className="text-lg">Searching academic sources...</span>
              </div>
            </div>
          ) : papers.length > 0 ? (
            <div className="royal-card p-6">
              <PapersTable papers={papers} />
            </div>
          ) : (
            <div className="royal-card p-8 text-center">
              <Search className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No papers found</h3>
              <p className="text-gray-300">
                Try adjusting your search terms or contact us for a custom research paper.
              </p>
            </div>
          )}

          <div className="royal-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Academic Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ACADEMIC_SOURCES.map((source) => {
                const sourceInfo = getSourceInfo(source);
                return (
                  <a
                    key={source}
                    href={sourceInfo?.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-purple-400" />
                    <span>{source}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
