import { useState, useEffect } from 'react';
import type { ApiConfig, Article } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ArticleModal from './components/ArticleModal';

export default function App() {
  // Theme state with localStorage persistence (default dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sentix-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // API Config state with localStorage persistence
  const [config, setConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('sentix-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      mode: 'local',
      newsApiKey: '',
      geminiApiKey: ''
    };
  });

  // Global article feed list state (to allow modal updates to propagate to dashboard stats/charts)
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Apply theme to document element on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sentix-theme', theme);
  }, [theme]);

  // Persist API configuration on change
  const handleConfigChange = (newConfig: ApiConfig) => {
    setConfig(newConfig);
    localStorage.setItem('sentix-config', JSON.stringify(newConfig));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Update sentiment details in-place for a specific article
  const handleUpdateArticleSentiment = (articleId: string, updatedSentiment: any) => {
    const updatedList = articles.map(art => {
      if (art.id === articleId) {
        const updatedArt = { ...art, sentiment: updatedSentiment };
        // Sync selected article to re-render modal
        if (selectedArticle?.id === articleId) {
          setSelectedArticle(updatedArt);
        }
        return updatedArt;
      }
      return art;
    });
    setArticles(updatedList);
  };

  return (
    <div className="app-layout">
      {/* 1. Sidebar Configurations Panel */}
      <Sidebar 
        config={config} 
        onConfigChange={handleConfigChange} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* 2. Main Dashboard Panel */}
      <main className="main-content-panel">
        <Dashboard 
          config={config} 
          theme={theme} 
          onSelectArticle={setSelectedArticle}
          articles={articles}
          setArticles={setArticles}
        />
      </main>

      {/* 3. Diagnostics Modal (Overlay) */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
          config={config}
          onUpdateArticleSentiment={handleUpdateArticleSentiment}
          theme={theme}
        />
      )}
    </div>
  );
}
