
export interface Article {
  id: string;
  title: string;
  content: string;
  topic: string;
  tags: string[];
  createdAt: string; 
  updatedAt: string;
  isPublished: boolean;
  viewCount: number;
  likes: number;
}

export interface DashboardData {
  popularTopics: { topic: string; score: number }[];
  emergingTrends: string[];
}