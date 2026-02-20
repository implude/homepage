import pino from 'pino';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
            singleLine: true,
        },
    },
});

const SECURITY_HEADERS: Record<string, string> = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Permissions-Policy':
        'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()',
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://api.iconify.design",
        "font-src 'self' data:",
        "connect-src 'self' https://api.iconify.design https://api.simplesvg.com https://cloudflareinsights.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
    ].join('; '),
};

const cpus = navigator.hardwareConcurrency;

if (Bun.isMainThread) {
    logger.info(`Starting ${cpus} workers on :8080`);
    for (let i = 0; i < cpus; i++) {
        const worker = new Worker(new URL(import.meta.url));
        worker.postMessage({ id: i + 1 });
    }
} else {
    const _log = console.log;
    const _info = console.info;
    console.log = () => {};
    console.info = () => {};

    const { handle, stop } = await import('./dist/server/entry.mjs');
    stop();

    console.log = _log;
    console.info = _info;

    self.onmessage = (e) => {
        const { id } = e.data;

        Bun.serve({
            port: 8080,
            reusePort: true,
            async fetch(req, server) {
                const start = performance.now();
                const url = new URL(req.url);

                const res = await handle(req, server);

                for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
                    res.headers.set(key, value);
                }
                if (url.pathname.startsWith('/_astro/')) {
                    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
                }

                const ms = (performance.now() - start).toFixed(1);
                const level = res.status >= 500 ? 'error' : res.status >= 400 ? 'warn' : 'info';
                logger[level](`W${id} ${req.method} ${url.pathname} ${res.status} ${ms}ms`);

                return res;
            },
        });

        logger.info(`Worker #${id} ready`);
    };
}