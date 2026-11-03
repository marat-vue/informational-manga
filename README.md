# Информационный мир

Авторская манга о кибербезопасности, дружбе и технологиях. Vue 3, Vue Router, Pinia, Tailwind CSS и Vite. Четыре оригинальные главы, 42 страницы. Шрифты Manrope и Oswald поставляются локально через Fontsource; обращения к Google Fonts не нужны.

## Запуск

Требуется Node.js 22.12+ (рекомендуется 24).

```sh
npm ci
npm run dev
```

Откройте адрес из терминала: обычно `http://127.0.0.1:5173/informational-manga/`.

```sh
npm test        # границы глав, восстановление прогресса, наличие всех страниц
npm run build  # production-сборка в dist/
npm run preview
```

## Возможности

- Адаптивные главная, каталог и страница о манге; тёмная и светлая темы.
- Поиск по названиям и темам, фильтрация по прогрессу, сортировка глав.
- Постраничный ридер: выбор главы и страницы, свайпы, предварительная загрузка следующей страницы, широкая страница и режим погружения.
- `←` / `→` — листать; `B` — закладка; `F` — погружение; `Esc` — вернуть панели; `Ctrl/Cmd + K` — поиск.
- Прогресс и закладки хранятся в localStorage этого браузера. Настройки сохраняются, прежние `lastChapter` / `lastPage` мигрируют автоматически. Синхронизации между устройствами нет.
- Поддержка клавиатуры, семантическая разметка, фокус в диалогах, `prefers-reduced-motion`.

## GitHub Pages

1. Загрузите проект в репозиторий GitHub. Файл `package-lock.json` должен быть включён в коммит.
2. В **Settings → Pages → Build and deployment → Source** выберите **GitHub Actions**.
3. Отправьте изменения в `main` / `master` или вручную запустите **Actions → Deploy to GitHub Pages → Run workflow**.

Workflow устанавливает зависимости через `npm ci`, запускает тесты, собирает и публикует `dist`. Базовый путь автоматически берётся из имени репозитория. Для текущего репозитория адрес после успешного деплоя будет: [marat-englisc.github.io/informational-manga/](https://marat-englisc.github.io/informational-manga/).

Настройка основана на [официальной инструкции Vite для GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages); версии GitHub Actions закреплены по SHA.

Роутер использует hash-адреса (`/#/chapter/1/page/1`), поэтому обновление страницы и прямые ссылки работают на статическом GH Pages без серверных перенаправлений. Пути изображений учитывают базовый путь. В `public/.nojekyll` отключена обработка Jekyll.

Для публикации в корне домена переопределите `VITE_BASE_PATH=/` при сборке и такое же значение в шаге Build workflow. Например, в PowerShell:

```powershell
$env:VITE_BASE_PATH = '/'
npm run build
```

## Структура

`src/pages/` — страницы; `src/components/` — общие элементы; `src/stores/reader.js` — Pinia и сохранение; `src/data/chapters.js` — единый каталог глав; `src/lib/progress.js` — проверка и восстановление состояния; `public/images/` — оригинальные иллюстрации и страницы. Старые адреса `/chapters`, `/title`, `/chapter/:chapterId/page/:pageId` сохранены внутри hash-роутера.
