import { gameplayPillars, standoutPoints, mediaItems } from './content';

const steamUrl = 'https://store.steampowered.com/app/3651110/Zon/';
const instagramUrl = 'https://www.instagram.com/zon_bullet.hell.moba/';

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a href="#hero" className="brand">
          ZON
        </a>
        <nav>
          <a href="#about">About</a>
          <a href="#gameplay">Gameplay</a>
          <a href="#media">Media</a>
          <a href="#wishlist" className="nav-cta">
            Wishlist
          </a>
        </nav>
      </header>

      <main>
        <section id="hero" className="hero section-glow">
          <div className="hero-copy">
            <p className="eyebrow">Neon Bullet Hell Base Warfare</p>
            <h1>Zon</h1>
            <p>
              A fast-paced, neon-soaked action game where you dodge bullet storms,
              build and defend your base, and outfight enemies in solo or multiplayer
              combat.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={steamUrl} target="_blank" rel="noreferrer">
                Wishlist on Steam
              </a>
              <a className="btn btn-secondary" href="#media">
                Watch / View Gameplay
              </a>
            </div>
            <p className="microcopy">Planned release date: To be announced.</p>
          </div>
          <div className="hero-media card-frame">
            <img
              src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3651110/capsule_616x353.jpg"
              alt="Zon official Steam capsule art"
              loading="eager"
            />
          </div>
        </section>

        <section id="about" className="section">
          <h2>About Zon</h2>
          <p>
            Zon blends frantic top-down bullet hell combat with real-time base building.
            Matches open with tactical setup—generators, turrets, walls—then explode into
            high-speed fights where positioning, upgrades, and fast reactions decide who survives.
          </p>
        </section>

        <section id="gameplay" className="section">
          <h2>Gameplay Pillars</h2>
          <div className="card-grid">
            {gameplayPillars.map((pillar) => (
              <article key={pillar.title} className="info-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="media" className="section">
          <h2>Media & Steam</h2>
          <div className="media-layout">
            <div className="card-frame steam-widget-wrap">
              <iframe
                src="https://store.steampowered.com/widget/3651110/"
                width="100%"
                height="190"
                frameBorder="0"
                title="Steam widget for Zon"
                loading="lazy"
              />
            </div>
            <div className="media-grid">
              {mediaItems.map((item) => (
                <a
                  key={item.title}
                  className="media-card"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={item.image} alt={item.alt} loading="lazy" />
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Why It Stands Out</h2>
          <ul className="standout-list">
            {standoutPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section id="wishlist" className="section section-glow cta-block">
          <h2>Enter the Arena. Wishlist Zon.</h2>
          <p>
            Follow development and be notified when Zon launches. If you want high-speed neon chaos with
            tactical depth, add it to your Steam wishlist now.
          </p>
          <a className="btn btn-primary" href={steamUrl} target="_blank" rel="noreferrer">
            Add to Wishlist
          </a>
        </section>
      </main>

      <footer className="footer">
        <p>© BSharpProductions</p>
        <div>
          <a href={steamUrl} target="_blank" rel="noreferrer">
            Steam
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
