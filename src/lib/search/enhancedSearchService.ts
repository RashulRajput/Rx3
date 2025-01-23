import { Paper } from '../searchService';
import { EnhancedPaper, SearchOptions } from './types';
import { searchCore } from './providers/coreProvider';
import { searchSemanticScholar, getSemanticScholarMetadata } from './providers/semanticScholarProvider';
import { searchCrossRef, getCrossRefMetadata } from './providers/crossRefProvider';
import { searchMeilisearch, indexPapers, initializeMeilisearch, getSimilarPapers } from './providers/meilisearchProvider';
import { createYearRangeFilter, filterByYearRange } from './filters';

// Weight factors for relevance scoring
const RELEVANCE_WEIGHTS = {
  titleMatch: 0.4,
  abstractMatch: 0.2,
  citations: 0.2,
  recency: 0.2,
};

// Calculate paper relevance score
function calculateRelevanceScore(paper: Paper, query: string): number {
  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  let score = 0;

  // Title matching
  const titleScore = queryTerms.reduce((acc, term) => {
    if (paper.title.toLowerCase().includes(term)) acc += 1;
    return acc;
  }, 0) / queryTerms.length;
  score += titleScore * RELEVANCE_WEIGHTS.titleMatch;

  // Abstract matching
  if (paper.abstract) {
    const abstractScore = queryTerms.reduce((acc, term) => {
      if (paper.abstract?.toLowerCase().includes(term)) acc += 1;
      return acc;
    }, 0) / queryTerms.length;
    score += abstractScore * RELEVANCE_WEIGHTS.abstractMatch;
  }

  // Citation impact
  const maxCitations = 1000; // Normalize citations to 0-1 range
  const citationScore = Math.min(paper.citations / maxCitations, 1);
  score += citationScore * RELEVANCE_WEIGHTS.citations;

  // Recency
  const currentYear = new Date().getFullYear();
  const maxAge = 5; // Consider papers up to 5 years old
  const age = currentYear - paper.year;
  const recencyScore = Math.max(0, 1 - age / maxAge);
  score += recencyScore * RELEVANCE_WEIGHTS.recency;

  return score;
}

// Combine and deduplicate papers from different sources
function combinePapers(papers: Paper[][]): EnhancedPaper[] {
  const seen = new Set<string>();
  const combined: EnhancedPaper[] = [];

  papers.flat().forEach(paper => {
    const key = paper.doi || paper.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push({ ...paper });
    }
  });

  return combined;
}

// Enhanced search across all providers
export async function enhancedSearch(
  query: string,
  options: SearchOptions = {}
): Promise<EnhancedPaper[]> {
  try {
    // Search across all providers concurrently
    const filters = createYearRangeFilter(options.yearRange);

    const [localResults, coreResults, semanticResults, crossRefResults] = await Promise.all([
      searchMeilisearch(query, {
        filter: filters,
        limit: options.limit,
      }),
      searchCore(query),
      searchSemanticScholar(query),
      searchCrossRef(query),
    ]);

    // Combine results and remove duplicates
    let allPapers = combinePapers([
      localResults,
      coreResults,
      semanticResults,
      crossRefResults,
    ]);

    // Apply filters
    allPapers = filterByYearRange(allPapers, options.yearRange);

    if (options.sources?.length) {
      allPapers = allPapers.filter(paper => options.sources?.includes(paper.source));
    }

    if (options.minCitations !== undefined) {
      const minCitations = options.minCitations;
      allPapers = allPapers.filter(paper => paper.citations >= minCitations);
    }

    // Calculate relevance scores
    allPapers.forEach(paper => {
      paper.relevanceScore = calculateRelevanceScore(paper, query);
    });

    // Sort results
    switch (options.sortBy) {
      case 'citations':
        allPapers.sort((a, b) => b.citations - a.citations);
        break;
      case 'year':
        allPapers.sort((a, b) => b.year - a.year);
        break;
      case 'relevance':
      default:
        allPapers.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    // Index new papers in Meilisearch for future local search
    await indexPapers(allPapers);

    return allPapers.slice(0, options.limit || 20);
  } catch (error) {
    console.error('Error in enhanced search:', error);
    return [];
  }
}

// Get paper details with metadata from multiple sources
export async function getPaperDetails(paperId: string): Promise<EnhancedPaper | null> {
  try {
    // Try to get paper from local index first
    const [similarPapers, semanticMetadata] = await Promise.all([
      getSimilarPapers(paperId),
      getSemanticScholarMetadata(paperId),
    ]);

    const searchResult = await searchMeilisearch(`id:${paperId}`);
    let paper = searchResult[0];
    
    if (!paper) {
      const crossRefPaper = await getCrossRefMetadata(paperId);
      if (crossRefPaper) {
        paper = crossRefPaper;
      }
    }

    if (paper) {
      // Enrich with additional metadata
      const enhancedPaper: EnhancedPaper = {
        ...paper,
        metadata: {
          citations: semanticMetadata?.citations || paper.citations,
        },
        similarPapers: similarPapers || [],
      };
      return enhancedPaper;
    }

    return null;
  } catch (error) {
    console.error('Error getting paper details:', error);
    return null;
  }
}

// Initialize search system
export async function initializeSearch(): Promise<void> {
  try {
    await initializeMeilisearch();
  } catch (error) {
    console.error('Error initializing search system:', error);
  }
}
