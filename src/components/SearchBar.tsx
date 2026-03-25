import { type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setQuery, saveToHistory, removeHistoryItem, searchRepos } from '../store/searchSlice';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const { query, loading, history } = useAppSelector((s) => s.search);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) dispatch(saveToHistory());
    dispatch(searchRepos());
  };

  const handleHistoryClick = (item: string) => {
    dispatch(setQuery(item));
    dispatch(saveToHistory());
    dispatch(searchRepos());
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="text"
            placeholder="Искать репозитории на GitHub..."
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          {query && (
            <span className={styles.clearInput} onClick={() => dispatch(setQuery(''))}>
              &times;
            </span>
          )}
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>
      {history.length > 0 && (
        <div className={styles.history}>
          <span>История:</span>
          {history.map((item) => (
            <span key={item} className={styles.historyItem}>
              <span className={styles.historyText} onClick={() => handleHistoryClick(item)}>
                {item}
              </span>
              <span
                className={styles.historyRemove}
                onClick={() => dispatch(removeHistoryItem(item))}
              >
                &times;
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
