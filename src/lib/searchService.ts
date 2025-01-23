import axios from 'axios';
import Fuse from 'fuse.js';
import { topicKeywords, getRelevantTopics } from './paperTopics';
import { samplePapers } from './papers';
import { searchScholar } from './scholarService';

// Academic keyword synonyms for better search matching
const ACADEMIC_SYNONYMS: { [key: string]: string[] } = {
  'ai': ['artificial intelligence', 'machine learning', 'deep learning'],
  'ml': ['machine learning', 'deep learning', 'neural networks'],
  'dl': ['deep learning', 'neural networks', 'machine learning'],
  'nlp': ['natural language processing', 'text analysis', 'language model'],
  'cv': ['computer vision', 'image processing', 'visual recognition'],
  'nn': ['neural network', 'deep learning', 'artificial neural network'],
  'gan': ['generative adversarial network', 'generative model'],
  'transformer': ['attention mechanism', 'language model', 'bert'],
  'bert': ['bidirectional encoder', 'language model', 'transformer'],
  'gpu': ['graphics processing unit', 'cuda', 'parallel computing'],
  'distributed': ['parallel', 'concurrent', 'cluster computing'],
  'optimization': ['gradient descent', 'backpropagation', 'learning rate'],
  'classification': ['categorization', 'prediction', 'pattern recognition'],
  'segmentation': ['partitioning', 'object detection', 'image analysis'],
};

// Fuse.js options for fuzzy searching
const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'abstract', weight: 0.3 },
    { name: 'authors', weight: 0.2 }
  ]
};

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  url: string;
  source: string;
  abstract?: string;
  doi?: string;
  relevanceScore?: number;
}

export const ACADEMIC_SOURCES = [
  { name: 'Google Scholar', baseUrl: 'https://scholar.google.com' },
  { name: 'PubMed', baseUrl: 'https://pubmed.ncbi.nlm.nih.gov' },
  { name: 'ResearchGate', baseUrl: 'https://www.researchgate.net' },
  { name: 'CORE', baseUrl: 'https://core.ac.uk' },
  { name: 'DOAJ', baseUrl: 'https://doaj.org' },
  { name: 'Semantic Scholar', baseUrl: 'https://www.semanticscholar.org' },
  { name: 'arXiv', baseUrl: 'https://arxiv.org' },
  { name: 'Sci-Hub', baseUrl: 'https://sci-hub.se' },
  { name: 'Academia.edu', baseUrl: 'https://www.academia.edu' },
  { name: 'Zenodo', baseUrl: 'https://zenodo.org' },
  { name: 'LibGen', baseUrl: 'https://libgen.is' },
  { name: 'PLOS', baseUrl: 'https://plos.org' },
  { name: 'BASE', baseUrl: 'https://www.base-search.net' },
  { name: 'ScienceOpen', baseUrl: 'https://www.scienceopen.com' }
];

// Real-time paper search combining multiple sources with fuzzy matching
export const searchPapers = async (query: string): Promise<Paper[]> => {
  // Expand query with synonyms
  const expandedQuery = expandQueryWithSynonyms(query);
  const keywords = expandedQuery.toLowerCase().split(' ').filter(k => k.length > 2);
  const currentYear = new Date().getFullYear();
  const usedTitles = new Set<string>();
  let allPapers: Paper[] = [];

  // Initialize Fuse instance with all papers
  const fuse = new Fuse(Object.values(samplePapers).flat(), fuseOptions);

  try {
    // Get papers from Google Scholar with expanded query
    const scholarResults = await searchScholar(expandedQuery);
    scholarResults.forEach((paper: Paper) => {
      if (!usedTitles.has(paper.title)) {
        const relevanceScore = calculateRelevanceScore(paper, keywords);
        allPapers.push({
          ...paper,
          relevanceScore,
          url: getSourceInfo(paper.source)?.baseUrl || paper.url // Use source base URL if available
        });
        usedTitles.add(paper.title);
      }
    });

    // Perform fuzzy search on local papers
    const fuseResults = fuse.search(expandedQuery);
    fuseResults.forEach(result => {
      const paper = result.item as Paper;
      if (!usedTitles.has(paper.title)) {
        const relevanceScore = calculateRelevanceScore(paper, keywords) * (1 - (result.score || 0));
        allPapers.push({
          ...paper,
          relevanceScore,
          url: getSourceInfo(paper.source)?.baseUrl || paper.url // Use source base URL if available
        });
        usedTitles.add(paper.title);
      }
    });

    // Filter, sort, and return combined results
    const filteredPapers = allPapers
      .filter(paper => paper.year >= 2020 && paper.year <= currentYear && (paper.relevanceScore || 0) >= 80)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    if (filteredPapers.length === 0) {
      // Fallback: Suggest relevant papers with some of the same matching keywords
      const fallbackPapers = allPapers
        .filter(paper => keywords.some(keyword => paper.title.toLowerCase().includes(keyword)))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 20);

      return fallbackPapers;
    }

    return filteredPapers.slice(0, 20); // Return up to 20 most relevant papers

  } catch (error) {
    console.error('Error searching papers:', error);
    return [];
  }
};

// Calculate relevance score using multiple factors
export const calculateRelevanceScore = (paper: Paper, keywords: string[]): number => {
  let score = 0;
  const lowercaseTitle = paper.title.toLowerCase();
  const lowercaseAbstract = paper.abstract?.toLowerCase() || '';
  const currentYear = new Date().getFullYear();

  // Title matches (highest weight)
  keywords.forEach(keyword => {
    if (lowercaseTitle.includes(keyword)) {
      score += 40;
      // Bonus for word boundary matches
      if (new RegExp(`\\b${keyword}\\b`).test(lowercaseTitle)) {
        score += 20;
      }
    }
  });

  // Abstract matches
  keywords.forEach(keyword => {
    if (lowercaseAbstract.includes(keyword)) {
      score += 20;
      if (new RegExp(`\\b${keyword}\\b`).test(lowercaseAbstract)) {
        score += 10;
      }
    }
  });

  // Citation impact (up to 30 points)
  score += Math.min(paper.citations / 50, 30);

  // Recency bonus (up to 20 points)
  const yearDiff = currentYear - paper.year;
  score += Math.max(0, 20 - yearDiff * 4);

  return score;
};

// Expand search query with synonyms
export const expandQueryWithSynonyms = (query: string): string => {
  const terms = query.toLowerCase().split(' ');
  const expandedTerms = new Set<string>();

  terms.forEach(term => {
    expandedTerms.add(term);
    // Add known synonyms
    if (ACADEMIC_SYNONYMS[term]) {
      ACADEMIC_SYNONYMS[term].forEach(synonym => expandedTerms.add(synonym));
    }
  });

  return Array.from(expandedTerms).join(' ');
};

// Get typeahead suggestions based on partial input
export const getSearchSuggestions = (partial: string): string[] => {
  if (!partial || partial.length < 2) return [];

  const fuse = new Fuse(Object.values(samplePapers).flat(), {
    keys: ['title'],
    threshold: 0.3
  });

  return fuse.search(partial)
    .slice(0, 5)
    .map(result => result.item.title);
};

export const getSourceInfo = (sourceName: string) => {
  return ACADEMIC_SOURCES.find(source => source.name === sourceName);
};
