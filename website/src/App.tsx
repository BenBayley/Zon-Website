import { useEffect, useRef, useState } from 'react';
import { portfolioLinks, steamMedia } from './content';

const { carouselImages, logo, poster, storeUrl, trailer, widgetUrl } = steamMedia;
const bSharpLogo = new URL('./assets/BSharp.png', import.meta.url).href;
const carouselIntervalMs = 4000;

function SteamImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % carouselImages.length);
    }, carouselIntervalMs);

    return () => window.clearInterval(intervalId);
  }, []);

  function showPreviousImage() {
    setActiveIndex((currentIndex) => (
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1
    ));
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % carouselImages.length);
  }

  return (
    <article className="image-carousel-card" aria-label="See more Zon images">
      <a className="carousel-viewport" href={storeUrl} target="_blank" rel="noreferrer">
        <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {carouselImages.map((image, index) => (
            <img key={image.image} src={image.image} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} />
          ))}
        </div>
        <span>See more images</span>
      </a>
      <button className="carousel-button carousel-button-previous" type="button" onClick={showPreviousImage} aria-label="Show previous image">
        &lsaquo;
      </button>
      <button className="carousel-button carousel-button-next" type="button" onClick={showNextImage} aria-label="Show next image">
        &rsaquo;
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
  const [isTrailerFocused, setIsTrailerFocused] = useState(false);

  function watchTrailer() {
    const heroVideo = heroVideoRef.current;

    if (heroVideo) {
      heroVideo.muted = false;
      heroVideo.volume = 1;
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

  return (
    <div>
      <a className="skip-link" href="#latest-project">
        Skip to latest project
      </a>

      <header className="topbar">
        <a href="#latest-project" className="brand-mark" aria-label="Ben Bayley portfolio home">
          <img src={bSharpLogo} alt="Ben Bayley" />
        </a>
        <nav className="topbar-links" aria-label="Primary">
          <a href="#latest-project">Zon</a>
          <a href="#other-games">Itch.io</a>
          <a href={storeUrl} target="_blank" rel="noreferrer">
            Steam
          </a>
          <a href={portfolioLinks.itch} className="nav-cta" target="_blank" rel="noreferrer">
            Games
          </a>
        </nav>
      </header>

      <main>
        <section id="latest-project" className="hero" aria-label="Ben Bayley latest project, Zon">
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
            <p className="portfolio-kicker">Ben Bayley portfolio / latest project</p>
            <a href={storeUrl} target="_blank" rel="noreferrer" aria-label="Wishlist Zon on Steam">
              <img className="hero-logo" src={logo} alt="Zon" />
            </a>
            <p className="tagline">Bullet hell. Base warfare. Neon chaos.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={storeUrl} target="_blank" rel="noreferrer">
                Wishlist on Steam
              </a>
              <a className="btn btn-secondary" href={storeUrl} target="_blank" rel="noreferrer">
                Watch the trailer
              </a>
            </div>
            <p className="steam-note">Trailer, screenshots, wishlist, and release updates live on Steam.</p>
          </div>

          {isTrailerFocused ? (
            <button className="hero-overlay-toggle restore-overlay-button" type="button" onClick={restoreHeroOverlay}>
              Show overlay
            </button>
          ) : (
            <button className="hero-overlay-toggle watch-trailer-button" type="button" onClick={watchTrailer}>
              Hide overlay
            </button>
          )}
        </section>

        <section className="project-showcase" aria-label="Zon project media">
          <div className="gallery-heading">
            <img src={logo} alt="" aria-hidden="true" />
            <a href={storeUrl} target="_blank" rel="noreferrer">
              Latest project on Steam
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

        <section id="other-games" className="other-games" aria-label="Other games by Ben Bayley">
          <div className="itch-card">
            <div>
              <p className="portfolio-kicker">Other games</p>
              <h2>More from Ben Bayley</h2>
              <p>Small experiments, playable builds, and earlier games live on itch.io.</p>
            </div>
            <a className="btn btn-primary" href={portfolioLinks.itch} target="_blank" rel="noreferrer">
              Open itch.io
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src={bSharpLogo} alt="Ben Bayley" />
        <div>
          <p>Copyright Ben Bayley</p>
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
