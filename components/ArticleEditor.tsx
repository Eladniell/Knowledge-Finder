import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface ArticleEditorProps {
  article: Article | null;
  onSave: (article: Article) => void;
  onClose: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setTopic(article.topic);
      setTags(article.tags.join(', '));
      setIsPublished(article.isPublished);
    } else {
      setTitle('');
      setContent('');
      setTopic('');
      setTags('');
      setIsPublished(false);
    }
    setError(null);
  }, [article]);

  const handleValidation = () => {
    const missingFields: string[] = [];
    if (!title.trim()) missingFields.push('Title');
    if (!content.trim()) missingFields.push('Content');
    if (!topic.trim()) missingFields.push('Topic');

    if (missingFields.length > 0) {
      setError(`Please fill in the required fields: ${missingFields.join(', ')}.`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSave = () => {
    if (!handleValidation()) return;
    onSave({
      ...(article || { id: '', createdAt: '', updatedAt: '', viewCount: 0, likes: 0 }),
      title,
      content,
      topic,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublished,
    });
  };
  
  const handleSaveDraft = () => {
    if (!handleValidation()) return;
    onSave({
      ...(article || { id: '', createdAt: '', updatedAt: '', viewCount: 0, likes: 0 }),
      title,
      content,
      topic,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublished: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{article ? 'Edit Article' : 'Create New Article'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Action Required</p>
              <p>{error}</p>
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 bg-white shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700">Topic</label>
            <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 bg-white shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="mt-1 block w-full rounded-md border border-slate-300 bg-white shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm"></textarea>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Tags (comma-separated)</label>
            <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 bg-white shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="published" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-secondary focus:ring-brand-secondary" />
            <label htmlFor="published" className="ml-2 block text-sm text-slate-900">Publish Article</label>
          </div>
        </main>
        <footer className="p-4 bg-slate-50 border-t flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">Cancel</button>
          <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 border border-transparent rounded-md shadow-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">Save Draft</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-brand-secondary border border-transparent rounded-md shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary">Save Article</button>
        </footer>
      </div>
    </div>
  );
};

export default ArticleEditor;