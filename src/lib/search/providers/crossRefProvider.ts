import fetch from 'cross-fetch';
import { Paper } from '../../searchService';

const CROSSREF_API_URL = 'https://api.crossref.org/works';
const EMAIL = process.env.VITE_CONTACT_EMAIL || ''; // Polite pool for better rate limits

interface CrossRefWork {
  DOI: string;
  title: string[];
  author?: Array<{
    given?: string;
    family?: string;
    name?: string;
  }>;
  published?: Array<{
    'date-parts': number[][];
  }>;
  abstract?: string;
  'is-referenced-by-count'?: number;
  URL?: string;
  link?: Array<{
    URL: string;
    'content-type'?: string;
  }>;
}

interface CrossRefResponse {
  message: {
    items: CrossRefWork[];
  };
}

export async function searchCrossRef(query: string): Promise<Paper[]> {
  try {
    const response = await fetch(
      `${CROSSREF_API_URL}?query=${encodeURIComponent(query)}&mailto=${EMAIL}&rows=10&select=DOI,title,author,published,abstract,is-referenced-by-count,URL,link`,
      {
        headers: {
          'User-Agent': 'ResearchX/1.0 (mailto:' + EMAIL + ')',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.statusText}`);
    }

    const data: CrossRefResponse = await response.json();
    
    return data.message.items.map(work => ({
      id: work.DOI,
      title: Array.isArray(work.title) ? work.title[0] : work.title,
      authors: work.author
        ? work.author.map(a => 
            a.name || [a.given, a.family].filter(Boolean).join(' ')
          )
        : [],
      year: work.published?.[0]?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      citations: work['is-referenced-by-count'] || 0,
      url: work.URL || work.link?.[0]?.URL || `https://doi.org/${work.DOI}`,
      source: 'CrossRef',
      abstract: work.abstract || '',
      doi: work.DOI,
    }));
  } catch (error) {
    console.error('Error searching CrossRef:', error);
    return [];
  }
}

// Get metadata for a specific DOI
export async function getCrossRefMetadata(doi: string): Promise<Paper | null> {
  try {
    const response = await fetch(
      `${CROSSREF_API_URL}/${encodeURIComponent(doi)}?mailto=${EMAIL}`,
      {
        headers: {
          'User-Agent': 'ResearchX/1.0 (mailto:' + EMAIL + ')',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.statusText}`);
    }

    const data = await response.json();
    const work = data.message;

    return {
      id: work.DOI,
      title: Array.isArray(work.title) ? work.title[0] : work.title,
      authors: work.author
        ? work.author.map(a => 
            a.name || [a.given, a.family].filter(Boolean).join(' ')
          )
        : [],
      year: work.published?.[0]?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      citations: work['is-referenced-by-count'] || 0,
      url: work.URL || work.link?.[0]?.URL || `https://doi.org/${work.DOI}`,
      source: 'CrossRef',
      abstract: work.abstract || '',
      doi: work.DOI,
    };
  } catch (error) {
    console.error('Error fetching CrossRef metadata:', error);
    return null;
  }
}
