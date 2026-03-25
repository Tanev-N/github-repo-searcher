import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSort, setOrder, setLanguage, searchRepos } from '../store/searchSlice';
import type { SortOption, OrderOption } from '../types/github';
import styles from './Filters.module.css';

const LANGUAGES = [
  '', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go',
  'Rust', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
];

export default function Filters() {
  const dispatch = useAppDispatch();
  const { sort, order, language, totalCount } = useAppSelector((s) => s.search);

  if (totalCount === 0 && !language) return null;

  const handleSort = (value: string) => {
    dispatch(setSort(value as SortOption));
    dispatch(searchRepos());
  };

  const handleOrder = (value: string) => {
    dispatch(setOrder(value as OrderOption));
    dispatch(searchRepos());
  };

  const handleLanguage = (value: string) => {
    dispatch(setLanguage(value));
    dispatch(searchRepos());
  };

  return (
    <div className={styles.filters}>
      <div className={styles.group}>
        <span className={styles.label}>Сортировка:</span>
        <select className={styles.select} value={sort} onChange={(e) => handleSort(e.target.value)}>
          <option value="stars">Звёзды</option>
          <option value="forks">Форки</option>
          <option value="updated">Обновление</option>
        </select>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Порядок:</span>
        <select className={styles.select} value={order} onChange={(e) => handleOrder(e.target.value)}>
          <option value="desc">По убыванию</option>
          <option value="asc">По возрастанию</option>
        </select>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Язык:</span>
        <select className={styles.select} value={language} onChange={(e) => handleLanguage(e.target.value)}>
          <option value="">Все</option>
          {LANGUAGES.filter(Boolean).map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
