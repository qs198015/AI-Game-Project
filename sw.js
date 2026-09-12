const CACHE = 'black-moon-demo-v21';
const ASSETS = ['./','./index.html','./styles.css','./game.js','./manifest.webmanifest','./assets/icon.svg','./assets/portraits/black-cat.svg','./assets/portraits/crow.svg','./assets/portraits/fox.svg','./assets/portraits/rabbit.svg','./assets/portraits/full/shadow.png','./assets/portraits/full/fang.png','./assets/portraits/full/tail.png','./assets/portraits/full/snow.png','./assets/references/tavern-style.png','./assets/references/main-menu.png','./assets/main-menu/background.png','./assets/references/main-menu-v2.png','./assets/menu-buttons/button-start-game.png','./assets/menu-buttons/button-start-game-1.png','./assets/menu-buttons/button-tutorial.png','./assets/menu-buttons/button-tutorial-1.png','./assets/menu-buttons/button-story-mode.png','./assets/menu-buttons/button-story-mode-1.png','./assets/menu-buttons/button-black-moon-trial.png','./assets/menu-buttons/button-black-moon-trial-1.png','./assets/menu-buttons/button-pet-gallery.png','./assets/menu-buttons/button-pet-gallery-1.png','./assets/menu-buttons/button-settings.png','./assets/menu-buttons/button-settings-1.png','./assets/portraits/owl-chief.png','./assets/references/character-select.png','./assets/battle/battle-screen.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === location.origin) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
