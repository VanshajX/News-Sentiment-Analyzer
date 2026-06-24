import type { SentimentResult, Emotions } from '../types';

// Curated AFINN-165 Lexicon for client-side NLP
const AFINN_LEXICON: Record<string, number> = {
  // Strong positive words (+4 to +5)
  'excellent': 5, 'outstanding': 5, 'amazing': 4, 'wonderful': 4, 'fantastic': 4,
  'superb': 5, 'breakthrough': 4, 'triumph': 4, 'masterpiece': 5, 'love': 4,
  'spectacular': 4, 'breathtaking': 5, 'glorious': 4, 'brilliant': 4, 'perfect': 5,
  
  // Positive words (+2 to +3)
  'good': 3, 'great': 3, 'boost': 3, 'growth': 3, 'win': 4, 'won': 3, 'success': 3,
  'successful': 3, 'innovative': 3, 'gain': 2, 'gains': 2, 'profit': 2, 'lucrative': 3,
  'rise': 2, 'rising': 2, 'support': 2, 'supported': 2, 'supporting': 2, 'agree': 2,
  'agreement': 2, 'advance': 2, 'advanced': 2, 'benefit': 2, 'beneficial': 2,
  'improve': 2, 'improved': 2, 'improvement': 2, 'optimistic': 2, 'hopeful': 2,
  'secure': 2, 'secured': 2, 'safe': 2, 'safety': 2, 'progress': 2, 'progressive': 2,
  'resolve': 2, 'resolved': 2, 'strong': 2, 'strengthen': 2, 'strength': 2,
  'leader': 2, 'leading': 3, 'top': 2, 'popular': 2, 'expansion': 2, 'expand': 2,
  'trust': 3, 'trusted': 3, 'valuable': 2, 'value': 2, 'smart': 2, 'creative': 2,
  
  // Mild positive words (+1)
  'like': 1, 'liked': 1, 'interest': 1, 'interested': 1, 'interesting': 1,
  'hope': 1, 'help': 1, 'helped': 1, 'helper': 1, 'easy': 1, 'clean': 1,
  
  // Neutral/mild indicators (handled by algorithm or given 0)
  
  // Mild negative words (-1)
  'warn': -1, 'warned': -1, 'warning': -1, 'warnings': -1, 'dispute': -1,
  'disputed': -1, 'slow': -1, 'slowing': -1, 'sluggish': -1, 'drop': -1,
  'dropped': -1, 'falling': -1, 'fall': -1, 'risk': -2, 'risky': -2,
  'difficult': -1, 'difficulty': -1, 'concern': -1, 'concerned': -1,
  
  // Negative words (-2 to -3)
  'bad': -3, 'worse': -3, 'loss': -3, 'losses': -3, 'fail': -2, 'failed': -2,
  'failure': -2, 'crash': -2, 'crashed': -2, 'crisis': -3, 'threat': -2,
  'threaten': -2, 'threatened': -2, 'decline': -2, 'declined': -2, 'declining': -2,
  'worry': -2, 'worried': -2, 'fear': -2, 'fearful': -2, 'protest': -2,
  'protested': -2, 'protesting': -2, 'clash': -2, 'clashed': -2, 'clashing': -2,
  'deny': -2, 'denied': -2, 'blame': -2, 'blamed': -2, 'accuse': -2,
  'accused': -2, 'reject': -2, 'rejected': -2, 'strike': -2, 'strikes': -2,
  'damage': -3, 'damaged': -3, 'hurt': -2, 'hurts': -2, 'critical': -2,
  
  // Strong negative words (-4 to -5)
  'terrible': -4, 'awful': -4, 'worst': -5, 'hate': -4, 'devastating': -4,
  'devastated': -4, 'catastrophe': -5, 'catastrophic': -5, 'disaster': -5,
  'disastrous': -5, 'tragedy': -4, 'tragic': -4, 'ruin': -4, 'ruined': -4,
  'illegal': -4, 'fraud': -4, 'scam': -4, 'bankrupt': -4, 'bankruptcy': -4
};

// Common stopwords to filter out for keyword extraction
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd',
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn',
  'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn',
  'weren', 'won', 'wouldn', 'new', 'news', 'says', 'said', 'also', 'u', 'us', 'say'
]);

/**
 * Local Lexicon Sentiment Analyzer
 */
