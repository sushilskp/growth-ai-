import React, { useState } from 'react';
import { Edit3, Folder, FileText, MoreHorizontal, ArrowUpRight, RefreshCw, Plus } from 'lucide-react';
import { NewsItem } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface RightPanelProps {
    mobileHidden?: boolean;
}

const mockNews: NewsItem[] = [
  { id: '1', category: 'Tech', title: 'AI Startup funding hits record high in Q3', time: '2h ago', source: 'TechCrunch' },
  { id: '2', category: 'Marketing', title: '5 Strategies for B2B Growth in 2024', time: '4h ago', source: 'Forbes' },
  { id: '3', category: 'Local', title: 'New incubator opens in Downtown district', time: '5h ago', source: 'CityBiz' },
  { id: '4', category: 'Funding', title: 'Series A checklist for SaaS founders', time: '1d ago', source: 'VC Daily' },
];

const mockChartData = [
  { name: 'Mon', tasks: 2 },
  { name: 'Tue', tasks: 4 },
  { name: 'Wed', tasks: 3 },
  { name: 'Thu', tasks: 7 },
  { name: 'Fri', tasks: 5 },
  { name: 'Sat', tasks: 6 },
  { name: 'Sun', tasks: 8 },
];

const RightPanel: React.FC<RightPanelProps> = ({ mobileHidden = true }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Tech', 'Funding', 'Marketing'];

  const filteredNews = activeCategory === 'All' 
    ? mockNews 
    : mockNews.filter(n => n.category === activeCategory);

  return (
    <aside className={`
      w-80 glass-panel border-l border-white/10 flex-col gap-6 p-6 overflow-y-auto hidden xl:flex
      ${mobileHidden ? 'hidden xl:flex' : 'flex w-full'}
    `}>
      
      {/* User Header (Right) */}
      <div className="flex items-center justify-end gap-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-0.5 cursor-pointer hover:scale-105 transition-transform">
           <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
        </div>
      </div>

      {/* Today Note */}
      <div className="glass-card rounded-2xl p-5 relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-white font-semibold">Today note</h3>
          <button className="text-slate-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Meeting with the dev team at 2 PM. Review the new landing page designs <span className="inline-block animate-pulse">🏀</span>
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>20min ago</span>
          <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">I'm going</span>
        </div>
      </div>

      {/* My Files */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">My files</h3>
          <MoreHorizontal className="text-slate-500 w-4 h-4 cursor-pointer" />
        </div>
        <div className="flex flex-col gap-3 items-center justify-center py-6 border-2 border-dashed border-slate-700 rounded-xl hover:border-slate-500 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Folder className="text-blue-400 w-6 h-6" />
            </div>
            <span className="text-sm text-slate-400">No files uploaded yet</span>
        </div>
        <button className="w-full mt-4 py-2 flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
            <Plus className="w-4 h-4" /> Add file
        </button>
      </div>

      {/* Activity Chart */}
      <div className="glass-card rounded-2xl p-5">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Activity</h3>
            <button className="p-1.5 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/30">
                <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
         </div>
         <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                    <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} 
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
            </ResponsiveContainer>
         </div>
         <div className="mt-2 text-center text-xs text-slate-400">13 Tasks Completed this week 🚀</div>
      </div>

      {/* News Widget */}
      <div className="flex-1 flex flex-col min-h-0">
         <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold">Daily News</h3>
            <RefreshCw className="w-4 h-4 text-slate-500 cursor-pointer hover:rotate-180 transition-transform duration-500" />
         </div>
         
         {/* Filter Chips */}
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                    {cat}
                </button>
            ))}
         </div>

         <div className="space-y-3 overflow-y-auto pr-1">
            {filteredNews.map(news => (
                <div key={news.id} className="group cursor-pointer">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-blue-400 mb-1">{news.category}</span>
                        <span className="text-[10px] text-slate-500">{news.time}</span>
                    </div>
                    <h4 className="text-sm text-slate-200 font-medium leading-snug group-hover:text-blue-300 transition-colors">{news.title}</h4>
                    <span className="text-[10px] text-slate-600 mt-1 block">{news.source}</span>
                    <div className="h-[1px] bg-white/5 w-full mt-3 group-last:hidden"></div>
                </div>
            ))}
         </div>
      </div>

    </aside>
  );
};

export default RightPanel;
