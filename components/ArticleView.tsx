
import React, { useState } from 'react';
import { Article } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import EyeIcon from './icons/EyeIcon';
import ClockIcon from './icons/ClockIcon';
import ThumbUpIcon from './icons/ThumbUpIcon';
import ShareIcon from './icons/ShareIcon';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
  onLike: (id: string) => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose, onLike }) => {
  const [copied, setCopied] = useState(false);

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 225;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleShare = () => {
    // In a real app, this would be a direct link to the article.
    navigator.clipboard.writeText(`Check out this article in our knowledge base: "${article.title}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-brand-dark">{article.title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                <span>Topic: <span className="font-semibold text-brand-secondary">{article.topic}</span></span>
                <span>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4 border-b pb-4">
                <span className="flex items-center gap-1.5">
                    <EyeIcon className="w-4 h-4" />
                    {article.viewCount} views
                </span>
                <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    {calculateReadTime(article.content)}
                </span>
                <span className="flex items-center gap-1.5">
                    <ThumbUpIcon className="w-4 h-4" />
                    {article.likes} likes
                </span>
            </div>
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{article.content}</p>
        </main>
        <footer className="p-4 bg-slate-50 border-t flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="bg-slate-200 rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onLike(article.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-secondary bg-brand-light rounded-md hover:bg-blue-200 transition-colors"
            >
              <ThumbUpIcon className="w-5 h-5" />
              <span>Like</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArticleView;
