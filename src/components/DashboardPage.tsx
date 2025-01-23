import React, { useState, useEffect } from 'react';
import {
  FileText, Clock, Search, Copy, ExternalLink,
  Download, History, PenTool, Bookmark, Book,
  FolderDown, Layout, Plus, User
} from 'lucide-react';
import { searchPapers, getSearchSuggestions } from '../lib/searchService';
import PaperDownloader from './PaperDownloader';
import AccountSettings from './AccountSettings';
import UserProfile from './UserProfile';

interface DownloadHistory {
  url: string;
  timestamp: number;
  sciHubUrl: string;
  title: string;
  source: string;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  url: string;
  source: string;
  abstract?: string;
}

export default function DashboardPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'search' | 'downloads' | 'history' | 'accountSettings' | 'profile'>('search');

  // Search state
  const [papers, setPapers] = useState<Paper[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [suggestions, setSuggestions] = useState<string[]>([]);
const [searchHistory, setSearchHistory] = useState<{ type: 'search' | 'download', query: string, timestamp: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Download state
  const [showDownloader, setShowDownloader] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const savedDownloads = localStorage.getItem('downloadHistory');
    if (savedDownloads) {
      setDownloadHistory(JSON.parse(savedDownloads));
    }
  }, []);

  // Search functionality
