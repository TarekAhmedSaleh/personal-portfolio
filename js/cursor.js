(function () {

    const initCursor = () => {
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');

        if (!dot || !outline) {
            setTimeout(initCursor, 200);
            return;
        }


        let mouseX = 0;
        let mouseY = 0;

        let outlineX = 0;
        let outlineY = 0;

        const delay = 8;

        window.addEventListener('mousemove', function (e) {
            dot.classList.add('cursor-active');
            outline.classList.add('cursor-active');

            mouseX = e.clientX;
            mouseY = e.clientY;

            dot.style.top = mouseY + 'px';
            dot.style.left = mouseX + 'px';
        });

        function animate() {
            outlineX += (mouseX - outlineX) / delay;
            outlineY += (mouseY - outlineY) / delay;

            outline.style.top = outlineY + 'px';
            outline.style.left = outlineX + 'px';

            requestAnimationFrame(animate);
        }

        animate();

        const interactiveSelectors = 'a, button, .cursor-pointer, .mud-button-root, .mud-list-item, .mud-card-header, .mud-tab, .bento-card, .mud-icon-button, .mud-nav-link';
        
        const resetHover = () => {
            document.body.classList.remove('cursor-hover');
        };

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                document.body.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                resetHover();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                setTimeout(resetHover, 100);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!e.target.closest(interactiveSelectors)) {
                resetHover();
            }
        });

        document.addEventListener('mousedown', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursor);
    } else {
        initCursor();
    }
})();
