import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Calendar } from 'lucide-react';
import { Task, User } from '../types';
import { getUserTasks, saveUserTasks } from '../services/storageService';

interface TasksProps {
  user: User;
}

const Tasks: React.FC<TasksProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Done'>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  useEffect(() => {
    setTasks(getUserTasks(user.email));
  }, [user.email]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: new Date().toLocaleDateString(),
      completed: false
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveUserTasks(user.email, updated);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    saveUserTasks(user.email, updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveUserTasks(user.email, updated);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Done') return t.completed;
    return true;
  });

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (p === 'Medium') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-green-400 bg-green-400/10 border-green-400/20';
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white mb-1">My Tasks</h2>
           <p className="text-slate-400">Keep track of your startup journey</p>
        </div>
        
        <div className="glass-card p-1 rounded-lg flex gap-1">
            {['All', 'Active', 'Done'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      {/* Add Task Input */}
      <div className="glass-card p-4 rounded-xl mb-6 border border-white/10 flex flex-col md:flex-row gap-3 items-center shadow-lg">
         <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-lg"
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
         />
         <div className="flex gap-2 w-full md:w-auto">
             <select
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
             >
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
             </select>
             <button
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
             >
                <Plus className="w-4 h-4" /> Add
             </button>
         </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
         {filteredTasks.length === 0 ? (
             <div className="text-center text-slate-500 py-10">No tasks found. Get to work! 🚀</div>
         ) : (
             filteredTasks.map(task => (
                <div key={task.id} className="group glass-card p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => toggleTask(task.id)} className="text-slate-500 hover:text-blue-400 transition-colors">
                            {task.completed ? <CheckCircle className="w-6 h-6 text-blue-500" /> : <Circle className="w-6 h-6" />}
                        </button>
                        <div>
                            <h3 className={`font-medium text-lg ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {task.dueDate}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
             ))
         )}
      </div>
    </div>
  );
};

export default Tasks;
