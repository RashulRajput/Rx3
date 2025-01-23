import fetch from 'cross-fetch';
import { Paper } from '../../searchService';

const SEMANTIC_SCHOLAR_API_URL = 'https://api.semanticscholar.org/graph/v1';
const SEMANTIC_SCHOLAR_API_KEY = process.env.VITE_SEMANTIC_SCHOLAR_API_KEY || '';

export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract?: string;
  year?: number;
  citationCount: number;
  authors: Array<{
    name: string;
    authorId: string;
  }>;
  url: string;
  doi?: string;
}

export async function searchSemanticScholar(query: string): Promise<Paper[]> {
  try {
    const response = await fetch(
      `${SEMANTIC_SCHOLAR_API_URL}/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,abstract,year,authors,citationCount,url,doi`,
      {
        headers: {
          'x-api-key': SEMANTIC_SCHOLAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((paper: SemanticScholarPaper) => ({
      id: paper.paperId,
      title: paper.title,
      authors: paper.authors.map(author => author.name),
      year: paper.year || new Date().getFullYear(),
      citations: paper.citationCount,
      url: paper.url,
      source: 'Semantic Scholar',
      abstract: paper.abstract || '',
      doi: paper.doi,
    }));
  } catch (error) {
    console.error('Error searching Semantic Scholar:', error);
    return [];
  }
}

// Get paper metadata and citations
export async function getSemanticScholarMetadata(paperId: string): Promise<{
  citations: number;
  references: Paper[];
}> {
  try {
    const response = await fetch(
      `${SEMANTIC_SCHOLAR_API_URL}/paper/${paperId}?fields=citations,references`,
      {
        headers: {
          'x-api-key': SEMANTIC_SCHOLAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      citations: data.citations?.length || 0,
      references: (data.references || []).map((ref: SemanticScholarPaper) => ({
        id: ref.paperId,
        title: ref.title,
        authors: ref.authors.map(author => author.name),
        year: ref.year || new Date().getFullYear(),
        citations: ref.citationCount,
        url: ref.url,
        source: 'Semantic Scholar',
        abstract: ref.abstract || '',
        doi: ref.doi,
      })),
    };
  } catch (error) {
    console.error('Error fetching Semantic Scholar metadata:', error);
    return { citations: 0, references: [] };
  }
}
