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
