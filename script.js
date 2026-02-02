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
        // First, load first frame of all original videos
        const originalVideos = ugcSlider.querySelectorAll('.ugc-video-wrapper video');
        originalVideos.forEach(video => {
            // Load metadata and seek to first frame
            video.load();
            video.addEventListener('loadeddata', () => {
                video.currentTime = 0.1; // Seek to show first frame
            }, { once: true });
        });

        const items = ugcSlider.innerHTML;
        ugcSlider.innerHTML = items + items + items + items;

        // Re-attach event listeners to all duplicated videos
        const allUgcVideos = ugcSlider.querySelectorAll('.ugc-video-wrapper video');
        allUgcVideos.forEach(video => {
            // Desktop: hover to play preview
            video.addEventListener('mouseenter', () => {
                video.play();
            });
            video.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });

            // Click: open fullscreen
            video.addEventListener('click', (e) => {
                e.stopPropagation();

                // Pause slider animation
                ugcSlider.style.animationPlayState = 'paused';

                // Request fullscreen
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.webkitEnterFullscreen) {
                    // iOS Safari
                    video.webkitEnterFullscreen();
                }
                video.play();
            });

            // Resume slider when exiting fullscreen
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    video.pause();
                    video.currentTime = 0;
                    ugcSlider.style.animationPlayState = 'running';
                }
            });
            document.addEventListener('webkitfullscreenchange', () => {
                if (!document.webkitFullscreenElement) {
                    video.pause();
                    video.currentTime = 0;
                    ugcSlider.style.animationPlayState = 'running';
                }
            });
        });
    }


    // Infinite logos slider - duplicate items for seamless loop
    const logosSlider = document.querySelector('.logos-slider');
    if (logosSlider) {
        const logos = logosSlider.innerHTML;
        logosSlider.innerHTML = logos + logos + logos + logos;
    }

    // Infinite testimonials slider - duplicate items for seamless loop
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        const testimonials = testimonialsSlider.innerHTML;
        testimonialsSlider.innerHTML = testimonials + testimonials + testimonials + testimonials;
    }

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
