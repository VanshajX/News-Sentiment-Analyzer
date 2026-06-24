import type { Article, ApiConfig } from '../types';
import { generateMockArticles } from './mockData';
import { analyzeSentimentLocally } from './sentimentEngine';

/**
 * Utility to calculate Date string for NewsAPI (YYYY-MM-DD)
 */
function getDateStringOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Main service to fetch articles and perform initial sentiment analysis
 */
export async function fetchAndAnalyzeArticles(
  query: string,
  timeframe: 'today' | 'week' | 'month',
  config: ApiConfig
): Promise<{ articles: Article[]; error?: string }> {
  // If mode is local or no key is provided, return mock data instantly
  if (config.mode === 'local' || !config.newsApiKey) {
    const mockArticles = generateMockArticles(query, timeframe);
    const analyzed = mockArticles.map(art => ({
      ...art,
      sentiment: analyzeSentimentLocally(`${art.title} ${art.description} ${art.content}`)
    }));
    return { articles: analyzed };
  }

  // Live Mode: newsapi.org fetching
  try {
    let daysOffset = 7;
    if (timeframe === 'today') daysOffset = 0;
    if (timeframe === 'month') daysOffset = 30;

    const fromDate = getDateStringOffset(daysOffset);
    const searchQuery = query.trim() || 'technology'; // Fallback query if search is empty
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&from=${fromDate}&sortBy=publishedAt&pageSize=25&apiKey=${config.newsApiKey}`;

    const response = await fetch(url);
    
    if (response.status === 401) {
      return { 
        articles: [], 
        error: "Invalid NewsAPI key. Please check your key in the settings panel." 
      };
    }
    
    if (response.status === 429) {
      return { 
        articles: [], 
        error: "NewsAPI rate limit exceeded. Please try again later or switch to Local Mode." 
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'error') {
      return { articles: [], error: data.message || "NewsAPI error occurred." };
    }

    if (!data.articles || data.articles.length === 0) {
      return { 
        articles: [], 
        error: `No live articles found for "${searchQuery}". Try a different term or switch to Local Mode.` 
      };
    }

    // Format NewsAPI response to our Article interface and perform local sentiment analysis
    const articles: Article[] = data.articles.map((art: any, index: number) => {
      const title = art.title || "Untitled Article";
      const description = art.description || "No description available.";
      const content = art.content || description || "";
      
      return {
        id: `newsapi-${index}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        content,
        url: art.url || "",
        urlToImage: art.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80",
        publishedAt: art.publishedAt || new Date().toISOString(),
        source: {
          name: art.source?.name || "Unknown Source",
          id: art.source?.id || null
        },
        sentiment: analyzeSentimentLocally(`${title} ${description} ${content}`)
      };
    });

    return { articles };
  } catch (error: any) {
    console.error("NewsAPI fetch failed:", error);
    
    // Check if it looks like a CORS restriction error (extremely common on client-side)
    const isCorsError = error.message?.includes('Failed to fetch') || !navigator.onLine;
    const errorMsg = isCorsError 
      ? "CORS restriction blocked client-side request. NewsAPI developer keys only work from localhost. We have fallen back to local simulation mode."
      : `Network error: ${error.message || 'Unknown error'}. Fallen back to local mode.`;

    // Graceful fallback to mock data so the application never breaks
    const mockArticles = generateMockArticles(query, timeframe);
    const analyzed = mockArticles.map(art => ({
      ...art,
      sentiment: analyzeSentimentLocally(`${art.title} ${art.description} ${art.content}`)
    }));

    return { 
      articles: analyzed,
      error: errorMsg
    };
  }
}
