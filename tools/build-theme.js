#!/usr/bin/env node
/**
 * build-theme.js — собирает JSON-тему SillyTavern из css/nightwood.css.
 *
 * Использование:
 *   node tools/build-theme.js <ST path> [src dir] [theme name]
 *
 * Пример:
 *   node tools/build-theme.js "C:/SillyTavern" . Nightwood
 *
 * Что делает:
 *   1. Читает nightwood.css и создаёт <ST>/data/default-user/themes/Run, little mouse....json
 *   2. Прописывает тему и CSS в <ST>/data/default-user/settings.json,
 *      чтобы хватило обновить страницу (Ctrl+R) без перевыбора темы в списке.
 */
const fs = require('fs');
const path = require('path');

const [stPath, srcDirArg, themeName = 'Run, little mouse...'] = process.argv.slice(2);

if (!stPath) {
    console.error('usage: node tools/build-theme.js <ST path> [src dir] [theme name]');
    console.error('example: node tools/build-theme.js "C:/SillyTavern" . Nightwood');
    process.exit(2);
}

const srcDir = path.resolve(srcDirArg || '.');
const cssPath = path.join(srcDir, 'css', 'run-little-mouse.css');
if (!fs.existsSync(cssPath)) {
    console.error(`не найден файл темы: ${cssPath}`);
    process.exit(2);
}
const css = fs.readFileSync(cssPath, 'utf8');

const theme = {
    name: themeName,
    blur_strength: 8,
    main_text_color: 'rgba(228, 234, 238, 1)',
    italics_text_color: 'rgba(169, 190, 203, 1)',
    underline_text_color: 'rgba(199, 212, 222, 1)',
    quote_text_color: 'rgba(217, 164, 106, 1)',
    blur_tint_color: 'rgba(8, 15, 21, 0.78)',
    chat_tint_color: 'rgba(4, 7, 10, 0.35)',
    user_mes_blur_tint_color: 'rgba(16, 28, 36, 0.55)',
    bot_mes_blur_tint_color: 'rgba(16, 28, 36, 0.55)',
    shadow_color: 'rgba(0, 0, 0, 0.65)',
    shadow_width: 2,
    border_color: 'rgba(110, 138, 160, 0.34)',
    font_scale: 1,
    fast_ui_mode: false,
    waifuMode: false,
    avatar_style: 0,
    chat_display: 1,
    noShadows: false,
    chat_width: 82,
    timer_enabled: true,
    timestamps_enabled: true,
    timestamp_model_icon: false,
    mesIDDisplay_enabled: true,
    hideChatAvatars_enabled: false,
    message_token_count_enabled: false,
    expand_message_actions: false,
    enableZenSliders: false,
    enableLabMode: false,
    hotswap_enabled: true,
    custom_css: css,
    bogus_folders: true,
    reduced_motion: false,
    compact_input_area: false,
};

const userDir = path.join(stPath, 'data', 'default-user');
const themesDir = path.join(userDir, 'themes');
fs.mkdirSync(themesDir, { recursive: true });

const out = path.join(themesDir, `${themeName}.json`);
fs.writeFileSync(out, JSON.stringify(theme, null, 4), 'utf8');
console.log(`theme:     ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB, css ${css.length} chars)`);

// CSS кладём и в settings.json (power_user.theme + power_user.custom_css)
const settingsPath = path.join(userDir, 'settings.json');
if (!fs.existsSync(settingsPath)) {
    console.log('settings.json: не найден, пропускаю (тема всё равно доступна в списке тем)');
    process.exit(0);
}

const raw = fs.readFileSync(settingsPath, 'utf8');
try {
    const settings = JSON.parse(raw);
    if (!settings.power_user || typeof settings.power_user !== 'object') {
        throw new Error('нет объекта power_user');
    }
    settings.power_user.theme = themeName;
    settings.power_user.custom_css = css;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4), 'utf8');
    console.log(`settings:  theme -> ${themeName}, custom_css -> ${css.length} chars`);
} catch (e) {
    console.warn('settings.json: не удалось обновить через JSON:', e.message);
    if (/"theme"\s*:/.test(raw)) {
        fs.writeFileSync(settingsPath, raw.replace(/"theme"\s*:\s*"[^"]*"/, `"theme": "${themeName}"`), 'utf8');
        console.log(`settings:  theme -> ${themeName} (только имя)`);
    }
}
