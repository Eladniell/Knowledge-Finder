
import React, { useState } from 'react';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { Article } from '../types';
import ArticleEditor from './ArticleEditor';
import Dashboard from './Dashboard';
import ConfirmationDialog from './ConfirmationDialog';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

const AdminView: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useKnowledgeBase();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const handleOpenEditor = (article: Article | null) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditingArticle(null);
    setIsEditorOpen(false);
  };

  const handleSaveArticle = (article: Article) => {
    if (article.id) {
      updateArticle(article);
    } else {
      // It's a new article
      const { title, content, topic, tags, isPublished } = article;
      addArticle({ title, content, topic, tags, isPublished });
    }
    handleCloseEditor();
  };

  const handleTogglePublish = (article: Article) => {
    updateArticle({ ...article, isPublished: !article.isPublished });
  };
  
  const handleDeleteRequest = (id: string) => {
    setArticleToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      deleteArticle(articleToDelete);
    }
  };
  
  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setArticleToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Dashboard />

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-2xl font-bold text-brand-dark">Manage Articles</h2>
          <button
            onClick={() => handleOpenEditor(null)}
            className="mt-2 sm:mt-0 flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-brand-secondary rounded-md shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Article
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Topic</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Views</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Likes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{article.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{article.topic}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{article.viewCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{article.likes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(article.updatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleTogglePublish(article)} title={article.isPublished ? 'Unpublish' : 'Publish'}>
                       {article.isPublished ? <EyeOffIcon className="w-5 h-5 text-yellow-600 hover:text-yellow-800" /> : <EyeIcon className="w-5 h-5 text-green-600 hover:text-green-800" />}
                    </button>
                    <button onClick={() => handleOpenEditor(article)} title="Edit">
                      <EditIcon className="w-5 h-5 text-brand-secondary hover:text-brand-dark" />
                    </button>
                    <button onClick={() => handleDeleteRequest(article.id)} title="Delete">
                       <TrashIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditorOpen && <ArticleEditor article={editingArticle} onSave={handleSaveArticle} onClose={handleCloseEditor} />}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message="Are you sure you want to permanently delete this article? This action cannot be undone."
      />
    </div>
  );
};

export default AdminView;