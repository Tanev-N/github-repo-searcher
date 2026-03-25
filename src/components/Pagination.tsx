import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPage, searchRepos } from '../store/searchSlice';
import styles from './Pagination.module.css';

function getPageNumbers(current: number, total: number): (number | '...')[] {
  const pages: (number | '...')[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { page, perPage, totalCount } = useAppSelector((s) => s.search);

  const totalPages = Math.min(Math.ceil(totalCount / perPage), 50); // GitHub API limits to 1000 results

  if (totalPages <= 1) return null;

  const goTo = (newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(searchRepos());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className={styles.pagination}>
      <button
        className={styles.navButton}
        disabled={page <= 1}
        onClick={() => goTo(1)}
        title="Первая страница"
      >
        &laquo;
      </button>
      <button
        className={styles.navButton}
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        title="Предыдущая страница"
      >
        &lsaquo;
      </button>

      <div className={styles.pages}>
        {pageNumbers.map((item, i) =>
          item === '...' ? (
            <span key={`dots-${i}`} className={styles.dots}>...</span>
          ) : (
            <button
              key={item}
              className={`${styles.pageButton} ${item === page ? styles.active : ''}`}
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        className={styles.navButton}
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        title="Следующая страница"
      >
        &rsaquo;
      </button>
      <button
        className={styles.navButton}
        disabled={page >= totalPages}
        onClick={() => goTo(totalPages)}
        title="Последняя страница"
      >
        &raquo;
      </button>
    </div>
  );
}
