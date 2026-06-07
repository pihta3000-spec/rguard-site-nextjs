// Дерево вопросов брифа. Один шаг = один экран.
// type: 'single' | 'multi' | 'text'
// next: id следующего шага (строка) — для финальной конвергенции всегда 'contacts'

export const ROOT_ID = 'root'

export const STEPS = {
  root: {
    id: 'root',
    type: 'single',
    question: 'Какую задачу необходимо решить?',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'leads',     label: 'Получить заявки на покупку товара или услуги', next: 'leads_tools' },
      { value: 'awareness', label: 'Повысить узнаваемость бренда',                 next: 'awareness_tools' },
      { value: 'smm',       label: 'Привлечь новых подписчиков в социальных сетях', next: 'smm_who' },
      { value: 'hr',        label: 'Привлечь сотрудников на работу',               next: 'hr_tools' },
      { value: 'event',     label: 'Провести мероприятие',                         next: 'event_format' },
    ],
  },

  // ───────── Ветка 1: Заявки ─────────
  leads_tools: {
    id: 'leads_tools',
    type: 'multi',
    question: 'Какими инструментами лидогенерации пользуетесь сейчас?',
    note: 'можно выбрать несколько, для перехода нажмите «Далее»',
    options: [
      { value: 'context',  label: 'Контекстная реклама' },
      { value: 'target',   label: 'Таргетированная реклама' },
      { value: 'expo',     label: 'Участие в выставках' },
      { value: 'social',   label: 'Через социальные сети' },
      { value: 'wom',      label: 'Сарафанное радио' },
    ],
    next: 'leads_eval',
  },
  leads_eval: {
    id: 'leads_eval',
    type: 'single',
    question: 'Оцените результативность использования текущих инструментов продвижения',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'none',      label: 'Заявки нет, бюджет расходуется',                                next: 'contacts' },
      { value: 'expensive', label: 'Заявки есть, но дорогие',                                       next: 'contacts' },
      { value: 'lowvol',    label: 'Заявки есть, цена приемлемая, но количество заявок недостаточно', next: 'contacts' },
    ],
  },

  // ───────── Ветка 2: Узнаваемость ─────────
  awareness_tools: {
    id: 'awareness_tools',
    type: 'multi',
    question: 'Какими инструментами повышения узнаваемости пользуетесь сейчас?',
    note: 'можно выбрать несколько, для перехода нажмите «Далее»',
    options: [
      { value: 'pr',     label: 'PR активности' },
      { value: 'expo',   label: 'Участие в выставках' },
      { value: 'events', label: 'Участие в социальных мероприятиях' },
      { value: 'social', label: 'Через социальные сети' },
    ],
    next: 'awareness_eval',
  },
  awareness_eval: {
    id: 'awareness_eval',
    type: 'single',
    question: 'Оцените результативность использования текущих инструментов повышения узнаваемости',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'unknown',   label: 'О компании не знают',                                          next: 'contacts' },
      { value: 'narrow',    label: 'О компании знают в узких кругах',                              next: 'contacts' },
      { value: 'wantmore',  label: 'О компании знают, но используют. Хотим повысить узнаваемость', next: 'contacts' },
    ],
  },

  // ───────── Ветка 3: Подписчики в соцсетях ─────────
  smm_who: {
    id: 'smm_who',
    type: 'single',
    question: 'Кто сейчас занимается развитием социальных сетей в вашей компании?',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'owner',     label: 'Собственник',                  next: 'smm_avatars' },
      { value: 'staff',     label: 'Штатный SMM-специалист',       next: 'smm_avatars' },
      { value: 'agency',    label: 'Привлечённое SMM-агентство',   next: 'smm_avatars' },
      { value: 'freelance', label: 'Внештатный SMM-специалист',    next: 'smm_avatars' },
    ],
  },
  smm_avatars: {
    id: 'smm_avatars',
    type: 'single',
    question: 'Активности снимаются в соцсетях уже сейчас?',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'none',   label: 'Активностей нет',                                  next: 'smm_results' },
      { value: 'stuck',  label: 'Активности есть, но подписчики не растут',         next: 'smm_results' },
      { value: 'slow',   label: 'Активности есть, подписчики растут, но медленно',  next: 'smm_results' },
    ],
  },
  smm_results: {
    id: 'smm_results',
    type: 'multi',
    question: 'Какие результаты вы ожидаете от сотрудничества с нами?',
    note: 'можно выбрать несколько',
    options: [
      { value: 'leads_via_social', label: 'Рост числа заявок через социальные сети' },
      { value: 'loyalty',          label: 'Рост подписчиков, повышение лояльности к бренду в социальных сетях' },
      { value: 'scripts',          label: 'Внедрение скриптов привлечения внимания и сторис в Instagram' },
    ],
    next: 'contacts',
  },

  // ───────── Ветка 4: Сотрудники ─────────
  hr_tools: {
    id: 'hr_tools',
    type: 'multi',
    question: 'Какими инструментами привлечения сотрудников пользуетесь сейчас?',
    note: 'можно выбрать несколько, для перехода нажмите «Далее»',
    options: [
      { value: 'boards',    label: 'HR доски объявлений (HH, Авито)' },
      { value: 'referral',  label: 'Через действующих сотрудников (рефералы)' },
      { value: 'ads',       label: 'Таргетированная или контекстная реклама в связке с вакансией' },
      { value: 'social',    label: 'Через социальные сети' },
    ],
    next: 'hr_eval',
  },
  hr_eval: {
    id: 'hr_eval',
    type: 'single',
    question: 'Оцените результативность использования текущих инструментов привлечения сотрудников',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'bad',      label: 'Заявки есть, но кривые',                                            next: 'hr_count' },
      { value: 'notarget', label: 'Есть целевые заявки, но не доходят до трудоустройства',             next: 'hr_count' },
      { value: 'churn',    label: 'Доходят до трудоустройства, но долго не задерживаются',             next: 'hr_count' },
      { value: 'good',     label: 'Всё хорошо, сотрудники устраиваются и остаются в компании надолго', next: 'hr_count' },
    ],
  },
  hr_count: {
    id: 'hr_count',
    type: 'single',
    question: 'Сколько сотрудников вам необходимо привлечь?',
    note: 'можно выбрать один вариант',
    options: [
      { value: '1-10',  label: '1–10',       next: 'contacts' },
      { value: '10-25', label: '10–25',      next: 'contacts' },
      { value: '25-50', label: '25–50',      next: 'contacts' },
      { value: '50+',   label: '50 и более', next: 'contacts' },
    ],
  },

  // ───────── Ветка 5: Мероприятие ─────────
  event_format: {
    id: 'event_format',
    type: 'single',
    question: 'Какого формата мероприятие планируется?',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'intimate', label: 'Камерное (свадьба, корпоратив, юбилей)', next: 'event_date' },
      { value: 'large',    label: 'Масштабное (городские праздники, фестивали, публичные мероприятия, открытые объекты)', next: 'event_date' },
    ],
  },
  event_date: {
    id: 'event_date',
    type: 'text',
    inputType: 'date',
    question: 'Выберите планируемую дату мероприятия',
    placeholder: 'дд.мм.гггг',
    next: 'event_guests',
  },
  event_guests: {
    id: 'event_guests',
    type: 'text',
    inputType: 'number',
    question: 'Укажите количество гостей',
    placeholder: 'Например, 50',
    next: 'event_solution',
  },
  event_solution: {
    id: 'event_solution',
    type: 'single',
    question: 'Выберите формат решения задачи',
    note: 'можно выбрать один вариант',
    options: [
      { value: 'turnkey', label: 'Под ключ (берём на себя весь круг организации)',                     next: 'contacts' },
      { value: 'partial', label: 'Частичное содержание (закрываем отдельные блоки мероприятия)',       next: 'contacts' },
      { value: 'media',   label: 'Только медиапродакшн (если событие организовано другой компанией)',  next: 'contacts' },
    ],
  },

  // ───────── Финал: контакты (точка схождения всех веток) ─────────
  contacts: {
    id: 'contacts',
    type: 'contacts',
    question: 'Заполните контактные данные — мы свяжемся с вами, обозначим время и продолжим маркетинговые маршруты',
    fields: [
      { name: 'company',  label: 'Название компании',          kind: 'short', required: true },
      { name: 'city',     label: 'Ваш город',                  kind: 'short', required: true },
      { name: 'activity', label: 'Род деятельности',           kind: 'long',  required: true },
      { name: 'phone',    label: 'Номер телефона',             kind: 'short', required: true },
    ],
  },
}

// Человекочитаемые названия задач — для письма
export const TASK_LABELS = {
  leads: 'Получить заявки на покупку товара или услуги',
  awareness: 'Повысить узнаваемость бренда',
  smm: 'Привлечь новых подписчиков в социальных сетях',
  hr: 'Привлечь сотрудников на работу',
  event: 'Провести мероприятие',
}
