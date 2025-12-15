import { User, Task, Post } from '../types';

export const saveUser = (user: User) => {
  localStorage.setItem('sessionUser', JSON.stringify(user));
  localStorage.setItem(`profile_${user.email}`, JSON.stringify(user));
};

export const getSessionUser = (): User | null => {
  const userStr = localStorage.getItem('sessionUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('sessionUser');
};

export const getUserTasks = (email: string): Task[] => {
  const tasksStr = localStorage.getItem(`tasks_${email}`);
  return tasksStr ? JSON.parse(tasksStr) : [];
};

export const saveUserTasks = (email: string, tasks: Task[]) => {
  localStorage.setItem(`tasks_${email}`, JSON.stringify(tasks));
};

export const getUserPosts = (email: string): Post[] => {
  const postsStr = localStorage.getItem(`posts_${email}`);
  return postsStr ? JSON.parse(postsStr) : [];
};

export const saveUserPosts = (email: string, posts: Post[]) => {
  localStorage.setItem(`posts_${email}`, JSON.stringify(posts));
};
