import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSort, setOrder, setLanguage, searchRepos } from '../store/searchSlice';
import type { SortOption, OrderOption } from '../types/github';
import Filter from './Filter';
import styles from './Filters.module.css';

const SORT_OPTIONS = [
  { value: 'stars' as const, label: 'Звёзды' },
  { value: 'forks' as const, label: 'Форки' },
  { value: 'updated' as const, label: 'Обновление' },
];

const ORDER_OPTIONS = [
  { value: 'desc' as const, label: 'По убыванию' },
  { value: 'asc' as const, label: 'По возрастанию' },
];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'C++', label: 'C++' },
  { value: 'C#', label: 'C#' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
];

export default function Filters() {
  const dispatch = useAppDispatch();
  const { sort, order, language, totalCount } = useAppSelector((s) => s.search);

  if (totalCount === 0 && !language) return null;

  const handleSort = (value: SortOption) => {
    dispatch(setSort(value));
    dispatch(searchRepos());
  };

  const handleOrder = (value: OrderOption) => {
    dispatch(setOrder(value));
    dispatch(searchRepos());
  };

  const handleLanguage = (value: string) => {
    dispatch(setLanguage(value));
    dispatch(searchRepos());
  };

  return (
    <div className={styles.filters}>
      <Filter label="Сортировка:" value={sort} options={SORT_OPTIONS} onChange={handleSort} />
      <Filter label="Порядок:" value={order} options={ORDER_OPTIONS} onChange={handleOrder} />
      <Filter label="Язык:" value={language} options={LANGUAGE_OPTIONS} onChange={handleLanguage} />
    </div>
  );
}
