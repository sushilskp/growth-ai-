import React, { useState } from 'react';
import { Save, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { saveUser } from '../services/storageService';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [interests, setInterests] = useState<string[]>(user.interests || []);

  const availableInterests = ['SaaS', 'FinTech', 'AI/ML', 'E-commerce', 'HealthTech', 'EdTech', 'Web3'];

  const handleSave = () => {
    const updatedUser = { ...user, name, bio, interests };
    saveUser(updatedUser);
    onUpdate(updatedUser);
    alert("Profile saved!");
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-white mb-8">My Profile</h2>
      
      <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-6">
         {/* Avatar Placeholder */}
         <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-500 transition-colors">
                <UserIcon className="w-10 h-10 text-slate-500" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white">Change</span>
                </div>
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Full Name</label>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
         </div>

         <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Bio / About</label>
            <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                placeholder="Tell us about your startup goals..."
            />
         </div>

         <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">Startup Interests</label>
            <div className="flex flex-wrap gap-2">
                {availableInterests.map(interest => (
                    <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${interests.includes(interest) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                        {interest}
                    </button>
                ))}
            </div>
         </div>

         <div className="pt-4">
            <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
            >
                <Save className="w-5 h-5" /> Save Changes
            </button>
         </div>
      </div>
    </div>
  );
};

export default Profile;
