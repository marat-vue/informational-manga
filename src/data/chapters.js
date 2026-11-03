export const chapters = [
  {
    id: 1, title: 'Пароли', pages: 11, topic: 'Цифровая защита', icon: 'shield',
    color: '#e87c55', background: '#6e777e',
    description: 'Один пароль может открыть целый мир. Главное — чтобы он не открыл его кому-то ещё.',
    summary: 'Вместе с Робо разбираемся, как придумать надёжный пароль и почему имя питомца — не лучшая идея.',
  },
  {
    id: 2, title: 'Социальные сети', pages: 10, topic: 'Жизнь онлайн', icon: 'users',
    color: '#a9bdae', background: '#9daca6',
    description: 'По ту сторону экрана тоже есть правила. Узнай, кому можно доверять в сети.',
    summary: 'Что мы рассказываем о себе в интернете? Учимся беречь личные данные и замечать цифровые ловушки.',
  },
  {
    id: 3, title: 'QR-коды', pages: 9, topic: 'Скрытые технологии', icon: 'qr',
    color: '#a8a4ce', background: '#aaa3bc',
    description: 'Маленький квадрат. Большие возможности. И несколько неожиданных секретов.',
    summary: 'Сканируем привычное с новой стороны: как устроены QR-коды и что стоит проверить перед переходом.',
  },
  {
    id: 4, title: 'Компьютер внутри нас', pages: 12, topic: 'Человек и будущее', icon: 'cpu',
    color: '#cdbb8b', background: '#b4a88d',
    description: 'Где заканчивается человек и начинается технология? Будущее ближе, чем кажется.',
    summary: 'Исследуем удивительное пересечение человека и технологий — от привычных устройств до мира завтрашнего дня.',
  },
]

export const totalPages = chapters.reduce((sum, chapter) => sum + chapter.pages, 0)
export const imagePath = (path) => `${import.meta.env.BASE_URL}images/${path}`
export const pagePath = (chapter, page = 1) => imagePath(`chapters/chapter${chapter}/page${page}.jpg`)
export const readerPath = (chapter, page = 1) => `/chapter/${chapter}/page/${page}`
