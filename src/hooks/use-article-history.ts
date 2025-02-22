import { useEffect, useState } from 'react';

interface ArticleHistory {
  readArticles: Set<string>;
  lastRefreshTime: number;
}

const HISTORY_KEY = 'article_history';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useArticleHistory = () => {
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

  // Load history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const { readArticles: saved, lastRefreshTime } = JSON.parse(savedHistory);
        
        // Check if cache should be invalidated
        const now = Date.now();
        if (now - lastRefreshTime > CACHE_DURATION) {
          // Clear history if cache duration exceeded
          clearHistory();
        } else {
          setReadArticles(new Set(saved));
        }
      }
    };

    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    const history: ArticleHistory = {
      readArticles: new Set(Array.from(readArticles)),
      lastRefreshTime: Date.now()
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify({
      readArticles: Array.from(readArticles),
      lastRefreshTime: history.lastRefreshTime
    }));
  }, [readArticles]);

  const markAsRead = (articleId: string) => {
    setReadArticles(prev => new Set([...prev, articleId]));
  };

  const markAllAsRead = (articleIds: string[]) => {
    setReadArticles(prev => new Set([...prev, ...articleIds]));
  };

  const clearHistory = () => {
    setReadArticles(new Set());
    localStorage.removeItem(HISTORY_KEY);
  };

  const isArticleRead = (articleId: string) => {
    return readArticles.has(articleId);
  };

  return {
    readArticles,
    markAsRead,
    markAllAsRead,
    clearHistory,
    isArticleRead
  };
};