export function analyzeSentimentLocally(text: string): SentimentResult {
  if (!text) {
    return {
      score: 0,
      comparative: 0,
      type: 'neutral',
      positiveWords: [],
      negativeWords: [],
      emotions: { joy: 0.1, anger: 0.1, trust: 0.2, fear: 0.1, sadness: 0.1 },
      keywords: []
    };
  }

  // Clean and tokenize text
  const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n]/g, ' ').toLowerCase();
  const words = cleanText.split(/\s+/).filter(w => w.length > 1);
  
  let score = 0;
  const positiveWords: string[] = [];
  const negativeWords: string[] = [];

  // Emotion count trackers
  let joyScore = 0;
  let angerScore = 0;
  let trustScore = 0;
  let fearScore = 0;
  let sadnessScore = 0;

  words.forEach(word => {
    if (AFINN_LEXICON.hasOwnProperty(word)) {
      const val = AFINN_LEXICON[word];
      score += val;
      if (val > 0) {
        positiveWords.push(word);
        
        // Emotion heuristics based on word meaning
        if (['excellent', 'outstanding', 'amazing', 'wonderful', 'fantastic', 'superb', 'breakthrough', 'triumph', 'love', 'perfect', 'win', 'won', 'success', 'successful'].includes(word)) {
          joyScore += 3;
        } else {
          joyScore += 1;
        }
        
        if (['support', 'trusted', 'trust', 'secure', 'safe', 'safety', 'agree', 'agreement'].includes(word)) {
          trustScore += 2.5;
        } else {
          trustScore += 1;
        }
      } else if (val < 0) {
        negativeWords.push(word);
        
        if (['threat', 'threaten', 'risk', 'risky', 'crisis', 'warn', 'warning', 'warnings', 'fear', 'fearful', 'crash', 'crashed', 'panic'].includes(word)) {
          fearScore += 3;
        } else {
          fearScore += 1;
        }

        if (['blame', 'blamed', 'dispute', 'disputed', 'protest', 'protesting', 'clash', 'clashed', 'clashing', 'accuse', 'accused', 'reject', 'rejected', 'bad', 'worse', 'worst'].includes(word)) {
          angerScore += 2.5;
        } else {
          angerScore += 0.8;
        }

        if (['loss', 'losses', 'fail', 'failed', 'failure', 'decline', 'declining', 'declined', 'devastating', 'tragedy', 'tragic', 'sad', 'bankrupt', 'bankruptcy'].includes(word)) {
          sadnessScore += 3;
        } else {
          sadnessScore += 1;
        }
      }
    }
  });

  const comparative = words.length > 0 ? score / words.length : 0;
  let type: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 0) type = 'positive';
  if (score < 0) type = 'negative';

  // Normalize emotions into ratios summing to 1 (plus background baseline)
  const totalEmotionWeight = joyScore + angerScore + trustScore + fearScore + sadnessScore;
  let emotions: Emotions;

  if (totalEmotionWeight > 0) {
    emotions = {
      joy: Math.min(0.9, parseFloat((joyScore / totalEmotionWeight * 0.8 + 0.1).toFixed(2))),
      anger: Math.min(0.9, parseFloat((angerScore / totalEmotionWeight * 0.8 + 0.1).toFixed(2))),
      trust: Math.min(0.9, parseFloat((trustScore / totalEmotionWeight * 0.8 + 0.1).toFixed(2))),
      fear: Math.min(0.9, parseFloat((fearScore / totalEmotionWeight * 0.8 + 0.1).toFixed(2))),
      sadness: Math.min(0.9, parseFloat((sadnessScore / totalEmotionWeight * 0.8 + 0.1).toFixed(2)))
    };
  } else {
    // Default fallback based on overall sentiment type
    if (type === 'positive') {
      emotions = { joy: 0.5, anger: 0.1, trust: 0.5, fear: 0.1, sadness: 0.1 };
    } else if (type === 'negative') {
      emotions = { joy: 0.1, anger: 0.4, trust: 0.1, fear: 0.5, sadness: 0.4 };
    } else {
      emotions = { joy: 0.2, anger: 0.1, trust: 0.3, fear: 0.2, sadness: 0.1 };
    }
  }

  // Extract top keywords (highest frequency nouns/adjectives, filtering stopwords)
  const keywordFreq: Record<string, number> = {};
  words.forEach(word => {
    if (!STOP_WORDS.has(word) && word.length > 2) {
      keywordFreq[word] = (keywordFreq[word] || 0) + 1;
    }
  });

  const keywords = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);

  return {
    score,
    comparative,
    type,
    positiveWords: Array.from(new Set(positiveWords)),
    negativeWords: Array.from(new Set(negativeWords)),
    emotions,
    keywords
  };
}

/**
 * Advanced Sentiment Analyzer using Gemini API (via client-side fetch)
 */
export async function analyzeSentimentWithGemini(
  title: string,
  description: string,
  content: string,
  apiKey: string
): Promise<Partial<SentimentResult>> {
  try {
    const fullText = `Title: ${title}\nDescription: ${description}\nContent Snippet: ${content}`;
    const prompt = `
You are an expert NLP model. Analyze the sentiment of the following news article.
Article:
"""
${fullText}
"""

Provide your analysis in STRICT JSON format, following this exact schema:
{
  "score": <number from -10 to 10 depending on intensity, where negative values represent negative sentiment and positive values represent positive sentiment>,
  "type": <"positive" or "negative" or "neutral">,
  "positiveWords": [<array of positive words found in the text>],
  "negativeWords": [<array of negative words found in the text>],
  "emotions": {
    "joy": <float from 0.0 to 1.0 representing joy intensity>,
    "anger": <float from 0.0 to 1.0 representing anger intensity>,
    "trust": <float from 0.0 to 1.0 representing trust intensity>,
    "fear": <float from 0.0 to 1.0 representing fear intensity>,
    "sadness": <float from 0.0 to 1.0 representing sadness intensity>
  },
  "summary": "<a concise 1-2 sentence professional summary of why this sentiment score was given and what the news is about>",
  "keywords": [<array of 3-5 main entities/keywords/topics in the text>]
}
Return only the raw JSON. Do not include markdown code block characters like \`\`\`json.
`;

    const modelName = 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("Empty response from Gemini API");
    }

    // Clean markdown code blocks if the model returned them
    const cleanJsonString = generatedText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsedResult = JSON.parse(cleanJsonString);

    // Compute comparative based on score
    const scoreVal = parsedResult.score || 0;
    const comparativeVal = scoreVal / 10; // Normalized mapping

    return {
      score: scoreVal,
      comparative: comparativeVal,
      type: parsedResult.type || 'neutral',
      positiveWords: parsedResult.positiveWords || [],
      negativeWords: parsedResult.negativeWords || [],
      emotions: parsedResult.emotions || { joy: 0.1, anger: 0.1, trust: 0.2, fear: 0.1, sadness: 0.1 },
      summary: parsedResult.summary || '',
      keywords: parsedResult.keywords || []
    };
  } catch (error) {
    console.error("Failed to analyze sentiment with Gemini API, falling back to local engine:", error);
    // Return empty fallback so the caller knows it failed and can fall back to local analysis
    return {};
  }
}
