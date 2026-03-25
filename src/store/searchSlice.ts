import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { GithubRepo, SortOption, OrderOption, SearchResponse } from '../types/github';
import { getSearchHistory, addToSearchHistory, clearSearchHistory } from '../utils/localStorage';

interface SearchState {
  query: string;
  repos: GithubRepo[];
  totalCount: number;
  loading: boolean;
  error: string | null;
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

    if (!query.trim()) {
      return rejectWithValue('Enter a search query');
    }

    let q = query.trim();
    if (language) {
      q += `+language:${language}`;
    }

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=${order}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        return rejectWithValue('API rate limit exceeded. Please wait a minute.');
      }
      return rejectWithValue(`Error: ${response.status} ${response.statusText}`);
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
    saveToHistory(state) {
      if (state.query.trim()) {
        state.history = addToSearchHistory(state.query.trim());
      }
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
        state.repos = action.payload.items;
        state.totalCount = action.payload.total_count;
      })
      .addCase(searchRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, setSort, setOrder, setLanguage, setPage, saveToHistory, clearHistory } =
  searchSlice.actions;
export default searchSlice.reducer;
