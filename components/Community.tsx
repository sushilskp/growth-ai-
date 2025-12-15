import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Tag, Send } from 'lucide-react';
import { Post, User } from '../types';
import { getUserPosts, saveUserPosts } from '../services/storageService';

interface CommunityProps {
  user: User;
}

const Community: React.FC<CommunityProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  // Initial dummy posts to populate feed
  const dummyPosts: Post[] = [
    {
      id: 'd1', author: 'Sarah J.', content: 'Just launched my MVP for the AI plant waterer! 🌿 Check it out.',
      tags: ['Launch', 'MVP'], likes: 24, timestamp: '2h ago'
    },
    {
      id: 'd2', author: 'Mike Ross', content: 'Looking for a co-founder with React Native experience. DM me!',
      tags: ['CoFounder', 'Hiring'], likes: 12, timestamp: '5h ago'
    }
  ];

  useEffect(() => {
    // Merge user posts with dummy posts for the demo feed
    const userStoredPosts = getUserPosts(user.email);
    setPosts([...userStoredPosts, ...dummyPosts]);
  }, [user.email]);

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: user.name,
      content: newPostContent,
      tags: ['General'],
      likes: 0,
      timestamp: 'Just now'
    };

    const userStored = getUserPosts(user.email);
    const updatedUserPosts = [newPost, ...userStored];
    saveUserPosts(user.email, updatedUserPosts);
    
    // Update local view
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto w-full h-full flex flex-col">
       <div className="mb-8">
           <h2 className="text-3xl font-bold text-white mb-1">Community</h2>
           <p className="text-slate-400">Connect with fellow founders</p>
       </div>

       {/* Create Post */}
       <div className="glass-card p-6 rounded-2xl mb-8 border border-white/10 shadow-xl">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                {user.name.charAt(0)}
             </div>
             <div className="flex-1">
                <textarea
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    placeholder="Share your startup journey..."
                    className="w-full bg-slate-800/50 rounded-xl p-4 text-white placeholder-slate-500 border border-white/5 focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center mt-3">
                   <div className="flex gap-2">
                       <button className="text-slate-400 hover:text-blue-400 transition-colors"><Tag className="w-5 h-5" /></button>
                   </div>
                   <button 
                     onClick={handlePost}
                     className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                   >
                     Post <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Feed */}
       <div className="space-y-6 overflow-y-auto pb-6">
          {posts.map(post => (
             <div key={post.id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                      {post.author.charAt(0)}
                   </div>
                   <div>
                      <h4 className="text-white font-medium">{post.author}</h4>
                      <span className="text-xs text-slate-500">{post.timestamp}</span>
                   </div>
                </div>
                <p className="text-slate-200 leading-relaxed mb-4">{post.content}</p>
                <div className="flex gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/10">#{tag}</span>
                    ))}
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors group"
                    >
                        <Heart className="w-5 h-5 group-hover:fill-current" /> 
                        <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                        <MessageSquare className="w-5 h-5" /> 
                        <span className="text-sm">Comment</span>
                    </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Community;
