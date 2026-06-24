import type { Article } from '../types';

// Unsplash source images for premium visuals
const IMAGE_URLS = {
  tech: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
  climate: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
  health: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=80',
  market: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
  startup: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80'
};

const MOCK_TEMPLATE_ARTICLES = [
  // Tech & AI
  {
    title: "DeepMind Unveils Next-Gen AI Model Capable of Scientific Breakthroughs",
    description: "Google DeepMind has introduced AlphaScientific, an AI system that has already predicted structural protein foldings and discovered three new materials.",
    content: "The research team at Google DeepMind has achieved a spectacular breakthrough in artificial intelligence. Their latest model, AlphaScientific, represents a massive leap forward in predictive science. It has already successfully solved complex biological equations, mapping out protein foldings with extreme accuracy. Researchers globally are celebrating this triumph, stating that this technology will boost biochemical discoveries and accelerate critical pharmaceutical developments, bringing massive benefits to global healthcare systems.",
    source: "TechCrunch",
    category: "ai",
    image: IMAGE_URLS.ai
  },
  {
    title: "Tech Giants Announce Strategic Coalition for Open-Source AI Safety",
    description: "Leading tech firms have agreed to a major partnership to establish global security standards and prevent AI-related risks.",
    content: "In an unexpected and highly praised alliance, major technology leaders have signed a historic agreement to support open-source artificial intelligence safety. The collaborative coalition aims to establish a secure framework for AI deployments. Industry experts believe this is a very positive, progressive step that will secure public trust while maintaining rapid technological progress. The joint statement highlights a shared vision of safe, reliable, and highly beneficial intelligence tools.",
    source: "Wired",
    category: "ai",
    image: IMAGE_URLS.tech
  },
  {
    title: "Major Cybersecurity Flaw Discovered in Popular Cloud Systems, Millions Exposed",
    description: "Security researchers warn of a critical vulnerability that allows unauthorized data extraction across major enterprise systems.",
    content: "A catastrophic security crisis has hit the cloud computing sector. Analysts have warned of an active, highly dangerous vulnerability affecting millions of corporate users. The threat allows hacker networks to bypass firewalls and steal sensitive databases. Major tech firms have faced a severe cyberattack leading to massive data losses and damage to their infrastructure. Stock values plummeted following reports of this devastating hack, triggering panic and worry among enterprise customers.",
    source: "Bloomberg",
    category: "tech",
    image: IMAGE_URLS.tech
  },
  
  // Finance & Markets
  {
    title: "Global Stock Markets Surge as Inflation Cools Down Significantly",
    description: "Investors are celebrating as central banks hint at rate cuts following optimistic economic recovery indicators.",
    content: "Global markets experienced an outstanding rise today, reaching record highs. Investors showed high optimism after reports confirmed a major drop in inflation. Financial analysts suggest this is a strong sign of economic recovery and profit growth. Leading stocks in technology, banking, and energy surged, driving massive gains across indexes. Analysts predict a strong, lucrative quarter ahead, boosting corporate expansion plans.",
    source: "Bloomberg",
    category: "finance",
    image: IMAGE_URLS.market
  },
  {
    title: "Cryptocurrency Exchange Declares Bankruptcy Following Massive Liquidity Crash",
    description: "Regulators clamp down on digital assets as a top exchange fails to secure emergency funding.",
    content: "The digital asset market suffered a disastrous blow today as a prominent cryptocurrency exchange declared bankruptcy. The platform experienced a sudden, catastrophic liquidity crash, failing to secure backup investments. Regulators have launched an immediate fraud investigation, raising severe concerns over investor safety and systemic risks. This failure has caused prices of major tokens to collapse, triggering widespread panic, sell-offs, and deep financial losses.",
    source: "Reuters",
    category: "finance",
    image: IMAGE_URLS.finance
  },
  {
    title: "Federal Reserve Holds Interest Rates Steady, Citing Sluggish Progress",
    description: "The central bank decided to pause rate changes, expressing caution about current employment stats and slow growth.",
    content: "The Federal Reserve announced it will keep interest rates unchanged at the current level. The central bank expressed moderate concern over sluggish progress in key sectors and a slowing labor market. While inflation has stabilized, Fed officials noted that economic recovery remains difficult and uncertain. Economists interpreted the decision as a cautious stance, indicating that further adjustments are unlikely until clearer data arrives.",
    source: "Wall Street Journal",
    category: "finance",
    image: IMAGE_URLS.market
  },

  // Climate & Environment
  {
    title: "Renewable Energy Capacity Boosted by 40% in Global Green Energy Shift",
    description: "Recent report confirms solar and wind projects are expanding at a rapid pace, replacing coal power plants.",
    content: "A major, hopeful milestone has been reached in environmental protection. Global renewable energy projects have grown by 40% this year. Solar and wind systems are successfully replacing traditional fossil fuels. This transition represents a brilliant success in the battle against climate change, reducing carbon emissions by millions of tons. Environmental groups are celebrating this progress, predicting cleaner air and lower utility costs.",
    source: "BBC News",
    category: "climate",
    image: IMAGE_URLS.climate
  },
  {
    title: "Severe Heatwaves and Catastrophic Droughts Threaten Agricultural Belts",
    description: "Scientists warn of a severe crisis as temperature records break, damaging crops and water supplies.",
    content: "A devastating heatwave is spreading across major agricultural areas, causing catastrophic droughts and water shortages. Climatologists warn of severe threat to global crop yields, which could spark food supply crises. Extreme temperatures are destroying vegetation and drying up reservoirs. Local governments have issued critical warnings, advising citizens to prepare for prolonged dry spells as emergency services clash over resource allocation.",
    source: "Reuters",
    category: "climate",
    image: IMAGE_URLS.climate
  },
  
  // Health & Medicine
  {
    title: "Clinical Trial for Cancer Cure Shows 90% Success Rate in Early Phases",
    description: "An innovative gene-editing therapy successfully eliminates tumors in early patient cohorts.",
    content: "In what is being described as a spectacular medical breakthrough, a new gene-editing therapy has achieved a 90% success rate in patient trials. The innovative treatment targets and eliminates cancerous cells without damaging healthy tissues. Medical associations have praised the outstanding results, calling it a historic triumph in oncology. This therapeutic advance offers incredible hope to patients worldwide, promising a safer and much more effective alternative to chemotherapy.",
    source: "BBC News",
    category: "health",
    image: IMAGE_URLS.health
  },
  {
    title: "Global Health Watchdog Warns of Rapid Outbreak of Highly Contagious Virus",
    description: "Health officials advise immediate safety guidelines as a new variant spreads across borders.",
    content: "A new virus outbreak has triggered worry and concern in global health circles. The World Health Organization issued a critical warning warning of high transmission rates of a new respiratory variant. The threat of lockdowns and border checks has raised public fear. Medical networks are struggling with rising hospitalizations, raising concerns about capacity limits and potential shortages of medical supplies.",
    source: "The Guardian",
    category: "health",
    image: IMAGE_URLS.health
  },

  // General Startups & Business
  {
    title: "Electric Vehicle Startup Secures $500M in Series C Funding for Factory Expansion",
    description: "The capital boost will help the company scale production and build a new, clean manufacturing hub.",
    content: "A promising electric vehicle startup has successfully secured a massive $500 million investment. The funding round will support the construction of a state-of-the-art green manufacturing hub. Industry leaders noted that this successful capital raise reflects strong investor trust in the company's innovative drivetrain technology. The startup expects this boost will expand its market footprint and create thousands of jobs, marking a major gain in the EV market.",
    source: "TechCrunch",
    category: "startup",
    image: IMAGE_URLS.startup
  },
  {
    title: "Retail Giant Faces Serious Union Protests and Potential Strikes Over Wages",
    description: "Workers demand better pay and safety standards, threatening to disrupt retail distribution networks.",
    content: "A major dispute is brewing inside one of the country's largest retail companies. Employee unions have organized massive protests, demanding higher wages and safer working environments. Union leaders warned of potential national strikes, which would cause severe disruption to retail supply chains. The company is facing criticism for rejecting negotiations, which has damaged its public reputation and led to a drop in consumer traffic.",
    source: "The Guardian",
    category: "general",
    image: IMAGE_URLS.general
  }
];

