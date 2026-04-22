import type { PointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { portfolioLinks, steamMedia } from './content';

const { carouselImages, logo, poster, storeUrl, trailer, widgetUrl } = steamMedia;
const benBayleyIcon = new URL('./assets/BenBayleyIconCurrent.png', import.meta.url).href;
const carouselIntervalMs = 4000;
const trailerFocusVolume = 0.35;

function SteamImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselIntervalRef = useRef<number | undefined>(undefined);

  function restartCarouselInterval() {
    if (carouselIntervalRef.current !== undefined) {
      window.clearInterval(carouselIntervalRef.current);
    }

    carouselIntervalRef.current = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % carouselImages.length);
    }, carouselIntervalMs);
  }

  function tiltCarousel(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (relativeX - 0.5) * 5;
    const rotateX = (0.5 - relativeY) * 4;

    event.currentTarget.style.setProperty('--carousel-tilt-x', `${rotateX.toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--carousel-tilt-y', `${rotateY.toFixed(2)}deg`);
  }

  function resetCarouselTilt(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty('--carousel-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--carousel-tilt-y', '0deg');
  }

  useEffect(() => {
    restartCarouselInterval();

    return () => {
      if (carouselIntervalRef.current !== undefined) {
        window.clearInterval(carouselIntervalRef.current);
      }
    };
  }, []);

  function showPreviousImage() {
    restartCarouselInterval();
    setActiveIndex((currentIndex) => (
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1
    ));
  }

  function showNextImage() {
    restartCarouselInterval();
    setActiveIndex((currentIndex) => (currentIndex + 1) % carouselImages.length);
  }

  return (
    <article
      className="image-carousel-card"
      aria-label="See more Zon images"
      onPointerMove={tiltCarousel}
      onPointerLeave={resetCarouselTilt}
    >
      <a className="carousel-viewport" href={storeUrl} target="_blank" rel="noreferrer">
        <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {carouselImages.map((image, index) => (
            <img key={image.image} src={image.image} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
          ))}
        </div>
        <span>See more images</span>
      </a>
      <button className="carousel-button carousel-button-previous" type="button" onClick={showPreviousImage} aria-label="Show previous image">
        <span className="carousel-button-glyph" aria-hidden="true">
          &lsaquo;
        </span>
      </button>
      <button className="carousel-button carousel-button-next" type="button" onClick={showNextImage} aria-label="Show next image">
        <span className="carousel-button-glyph" aria-hidden="true">
          &rsaquo;
        </span>
      </button>
      <div className="carousel-dots" aria-hidden="true">
        {carouselImages.map((image, index) => (
          <span key={image.image} className={index === activeIndex ? 'is-active' : undefined} />
        ))}
      </div>
    </article>
  );
}

function App() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroLogoLinkRef = useRef<HTMLAnchorElement>(null);
  const [isTrailerFocused, setIsTrailerFocused] = useState(false);
  const [trailerVolume, setTrailerVolume] = useState(trailerFocusVolume);

  function tiltHeroLogo(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'touch') {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (relativeX - 0.5) * 28;
    const rotateX = (0.5 - relativeY) * 22;

    event.currentTarget.style.setProperty('--logo-tilt-x', `${rotateX.toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--logo-tilt-y', `${rotateY.toFixed(2)}deg`);
  }

  function resetHeroLogoTilt(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'touch') {
      return;
    }

    event.currentTarget.style.setProperty('--logo-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--logo-tilt-y', '0deg');
  }

  useEffect(() => {
    const heroLogoLink = heroLogoLinkRef.current;
    const mobilePointerQuery = window.matchMedia('(pointer: coarse)');
    const mobileHoverQuery = window.matchMedia('(hover: none)');
    const isMobileLike = window.innerWidth <= 720
      || navigator.maxTouchPoints > 0
      || mobilePointerQuery.matches
      || mobileHoverQuery.matches;

    if (!heroLogoLink || !isMobileLike) {
      return undefined;
    }

    const mobileHeroLogoLink = heroLogoLink;
    let touchStartX: number | undefined;
    let touchStartY: number | undefined;
    let isTouchActive = false;
    let settleTimeoutId: number | undefined;
    let animationFrameId: number | undefined;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    const maxTilt = 38;
    const deadZonePx = 8;
    const maxDragDistancePx = 220;

    function normalizeTouchOffset(offset: number) {
      const absOffset = Math.abs(offset);

      if (absOffset <= deadZonePx) {
        return 0;
      }

      const normalizedOffset = (absOffset - deadZonePx) / (maxDragDistancePx - deadZonePx);
      const clampedOffset = Math.min(1, normalizedOffset);
      return Math.sign(offset) * Math.pow(clampedOffset, 1.15);
    }

    function settleHeroLogo() {
      queueHeroLogoTilt(0, 0);
    }

    function renderHeroLogoTilt() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.1;
      currentRotateY += (targetRotateY - currentRotateY) * 0.1;

      mobileHeroLogoLink.style.setProperty('--logo-tilt-x', `${currentRotateX.toFixed(2)}deg`);
      mobileHeroLogoLink.style.setProperty('--logo-tilt-y', `${currentRotateY.toFixed(2)}deg`);

      const isSettled = Math.abs(targetRotateX - currentRotateX) < 0.02
        && Math.abs(targetRotateY - currentRotateY) < 0.02;

      if (isSettled) {
        currentRotateX = targetRotateX;
        currentRotateY = targetRotateY;
        mobileHeroLogoLink.style.setProperty('--logo-tilt-x', `${currentRotateX.toFixed(2)}deg`);
        mobileHeroLogoLink.style.setProperty('--logo-tilt-y', `${currentRotateY.toFixed(2)}deg`);
        animationFrameId = undefined;
        return;
      }

      animationFrameId = window.requestAnimationFrame(renderHeroLogoTilt);
    }

    function queueHeroLogoTilt(rawRotateX: number, rawRotateY: number) {
      const vectorMagnitude = Math.hypot(rawRotateX, rawRotateY);
      const clampScale = vectorMagnitude > maxTilt ? maxTilt / vectorMagnitude : 1;
      targetRotateX = rawRotateX * clampScale;
      targetRotateY = rawRotateY * clampScale;

      if (animationFrameId === undefined) {
        animationFrameId = window.requestAnimationFrame(renderHeroLogoTilt);
      }

      if (settleTimeoutId !== undefined) {
        window.clearTimeout(settleTimeoutId);
      }

      if (!isTouchActive) {
        settleTimeoutId = window.setTimeout(settleHeroLogo, 320);
      }
    }

    function handleTouchStart(event: TouchEvent) {
      isTouchActive = true;
      touchStartX = event.touches[0]?.clientX;
      touchStartY = event.touches[0]?.clientY;
      mobileHeroLogoLink.classList.add('is-mobile-tilting');

      if (settleTimeoutId !== undefined) {
        window.clearTimeout(settleTimeoutId);
        settleTimeoutId = undefined;
      }
    }

    function handleTouchMove(event: TouchEvent) {
      const touchX = event.touches[0]?.clientX;
      const touchY = event.touches[0]?.clientY;

      if (touchX === undefined || touchY === undefined) {
        return;
      }

      if (touchStartX === undefined || touchStartY === undefined) {
        touchStartX = touchX;
        touchStartY = touchY;
        return;
      }

      const touchOffsetX = touchX - touchStartX;
      const touchOffsetY = touchY - touchStartY;

      if (Math.abs(touchOffsetX) < 1 && Math.abs(touchOffsetY) < 1) {
        return;
      }

      const normalizedOffsetX = normalizeTouchOffset(touchOffsetX);
      const normalizedOffsetY = normalizeTouchOffset(touchOffsetY);

      queueHeroLogoTilt(normalizedOffsetY * maxTilt, normalizedOffsetX * (maxTilt * 0.9));
    }

    function handleTouchEnd() {
      isTouchActive = false;
      touchStartX = undefined;
      touchStartY = undefined;
      mobileHeroLogoLink.classList.remove('is-mobile-tilting');

      if (settleTimeoutId !== undefined) {
        window.clearTimeout(settleTimeoutId);
      }

      settleTimeoutId = window.setTimeout(settleHeroLogo, 180);
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      if (settleTimeoutId !== undefined) {
        window.clearTimeout(settleTimeoutId);
      }

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  function watchTrailer() {
    const heroVideo = heroVideoRef.current;

    if (heroVideo) {
      heroVideo.muted = false;
      heroVideo.volume = trailerVolume;
      void heroVideo.play();
    }

    setIsTrailerFocused(true);
  }

  function restoreHeroOverlay() {
    const heroVideo = heroVideoRef.current;

    if (heroVideo) {
      heroVideo.muted = true;
    }

    setIsTrailerFocused(false);
  }

  function changeTrailerVolume(volume: number) {
    const heroVideo = heroVideoRef.current;

    setTrailerVolume(volume);

    if (heroVideo) {
      heroVideo.volume = volume;
      heroVideo.muted = volume === 0;
    }
  }

  return (
    <div>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="topbar">
        <a href="#latest-project" className="brand-mark" aria-label="Zon home">
          <img src={benBayleyIcon} alt="" />
          <span>Ben Bayley</span>
        </a>
        <nav className="topbar-links" aria-label="Primary">
          <a href="#latest-project">Zon</a>
          <a href="#other-games">Games</a>
          <a href={storeUrl} target="_blank" rel="noreferrer">
            Steam
          </a>
          <a href={portfolioLinks.itch} className="nav-cta" target="_blank" rel="noreferrer">
            itch.io
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section id="latest-project" className={`hero ${isTrailerFocused ? 'is-trailer-focused' : ''}`} aria-label="Zon hero">
          <div className="hero-backdrop" aria-hidden="true">
            <img className="hero-poster" src={poster} alt="" />
            <video
              ref={heroVideoRef}
              className="hero-video"
              autoPlay
              controls={isTrailerFocused}
              loop
              muted={!isTrailerFocused}
              playsInline
              poster={poster}
              preload="auto"
            >
              <source src={trailer.webm} type="video/webm" />
              <source src={trailer.mp4} type="video/mp4" />
            </video>
          </div>
          <div className={`hero-shade ${isTrailerFocused ? 'is-hidden' : ''}`} aria-hidden="true" />

          <div className={`hero-content ${isTrailerFocused ? 'is-hidden' : ''}`}>
            <p className="portfolio-kicker">Steam featured project</p>
            <a
              ref={heroLogoLinkRef}
              className="hero-logo-link"
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Wishlist Zon on Steam"
              onPointerMove={tiltHeroLogo}
              onPointerLeave={resetHeroLogoTilt}
            >
              <img className="hero-logo" src={logo} alt="Zon" />
            </a>
            <p className="hero-eyebrow">Featured project</p>
            <p className="tagline">Bullet hell. Base warfare. Neon chaos.</p>
            <p className="hero-lede">
              A neon sci-fi action game built around bullet hell pressure, base warfare, and a direct Steam wishlist
              path.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={storeUrl} target="_blank" rel="noreferrer">
                Wishlist on Steam
              </a>
              <button className="btn btn-secondary" type="button" onClick={watchTrailer}>
                Watch trailer
              </button>
            </div>
          </div>

          {isTrailerFocused ? (
            <>
              <label className="hero-volume-control">
                <span>Volume</span>
                <input
                  aria-label="Trailer volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={trailerVolume}
                  onChange={(event) => changeTrailerVolume(event.currentTarget.valueAsNumber)}
                />
              </label>
              <div className="focused-trailer-actions">
                <a className="focused-trailer-link" href={storeUrl} target="_blank" rel="noreferrer">
                  Watch on Steam
                </a>
                <button className="focused-trailer-button" type="button" onClick={restoreHeroOverlay}>
                  Show overlay
                </button>
              </div>
            </>
          ) : null}
        </section>

        <section className="project-showcase" aria-label="Zon project media">
          <div className="gallery-heading">
            <a href={storeUrl} target="_blank" rel="noreferrer">
              Visit Zon on Steam
            </a>
          </div>

          <div className="project-media">
            <SteamImageCarousel />
          </div>

          <div className="steam-callout">
            <div className="steam-widget-panel">
              <iframe src={widgetUrl} title="Wishlist Zon on Steam" loading="lazy" />
            </div>
            <a className="wishlist-fallback" href={storeUrl} target="_blank" rel="noreferrer">
              Wishlist directly on Steam
            </a>
          </div>
        </section>

        <section id="other-games" className="other-games" aria-label="Other projects">
          <div className="itch-card">
            <div>
              <p className="portfolio-kicker">Other projects</p>
              <h2>More games and experiments</h2>
              <p>
                Small experiments, playable builds, and earlier releases live on itch.io alongside the current focus
                on Zon.
              </p>
            </div>
            <a className="btn btn-primary" href={portfolioLinks.itch} target="_blank" rel="noreferrer">
              Open itch.io
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src={benBayleyIcon} alt="" />
        <div>
          <p>Zon and other projects</p>
          <a href={portfolioLinks.itch} target="_blank" rel="noreferrer">
            itch.io
          </a>
          <a href={storeUrl} target="_blank" rel="noreferrer">
            Zon on Steam
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
