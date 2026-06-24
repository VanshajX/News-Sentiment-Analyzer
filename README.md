# 📰 News Sentiment Analyzer & Analytics Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vanilla CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/TR/CSS/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A premium, interactive **News Sentiment Analyzer and Analytics Dashboard** designed to fetch, analyze, and visualize public sentiment across global news coverage. Built as a portfolio project, this application showcases advanced client-side natural language processing (NLP), dynamic data visualization, and an elegant Glassmorphism-style dark/light UI.

---

## ✨ Features

- **🔍 Live & Offline Modes**: 
  - **Local Mode**: Uses a rich, rule-based natural language processing engine and realistic mock data generator for instant out-of-the-box demonstration.
  - **Live Mode**: Fetches real-time headlines on any topic via integration with the **NewsAPI**.
- **🧠 Hybrid Sentiment Engine**:
  - Analyzes sentiment locally using a customized **AFINN-165** lexicon.
  - Generates detailed sentiment scores (Positive, Neutral, Negative) and highlights exact words carrying sentiment weight.
  - Maps text to 5 emotional dimensions: *Joy, Anger, Trust, Fear, and Sadness*.
  - *Optional*: Integrate the **Gemini API** for advanced summary generation and semantic emotion extraction.
- **📊 Rich Interactive Visualizations**:
  - **Sentiment Trend over Time**: Visualize daily sentiment peaks and troughs.
  - **Source Sentiment Bias**: Compare sentiment distribution across popular outlets (e.g., BBC vs. TechCrunch).
  - **Impact Words**: Detailed charts showing the most frequent positive and negative terms.
- **🎨 State-of-the-art UI/UX**:
  - Elegant glassmorphism theme using HSL CSS variables.
  - Smooth light/dark mode transitions.
  - Responsive layout tailored for mobile, tablet, and desktop screens.
  - Fluid micro-animations for card hovers, modal popups, and layout changes.

---

## 🛠️ Tech Stack & Libraries

- **Frontend Framework**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphic effects)
- **Data Visualization**: Chart.js + React-Chartjs-2
- **Icons**: Lucide React

---

## 📂 Project Structure

```text
news-sentiment-analyzer/
├── public/
├── src/
│   ├── components/            # UI Components
│   │   ├── AnalyticsCharts.tsx # Chart wrappers (Line, Bar, Radar)
│   │   ├── ArticleCard.tsx    # Card layout for news articles
│   │   ├── ArticleModal.tsx   # Detailed analysis view
│   │   ├── Dashboard.tsx      # Main application page
│   │   └── Sidebar.tsx        # Configuration & API settings panel
│   ├── services/              # Logic & Data fetching
│   │   ├── mockData.ts        # Dynamic realistic article generator
│   │   ├── newsApi.ts         # NewsAPI connection client
│   │   └── sentimentEngine.ts # AFINN NLP sentiment analysis engine
│   ├── types/                 # TypeScript models
│   │   └── index.ts
│   ├── App.tsx                # App shell
│   ├── index.css              # Custom CSS Design System
│   └── main.tsx               # App entrypoint
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/news-sentiment-analyzer.git
   cd news-sentiment-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified in terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Configuration & API Integration

Out of the box, the app runs in **Offline / Local Demo Mode** which requires no configuration or API keys. If you want to configure real-time feeds:

1. Click the **Settings Gear** icon in the sidebar.
2. Obtain a free API key from [NewsAPI.org](https://newsapi.org/) and enter it in the **NewsAPI Key** field.
3. Optionally, get an API key from Google AI Studio for [Gemini API](https://aistudio.google.com/) and paste it to enable advanced summary and semantic analytics.
4. Toggle **Live Mode** to fetch live headlines.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Created by

* **Your Name** - *Initial Work* - [GitHub Profile](https://github.com/your-username)