/**
 * Generates realistic articles based on a search query
 */
export function generateMockArticles(query: string = '', timeframe: 'today' | 'week' | 'month' = 'week'): Article[] {
  const normalizedQuery = query.trim().toLowerCase();
  
  // Filter templates based on query matching category, title, description, or content
  let filteredTemplates = MOCK_TEMPLATE_ARTICLES;
  
  if (normalizedQuery) {
    filteredTemplates = MOCK_TEMPLATE_ARTICLES.filter(article => 
      article.category.includes(normalizedQuery) ||
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.description.toLowerCase().includes(normalizedQuery) ||
      article.content.toLowerCase().includes(normalizedQuery)
    );
    
    // If no articles match the query, fall back to a random subset of articles, but adapt their content dynamically
    if (filteredTemplates.length === 0) {
      filteredTemplates = MOCK_TEMPLATE_ARTICLES.slice(0, 6);
    }
  }

  // Set up date calculations based on timeframe to create a realistic spread
  const today = new Date();
  const articles: Article[] = [];

  filteredTemplates.forEach((tpl, index) => {
    // Generate dates scattered across the timeframe
    const date = new Date(today);
    let daysOffset = 0;
    
    if (timeframe === 'today') {
      // Offset by hours
      const hoursOffset = Math.floor(Math.random() * 20);
      date.setHours(today.getHours() - hoursOffset);
    } else if (timeframe === 'week') {
      daysOffset = Math.floor(Math.random() * 6);
      date.setDate(today.getDate() - daysOffset);
    } else {
      daysOffset = Math.floor(Math.random() * 28);
      date.setDate(today.getDate() - daysOffset);
    }

    // Dynamically insert search keyword into the text to make it feel customized if a search query is used
    let title = tpl.title;
    let description = tpl.description;
    let content = tpl.content;

    if (normalizedQuery && !title.toLowerCase().includes(normalizedQuery)) {
      // Subsitute context words with query words to make it feel highly realistic!
      const capQuery = query.charAt(0).toUpperCase() + query.slice(1);
      if (tpl.category === 'ai' || tpl.category === 'tech') {
        title = title.replace(/AI|Tech/g, capQuery);
        description = description.replace(/AI|technology/g, capQuery);
      } else if (tpl.category === 'finance') {
        title = title.replace(/Stock Markets|Inflation/g, capQuery);
        description = description.replace(/economic|investors/g, capQuery);
      }
    }

    articles.push({
      id: `mock-art-${index}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      content,
      url: `https://example.com/news/${tpl.category}-${index}`,
      urlToImage: tpl.image,
      publishedAt: date.toISOString(),
      source: {
        name: tpl.source,
        id: tpl.source.toLowerCase().replace(/\s+/g, '-')
      }
    });
  });

  // Sort articles by publication date descending by default
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Returns a list of all mock sources for dashboard filters
 */
export function getMockSources(): string[] {
  const sources = MOCK_TEMPLATE_ARTICLES.map(a => a.source);
  return Array.from(new Set(sources));
}
