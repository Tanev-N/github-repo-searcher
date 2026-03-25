import styles from './Filters.module.css';

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterProps<T extends string> {
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
}

export default function Filter<T extends string>({ label, value, options, onChange }: FilterProps<T>) {
  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
