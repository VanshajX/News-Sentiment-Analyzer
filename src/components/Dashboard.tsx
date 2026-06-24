import { useState, useEffect } from 'react';
import { Search, RefreshCw, ListFilter, AlertCircle, Info } from 'lucide-react';
import type { Article, FilterState, ApiConfig, DashboardStats, Emotions } from '../types';
import { fetchAndAnalyzeArticles } from '../services/newsApi';
import ArticleCard from './ArticleCard';
import AnalyticsCharts from './AnalyticsCharts';

interface DashboardProps {
  config: ApiConfig;
  theme: 'light' | 'dark';
  onSelectArticle: (article: Article) => void;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

export default function Dashboard({ 
  config, 
  theme, 
  onSelectArticle,
  articles,
  setArticles
}: DashboardProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Local Filter States
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    timeframe: 'week',
    sortBy: 'publishedAt',
    selectedSource: 'all',
    sentimentFilter: 'all'
  });

  const [activeSearch, setActiveSearch] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyzed: 0,
    averageSentiment: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
    emotionAverages: { joy: 0, anger: 0, trust: 0, fear: 0, sadness: 0 }
  });

  // Fetch articles on search query or timeframe or config updates
  const loadArticles = async (queryTerm: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { articles: fetchedArticles, error } = await fetchAndAnalyzeArticles(
        queryTerm,
        filters.timeframe,
        config
      );
      
      setArticles(fetchedArticles);
      if (error) {
        setErrorMsg(error);
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred while loading news data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(activeSearch);
  }, [filters.timeframe, config.mode, config.newsApiKey, activeSearch]);

  // Recalculate Statistics when articles update
  useEffect(() => {
    if (articles.length === 0) {
      setStats({
        totalAnalyzed: 0,
        averageSentiment: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        emotionAverages: { joy: 0, anger: 0, trust: 0, fear: 0, sadness: 0 }
      });
      return;
    }

    let pos = 0;
    let neg = 0;
    let neu = 0;
    let sumScore = 0;
    
    const emoSum: Emotions = { joy: 0, anger: 0, trust: 0, fear: 0, sadness: 0 };

    articles.forEach(art => {
      if (!art.sentiment) return;
      sumScore += art.sentiment.score;
      
      if (art.sentiment.type === 'positive') pos++;
      else if (art.sentiment.type === 'negative') neg++;
      else neu++;

      emoSum.joy += art.sentiment.emotions.joy;
      emoSum.anger += art.sentiment.emotions.anger;
      emoSum.trust += art.sentiment.emotions.trust;
      emoSum.fear += art.sentiment.emotions.fear;
      emoSum.sadness += art.sentiment.emotions.sadness;
    });

    const total = articles.length;
    
    setStats({
      totalAnalyzed: total,
      averageSentiment: parseFloat((sumScore / total).toFixed(2)),
      positiveCount: pos,
      negativeCount: neg,
      neutralCount: neu,
      emotionAverages: {
        joy: parseFloat((emoSum.joy / total).toFixed(2)),
        anger: parseFloat((emoSum.anger / total).toFixed(2)),
        trust: parseFloat((emoSum.trust / total).toFixed(2)),
        fear: parseFloat((emoSum.fear / total).toFixed(2)),
        sadness: parseFloat((emoSum.sadness / total).toFixed(2))
      }
    });
  }, [articles]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(filters.searchQuery);
  };

  // Get unique sources list for the filter select
  const uniqueSources = Array.from(new Set(articles.map(art => art.source.name)));

  // Filter and Sort articles
  const getProcessedArticles = () => {
    let list = [...articles];

    // Filter by Source
    if (filters.selectedSource !== 'all') {
      list = list.filter(art => art.source.name === filters.selectedSource);
    }

    // Filter by Sentiment Type
    if (filters.sentimentFilter !== 'all') {
      list = list.filter(art => art.sentiment?.type === filters.sentimentFilter);
    }

    // Sorting
    list.sort((a, b) => {
      if (filters.sortBy === 'publishedAt') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (filters.sortBy === 'sentiment') {
        const scoreA = a.sentiment?.score ?? 0;
        const scoreB = b.sentiment?.score ?? 0;
        return scoreB - scoreA; // descending order of score
      }
      // default / relevance (lexicon score absolute weight)
      const weightA = Math.abs(a.sentiment?.score ?? 0);
      const weightB = Math.abs(b.sentiment?.score ?? 0);
      return weightB - weightA;
    });

    return list;
  };

  const processedArticles = getProcessedArticles();

  // Format dynamic sentiment badge for averages
  const getAverageSentimentLabel = (score: number) => {
    if (score > 0.5) return { text: 'Bullish', color: 'text-positive' };
    if (score < -0.5) return { text: 'Bearish', color: 'text-negative' };
    return { text: 'Neutral', color: 'text-neutral' };
  };

  const avgSentimentDetails = getAverageSentimentLabel(stats.averageSentiment);

  return (
    <div className="dashboard-layout" id="dashboard-wrapper">
      {/* Header bar */}
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Analytics Desk</h1>
          <p>Global coverage sentiment profiling index</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-form" id="form-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              id="input-search"
              type="text"
              className="input-field search-input"
              placeholder="Search topic (e.g. AI, Climate, Stock)..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" id="btn-search">
            Search
          </button>
        </form>
      </header>

      {/* Warnings & Errors Banner */}
      {errorMsg && (
        <div className="info-banner warning-banner animate-fade-in" id="banner-warning">
          <AlertCircle size={18} />
          <p>{errorMsg}</p>
          {config.mode === 'live' && (
            <button 
              className="btn btn-secondary btn-xs" 
              onClick={() => loadArticles(activeSearch)}
              id="btn-retry-fetch"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          )}
        </div>
      )}

      {/* 1. Main Statistics Grid */}
      <section className="stats-grid" id="stats-summary-grid">
        <div className="stats-card glass-panel">
          <span className="stats-title">Analyzed Headlines</span>
          <h2 className="stats-value">{stats.totalAnalyzed}</h2>
          <span className="stats-subtitle">Timeframe: {filters.timeframe}</span>
        </div>

        <div className="stats-card glass-panel">
          <span className="stats-title">Composite Sentiment</span>
          <h2 className={`stats-value ${avgSentimentDetails.color}`}>
            {stats.averageSentiment > 0 ? `+${stats.averageSentiment}` : stats.averageSentiment}
          </h2>
          <span className="stats-subtitle">
            Index: <strong>{avgSentimentDetails.text}</strong>
          </span>
        </div>

        <div className="stats-card glass-panel">
          <span className="stats-title">Sentiment Ratios</span>
          <div className="ratios-container">
            <div className="ratio-item text-positive">
              <span>Pos</span>
              <strong>{stats.positiveCount}</strong>
            </div>
            <div className="ratio-item text-neutral">
              <span>Neu</span>
              <strong>{stats.neutralCount}</strong>
            </div>
            <div className="ratio-item text-negative">
              <span>Neg</span>
              <strong>{stats.negativeCount}</strong>
            </div>
          </div>
          <span className="stats-subtitle">Headline distribution count</span>
        </div>

        <div className="stats-card glass-panel">
          <span className="stats-title">Leading Tone</span>
          <h2 className="stats-value text-accent">
            {stats.totalAnalyzed > 0 
              ? Object.entries(stats.emotionAverages).sort((a,b) => b[1] - a[1])[0][0].toUpperCase()
              : 'N/A'
            }
          </h2>
          <span className="stats-subtitle">Dominant semantic emotion</span>
        </div>
      </section>

      {/* 2. Visual Analytics Section */}
      <section className="analytics-section">
        <AnalyticsCharts articles={articles} theme={theme} />
      </section>

      {/* 3. News Feed Toolbar */}
      <section className="feed-toolbar glass-panel">
        <div className="toolbar-left">
          <ListFilter size={18} />
          <h3>Article Stream</h3>
          <span className="feed-count">({processedArticles.length} items filtered)</span>
        </div>

        <div className="toolbar-right">
          {/* Timeframe selector */}
          <div className="filter-select-wrapper">
            <label htmlFor="select-timeframe">Period</label>
            <select
              id="select-timeframe"
              value={filters.timeframe}
              onChange={(e) => setFilters({ ...filters, timeframe: e.target.value as any })}
              className="input-field select-field"
            >
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="select-source">Source</label>
            <select
              id="select-source"
              value={filters.selectedSource}
              onChange={(e) => setFilters({ ...filters, selectedSource: e.target.value })}
              className="input-field select-field"
            >
              <option value="all">All Publishers</option>
              {uniqueSources.map((sourceName, i) => (
                <option key={i} value={sourceName}>{sourceName}</option>
              ))}
            </select>
          </div>

          {/* Sentiment Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="select-sentiment">Sentiment</label>
            <select
              id="select-sentiment"
              value={filters.sentimentFilter}
              onChange={(e) => setFilters({ ...filters, sentimentFilter: e.target.value as any })}
              className="input-field select-field"
            >
              <option value="all">All Scores</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-select-wrapper">
            <label htmlFor="select-sort">Sort By</label>
            <select
              id="select-sort"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="input-field select-field"
            >
              <option value="publishedAt">Newest Date</option>
              <option value="sentiment">Sentiment Score</option>
              <option value="relevance">Polar Intensity</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. News Grid */}
      {loading ? (
        <div className="feed-loader" id="feed-loading-spinner">
          <RefreshCw className="spin-animation loader-icon" size={32} />
          <p>Retrieving and profiling global articles...</p>
        </div>
      ) : processedArticles.length > 0 ? (
        <div className="news-grid" id="articles-list-grid">
          {processedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-feed glass-panel" id="articles-empty-view">
          <Info size={36} className="empty-icon" />
          <h3>No Articles Match Selected Filters</h3>
          <p>Try resetting the sentiment filters, selected publishers, or search query term.</p>
        </div>
      )}
    </div>
  );
}
