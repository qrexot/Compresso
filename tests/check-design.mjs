import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const bundle=await readFile(new URL('../dist/assets/index-v7a3H2y7.js',import.meta.url),'utf8');
const css=await readFile(new URL('../dist/assets/compression-levels.css',import.meta.url),'utf8');
const classes=['compresso-shell','compresso-library','compresso-main','compresso-toolbutton','compresso-file-card','compresso-file-thumb','compresso-settings-column','compresso-settings-content','compresso-action-bar','compresso-primary-action','compresso-empty-list','compresso-preview-empty','compresso-telegram'];
for(const name of classes){assert(bundle.includes(name),`Missing component ${name}`);assert(css.includes('.'+name),`Missing style ${name}`)}
assert(bundle.includes('"data-selected":P'));assert(css.includes('.compresso-file-card[data-selected=true]'));
assert(bundle.includes('onClick:developer,className:"compresso-telegram-item","aria-label":"Открыть Telegram разработчика"'));
assert(css.includes(':focus-visible'));assert(css.includes('prefers-reduced-motion'));
assert(bundle.includes('className:"compresso-account-menu"'));
assert(css.includes('.compresso-account-menu {') && css.includes('background:hsl(var(--background))'));
for(const part of ['compresso-menu-header__mark','compresso-account-action__icon','compresso-telegram__action']) assert(bundle.includes(part) && css.includes('.'+part));
assert(bundle.includes('EstimatePanel,{file:e,config:r}'));assert(bundle.includes('x.jsx(EncoderSettings,{})'));
console.log('Проверены классы экранов, выделение файла, кнопка Telegram и доступность управления.');
