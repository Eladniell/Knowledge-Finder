import React, { useState, useMemo } from 'react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import ArticleView from './ArticleView';
import MagnifyingGlassIcon from './icons/MagnifyingGlassIcon';
import FireIcon from './icons/FireIcon';

const UserView: React.FC = () => {
  const { articles, incrementViewCount, likeArticle } = useKnowledgeBase();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  
  const publishedArticles = useMemo(() => articles.filter(a => a.isPublished), [articles]);

  const mostViewedArticles = useMemo(() => {
    return [...publishedArticles]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 4);
  }, [publishedArticles]);

  const allTopics = useMemo(() => ['All', ...new Set(publishedArticles.map(a => a.topic))], [publishedArticles]);
  const allTags = useMemo(() => ['All', ...new Set(publishedArticles.flatMap(a => a.tags))], [publishedArticles]);
  
  const filteredArticles = useMemo(() => {
    const filtered = publishedArticles.filter(article => {
      const searchMatch = searchTerm.toLowerCase() === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const topicMatch = selectedTopic === 'All' || article.topic === selectedTopic;
      const tagMatch = selectedTag === 'All' || article.tags.includes(selectedTag);

      return searchMatch && topicMatch && tagMatch;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'views-desc':
        sorted.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'views-asc':
        sorted.sort((a, b) => a.viewCount - b.viewCount);
        break;
      case 'date-desc':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return sorted;
  }, [publishedArticles, searchTerm, selectedTopic, selectedTag, sortBy]);

  const handleSelectArticle = (article: Article) => {
    incrementViewCount(article.id);
    setSelectedArticle(article);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-brand-dark tracking-tight sm:text-5xl">Knowledge Base</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">Find answers, guides, and best practices.</p>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-16 bg-slate-50/80 backdrop-blur-sm z-10 py-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-slate-700 mb-1">Search Articles</label>
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                id="search-input"
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border bg-white border-slate-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-full sm:flex-1">
              <label htmlFor="topic-select" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
              <select id="topic-select" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} className="w-full border bg-white border-slate-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary py-2 px-3">
                {allTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </div>
            <div className="w-full sm:flex-1">
              <label htmlFor="tag-select" className="block text-sm font-medium text-slate-700 mb-1">Tag</label>
              <select id="tag-select" value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="w-full border bg-white border-slate-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary py-2 px-3">
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>
            <div className="w-full sm:flex-1">
              <label htmlFor="sort-by-select" className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
              <select id="sort-by-select" value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full border bg-white border-slate-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary py-2 px-3">
                <option value="date-desc">Date: Newest</option>
                <option value="date-asc">Date: Oldest</option>
                <option value="title-asc">Title: A-Z</option>
                <option value="title-desc">Title: Z-A</option>
                <option value="views-desc">Popularity: Most Viewed</option>
                <option value="views-asc">Popularity: Least Viewed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Grid Header */}
      <div className="border-b border-slate-200 mb-8 pb-2">
        <h2 className="text-3xl font-bold text-brand-dark">All Articles</h2>
      </div>
      
      {/* Article Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} onSelect={handleSelectArticle} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <p className="text-slate-500">No articles found. Try adjusting your search or filters.</p>
         </div>
      )}

      {/* Trending Articles Section */}
      {mostViewedArticles.length > 0 && (
        <React.Fragment>
          <div className="mt-12 border-t border-slate-200" />
          <div className="mt-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <FireIcon className="w-6 h-6 text-orange-500" />
                Trending Articles
              </h2>
              <ol className="space-y-1">
                {mostViewedArticles.map((article, index) => (
                  <li key={article.id}>
                     <div 
                       onClick={() => handleSelectArticle(article)}
                       className="flex items-baseline justify-between p-3 rounded-md cursor-pointer hover:bg-slate-100 transition-colors duration-200 group"
                     >
                        <div className="flex items-baseline">
                           <span className="text-lg font-bold text-slate-400 mr-4">{index + 1}</span>
                           <span className="font-semibold text-slate-700 group-hover:text-brand-secondary">{article.title}</span>
                        </div>
                        <span className="text-sm text-slate-500 hidden sm:block">{article.viewCount} views</span>
                     </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </React.Fragment>
      )}

      {selectedArticle && <ArticleView article={selectedArticle} onClose={() => setSelectedArticle(null)} onLike={likeArticle} />}
    </div>
  );
};

export default UserView;