import { Paper as BasePaper } from '../searchService';

export interface SearchOptions {
  yearRange?: { start: number; end: number };
  sources?: string[];
  minCitations?: number;
  sortBy?: 'relevance' | 'citations' | 'year';
  limit?: number;
}

export interface EnhancedPaper extends BasePaper {
  similarPapers?: BasePaper[];
  relevanceScore?: number;
  metadata?: {
    references?: BasePaper[];
    citations?: number;
    topics?: string[];
  };
}
