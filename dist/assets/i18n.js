/** UI text catalog. Language selection is independent of compression settings. */
const PAIRS = [
  ['Add a video', 'Добавьте видео'], ['Drag a file here or click “+”', 'Перетащите файл сюда или нажмите «+»'],
  ['Your video will appear here', 'Ваше видео появится здесь'], ['Add a file or select one from the list on the left.', 'Добавьте файл или выберите его в списке слева.'],
  ['Open the developer’s Telegram', 'Открыть Telegram разработчика'],
  ['App author', 'Автор приложения'],
  ['Video compression', 'Сжатие видео'], ['Reset settings', 'Сбросить настройки'],
  ['Remove completed', 'Убрать завершённые'], ['Developer', 'Разработчик'],
  ['@seltux on Telegram', '@seltux в Telegram'], ['Language', 'Язык'],
  ['Compression level', 'Степень сжатия'], ['Choose a balance between file size and quality', 'Выберите подходящий баланс размера и качества'],
  ['Light', 'Слабое'], ['Medium', 'Среднее'], ['Strong', 'Сильное'],
  ['Higher quality · larger file', 'Лучше качество · файл больше'], ['Balance of quality and size', 'Баланс качества и размера'],
  ['Smaller file · previous setting', 'Меньше размер · прежний режим'], ['Custom quality', 'Настраиваемое качество'],
  ['Compression settings', 'Настройки сжатия'], ['Add videos', 'Добавить видео'], ['Clear list', 'Очистить список'],
  ['Pin window', 'Закрепить окно'], ['Restore defaults', 'Восстановить настройки'], ['Settings Guide', 'Руководство по настройкам'],
  ['Show in folder', 'Показать в папке'], ['Remove from list', 'Убрать из списка'], ['Stop compression', 'Остановить сжатие'],
  ['Compress now', 'Сжать сейчас'], ['Show in Folder', 'Показать в папке'],
  ['Recompress with current settings', 'Сжать повторно с текущими настройками'], ['Cancel compression', 'Отменить сжатие'],
  ['Ready', 'Готово'], ['Waiting', 'В очереди'], ['Compressing', 'Сжатие'], ['Retrying', 'Повторное сжатие'],
  ['Done', 'Готово'], ['Error', 'Ошибка'], ['Canceled', 'Отменено'],
  ['Getting started', 'Начало работы'], ['Drag in a video', 'Перетащите видео'],
  ['Click Show in Folder', 'Нажмите «Показать в папке»'], ['Open Settings', 'Откройте настройки'],
  ['Try the Mini mode', 'Попробуйте мини-режим'], ['Close', 'Закрыть'],
  ['Format', 'Формат'], ['Video Stream', 'Видеопоток'], ['Audio Stream', 'Аудиопоток'],
  ['No audio', 'Без звука'], ['No video', 'Без видео'], ['Trim', 'Обрезать'],
  ['Original', 'Оригинал'], ['Compressed', 'Сжато'], ['Details', 'подробности'],
  ['Show', 'Показать'], ['Hide', 'Скрыть'], ['Type', 'Тип'],
  ['Relative', 'В процентах'], ['Width', 'Ширина'], ['Height', 'Высота'],
  ['Keep scale', 'Исходный размер'], ['10% scale', '10% размера'], ['25% scale', '25% размера'],
  ['50% scale', '50% размера'], ['75% scale', '75% размера'],
  ['Limit file size', 'Ограничить размер файла'], ['Max', 'Макс.'], ['MB', 'МБ'], ['More', 'Подробнее'],
  ['Experimental: if the file is too large, compression is retried at lower quality.', 'Экспериментально: если размер больше заданного, программа повторит сжатие с более низким качеством.'],
  ['Preserve metadata', 'Сохранить метаданные'], ['Faster', 'Быстрее'], ['Better', 'Лучше'],
  ['Boost', 'Ускорение'], ['Use more CPU cores to compress faster. Other apps may be less responsive while boosting.', 'Использовать больше ядер процессора для ускорения сжатия. Другие приложения могут работать медленнее.'],
  ['Keep audio', 'Сохранить звук'], ['Web stream-friendly', 'Быстрый запуск в интернете'],
  ['MP4 format', 'Формат MP4'], ['WebM format', 'Формат WebM'], ['Keep speed', 'Исходная скорость'],
  ['0.5x speed', 'Скорость 0,5×'], ['1.5x speed', 'Скорость 1,5×'], ['2x speed', 'Скорость 2×'],
  ['5x speed', 'Скорость 5×'], ['10x speed', 'Скорость 10×'], ['Keep framerate', 'Исходная частота кадров'],
  ['Select', 'Выберите'], ['Select file type', 'Выберите формат'], ['Compress All', 'Сжать всё'],
  ['Drag files here or click + to select videos', 'Перетащите видео сюда или нажмите «+»'],
  ['—without losing quality', '— без потери качества'], ['GO', 'Сжать'],
  ['Compression speed vs Quality', 'Скорость и качество сжатия'], ['Scale down', 'Изменение размера'],
  ['Speed up video', 'Скорость видео'], ['Set a maxium framerate', 'Ограничение частоты кадров'],
  ['Remove Audio', 'Удаление звука'], ['Make the video streamable', 'Подготовка к просмотру онлайн'],
  ['Set a quality level', 'Уровень качества'], ['Choose a file format', 'Формат файла'],
  ['Shrink your videos', 'Уменьшайте размер видео'], ['Tweak it', 'Настройте сжатие'],
  ['Batch them up', 'Обрабатывайте несколько файлов'], ['Go big', 'Большие файлы'],
  ['Go small', 'Мини-режим'], ['Compare', 'Сравнение'],
  ['Screen recording', 'Запись экрана'], ['Camera footage', 'Видео с камеры'], ['Gameplay', 'Игровые записи'],
  ['Drone footage', 'Видео с дрона'], ['Security camera', 'Видео с камеры наблюдения'],
  ['Videos', 'Видеофайлы'], ['Could not add video:', 'Не удалось добавить видео:'],
  ['Could not add files:', 'Не удалось добавить файлы:'], ['Could not open Telegram:', 'Не удалось открыть Telegram:'],
  ['Could not start FFmpeg:', 'Не удалось запустить FFmpeg:'], ['Compression canceled', 'Сжатие отменено'],
  ['FFmpeg failed (code', 'FFmpeg завершился с ошибкой (код'],
  ['Unknown video height', 'Неизвестна высота видео'], ["Can't start (10)", 'Не удалось запустить сжатие (10)'],
  ["Can't compress (11)", 'Не удалось сжать видео (11)'],
  ['Select language', 'Выберите язык'], ['Speed', 'Скорость'], ['Percent smaller', 'Уменьшение в процентах'],
  ['Downscale, speed up, remove audio, reduce audio to compress up to 99%. Simple and easy settings.', 'Меняйте размер и скорость видео, удаляйте звук и настраивайте сжатие.'],
  ['Drag in as many videos as you want and keep doing what you were doing.', 'Добавьте несколько видео и продолжайте заниматься своими делами.'],
  ['Got hours of footage? Whole movies? Compress any size video. Megabytes, Gigabytes, Terabytes. We’ve got you.', 'Сжимайте длинные видео и большие файлы.'],
  ['Float a tiny window on top of your other apps, always ready to drag in videos to compress.', 'Закрепите мини-окно поверх других приложений и добавляйте видео перетаскиванием.'],
  ['If 90% smaller sounds too good to be true, see it with your own two eyes with the comparison slider.', 'Сравните оригинал и результат с помощью ползунка.'],
  ['Wait for processing to finish and try again.', 'Дождитесь завершения обработки и попробуйте снова.'],
  ['Encoding method', 'Способ сжатия'], ['CPU', 'Процессор'],
  ['The GPU may be faster, but quality and file size can differ.', 'Видеокарта может сжимать быстрее, но качество и размер могут отличаться.'],
  ['Checking the GPU…', 'Проверка видеокарты…'],
  ['WebM uses the CPU. NVENC is available for MP4.', 'WebM сжимается процессором. NVENC работает с MP4.'],
  ['NVIDIA NVENC is unavailable. Check the GPU and driver or choose CPU.', 'NVIDIA NVENC недоступен. Проверьте видеокарту и драйвер или выберите процессор.'],
  ['Estimate size', 'Оценить размер'], ['Estimating…', 'Выполняется оценка…'], ['Estimate again', 'Оценить заново'],
  ['Approximately', 'Примерно'], ['Based on short samples; the actual size may differ.', 'По коротким фрагментам; фактический размер может отличаться.'],
  ['Estimation is unavailable when a file size limit is enabled.', 'Оценка недоступна при ограничении размера файла.'],
  ['Could not estimate this video.', 'Не удалось оценить размер этого видео.'],
  ['Could not estimate the size. Check NVIDIA NVENC or choose CPU.', 'Не удалось оценить размер. Проверьте NVIDIA NVENC или выберите процессор.'],
  ['Size', 'Размер'], ['Duration', 'Длительность'], ['Streams', 'Потоки'], ['Stream groups', 'Группы потоков'],
  ['Start time', 'Время начала'], ['Start Time', 'Время начала'], ['Bit rate', 'Битрейт'], ['Bit Rate', 'Битрейт'],
  ['Codec', 'Кодек'], ['Profile', 'Профиль'], ['Pixel Format', 'Формат пикселей'], ['Frame Rate', 'Частота кадров'],
  ['Average Frame Rate', 'Средняя частота кадров'], ['Color Range', 'Диапазон цвета'], ['Color Space', 'Цветовое пространство'],
  ['Color Primaries', 'Основные цвета'], ['Color Transfer', 'Передаточная функция цвета'], ['Chroma Location', 'Расположение цветности'],
  ['Field Order', 'Порядок полей'], ['Number of Frames', 'Количество кадров'], ['Number of Read Frames', 'Прочитано кадров'],
  ['Number of Read Packets', 'Прочитано пакетов'], ['Time Base', 'База времени'], ['Sample Rate', 'Частота дискретизации'],
  ['Sample Format', 'Формат отсчётов'], ['Channels', 'Каналы'], ['Channel Layout', 'Схема каналов'],
  ['Bits Per Sample', 'Бит на отсчёт'], ['Bits Per Raw Sample', 'Бит на исходный отсчёт'],
  ['Initial Padding', 'Начальное заполнение'], ['Max Bit Rate', 'Максимальный битрейт'], ['References', 'Опорные кадры'],
  ['Start PTS', 'Начальный PTS'], ['Dispositions', 'Назначения'], ['Tags', 'Метки'],
  ['24 fps', '24 кадра/с'], ['30 fps', '30 кадров/с'], ['60 fps', '60 кадров/с'], ['fps', 'кадр/с'],
  ['Drag to move or focus and use arrow keys', 'Перетащите или используйте клавиши со стрелками'],
  ['Timeline', 'Шкала времени'], ['x speed', '× скорость'], ['← Back', '← Назад'],
  ['Content for website', 'Видео для сайта'], ['Archiving', 'Архивирование'], ['Messaging', 'Переписка'],
  ['Hosting', 'Хостинг'], ['monthly views', 'просмотров в месяц'], ['Other', 'Другое'],
  ['Free up space, reduce bandwidth costs and send videos over email and chat', 'Освобождайте место, сокращайте расход трафика и отправляйте видео в чаты и по почте'],
  ['Remove watermark', 'Убрать водяной знак'], ['px', 'пкс'],
  ['Get started', 'Начать'], ['Already have an account? Log in', 'Уже есть аккаунт? Войти'],
  ['Monthly data savings', 'Экономия трафика за месяц'], ['Total data savings', 'Общая экономия трафика'],
  ['Free data allowance per month', 'Бесплатный объём трафика в месяц'], ['Chargeable data saved per month', 'Экономия платного трафика за месяц'],
  ['Savings per GB over free allowance', 'Экономия за ГБ сверх бесплатного лимита'], ['Monthly visitors', 'Посетителей в месяц'],
  ["Using Vercel's bandwidth pricing as of Sep 2024 with the data for an average Compresso user, assuming all compressions are made for hosting on the web via Vercel.", 'Расчёт основан на ценах Vercel на трафик за сентябрь 2024 года и предполагает публикацию всех сжатых видео через Vercel.'],
  ["It's a rough estimate to give you an idea of the potential savings.", 'Это приблизительная оценка возможной экономии.'],
  ['What do you typically compress videos for?', 'Для чего вы обычно сжимаете видео?'],
  ['🌎 Hosting on the web', '🌎 Публикация в интернете'], ['☁️ Archiving in the cloud', '☁️ Хранение в облаке'],
  ['💾 Archiving on disk', '💾 Хранение на диске'], ['💬 Chat & Email', '💬 Чаты и почта'],
  ["Here's how much users like you are saving", 'Вот сколько экономят пользователи с похожими задачами'],
  ['Loading...', 'Загрузка...'], ['No data found for answer', 'Данные для ответа не найдены'],
  ['Contintue', 'Продолжить'], ['Saved yearly', 'Экономия за год'], ['Saved monthly', 'Экономия за месяц'],
  ['Saved daily', 'Экономия за день'], ['How do we calculate this?', 'Как мы это рассчитываем?'],
  ['/month', '/месяц'], ['/year', '/год'], ['We opened your check-out page', 'Страница оплаты открыта'],
  ['Complete the purchase to continue.', 'Завершите покупку, чтобы продолжить.'], ['Waiting for payment...', 'Ожидание оплаты...'],
  ['Open Checkout Again', 'Открыть страницу оплаты снова'], ['Check Payment Manually', 'Проверить оплату'], ['Cancel', 'Отмена'],
  ['Compresso Pro lifetime membership', 'Бессрочный доступ Compresso Pro'], ['33% off', 'Скидка 33%'],
  ["You've unlocked the launch offer for Compresso Pro.", 'Вам доступно стартовое предложение Compresso Pro.'],
  ['Upgrade now', 'Улучшить доступ'], ['Almost done!', 'Почти готово!'],
  ['Interesting! Do you remember which account?', 'Помните, какой аккаунт вы использовали?'],
  ['e.g. @username on Twitter', 'Например, @username в Twitter'], ['Submit', 'Отправить'],
];
const aliases = new Map();
for (const [en, ru] of PAIRS) { aliases.set(en,[en,ru]); aliases.set(ru,[en,ru]); }
// Additional variants used by the original bundled interface.
for (const [alias, canonical] of [['Show in Folder','Show in folder'],['Recompress with Current Settings','Recompress with current settings'],['Cancel Compression','Cancel compression'],['Remove from List','Remove from list'],['Reset to defaults','Restore defaults'],['Compression Settings','Compression settings'],['Add files','Add videos'],['Clear all files','Clear list'],['Pin','Pin window'],['What’s new?','What is new?']]) {
  if (aliases.has(canonical)) aliases.set(alias,aliases.get(canonical));
}
const ERROR_PREFIXES = PAIRS.filter(([en,ru]) => en.length >= 8 && (en.endsWith(':') || en.endsWith('(11)') || en.endsWith('(код') || ru.endsWith('(код')));
let language = 'ru';
try { if (localStorage.getItem('compresso-language') === 'en') language = 'en'; } catch {}
export function getLanguage() { return language; }
export function translateText(value, selected = language) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^(\s*)(.*?)(\s*)$/s); if (!match || !match[2]) return value;
  const text = match[2], prefix = match[1], suffix = match[3];
  const count = text.match(/^(?:Убрать завершённые|Remove completed) \((\d+)\)$/);
  if (count) return prefix + (selected === 'en' ? 'Remove completed' : 'Убрать завершённые') + ` (${count[1]})` + suffix;
  const pair = aliases.get(text);
  if (pair) return prefix + pair[selected === 'en' ? 0 : 1] + suffix;
  // Preserve diagnostic details while translating the human-readable prefix.
  for (const [en, ru] of ERROR_PREFIXES) {
    for (const source of [en,ru]) if (text.startsWith(source) && text.length>source.length) {
      return prefix + (selected === 'en' ? en : ru) + text.slice(source.length) + suffix;
    }
  }
  const probe = text.match(/^ffp failed with code (\d+):([\s\S]*)$/);
  if (probe) return prefix + (selected === 'en' ? 'Could not inspect video (code ' : 'Не удалось прочитать видео (код ') + probe[1] + '):' + probe[2] + suffix;
  return value;
}
export function setLanguage(value) {
  if (value !== 'ru' && value !== 'en') throw new RangeError('Unsupported language');
  language = value;
  try { localStorage.setItem('compresso-language',value); } catch {}
  if (typeof document !== 'undefined') { document.documentElement.lang=value; translateDocument(); }
}
// Keep React's original text so switching back preserves ambiguous labels
// such as "Ready" and "Done", both rendered as «Готово» in Russian.
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
function translateNode(node) {
  if (node.nodeType === 3) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script, style, textarea, input, [data-no-translate]')) return;
    const previous = originalText.get(node);
    const source = previous && node.data === previous.last ? previous.source : node.data;
    const result = translateText(source);
    originalText.set(node, {source, last:result});
    if (result !== node.data) node.data = result;
  } else if (node.nodeType === 1) {
    if (node.closest('script, style, [data-no-translate]')) return;
    const saved = originalAttributes.get(node) || {};
    for (const attr of ['title','placeholder','aria-label']) {
      if (!node.hasAttribute(attr)) continue;
      const current = node.getAttribute(attr), previous = saved[attr];
      const source = previous && current === previous.last ? previous.source : current;
      const result = translateText(source);
      saved[attr] = {source, last:result};
      if (current !== result) node.setAttribute(attr,result);
    }
    originalAttributes.set(node,saved);
  }
}
function translateTree(root) {
  translateNode(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) translateNode(walker.currentNode);
}
export function translateDocument() { if (typeof document !== 'undefined') translateTree(document.documentElement); }
if (typeof document !== 'undefined') {
  document.documentElement.lang=language;
  const observer=new MutationObserver(records=>{
    for (const record of records) {
      if (record.type === 'characterData' || record.type === 'attributes') translateNode(record.target);
      else for (const node of record.addedNodes) if (node.nodeType===1 || node.nodeType===3) translateTree(node);
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label']});
  translateDocument();
}
