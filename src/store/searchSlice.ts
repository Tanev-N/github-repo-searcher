import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { GithubRepo, SortOption, OrderOption, SearchResponse } from '../types/github';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } from '../utils/localStorage';

function sortRepos(items: GithubRepo[], sort: SortOption, order: OrderOption): GithubRepo[] {
  const sorted = [...items];
  const key = sort === 'stars' ? 'stargazers_count' : sort === 'forks' ? 'forks_count' : 'updated_at';

  sorted.sort((a, b) => {
    const av = key === 'updated_at' ? new Date(a[key]).getTime() : a[key];
    const bv = key === 'updated_at' ? new Date(b[key]).getTime() : b[key];
    return order === 'asc' ? av - bv : bv - av;
  });

  return sorted;
}

interface SearchState {
  query: string;
  repos: GithubRepo[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  searched: boolean;
  sort: SortOption;
  order: OrderOption;
  language: string;
  page: number;
  perPage: number;
  history: string[];
}

const initialState: SearchState = {
  query: '',
  repos: [],
  totalCount: 0,
  loading: false,
  error: null,
  searched: false,
  sort: 'stars',
  order: 'desc',
  language: '',
  page: 1,
  perPage: 20,
  history: getSearchHistory(),
};

export const searchRepos = createAsyncThunk(
  'search/searchRepos',
  async (_, { getState, rejectWithValue }) => {
    const state = (getState() as { search: SearchState }).search;
    const { query, sort, order, language, page, perPage } = state;

    // * позволяет искать все репозитории при пустом запросе
    let q = encodeURIComponent(query.trim() || '*');
    if (language) {
      q += `+language:${encodeURIComponent(language)}`;
    }

    const url = `https://api.github.com/search/repositories?q=${q}&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        return rejectWithValue('Превышен лимит запросов к API. Подождите минуту.');
      }
      return rejectWithValue(`Ошибка: ${response.status} ${response.statusText}`);
    }

    const data: SearchResponse = await response.json();
    return data;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setOrder(state, action: PayloadAction<OrderOption>) {
      state.order = action.payload;
      state.page = 1;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    saveToHistory(state, action: PayloadAction<string | undefined>) {
      const term = (action.payload ?? state.query).trim();
      if (term) {
        state.history = addToSearchHistory(term);
      }
    },
    removeHistoryItem(state, action: PayloadAction<string>) {
      state.history = removeFromSearchHistory(action.payload);
    },
    clearHistory(state) {
      state.history = clearSearchHistory();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRepos.fulfilled, (state, action) => {
        state.loading = false;
        state.searched = true;
        state.totalCount = action.payload.total_count;

        // GitHub API иногда возвращает неточный порядок,
        // поэтому досортируем результат
        state.repos = sortRepos(action.payload.items, state.sort, state.order);
      })
      .addCase(searchRepos.rejected, (state, action) => {
        state.loading = false;
        state.searched = true;
        state.error = action.payload as string;
        state.repos = [];
        state.totalCount = 0;
      });
  },
});

export const { setQuery, setSort, setOrder, setLanguage, setPage, saveToHistory, removeHistoryItem, clearHistory } =
  searchSlice.actions;
export default searchSlice.reducer;
