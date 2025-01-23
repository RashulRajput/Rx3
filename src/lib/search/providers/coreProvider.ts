import fetch from 'cross-fetch';
import { Paper } from '../../searchService';

const CORE_API_URL = 'https://api.core.ac.uk/v3';
const CORE_API_KEY = process.env.VITE_CORE_API_KEY || '';

export interface CoreSearchResult {
  id: string;
  title: string;
  authors: { name: string }[];
  year: number;
  downloadUrl: string;
  abstract: string;
  doi?: string;
  citations?: number;
}

export async function searchCore(query: string): Promise<Paper[]> {
  try {
    const response = await fetch(`${CORE_API_URL}/search/works`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CORE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        page: 1,
        pageSize: 10,
        orderBy: 'relevance',
      }),
    });

    if (!response.ok) {
      throw new Error(`CORE API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map((result: CoreSearchResult) => ({
      id: result.id,
      title: result.title,
      authors: result.authors.map(author => author.name),
      year: result.year,
      citations: result.citations || 0,
      url: result.downloadUrl,
      source: 'CORE',
      abstract: result.abstract,
      doi: result.doi,
    }));
  } catch (error) {
    console.error('Error searching CORE:', error);
    return [];
  }
}
