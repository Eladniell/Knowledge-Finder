
import React, { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { analyzeTopicsAndTrends } from '../services/geminiService';
import { DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const { articles } = useKnowledgeBase();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeTopicsAndTrends(articles);
      setData(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [articles]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-bold text-brand-dark">AI-Powered Dashboard</h2>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="mt-2 sm:mt-0 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-brand-secondary rounded-md shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      {!data && !isLoading && (
         <div className="text-center py-10 px-4 bg-brand-light rounded-lg">
           <h3 className="text-lg font-medium text-brand-dark">Ready for Insights?</h3>
           <p className="mt-1 text-sm text-slate-600">Click "Generate Insights" to use Gemini to analyze your knowledge base and reveal popular topics and emerging trends.</p>
         </div>
      )}

      {isLoading && <div className="text-center py-10">Loading...</div>}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Popular Topics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.popularTopics} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip wrapperClassName="!bg-white !border-slate-300 !rounded-md !shadow-lg" />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Popularity Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Emerging Trends</h3>
            <ul className="space-y-2">
              {data.emergingTrends.map((trend, index) => (
                <li key={index} className="bg-slate-100 p-3 rounded-md text-sm">{trend}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
