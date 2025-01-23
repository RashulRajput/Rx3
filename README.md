# Research Paper Search System

A modern academic paper search system with advanced features including full-text search, fuzzy matching, multi-source aggregation, and intelligent relevance ranking.

## Features

- **Full-Text Search**: Using Meilisearch for fast, typo-tolerant search
- **Multi-Source Integration**: 
  - CORE API
  - Semantic Scholar
  - CrossRef
  - Google Scholar
- **Advanced Ranking**:
  - Relevance scoring
  - Citation impact
  - Publication recency
  - Source credibility
- **Smart Suggestions**:
  - Real-time typeahead
  - Academic keyword expansion
  - Related papers
- **Search Filters**:
  - Year range
  - Minimum citations
  - Source selection
  - Custom sorting

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Meilisearch (requires Docker):
```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='your-master-key' \
  getmeili/meilisearch:latest
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your API keys:
- Get a CORE API key from: https://core.ac.uk/services/api/
- Get a Semantic Scholar API key from: https://www.semanticscholar.org/product/api
- Set your email for CrossRef's polite pool

4. Initialize the search system:
```bash
npm run init-search
```

5. Start the development server:
```bash
npm run dev
```

## Usage

### Basic Search
```typescript
import { enhancedSearch } from './lib/search/enhancedSearchService';

const papers = await enhancedSearch('machine learning');
```

### Advanced Search
```typescript
const papers = await enhancedSearch('deep learning', {
  yearRange: { start: 2020, end: 2024 },
  minCitations: 10,
  sources: ['CORE', 'Semantic Scholar'],
  sortBy: 'citations',
  limit: 20
});
```

### Get Paper Details
```typescript
import { getPaperDetails } from './lib/search/enhancedSearchService';

const paper = await getPaperDetails('paper-id');
// Returns paper with metadata and similar papers
```

## API Documentation

### Search Options

| Option | Type | Description |
|--------|------|-------------|
| yearRange | { start: number; end: number } | Filter papers by publication year |
| sources | string[] | Filter by academic sources |
| minCitations | number | Minimum citation count |
| sortBy | 'relevance' \| 'citations' \| 'year' | Sort results |
| limit | number | Maximum number of results |

## Performance Optimization

The system uses several strategies to optimize search performance:

1. **Local Caching**: Papers are indexed in Meilisearch for fast subsequent searches
2. **Concurrent API Calls**: Multiple sources are queried simultaneously
3. **Smart Deduplication**: Results are merged with duplicate detection
4. **Efficient Filtering**: Uses database-level filtering where possible

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
