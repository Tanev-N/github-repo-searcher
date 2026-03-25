const HISTORY_KEY = 'search-history';
const MAX_HISTORY = 10;

export function getSearchHistory(): string[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): string[] {
  const history = getSearchHistory().filter((item) => item !== query);
  const updated = [query, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSearchHistory(): string[] {
  localStorage.removeItem(HISTORY_KEY);
  return [];
}
