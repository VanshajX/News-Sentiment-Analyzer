export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
    id: string | null;
  };
  sentiment?: SentimentResult;
}

export interface SentimentResult {
  score: number;        /* Raw sentiment score */
  comparative: number;  /* Average score per word */
  type: 'positive' | 'negative' | 'neutral';
  positiveWords: string[];
  negativeWords: string[];
  emotions: Emotions;
  summary?: string;
  keywords: string[];
}

export interface Emotions {
  joy: number;      /* 0.0 to 1.0 */
  anger: number;    /* 0.0 to 1.0 */
  trust: number;    /* 0.0 to 1.0 */
  fear: number;     /* 0.0 to 1.0 */
  sadness: number;  /* 0.0 to 1.0 */
}

export interface FilterState {
  searchQuery: string;
  timeframe: 'today' | 'week' | 'month';
  sortBy: 'relevance' | 'publishedAt' | 'sentiment';
  selectedSource: string;
  sentimentFilter: 'all' | 'positive' | 'negative' | 'neutral';
}

export interface ApiConfig {
  mode: 'local' | 'live';
  newsApiKey: string;
  geminiApiKey: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  averageSentiment: number; /* -1 to 1 */
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  emotionAverages: Emotions;
}
