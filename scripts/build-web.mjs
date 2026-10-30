// Builds the Capacitor web bundle (www/) from the single-file game in index.html.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';

const src = readFileSync('index.html', 'utf8');
const split = src.indexOf('<div id="app">');
if (split < 0) throw new Error('index.html: #app not found');

const head = src.slice(0, split)
  .replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, '')
  .replace(/<link rel="preconnect"[^>]*>\n?/g, '')
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/, '<link rel="stylesheet" href="fonts/fonts.css">\n');
const body = src.slice(split);

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#101824">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px/1.45 system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
${head}</head>
<body>
${body}
<script>
if (!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) && 'serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
</script>
</body>
</html>
`;

rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
cpSync('public', 'www', { recursive: true });
writeFileSync('www/index.html', html);
console.log('www/ built:', (html.length / 1024).toFixed(0) + ' KB');
