const steamAssetVersion = 't=1765913868';
const heroLogo = new URL('../Vibrant ZON logo with gradient glow.png', import.meta.url).href;
export const steamMedia = {
  storeUrl: 'https://store.steampowered.com/app/3651110/Zon/',
  widgetUrl: 'https://store.steampowered.com/widget/3651110/',
  logo: heroLogo,
  poster: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3651110/e25ff7b65920fba918964b2152ce0b1c665f6520/header.jpg?${steamAssetVersion}`,
  trailer: {
    webm: 'https://video.cloudflare.steamstatic.com/store_trailers/257166496/movie_max_vp9.webm',
    mp4: 'https://video.cloudflare.steamstatic.com/store_trailers/257166496/movie_max.mp4'
  },
  gallery: [
    {
      title: 'Open Steam',
      image: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3651110/7da8577ed7da337ff720a425517bf9158b2b7846/capsule_616x353.jpg?${steamAssetVersion}`,
      alt: 'Zon capsule art from Steam'
    }
  ],
  carouselImages: [
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/696eedb5a09910e83f1375d3320947c48ea13743/ss_696eedb5a09910e83f1375d3320947c48ea13743.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 1'
    },
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/99c3f9a0b13f7578bb3a8f80d8bd5c73b1f64dfe/ss_99c3f9a0b13f7578bb3a8f80d8bd5c73b1f64dfe.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 2'
    },
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/7cf97e5b35e03191139eaa6fb401bd3a866761b6/ss_7cf97e5b35e03191139eaa6fb401bd3a866761b6.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 3'
    },
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/b5fbafec799c9e6ccc4f666ed53852e80f9b873b/ss_b5fbafec799c9e6ccc4f666ed53852e80f9b873b.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 4'
    },
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/beb1ac5003f0c0488474d1c55a33541c7191c33e/ss_beb1ac5003f0c0488474d1c55a33541c7191c33e.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 5'
    },
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/fbfb2843bf0adaf48f11d3bb776c48ad4b064cd8/ss_fbfb2843bf0adaf48f11d3bb776c48ad4b064cd8.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 6'
    },
    {
      image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3651110/cf211c537963cabee6d7db80612d4788d68e28dc/ss_cf211c537963cabee6d7db80612d4788d68e28dc.1920x1080.jpg?t=1765913868',
      alt: 'Zon Steam screenshot 7'
    }
  ]
} as const;

export const portfolioLinks = {
  itch: 'https://bsharp21.itch.io/'
} as const;
