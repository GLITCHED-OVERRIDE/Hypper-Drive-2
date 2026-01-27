// sw.js
const files = {};

self.addEventListener('message', e => {
    if (e.data.type === 'INIT') {
        Object.entries(e.data.files).forEach(([path, buffer]) => {
            files[path] = buffer;
        });
    }
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    let path = url.pathname;

    // If requesting a directory, default to /index.html
    if (path.endsWith('/')) path += 'index.html';

    if (files[path]) {
        e.respondWith(new Response(files[path], {
            status: 200,
            headers: { 'Content-Type': guessContentType(path) }
        }));
    }
});

// Guess content type for common file types
function guessContentType(path) {
    if (path.endsWith('.html')) return 'text/html';
    if (path.endsWith('.js')) return 'application/javascript';
    if (path.endsWith('.css')) return 'text/css';
    if (path.endsWith('.png')) return 'image/png';
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
    if (path.endsWith('.gif')) return 'image/gif';
    if (path.endsWith('.svg')) return 'image/svg+xml';
    if (path.endsWith('.woff')) return 'font/woff';
    if (path.endsWith('.woff2')) return 'font/woff2';
    return 'application/octet-stream';
}
