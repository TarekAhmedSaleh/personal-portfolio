export function initCustomCursor() {
    // 1. Prevent duplicate injections if the script runs twice
    if (document.getElementById('custom-cursor-dot')) return;

    // 2. Inject the CSS dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        * { cursor: none !important; }
        .custom-cursor-dot {
            position: fixed; top: 0; left: 0; width: 8px; height: 8px;
            background-color: #ffffff; border-radius: 50%;
            pointer-events: none !important; z-index: 999999;
            transform: translate(-50%, -50%); mix-blend-mode: difference;
        }
        .custom-cursor-glow {
            position: fixed; top: 0; left: 0; width: 40px; height: 40px;
            border: 1px solid rgba(255, 255, 255, 0.6); background-color: transparent;
            border-radius: 50%; pointer-events: none !important; z-index: 999998;
            transform: translate(-50%, -50%);
            transition: width 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        background-color 0.2s ease;
            mix-blend-mode: difference;
        }
        .custom-cursor-glow.hovering {
            width: 60px; height: 60px; background-color: rgba(255, 255, 255, 1);
            border-color: #ffffff; transform: translate(-50%, -50%) scale(0.9);
        }
    `;
    document.head.appendChild(style);

    // 3. Inject the HTML elements dynamically
    const dot = document.createElement('div');
    dot.id = 'custom-cursor-dot';
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);

    const glow = document.createElement('div');
    glow.id = 'custom-cursor-glow';
    glow.className = 'custom-cursor-glow';
    document.body.appendChild(glow);

    // 4. Track mouse movement
    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;

        glow.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 40, fill: "forwards" });
    });

    // 5. Add hover physics dynamically
    const addHoverEvents = () => {
        const clickables = document.querySelectorAll('a, button, .mud-button-root, input, .mud-nav-link');
        clickables.forEach(el => {
            if (!el.dataset.hasCursorHover) {
                el.addEventListener('mouseenter', () => glow.classList.add('hovering'));
                el.addEventListener('mouseleave', () => glow.classList.remove('hovering'));
                el.dataset.hasCursorHover = "true";
            }
        });
    };

    addHoverEvents();

    // 6. Keep watching the DOM for new buttons created by Blazor routing
    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });
}

// EmailJS integration for Contact Form
export async function sendEmail(serviceId, templateId, publicKey, templateParams) {
    try {
        // Dynamically load EmailJS SDK if not already loaded
        if (!window.emailjs) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        emailjs.init(publicKey);

        const response = await emailjs.send(serviceId, templateId, templateParams);
        return { success: true, status: response.status };
    } catch (error) {
        return { success: false, error: error?.text || error?.message || 'Unknown error' };
    }
}