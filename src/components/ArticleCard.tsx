import { Calendar, Eye, ExternalLink } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

export default function ArticleCard({ article, onSelect }: ArticleCardProps) {
  const { title, description, publishedAt, source, url, urlToImage, sentiment } = article;

  // Format date nicely
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  // Get sentiment badge class and text
  const getSentimentDetails = () => {
    if (!sentiment) return { label: 'Neutral', className: 'badge-neu', scoreStr: '0' };
    
    const score = sentiment.score;
    const sign = score > 0 ? '+' : '';
    
    if (sentiment.type === 'positive') {
      return { 
        label: 'Positive', 
        className: 'badge-pos', 
        scoreStr: `${sign}${score}` 
      };
    } else if (sentiment.type === 'negative') {
      return { 
        label: 'Negative', 
        className: 'badge-neg', 
        scoreStr: `${score}` 
      };
    } else {
      return { 
        label: 'Neutral', 
        className: 'badge-neu', 
        scoreStr: '0' 
      };
    }
  };

  const badgeDetails = getSentimentDetails();
  const sentimentShadowClass = sentiment 
    ? `card-sentiment-${sentiment.type}` 
    : 'card-sentiment-neutral';

  return (
    <article className={`glass-card news-card ${sentimentShadowClass} animate-fade-in-up`}>
      {/* Article Image Preview */}
      <div className="card-image-wrapper">
        <img 
          src={urlToImage} 
          alt={title} 
          className="card-image"
          loading="lazy"
          onError={(e) => {
            // Fallback image if Unsplash fails or NewsAPI image is broken
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80";
          }}
        />
        <div className="card-badge-overlay">
          <span className={`badge ${badgeDetails.className}`}>
            {badgeDetails.label} ({badgeDetails.scoreStr})
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="card-content">
        <div className="card-meta">
          <span className="card-source">{source.name}</span>
          <span className="card-date">
            <Calendar size={12} />
            {formatDate(publishedAt)}
          </span>
        </div>
        
        <h3 className="card-title" title={title}>{title}</h3>
        <p className="card-desc">{description}</p>
        
        {/* Card Actions */}
        <div className="card-actions">
          <button 
            onClick={() => onSelect(article)} 
            className="btn btn-secondary card-btn-analyze"
            id={`btn-analyze-${article.id}`}
            title="Open comprehensive sentiment diagnostics"
          >
            <Eye size={14} />
            <span>Diagnostics</span>
          </button>
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary card-btn-link"
            id={`link-original-${article.id}`}
            title="Read full article on publisher site"
          >
            <span>Source</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
