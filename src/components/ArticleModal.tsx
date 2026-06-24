import { useState } from 'react';
import { X, Cpu, Sparkles, Brain, FileText, AlertTriangle } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartData } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { Article, SentimentResult, ApiConfig } from '../types';
import { analyzeSentimentWithGemini } from '../services/sentimentEngine';

// Register Radar-specific modules
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  config: ApiConfig;
  onUpdateArticleSentiment: (articleId: string, updatedSentiment: SentimentResult) => void;
  theme: 'light' | 'dark';
}

export default function ArticleModal({ 
  article, 
  onClose, 
  config, 
  onUpdateArticleSentiment,
  theme 
}: ArticleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { id, title, description, content, publishedAt, source, sentiment } = article;
  const isDark = theme === 'dark';

  // Highlight words with sentiment weights in text
  const renderHighlightedText = (text: string) => {
    if (!text || !sentiment) return text;
    
    const { positiveWords, negativeWords } = sentiment;
    if (positiveWords.length === 0 && negativeWords.length === 0) return text;

    // Build lists of unique words to search for
    const posSet = new Set(positiveWords.map(w => w.toLowerCase()));
    const negSet = new Set(negativeWords.map(w => w.toLowerCase()));

    // Regex to split text by word boundaries
    const parts = text.split(/(\b\w+\b)/g);
    
    return parts.map((part, idx) => {
      const lowerPart = part.toLowerCase();
      if (posSet.has(lowerPart)) {
        return <span key={idx} className="highlight-pos" title="Positive Indicator">{part}</span>;
      }
      if (negSet.has(lowerPart)) {
        return <span key={idx} className="highlight-neg" title="Negative Indicator">{part}</span>;
      }
      return part;
    });
  };

  // Trigger Gemini API for refined analysis
  const handleGeminiAnalysis = async () => {
    if (!config.geminiApiKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeSentimentWithGemini(title, description, content, config.geminiApiKey);
      
      if (result.score !== undefined) {
        // Complete the object with fallback structures if missing
        const updatedSentiment: SentimentResult = {
          score: result.score,
          comparative: result.comparative ?? (result.score / 10),
          type: result.type ?? 'neutral',
          positiveWords: result.positiveWords ?? sentiment?.positiveWords ?? [],
          negativeWords: result.negativeWords ?? sentiment?.negativeWords ?? [],
          emotions: result.emotions ?? sentiment?.emotions ?? { joy: 0.1, anger: 0.1, trust: 0.2, fear: 0.1, sadness: 0.1 },
          summary: result.summary,
          keywords: result.keywords ?? sentiment?.keywords ?? []
        };
        
        onUpdateArticleSentiment(id, updatedSentiment);
      } else {
        throw new Error("Unable to analyze article text correctly. Gemini returned incomplete values.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to contact Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EMOTIONS RADAR CHART CONFIGURATION
  // ==========================================
  const radarData: ChartData<'radar'> = {
    labels: ['Joy', 'Anger', 'Trust', 'Fear', 'Sadness'],
    datasets: [
      {
        label: 'Emotional Dimensions',
        data: sentiment 
          ? [
              sentiment.emotions.joy,
              sentiment.emotions.anger,
              sentiment.emotions.trust,
              sentiment.emotions.fear,
              sentiment.emotions.sadness
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(99, 102, 241, 0.15)',
        borderColor: isDark ? 'rgb(139, 92, 246)' : 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: isDark ? 'rgb(139, 92, 246)' : 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: isDark ? 'rgb(139, 92, 246)' : 'rgb(99, 102, 241)',
        pointRadius: 3
      }
    ]
  };

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      r: {
        angleLines: { color: gridColor },
        grid: { color: gridColor },
        pointLabels: {
          color: textColor,
          font: { family: 'Outfit', size: 11, weight: 600 }
        },
        ticks: {
          display: false,
          stepSize: 0.2
        },
        suggestedMin: 0,
        suggestedMax: 1
      }
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} id="modal-container">
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} id="modal-body">
        {/* Modal Header */}
        <header className="modal-header">
          <div className="modal-source-badge">{source.name}</div>
          <button className="modal-close-btn" onClick={onClose} id="btn-close-modal">
            <X size={20} />
          </button>
        </header>

        {/* Modal Main Body Grid */}
        <main className="modal-grid">
          {/* Left Column: Full Content & Diagnostics */}
          <section className="modal-left-col">
            <h2 className="modal-title">{title}</h2>
            <time className="modal-time">Published on {new Date(publishedAt).toLocaleString()}</time>

            {/* Snippet / Description Content */}
            <div className="text-analysis-card glass-card">
              <h4>
                <FileText size={16} />
                Sentiment Term Highlighting
              </h4>
              <p className="article-body-text">
                {renderHighlightedText(content || description)}
              </p>
              <div className="highlight-legend">
                <span className="legend-pos">⬤ Positive word</span>
                <span className="legend-neg">⬤ Negative word</span>
              </div>
            </div>

            {/* Keyword Entity Badges */}
            {sentiment && sentiment.keywords.length > 0 && (
              <div className="modal-keywords-container">
                <h4>Extracted Keywords</h4>
                <div className="keywords-list">
                  {sentiment.keywords.map((kw, i) => (
                    <span key={i} className="keyword-badge">#{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Sentiment Stats, Radar, & AI Actions */}
          <section className="modal-right-col">
            {/* Score Stats */}
            <div className="score-summary-card glass-card">
              <h3>Sentiment Score</h3>
              <div className={`score-large ${sentiment?.type}`}>
                {sentiment ? (sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score) : '0'}
              </div>
              <span className="score-label-sub">
                Type: <strong className={`text-${sentiment?.type}`}>{sentiment?.type}</strong>
              </span>
            </div>

            {/* Emotions Radar Chart */}
            <div className="emotions-radar-card glass-card">
              <h4>Emotional Profiling</h4>
              <div className="radar-container">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* AI / Gemini Refine Section */}
            <div className="gemini-refine-card glass-card">
              <div className="gemini-header">
                <Cpu className="icon-pulse" size={18} />
                <h4>Gemini Neural Diagnostics</h4>
              </div>

              {sentiment?.summary ? (
                <div className="gemini-summary-results animate-fade-in-up">
                  <div className="gemini-badge">
                    <Sparkles size={12} />
                    <span>AI Insights Active</span>
                  </div>
                  <p className="gemini-summary-text">{sentiment.summary}</p>
                </div>
              ) : (
                <div className="gemini-cta">
                  {config.geminiApiKey ? (
                    <button 
                      onClick={handleGeminiAnalysis}
                      disabled={loading}
                      className="btn btn-primary gemini-btn-full"
                      id="btn-trigger-gemini"
                    >
                      {loading ? (
                        <>
                          <Brain className="spin-animation" size={16} />
                          <span>Generating AI Insights...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Analyze with Gemini API</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="gemini-placeholder-box">
                      <Brain size={24} className="gemini-icon-muted" />
                      <p>
                        Provide a <strong>Gemini API Key</strong> in the sidebar settings to unlock full neural summaries, semantic keyword extractions, and deep sentiment analysis.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="gemini-error-banner">
                  <AlertTriangle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
