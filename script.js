// Clean parallax effect on scroll
document.addEventListener('DOMContentLoaded', function() {
    const parallaxBg = document.querySelector('.parallax-bg');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.35;

        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(-${rate}px)`;
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Infinite UGC slider - duplicate items multiple times for seamless loop
    const ugcSlider = document.querySelector('.ugc-slider');
    if (ugcSlider) {
        const items = ugcSlider.innerHTML;
        // On mobile: don't duplicate (user scrolls manually), on desktop: duplicate for infinite loop
        if (window.innerWidth > 768) {
            ugcSlider.innerHTML = items + items + items + items;
        }

        let currentFullscreenVideo = null;

        // Single global fullscreen change listener
        const handleFullscreenExit = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (currentFullscreenVideo) {
                    currentFullscreenVideo.pause();
                    currentFullscreenVideo.currentTime = 0;
                    currentFullscreenVideo = null;
                }
                // Force restart animation
                ugcSlider.style.animation = 'none';
                ugcSlider.offsetHeight; // Trigger reflow
                ugcSlider.style.animation = '';
                ugcSlider.style.animationPlayState = 'running';
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenExit);
        document.addEventListener('webkitfullscreenchange', handleFullscreenExit);

        // Attach event listeners to all videos
        const allUgcVideos = ugcSlider.querySelectorAll('.ugc-video-wrapper video');
        allUgcVideos.forEach(video => {
            // Desktop: hover to play preview
            video.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });
            video.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });

            // Click/touch: open fullscreen
            video.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                // Pause slider animation
                ugcSlider.style.animationPlayState = 'paused';
                currentFullscreenVideo = video;

                // Request fullscreen
                if (video.requestFullscreen) {
                    video.requestFullscreen().then(() => {
                        video.play();
                    }).catch(() => {
                        // Fallback: just play
                        video.play();
                    });
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                    video.play();
                } else if (video.webkitEnterFullscreen) {
                    // iOS Safari native player
                    video.webkitEnterFullscreen();
                    video.play();
                } else {
                    // Fallback: just play
                    video.play();
                }
            });

            // iOS Safari: handle native player exit
            video.addEventListener('webkitendfullscreen', () => {
                video.pause();
                video.currentTime = 0;
                currentFullscreenVideo = null;
                ugcSlider.style.animation = 'none';
                ugcSlider.offsetHeight;
                ugcSlider.style.animation = '';
                ugcSlider.style.animationPlayState = 'running';
            });
        });
    }


    // Infinite logos slider - duplicate items for seamless loop
    const logosSlider = document.querySelector('.logos-slider');
    if (logosSlider) {
        const logos = logosSlider.innerHTML;
        logosSlider.innerHTML = logos + logos + logos + logos;
    }

    // Testimonials track - drag scroll + arrow buttons
    const track = document.getElementById('testimonialsTrack');
    if (track) {
        // Arrow buttons
        const prevBtn = document.querySelector('.testimonials-arrow-prev');
        const nextBtn = document.querySelector('.testimonials-arrow-next');
        const scrollAmount = 320;
        if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
        if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));

        // Drag to scroll
        let isDown = false, startX, scrollLeft;
        track.addEventListener('mousedown', e => {
            isDown = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        track.addEventListener('mouseleave', () => isDown = false);
        track.addEventListener('mouseup', () => isDown = false);
        track.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            track.scrollLeft = scrollLeft - (x - startX);
        });
    }

    // Portfolio categories accordion
    const portfolioCategories = document.querySelectorAll('.portfolio-category');
    portfolioCategories.forEach(category => {
        const header = category.querySelector('.category-header');
        header.addEventListener('click', () => {
            const isOpen = category.classList.contains('open');
            portfolioCategories.forEach(c => c.classList.remove('open'));
            if (!isOpen) category.classList.add('open');
        });
    });

    // Portfolio videos: hover to preview, click for fullscreen
    document.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.portfolio-item');
        if (!item) return;
        const video = item.querySelector('video');
        if (video) {
            video.play().catch(() => {});
            const btn = item.querySelector('.portfolio-play-btn');
            if (btn) btn.style.opacity = '0';
        }
    });
    document.addEventListener('mouseout', (e) => {
        const item = e.target.closest('.portfolio-item');
        if (!item) return;
        const video = item.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            const btn = item.querySelector('.portfolio-play-btn');
            if (btn) btn.style.opacity = '1';
        }
    });
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.portfolio-item');
        if (!item) return;
        const video = item.querySelector('video');
        if (!video) return;
        if (video.requestFullscreen) {
            video.requestFullscreen().then(() => video.play()).catch(() => video.play());
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
            video.play();
        } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
            video.play();
        }
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// ===== NAVBAR =====
const navHamburger = document.getElementById('navbar-hamburger');
const navMenu = document.getElementById('navbar-menu');
const navOverlay = document.getElementById('navbar-overlay');

function openNavMenu() {
    navHamburger.classList.add('open');
    navMenu.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeNavMenu() {
    navHamburger.classList.remove('open');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

navHamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) {
        closeNavMenu();
    } else {
        openNavMenu();
    }
});

// ===== STILLS CAROUSEL =====
(function() {
    const track = document.getElementById('stills-track');
    const dotsContainer = document.getElementById('stills-dots');
    const prevBtn = document.querySelector('.stills-arrow-prev');
    const nextBtn = document.querySelector('.stills-arrow-next');
    if (!track) return;

    const slides = track.querySelectorAll('.stills-slide');
    const total = slides.length;
    let current = 0;
    let slidesVisible = getSlidesVisible();
    let startX = 0;
    let isDragging = false;
    let dragOffset = 0;

    function getSlidesVisible() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getSlideWidth() {
        const container = track.parentElement;
        const gap = 16;
        return (container.offsetWidth - gap * (slidesVisible - 1)) / slidesVisible + gap;
    }

    function maxIndex() {
        return Math.max(0, total - slidesVisible);
    }

    // Build dots
    function buildDots() {
        dotsContainer.innerHTML = '';
        const dotCount = maxIndex() + 1;
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'stills-dot' + (i === current ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.stills-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function updateActiveSlide() {
        slides.forEach((s, i) => s.classList.toggle('active', i === current + Math.floor(slidesVisible / 2)));
    }

    function goTo(index) {
        current = Math.max(0, Math.min(index, maxIndex()));
        track.style.transform = `translateX(${current * getSlideWidth()}px)`;
        updateDots();
        updateActiveSlide();
    }

    // RTL: next goes left (positive transform in RTL)
    function goNext() { goTo(current + 1); }
    function goPrev() { goTo(current - 1); }

    prevBtn && prevBtn.addEventListener('click', goPrev);
    nextBtn && nextBtn.addEventListener('click', goNext);

    // Touch / drag support — RTL: swipe left (negative offset) = next (forward), swipe right = prev (back)
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; dragOffset = 0; }, { passive: true });
    track.addEventListener('touchmove', e => {
        if (!isDragging) return;
        dragOffset = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        if (dragOffset > 50) goNext();
        else if (dragOffset < -50) goPrev();
        dragOffset = 0;
    });

    // Mouse drag — same RTL logic
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; dragOffset = 0; track.style.cursor = 'grabbing'; });
    window.addEventListener('mousemove', e => { if (!isDragging) return; dragOffset = e.clientX - startX; });
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = '';
        if (dragOffset > 50) goNext();
        else if (dragOffset < -50) goPrev();
        dragOffset = 0;
    });

    // Responsive resize
    window.addEventListener('resize', () => {
        slidesVisible = getSlidesVisible();
        current = Math.min(current, maxIndex());
        buildDots();
        goTo(current);
    });

    // Init
    buildDots();
    goTo(0);
})();

// ===== WORKFLOW SCROLL REVEAL =====
(function() {
    const steps = document.querySelectorAll('.wf-reveal');
    const vlineFill = document.getElementById('process-vline-fill');
    const vline = document.querySelector('.process-vline');
    if (!steps.length) return;

    // Reveal steps with IntersectionObserver
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger based on index
                const idx = Array.from(steps).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('wf-visible');
                }, idx * 120);
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    steps.forEach(step => stepObserver.observe(step));

    // Fill vertical line based on scroll progress through section
    if (vlineFill && vline) {
        function updateVline() {
            const section = document.querySelector('.process-section');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const winH = window.innerHeight;
            // progress from 0 (section enters bottom) to 1 (section leaves top)
            const progress = Math.min(1, Math.max(0, (winH - rect.top) / (rect.height + winH * 0.3)));
            vlineFill.style.height = (progress * 100) + '%';
        }
        window.addEventListener('scroll', updateVline, { passive: true });
        updateVline();
    }
})();
