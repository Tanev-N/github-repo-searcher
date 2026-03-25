import { useAppSelector } from '../store/hooks';
import styles from './RepoList.module.css';

export default function RepoList() {
  const { repos, loading, error, totalCount, searched } = useAppSelector((s) => s.search);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!loading && repos.length === 0) {
    if (searched) {
      return <div className={styles.empty}>Ничего не найдено</div>;
    }
    return null;
  }

  return (
    <div className={styles.list}>
      {totalCount > 0 && (
        <div className={styles.totalCount}>
          Найдено {totalCount.toLocaleString()} репозиториев
        </div>
      )}
      {repos.map((repo) => (
        <div key={repo.id} className={styles.card}>
          <div className={styles.header}>
            <img className={styles.avatar} src={repo.owner.avatar_url} alt="" />
            <a className={styles.repoName} href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.full_name}
            </a>
          </div>
          {repo.description && <div className={styles.description}>{repo.description}</div>}
          <div className={styles.meta}>
            {repo.language && (
              <span className={styles.metaItem}>
                <span className={styles.langDot} />
                {repo.language}
              </span>
            )}
            <span className={styles.metaItem}>&#9733; {repo.stargazers_count.toLocaleString()}</span>
            <span className={styles.metaItem}>&#128268; {repo.forks_count.toLocaleString()}</span>
            <span className={styles.metaItem}>
              Обновлён {new Date(repo.updated_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
