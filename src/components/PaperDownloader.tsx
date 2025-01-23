import React, { useState } from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';

interface PaperDownloaderProps {
  onClose: () => void;
}

export default function PaperDownloader({ onClose }: PaperDownloaderProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter a paper URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Sci-Hub URL
      const sciHubUrl = `https://sci-hub.se/${url}`;

      // Open in new tab
      window.open(sciHubUrl, '_blank');
      
      // Store the download attempt in history
      const downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
      downloadHistory.unshift({
        url: url,
        timestamp: Date.now(),
        sciHubUrl,
        title: 'Manual Download',
        source: 'Custom URL'
      });
      localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory.slice(0, 50)));

      setDownloadUrl(sciHubUrl);
      onClose(); // Close modal after successful download
    } catch (err) {
      setError('Failed to process download. Please try again.');
      console.error('Download error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Download Paper
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Paper URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="royal-input"
            />
            <p className="mt-1 text-sm text-gray-400">
              Enter the URL of the paper you want to download
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {downloadUrl && (
            <div className="text-sm text-green-400">
              Paper download initiated. If it doesn't start automatically,{' '}
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-300"
              >
                click here
              </a>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="royal-button-secondary px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={loading || !url.trim()}
              className="royal-button px-4 py-2 text-sm flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <p className="text-xs text-gray-400">
            Note: This tool uses Sci-Hub to access papers. Please respect copyright and use institutional access when available.
          </p>
        </div>
      </div>
    </div>
  );
}
