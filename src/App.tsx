import { useAppSelector } from './store/hooks';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import RepoList from './components/RepoList';
import Pagination from './components/Pagination';
import styles from './App.module.css';

function App() {
  const loading = useAppSelector((s) => s.search.loading);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Поиск репозиториев GitHub</h1>
      <div className={styles.sections}>
        <SearchBar />
        <Filters />
        {loading && <div className={styles.spinner}>Загрузка...</div>}
        <RepoList />
        <Pagination />
      </div>
    </div>
  );
}

export default App;
