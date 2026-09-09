// data/blog-articles.js — The Journal content data store
// Extracted from approved Figma frame "AI Travel / blog-listing" (208:5107)

export const featuredArticle = {
  id: "featured-1",
  badge: "Japan",
  destination: "Japan",
  category: "Culture",
  readTime: "8 min read",
  date: "12 August 2026",
  meta: "Culture · 8 min read · 12 August 2026",
  title: "Kyoto in the quiet hours, before the city wakes.",
  description: "There is a fragile, fleeting version of Kyoto that exists only between 5:00 and 7:00 AM. As the mist clears off the Higashiyama hills, old temples and narrow wooden lanes emerge in absolute silence. Our lead agent shares how to wander these preserved streets properly.",
  image: "assets/images/blog/blog-featured.webp",
  imageAlt: "Misty morning view of historic wooden pagodas and streets in Higashiyama, Kyoto",
  ctaText: "Read the story",
  link: "#"
};

export const initialArticles = [
  {
    id: "article-1",
    badge: "Dubai",
    destination: "Dubai",
    category: "Culture",
    readTime: "6 min read",
    title: "The Dubai that exists after the skyline",
    description: "Beyond the chrome and skyscrapers lies a city of concrete poetry, quiet salt creeks, and recipes carried across centuries.",
    date: "10 August 2026",
    image: "assets/images/blog/blog-card-1.webp",
    imageAlt: "Serene waters of Dubai Creek reflecting historic shores and distant skyline",
    link: "#"
  },
  {
    id: "article-2",
    badge: "Japan",
    destination: "Japan",
    category: "Planning",
    readTime: "9 min read",
    title: "Choosing your season in Japan",
    description: "Cherry blossoms are only part of the story. Why November's deep autumn and February's quiet snow offer Japan at its most authentic.",
    date: "8 August 2026",
    image: "assets/images/blog/blog-card-2.webp",
    imageAlt: "Vibrant red Japanese autumn foliage framing a serene garden temple",
    link: "#"
  },
  {
    id: "article-3",
    badge: "Japan",
    destination: "Japan",
    category: "Food",
    readTime: "5 min read",
    title: "Eating well in Osaka without a reservation",
    description: "The best meals in the nation's kitchen are often found down neon-lit alleys, beneath simple paper lanterns with standing room only.",
    date: "4 August 2026",
    image: "assets/images/blog/blog-card-3.webp",
    imageAlt: "Atmospheric evening alleyway in Osaka with warm paper lanterns",
    link: "#"
  },
  {
    id: "article-4",
    badge: "Dubai",
    destination: "Dubai",
    category: "Experiences",
    readTime: "7 min read",
    title: "A desert night, done properly",
    description: "Skip the generic tourist camps. How to experience the profound stillness of the Empty Quarter under a canopy of desert stars.",
    date: "1 August 2026",
    image: "assets/images/blog/blog-card-4.webp",
    imageAlt: "Vast golden and crimson desert sand dunes extending to the horizon",
    link: "#"
  },
  {
    id: "article-5",
    badge: "Japan",
    destination: "Japan",
    category: "Neighbourhoods",
    readTime: "6 min read",
    title: "Where to stay in Tokyo, honestly",
    description: "From the sleepy wooden houses of Yanaka to the architectural high-modernism of Aoyama — matching your pace to the right district.",
    date: "28 July 2026",
    image: "assets/images/blog/blog-card-5.webp",
    imageAlt: "Quiet charming residential street in Tokyo with lush greenery",
    link: "#"
  },
  {
    id: "article-6",
    badge: "Planning",
    destination: "All",
    category: "Planning",
    readTime: "4 min read",
    title: "Flying from New Zealand: the routes that work",
    description: "The direct paths, the strategic stopovers, and how to arrive in Tokyo or Dubai with your internal clock intact.",
    date: "22 July 2026",
    image: "assets/images/blog/blog-card-6.webp",
    imageAlt: "Airplane wing traversing soft clouds during high altitude flight",
    link: "#"
  }
];

export const additionalArticles = [
  {
    id: "article-7",
    badge: "Dubai",
    destination: "Dubai",
    category: "Experiences",
    readTime: "8 min read",
    title: "Hatta's rugged mountain trails and turquoise dams",
    description: "Escape the coastal heat into the craggy Hajar peaks where ancient watchtowers oversee pristine kayak reservoirs.",
    date: "18 July 2026",
    image: "assets/images/blog/blog-card-1.webp",
    imageAlt: "Craggy mountain peaks rising above a calm blue reservoir",
    link: "#"
  },
  {
    id: "article-8",
    badge: "Japan",
    destination: "Japan",
    category: "Culture",
    readTime: "10 min read",
    title: "Onsen etiquette: entering the thermal bath with grace",
    description: "A thoughtful traveler's guide to Japan's communal bathing culture, natural mineral pools, and respectful customs.",
    date: "14 July 2026",
    image: "assets/images/blog/blog-card-2.webp",
    imageAlt: "Natural cedar-lined outdoor hot spring surrounded by Japanese pines",
    link: "#"
  },
  {
    id: "article-9",
    badge: "Dubai",
    destination: "Dubai",
    category: "Food",
    readTime: "6 min read",
    title: "The spice merchants of Old Deira",
    description: "Navigating saffron strands, dried limes, and frankincense resins along the historic trading docks.",
    date: "9 July 2026",
    image: "assets/images/blog/blog-card-4.webp",
    imageAlt: "Aromatic sacks of dried herbs, saffron, and spices in an old souk",
    link: "#"
  }
];

export const readerFavourites = [
  {
    rank: "01",
    title: "Ten days in Japan without rushing",
    description: "A beautifully slow-paced itinerary that stays in just three ryokans, prioritizing rest and connection over checklist ticking.",
    readTime: "11 min read",
    link: "#"
  },
  {
    rank: "02",
    title: "What a Travel AI Agent actually does for you",
    description: "How our proprietary technology works in tandem with humans to secure hyper-local bookings and manage complex transport on the fly.",
    readTime: "5 min read",
    link: "#"
  },
  {
    rank: "03",
    title: "Dubai in the shoulder season",
    description: "Why the quiet months of late April and October provide the perfect sweet spot for warm gulf waters and empty desert camps.",
    readTime: "6 min read",
    link: "#"
  },
  {
    rank: "04",
    title: "Trains, passes and the myth of the rail pass",
    description: "An honest cost breakdown of regional vs. national transit tickets on the Shinkansen network — why the famous pass is rarely worth it now.",
    readTime: "8 min read",
    link: "#"
  }
];

export const filterOptions = [
  { label: "All Destinations", value: "all" },
  { label: "Dubai", value: "Dubai" },
  { label: "Japan", value: "Japan" },
  { label: "Experiences", value: "Experiences" }
];
