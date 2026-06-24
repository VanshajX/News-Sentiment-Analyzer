import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { Article } from '../types';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsChartsProps {
  articles: Article[];
  theme: 'light' | 'dark';
}

export default function AnalyticsCharts({ articles, theme }: AnalyticsChartsProps) {
  const isDark = theme === 'dark';
  
  // Theme color constants for ChartJS configuration
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const tooltipBg = isDark ? '#0f131a' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
  const tooltipText = isDark ? '#f1f5f9' : '#0f172a';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 11, weight: 500 }
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: textColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        titleFont: { family: 'Outfit', weight: 'bold' as const },
        bodyFont: { family: 'Inter' }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      }
    }
  };

  // ==========================================
  // DATA PREPARATION: 1. Sentiment Trend Over Time
  // ==========================================
  const getTrendData = () => {
    const datesMap: Record<string, { totalScore: number; count: number }> = {};
    
    articles.forEach(art => {
      if (!art.sentiment) return;
      try {
        const dateStr = new Date(art.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        if (!datesMap[dateStr]) {
          datesMap[dateStr] = { totalScore: 0, count: 0 };
        }
        datesMap[dateStr].totalScore += art.sentiment.score;
        datesMap[dateStr].count += 1;
      } catch (e) {
        // ignore date errors
      }
    });

    // Sort chronologically (assume source dates are sorted, otherwise we sort keys)
    const sortedDates = Object.keys(datesMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const averageScores = sortedDates.map(date => 
      parseFloat((datesMap[date].totalScore / datesMap[date].count).toFixed(2))
    );

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Average Sentiment Score',
          data: averageScores,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.08)',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: 'rgb(139, 92, 246)',
          pointBorderColor: isDark ? '#0f131a' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  // ==========================================
  // DATA PREPARATION: 2. Source Bias Bar Chart
  // ==========================================
  const getSourceBiasData = () => {
    const sourceMap: Record<string, { totalScore: number; count: number }> = {};
    
    articles.forEach(art => {
      if (!art.sentiment) return;
      const sourceName = art.source.name;
      if (!sourceMap[sourceName]) {
        sourceMap[sourceName] = { totalScore: 0, count: 0 };
      }
      sourceMap[sourceName].totalScore += art.sentiment.score;
      sourceMap[sourceName].count += 1;
    });

    const sources = Object.keys(sourceMap);
    const averageScores = sources.map(source => 
      parseFloat((sourceMap[source].totalScore / sourceMap[source].count).toFixed(2))
    );

    // Dynamic bar colors: Green for positive bias, Red for negative, Grey for neutral
    const barColors = averageScores.map(score => {
      if (score > 0.5) return 'rgba(16, 185, 129, 0.7)'; // Emerald
      if (score < -0.5) return 'rgba(244, 63, 94, 0.7)'; // Rose
      return 'rgba(100, 116, 139, 0.7)'; // Slate
    });

    const borderColors = averageScores.map(score => {
      if (score > 0.5) return 'rgb(16, 185, 129)';
      if (score < -0.5) return 'rgb(244, 63, 94)';
      return 'rgb(100, 116, 139)';
    });

    return {
      labels: sources,
      datasets: [
        {
          label: 'Sentiment Bias (Avg Score)',
          data: averageScores,
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 4
        }
      ]
    };
  };

  // ==========================================
  // DATA PREPARATION: 3. Impact Words Frequency
  // ==========================================
  const getImpactWordsData = () => {
    const wordFreq: Record<string, { count: number; type: 'pos' | 'neg' }> = {};
    
    articles.forEach(art => {
      if (!art.sentiment) return;
      art.sentiment.positiveWords.forEach(word => {
        if (!wordFreq[word]) wordFreq[word] = { count: 0, type: 'pos' };
        wordFreq[word].count += 1;
      });
      art.sentiment.negativeWords.forEach(word => {
        if (!wordFreq[word]) wordFreq[word] = { count: 0, type: 'neg' };
        wordFreq[word].count += 1;
      });
    });

    // Select top 8 words
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);

    const labels = topWords.map(entry => entry[0]);
    const counts = topWords.map(entry => entry[1].count);
    const backgroundColors = topWords.map(entry => 
      entry[1].type === 'pos' ? 'rgba(16, 185, 129, 0.65)' : 'rgba(244, 63, 94, 0.65)'
    );
    const borderColors = topWords.map(entry => 
      entry[1].type === 'pos' ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'
    );

    return {
      labels,
      datasets: [
        {
          label: 'Occurrences',
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 4
        }
      ]
    };
  };

  const trendData = getTrendData();
  const sourceBiasData = getSourceBiasData();
  const impactWordsData = getImpactWordsData();

  // If no articles are present, display a placeholder
  if (articles.length === 0) {
    return (
      <div className="charts-placeholder glass-panel">
        <p>No article statistics available. Execute a search query to load charts.</p>
      </div>
    );
  }

  return (
    <div className="analytics-grid">
      {/* 1. Sentiment Trend Chart */}
      <section className="chart-card glass-panel" id="chart-sentiment-trend">
        <h3>Sentiment Velocity</h3>
        <span className="chart-subtitle">Average article sentiment trend over time</span>
        <div className="chart-container">
          <Line 
            data={trendData} 
            options={{
              ...commonOptions,
              scales: {
                ...commonOptions.scales,
                y: {
                  ...commonOptions.scales.y,
                  suggestedMin: -3,
                  suggestedMax: 3
                }
              }
            }} 
          />
        </div>
      </section>

      {/* 2. Source Bias Chart */}
      <section className="chart-card glass-panel" id="chart-source-bias">
        <h3>Publisher Sentiment Bias</h3>
        <span className="chart-subtitle">Sentiment divergence across publishers</span>
        <div className="chart-container">
          <Bar 
            data={sourceBiasData} 
            options={{
              ...commonOptions,
              indexAxis: 'y' as const, // Horizontal Bar Chart
              plugins: {
                ...commonOptions.plugins,
                legend: { display: false }
              }
            }} 
          />
        </div>
      </section>

      {/* 3. Keyword / Impact Words Chart */}
      <section className="chart-card glass-panel" id="chart-impact-words">
        <h3>Primary Sentiment Drivers</h3>
        <span className="chart-subtitle">Highest frequency sentiment terms detected</span>
        <div className="chart-container">
          <Bar 
            data={impactWordsData} 
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                legend: { display: false }
              }
            }} 
          />
        </div>
      </section>
    </div>
  );
}
