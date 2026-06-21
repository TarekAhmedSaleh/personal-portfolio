// ── Google Analytics 4 (gtag.js) — SPA-aware loader ──────────────────────────────
// gtag.js is injected at runtime (not in index.html) so that:
//   * the Measurement ID stays in appsettings.json (single source of truth), and
//   * local development traffic is never sent to GA.
// Page views are sent manually (send_page_view:false) because Blazor routing does
// not trigger real page loads — see MainLayout.OnLocationChanged.

let initialized = false;

export function initialize(measurementId) {
    if (initialized || !measurementId) return;

    // Never pollute analytics with local dev traffic.
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
        console.info('[analytics] disabled on local host');
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // We fire page_view events ourselves so SPA navigations are captured.
    window.gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);

    initialized = true;
}

export function trackPageView(path) {
    if (!initialized || !window.gtag) return;
    window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title
    });
}

export function trackEvent(name, parameters) {
    if (!initialized || !window.gtag) return;
    window.gtag('event', name, parameters || {});
}

// ── Microsoft Clarity — heatmaps & session recordings ────────────────────────────
// Loaded the same way as GA: runtime, config-driven, and skipped on local host.
let clarityInitialized = false;

export function initializeClarity(projectId) {
    if (clarityInitialized || !projectId) return;

    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
        console.info('[clarity] disabled on local host');
        return;
    }

    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', projectId);

    clarityInitialized = true;
}
