import { MeiliSearch } from 'meilisearch';
import { Paper } from '../../searchService';

const MEILISEARCH_HOST = process.env.VITE_MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_KEY = process.env.VITE_MEILISEARCH_ADMIN_KEY || '';

// Initialize Meilisearch client
const searchClient = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_KEY,
});

// Papers index configuration
const PAPERS_INDEX = 'papers';
const PAPERS_CONFIG = {
  searchableAttributes: [
    'title',
    'abstract',
    'authors',
    'keywords',
  ],
  filterableAttributes: [
    'year',
    'source',
    'citations',
  ],
  sortableAttributes: [
    'year',
    'citations',
  ],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
  ],
  distinctAttribute: 'id',
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 4,
      twoTypos: 8,
    },
  },
};

// Initialize the papers index
export async function initializeMeilisearch() {
  try {
    const index = await searchClient.getIndex(PAPERS_INDEX);
    await index.updateSettings(PAPERS_CONFIG);
    console.log('Meilisearch index initialized');
  } catch (error) {
    console.error('Error initializing Meilisearch:', error);
    // Create index if it doesn't exist
    try {
      await searchClient.createIndex(PAPERS_INDEX, { primaryKey: 'id' });
      const index = await searchClient.getIndex(PAPERS_INDEX);
      await index.updateSettings(PAPERS_CONFIG);
      console.log('Meilisearch index created');
    } catch (createError) {
      console.error('Error creating Meilisearch index:', createError);
    }
  }
}

// Add or update papers in the index
export async function indexPapers(papers: Paper[]) {
  try {
    const index = await searchClient.getIndex(PAPERS_INDEX);
    await index.addDocuments(papers);
    console.log(`Indexed ${papers.length} papers`);
  } catch (error) {
    console.error('Error indexing papers:', error);
  }
}

// Search papers with advanced options
export async function searchMeilisearch(
  query: string,
  options?: {
    filter?: string[];
    sort?: string[];
    limit?: number;
    offset?: number;
  }
): Promise<Paper[]> {
  try {
    const index = await searchClient.getIndex(PAPERS_INDEX);
    const results = await index.search(query, {
      filter: options?.filter,
      sort: options?.sort,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      attributesToHighlight: ['title', 'abstract'],
      cropLength: 200,
    });

    return results.hits as Paper[];
  } catch (error) {
    console.error('Error searching Meilisearch:', error);
    return [];
  }
}

// Get similar papers based on content
export async function getSimilarPapers(paperId: string): Promise<Paper[]> {
  try {
    const index = await searchClient.getIndex(PAPERS_INDEX);
    const paper = await index.getDocument(paperId);
    
    // Create a search query from the paper's title and abstract
    const searchQuery = `${paper.title} ${paper.abstract || ''}`.slice(0, 100);
    
    // Search for similar papers excluding the original
    const results = await index.search(searchQuery, {
      filter: [`id != ${paperId}`],
      limit: 5,
    });

    return results.hits as Paper[];
  } catch (error) {
    console.error('Error finding similar papers:', error);
    return [];
  }
}
