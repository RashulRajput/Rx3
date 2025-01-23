import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Paper, getSourceInfo } from '../lib/searchService';

export default function PapersTable({ papers }: { papers: Paper[] }) {
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const togglePaper = (paperId: string) => {
    setExpandedPaper(expandedPaper === paperId ? null : paperId);
  };

  const getDirectUrl = (paper: Paper) => {
    const sourceInfo = getSourceInfo(paper.source);
    if (paper.doi && (paper.source === 'Science Direct' || paper.source === 'IEEE' || paper.source === 'ACM Digital Library')) {
      return `https://doi.org/${paper.doi}`;
    }
    if (sourceInfo?.baseUrl && paper.url) {
      // If the URL is relative, prepend the source's base URL
      return paper.url.startsWith('http') ? paper.url : `${sourceInfo.baseUrl}${paper.url}`;
    }
    return paper.url;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-purple-500/20">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
              Title & Relevance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Authors</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Year</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Citations</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-500/20">
          {papers.map((paper) => (
            <React.Fragment key={paper.id}>
              <tr className="group hover:bg-purple-500/5 transition-colors duration-300 cursor-pointer" onClick={() => togglePaper(paper.id)}>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 pt-1">
                      {expandedPaper === paper.id ? (
                        <ChevronUp className="h-4 w-4 text-purple-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium text-purple-100">{paper.title}</div>
                      {paper.relevanceScore && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-yellow-400">
                            Relevance: {paper.relevanceScore.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{paper.authors.join(', ')}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{paper.year}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{paper.citations}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{paper.source}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <a
                    href={getDirectUrl(paper)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transform transition-transform group-hover:scale-110 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </td>
              </tr>
              {expandedPaper === paper.id && paper.abstract && (
                <tr className="bg-purple-500/5">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="text-gray-300 space-y-4">
                      <h4 className="text-white font-medium">Abstract</h4>
                      <p>{paper.abstract}</p>
                      <div className="flex justify-end space-x-4">
                        {paper.doi && (
                          <span className="text-sm text-gray-400">
                            DOI: {paper.doi}
                          </span>
                        )}
                        <a
                          href={getDirectUrl(paper)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="royal-button inline-flex items-center space-x-2"
                        >
                          <span>Read Full Paper</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
