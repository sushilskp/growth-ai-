export interface User {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  interests?: string[];
}

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  tags: string[];
  likes: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  time: string;
  source: string;
}

export enum Page {
  Dashboard = 'Dashboard',
  Tasks = 'Tasks',
  Community = 'Community',
  Profile = 'Profile',
  Settings = 'Settings',
}
