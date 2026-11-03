# Информационный мир

Авторская манга о кибербезопасности, дружбе и технологиях. Vue 3, Vue Router, Pinia, Tailwind CSS и Vite. Четыре оригинальные главы, 42 страницы. Шрифты Manrope и Oswald поставляются локально через Fontsource; обращения к Google Fonts не нужны.

## Демонстрация

[Открыть сайт →](https://marat-vue.github.io/informational-manga/)

**Главная страница** — знакомство с историей и быстрый переход к чтению.

[![Главная страница «Информационного мира»: героиня и Робо, описание манги и кнопка «Начать читать»](docs/screenshots/home-desktop.jpg)](docs/screenshots/home-desktop.jpg)

**Каталог глав** — четыре истории о цифровом мире, поиск и фильтры по прогрессу чтения.

[![Каталог с обложками глав «Пароли», «Социальные сети», «QR-коды» и «Компьютер внутри нас»](docs/screenshots/chapters-desktop.jpg)](docs/screenshots/chapters-desktop.jpg)

<table>
  <tr>
    <th width="65%">Постраничный ридер</th>
    <th width="35%">Мобильная версия</th>
  </tr>
  <tr>
    <td align="center" valign="top">
      <a href="docs/screenshots/reader-desktop.jpg"><img src="docs/screenshots/reader-desktop.jpg" alt="Ридер: страница главы «Пароли», выбор главы, закладки и панель перелистывания" width="600" /></a>
    </td>
    <td align="center" valign="top">
      <a href="docs/screenshots/home-mobile.jpg"><img src="docs/screenshots/home-mobile.jpg" alt="Главная страница на смартфоне: адаптивная обложка, мобильное меню и кнопка начала чтения" width="280" /></a>
    </td>
  </tr>
  <tr>
    <td>Выбор главы и страницы, закладки и режим погружения.</td>
    <td>История всегда под рукой — на любом экране.</td>
  </tr>
</table>

Скриншоты сняты с работающего сайта в двойном разрешении. Нажмите на изображение, чтобы открыть его в полном размере.

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

Workflow устанавливает зависимости через `npm ci`, запускает тесты, собирает и публикует `dist`. Базовый путь автоматически берётся из имени репозитория. Адрес сайта: [marat-vue.github.io/informational-manga/](https://marat-vue.github.io/informational-manga/).

Настройка основана на [официальной инструкции Vite для GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages); версии GitHub Actions закреплены по SHA.

Роутер использует hash-адреса (`/#/chapter/1/page/1`), поэтому обновление страницы и прямые ссылки работают на статическом GH Pages без серверных перенаправлений. Пути изображений учитывают базовый путь. В `public/.nojekyll` отключена обработка Jekyll.

Для публикации в корне домена переопределите `VITE_BASE_PATH=/` при сборке и такое же значение в шаге Build workflow. Например, в PowerShell:

```powershell
$env:VITE_BASE_PATH = '/'
npm run build
```

## Структура

`src/pages/` — страницы; `src/components/` — общие элементы; `src/stores/reader.js` — Pinia и сохранение; `src/data/chapters.js` — единый каталог глав; `src/lib/progress.js` — проверка и восстановление состояния; `public/images/` — оригинальные иллюстрации и страницы. Старые адреса `/chapters`, `/title`, `/chapter/:chapterId/page/:pageId` сохранены внутри hash-роутера.
