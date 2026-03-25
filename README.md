# GitHub Repo Searcher

SPA для поиска репозиториев через публичный GitHub API.

**Demo:** https://tanev-n.github.io/github-repo-searcher/

## Стек

React + TypeScript + Redux Toolkit + Vite + CSS Modules

## Локальный запуск

```bash
git clone git@github.com:Tanev-N/github-repo-searcher.git
cd github-repo-searcher
npm install
npm run dev
```

Приложение запустится на `http://localhost:5173/github-repo-searcher/`.

## Структура компонентов

| Компонент | Назначение |
|-----------|-----------|
| `SearchBar` | Поле ввода с кнопкой поиска, блок истории запросов |
| `Filter` | Переиспользуемый generic select-фильтр (label + options + onChange) |
| `Filters` | Набор фильтров: сортировка (stars/forks/updated), порядок (asc/desc), язык |
| `RepoList` | Карточки репозиториев: аватар, название-ссылка, описание, метаданные |
| `Pagination` | Навигация по страницам: первая/последняя, пред./след., номера с многоточием |

## Архитектурные решения

- **Redux Toolkit** — `searchSlice` хранит запрос, фильтры, результаты, пагинацию и историю. Поиск выполняется через `createAsyncThunk`.
- **CSS Modules** — стили изолированы на уровне компонентов.
- **История поиска** — до 10 последних запросов в `localStorage`. Удаление по одному, сохраняется между сессиями.
- **Клиентская досортировка** — GitHub API иногда возвращает неточный порядок , поэтому результаты досортируются.


## Ограничения

- **Лимит запросов** — публичный GitHub API допускает ~10 запросов в минуту без токена. При превышении показывается ошибка.
- **Максимум 1000 результатов** — ограничение GitHub Search API. Это 50 страниц по 20 элементов.

