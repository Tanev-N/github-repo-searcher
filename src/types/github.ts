export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}

export type SortOption = 'stars' | 'forks' | 'updated';
export type OrderOption = 'desc' | 'asc';