useEffect(() => {
  if (searchQuery.trim()) {
    const debounceTimeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchPapers(searchQuery);
        setPapers(results);
        setSearchHistory(prevHistory => [{ type: 'search', query: searchQuery, timestamp: Date.now() }, ...prevHistory.slice(0, 49)]);
      } catch (err) {
        console.error('Error searching papers:', err);
        setError('Failed to fetch papers. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(debounceTimeout);
  } else {
    setPapers([]);
  }
}, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b border-purple-500/20">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'search' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'downloads' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Downloads</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'history' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('accountSettings')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'accountSettings' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === 'profile' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'
              }`}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </button>
          </div>

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Academic Paper Search</h1>
                <p className="text-gray-300">Search across multiple academic sources (2020-2025)</p>
              </div>

<div className="flex items-center space-x-4">
  <div className="flex-1 relative">
    <input
      type="text"
      placeholder="Search papers (e.g., 'machine learning healthcare')"
      value={searchQuery}
onChange={(e) => {
  setSearchQuery(e.target.value);
  setSuggestions(getSearchSuggestions(e.target.value));
}}
      className="royal-input"
    />
    <Search className="absolute right-4 top-3.5 h-5 w-5 text-purple-400" />
    {suggestions.length > 0 && (
      <div className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              setSearchQuery(suggestion);
              setSuggestions([]);
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

              {/* Results */}
{loading ? (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
) : papers.length > 0 ? (
  <div className="space-y-6">
    {papers.map(paper => (
      <div key={paper.id} className="royal-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">{paper.title}</h3>
        <p className="text-gray-400">{paper.authors.join(', ')}</p>
        {paper.abstract && (
          <p className="text-gray-300">{paper.abstract}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{paper.year}</span>
            <span>•</span>
            <span>{paper.source}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(paper.url, '_blank')}
              className="royal-button px-3 py-1 text-sm flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Paper</span>
            </button>
            <button
              onClick={() => {
                const downloadUrl = paper.source === 'arXiv'
                  ? paper.url // Direct PDF link for arXiv papers
                  : `https://sci-hub.se/${paper.url}`; // Sci-Hub for others

                window.open(downloadUrl, '_blank');

                // Save to download history
                const downloadEntry = {
                  url: paper.url,
                  timestamp: Date.now(),
                  sciHubUrl: downloadUrl,
                  title: paper.title,
                  source: paper.source
                };
                setSearchHistory(prevHistory => [{ type: 'download', query: paper.title, timestamp: Date.now() }, ...prevHistory.slice(0, 49)]);
                const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
                history.unshift(downloadEntry);
                localStorage.setItem('downloadHistory', JSON.stringify(history.slice(0, 50)));
                setDownloadHistory(history);
              }}
              className="royal-button px-3 py-1 text-sm flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
) : searchQuery && (
  <div className="text-center py-12">
    <Search className="h-12 w-12 text-purple-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">No papers found</h3>
    <p className="text-gray-400">Try different keywords or adjust your search terms</p>
    <p className="text-gray-400 mt-4">Here are some relevant papers:</p>
    <div className="space-y-6 mt-4">
      {papers.map(paper => (
        <div key={paper.id} className="royal-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">{paper.title}</h3>
          <p className="text-gray-400">{paper.authors.join(', ')}</p>
          {paper.abstract && (
            <p className="text-gray-300">{paper.abstract}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{paper.year}</span>
              <span>•</span>
              <span>{paper.source}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.open(paper.url, '_blank')}
                className="royal-button px-3 py-1 text-sm flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Paper</span>
              </button>
              <button
                onClick={() => {
                  const downloadUrl = paper.source === 'arXiv'
                    ? paper.url // Direct PDF link for arXiv papers
                    : `https://sci-hub.se/${paper.url}`; // Sci-Hub for others

                  window.open(downloadUrl, '_blank');

                  // Save to download history
                  const downloadEntry = {
                    url: paper.url,
                    timestamp: Date.now(),
                    sciHubUrl: downloadUrl,
                    title: paper.title,
                    source: paper.source
                  };
                  setSearchHistory(prevHistory => [{ type: 'download', query: paper.title, timestamp: Date.now() }, ...prevHistory.slice(0, 49)]);
                  const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
                  history.unshift(downloadEntry);
                  localStorage.setItem('downloadHistory', JSON.stringify(history.slice(0, 50)));
                  setDownloadHistory(history);
                }}
                className="royal-button px-3 py-1 text-sm flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Paper Downloads</h2>
                <button
                  onClick={() => setShowDownloader(true)}
                  className="royal-button px-4 py-2 text-sm flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Download New Paper</span>
                </button>
              </div>

              {downloadHistory.length > 0 ? (
                <div className="space-y-4">
                  {downloadHistory.map((download, index) => (
                    <div key={index} className="royal-card p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium mb-1">{download.title}</p>
                          <p className="text-sm text-gray-400">Source: {download.source}</p>
                          <p className="text-sm text-gray-400">
                            Downloaded on {new Date(download.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const downloadUrl = download.source === 'arXiv'
                              ? download.url // Direct PDF for arXiv
                              : download.sciHubUrl; // Sci-Hub URL for others
                            window.open(downloadUrl, '_blank');
                          }}
                          className="royal-button px-3 py-1 text-sm flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Again</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Download className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No downloads yet</h3>
                  <p className="text-gray-400">
                    Start by downloading papers from the search results
                  </p>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
{activeTab === 'history' && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">History</h2>
    {searchHistory.length > 0 ? (
      <div className="space-y-4">
        {searchHistory.sort((a, b) => b.timestamp - a.timestamp).map((entry, index) => (
          <div key={index} className="royal-card p-4">
            <p className="text-white font-medium mb-1">{entry.type === 'search' ? `Searched: ${entry.query}` : `Downloaded: ${entry.query}`}</p>
            <p className="text-sm text-gray-400">Timestamp: {new Date(entry.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <History className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No history yet</h3>
        <p className="text-gray-400">
          Start by searching for papers or downloading papers
        </p>
      </div>
    )}
  </div>
)}

          {/* Account Settings Tab */}
{activeTab === 'accountSettings' && <AccountSettings />}

          {/* Profile Tab */}
{activeTab === 'profile' && <UserProfile />}
        </div>
      </div>

      {/* Paper Downloader Modal */}
      {showDownloader && (
        <PaperDownloader onClose={() => setShowDownloader(false)} />
      )}
    </div>
  );
}
