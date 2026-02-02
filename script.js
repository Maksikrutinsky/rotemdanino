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
        ugcSlider.innerHTML = items + items + items + items;

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
