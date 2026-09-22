# Оптимизация мобильной главной — 2026-09-22

- Шрифты Google Fonts размещены в public/fonts с OFL-лицензиями; CSS больше
  не делает внешний @import. font-display: swap сохраняет читаемый текст при загрузке.
- SSR не содержит src/source для hero-видео. IntersectionObserver + idle callback
  разрешают загрузку после появления в viewport. На мобильном выбран reel-mobile.mp4.
  Вне экрана видео приостанавливается. Save-Data, 2g и reduced-motion оставляют запуск
  по кнопке; отказ autoplay тоже не убирает кнопку.
- Главная получает только поля 4 видимых кейсов и 3 блогеров. NEXT_DATA 85241 → 4840
  байт; HTML 126432 → 46140 байт (до gzip, локальная production-сборка).
- На VPS gzip включён только в server rguard.ru для CSS, JS, JSON, SVG. nginx -t
  прошёл, выполнен reload. Проверенный JS: 211849 → 66706 байт по сети (gzip).
  Backup: /etc/nginx/sites-available/rguard.before-gzip-20260922054916.
  Видеофайлы не сжимаются gzip. Другие сайты VPS не менялись.
- Код сайта пока не задеплоен. Сжатие на VPS уже активно.

Проверки: node --test tests/home-performance.test.mjs; npm run build.
Браузер 390px: до прокрутки video src отсутствует и readyState=0, меню открывается;
после прокрутки src=/reel-mobile.mp4, readyState=4, paused=false.
Это функциональная проверка, не замер скорости на реальном мобильном операторе.

## Повторная жалоба: iPhone 16 Pro Max, LTE, несколько браузеров

Точную причину задержки на телефоне пока не воспроизвели. Приватность Safari
не считается доказанной причиной. Подготовлена независимая от React шапка:
нативные details/summary для меню, обычные ссылки мобильной навигации,
обработчик переключения темы inline в head. Метрика переведена на lazyOnload.
В тестовом HTML удалены все внешние script: меню открывается, тема переключается.
В обычной production-сборке с React работают те же элементы без ошибок консоли.
Эта правка локальная; формы по-прежнему требуют React. Нужен повторный тест
на реальном телефоне после согласованного деплоя, без обещания устранения всего зависания.
# Brief loading follow-up (local, not deployed)

- `/brief` now gates its optional backdrop at 1024px before mounting the dynamic component. The form remains directly imported and server-rendered.
- Desktop backdrop initially requests six still frames instead of all 906. Each animation requests remaining frames only on interaction, four requests at a time per tile; queue stops on unmount.
- Layout no longer mounts/downloads the unused modal on `/brief` or before it is opened elsewhere.
- Cookie storage reads/writes are guarded so unavailable localStorage cannot throw from the banner into the app. This was a code risk, not a confirmed reproduction on the user's phone.
- Production build and eight focused tests pass. Browser check at 440x956: zero canvases, no console errors, awareness branch advances through single/multiple choice to contact fields; unchecked consent disables submission. No test lead submitted.
- Real iPhone/LTE freeze remains unverified. Do not report it resolved based on a desktop viewport check.
