import { useState } from 'react';
import { Settings, Shield, Globe, Sun, Moon, ToggleLeft, ToggleRight } from 'lucide-react';
import type { ApiConfig } from '../types';

interface SidebarProps {
  config: ApiConfig;
  onConfigChange: (newConfig: ApiConfig) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Sidebar({ config, onConfigChange, theme, toggleTheme }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newsKey, setNewsKey] = useState(config.newsApiKey);
  const [geminiKey, setGeminiKey] = useState(config.geminiApiKey);
  const [mode, setMode] = useState(config.mode);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigChange({
      mode,
      newsApiKey: newsKey,
      geminiApiKey: geminiKey
    });
    setIsOpen(false);
  };

  const toggleMode = () => {
    const nextMode = mode === 'local' ? 'live' : 'local';
    setMode(nextMode);
    onConfigChange({
      ...config,
      mode: nextMode
    });
  };

  return (
    <aside className="sidebar-container glass-panel">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-logo">📰</div>
        <div className="brand-text">
          <h2>Sentix</h2>
          <span>News Sentiment Engine</span>
        </div>
      </div>

      {/* Mode Toggle Banner */}
      <div className={`mode-banner ${mode === 'live' ? 'mode-live' : 'mode-local'}`} onClick={toggleMode} id="btn-mode-toggle">
        {mode === 'live' ? <Globe size={18} /> : <Shield size={18} />}
        <span>{mode === 'live' ? 'Live API Mode' : 'Local Offline Mode'}</span>
        {mode === 'live' ? (
          <ToggleRight size={28} className="mode-toggle-icon active" />
        ) : (
          <ToggleLeft size={28} className="mode-toggle-icon" />
        )}
      </div>

      {/* Navigation & Controls */}
      <div className="sidebar-content">
        <button 
          className="btn btn-secondary sidebar-btn"
          id="btn-settings-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Settings size={18} />
          <span>API Configurations</span>
        </button>

        {/* API Settings Form Panel (Collapsible) */}
        {isOpen && (
          <form onSubmit={handleSave} className="settings-form animate-fade-in-up" id="form-settings">
            <div className="form-group">
              <label htmlFor="input-newsapi-key">NewsAPI Key</label>
              <input
                id="input-newsapi-key"
                type="password"
                className="input-field"
                placeholder="Paste NewsAPI key..."
                value={newsKey}
                onChange={(e) => setNewsKey(e.target.value)}
              />
              <span className="field-hint">
                Get a free key from <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">newsapi.org</a>
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="input-gemini-key">Gemini API Key</label>
              <input
                id="input-gemini-key"
                type="password"
                className="input-field"
                placeholder="Paste Gemini API key..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <span className="field-hint">
                Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
              </span>
            </div>

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary btn-sm" id="btn-save-settings">
                Save & Apply
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                id="btn-cancel-settings"
                onClick={() => {
                  setNewsKey(config.newsApiKey);
                  setGeminiKey(config.geminiApiKey);
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Developer Bio Card (Resume & GitHub Ready) */}
      <div className="developer-card glass-card">
        <div className="dev-avatar">VS</div>
        <div className="dev-info">
          <h4>Vanshaj Saxena</h4>
          <p>Full Stack Engineer</p>
          <div className="dev-links">
            <a 
              href="https://github.com/your-username/news-sentiment-analyzer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-link"
              id="link-github-repo"
              title="View Source on GitHub"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              <span>Repository</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Controls: Theme Toggle & Branding */}
      <div className="sidebar-footer">
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary theme-toggle-btn"
          id="btn-theme-toggle"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div className="app-version">v1.0.0</div>
      </div>
    </aside>
  );
}
