import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Article } from '../types';

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Q3 Sales Strategy & Goals',
    content: 'Our main goal for Q3 is to increase enterprise sales by 20%. Key strategies include focusing on the European market, offering bundled discounts, and leveraging our new CRM features. All sales teams should review the attached presentation for detailed targets.',
    topic: 'Sales',
    tags: ['goals', 'strategy', 'q3', 'enterprise'],
    createdAt: '2023-07-15T10:00:00Z',
    updatedAt: '2023-07-16T11:30:00Z',
    isPublished: true,
    viewCount: 152,
    likes: 45,
  },
  {
    id: '2',
    title: 'Onboarding New Remote Employees',
    content: 'This guide outlines the complete process for onboarding remote employees. It covers IT setup, initial meetings, mentorship programs, and first-week objectives. HR managers are responsible for initiating the process at least one week before the start date.',
    topic: 'HR Policies',
    tags: ['onboarding', 'remote work', 'hr'],
    createdAt: '2023-08-01T14:00:00Z',
    updatedAt: '2023-08-01T14:00:00Z',
    isPublished: true,
    viewCount: 210,
    likes: 82,
  },
  {
    id: '3',
    title: 'Troubleshooting API Connection Errors',
    content: 'When encountering a 401 Unauthorized error, first verify the API key. For 503 Service Unavailable, check the status page for ongoing incidents. This document contains a comprehensive list of error codes and their solutions.',
    topic: 'Technical Support',
    tags: ['api', 'troubleshooting', 'errors'],
    createdAt: '2023-08-20T09:25:00Z',
    updatedAt: '2023-08-22T16:45:00Z',
    isPublished: true,
    viewCount: 345,
    likes: 120,
  },
  {
    id: '4',
    title: 'Alpha Project Retrospective (Draft)',
    content: 'Initial thoughts on the Alpha Project. What went well: team collaboration, agile methodology. What could be improved: initial requirement gathering, stakeholder communication. This is a draft for internal discussion only.',
    topic: 'Project Management',
    tags: ['retrospective', 'alpha project'],
    createdAt: '2023-09-05T18:00:00Z',
    updatedAt: '2023-09-05T18:00:00Z',
    isPublished: false,
    viewCount: 15,
    likes: 5,
  },
  {
    id: '5',
    title: 'Using the New Expense Reporting System',
    content: 'All employees must use the new "ExpenseFlow" system for submitting expenses starting October 1st. This guide provides a step-by-step walkthrough, from logging in to submitting a report for approval. Please complete the mandatory training by September 25th.',
    topic: 'HR Policies',
    tags: ['expenses', 'finance', 'guide'],
    createdAt: '2023-09-10T11:00:00Z',
    updatedAt: '2023-09-10T11:00:00Z',
    isPublished: true,
    viewCount: 480,
    likes: 98,
  }
];

interface KnowledgeBaseContextType {
  articles: Article[];
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes'>) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  getArticle: (id: string) => Article | undefined;
  incrementViewCount: (id: string) => void;
  likeArticle: (id: string) => void;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);

  const addArticle = useCallback((articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes'>) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likes: 0,
    };
    setArticles(prev => [newArticle, ...prev]);
  }, []);

  const updateArticle = useCallback((updatedArticle: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? { ...updatedArticle, updatedAt: new Date().toISOString() } : a));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  }, []);
  
  const getArticle = useCallback((id: string) => articles.find(a => a.id === id), [articles]);

  const incrementViewCount = useCallback((id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, viewCount: a.viewCount + 1 } : a));
  }, []);
  
  const likeArticle = useCallback((id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
  }, []);

  return React.createElement(KnowledgeBaseContext.Provider, {
    value: { 
      articles, 
      addArticle, 
      updateArticle, 
      deleteArticle, 
      getArticle, 
      incrementViewCount,
      likeArticle 
    }
  }, children);
};

export const useKnowledgeBase = (): KnowledgeBaseContextType => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};