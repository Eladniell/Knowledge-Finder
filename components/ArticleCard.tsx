
import React from 'react';
import { Article } from '../types';
import EyeIcon from './icons/EyeIcon';
import ClockIcon from './icons/ClockIcon';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 225;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col"
      onClick={() => onSelect(article)}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-center justify-between mb-2">
           <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-secondary bg-brand-light">
             {article.topic}
           </span>
           <span className="text-xs text-slate-500">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <h3 className="text-lg font-bold text-brand-dark mb-2">{article.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-3">
          {article.content}
        </p>
      </div>
      <div className="px-6 pt-4 pb-6 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1.5">
            <EyeIcon className="w-4 h-4" />
            {article.viewCount} views
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4" />
            {calculateReadTime(article.content)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="bg-slate-200 rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
