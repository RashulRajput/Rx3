import { Paper } from '../searchService';
import { SearchOptions } from './types';

export function hasValidYearRange(range: SearchOptions['yearRange']): range is { start: number; end: number } {
  return range !== undefined && 
         typeof range.start === 'number' && 
         typeof range.end === 'number';
}

export function createYearRangeFilter(yearRange: SearchOptions['yearRange']): string[] | undefined {
  if (!hasValidYearRange(yearRange)) return undefined;
  return [`year >= ${yearRange.start}`, `year <= ${yearRange.end}`];
}

export function filterByYearRange(papers: Paper[], yearRange: SearchOptions['yearRange']): Paper[] {
  if (!hasValidYearRange(yearRange)) return papers;
  return papers.filter(
    paper => paper.year >= yearRange.start && paper.year <= yearRange.end
  );
}
