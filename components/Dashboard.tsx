import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, Bot, User as UserIcon, Image as ImageIcon } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage, User } from '../types';
import { GenerateContentResponse } from "@google/genai";

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Hi ${user.name}! I'm your startup assistant. Need a business idea, a marketing strategy, or just want to chat about your goals?`, timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Create a placeholder for the bot's response
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      const stream = await streamChatResponse(text, history);
      
      let fullText = '';
      for await (const chunk of stream) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
             fullText += c.text;
             setMessages(prev => prev.map(msg => 
                 msg.id === botMsgId ? { ...msg, text: fullText } : msg
             ));
         }
      }

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having trouble connecting right now. Please check your API key setup.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "Generate a startup idea",
    "Create a pricing model",
    "Draft a pitch deck outline",
    "Marketing plan for SaaS"
  ];

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Stars Background Effect for this section */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)' }}></div>

      <div className="flex-none p-6 md:p-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-2">
            Make Things Simple!
        </h1>
        <p className="text-slate-400 max-w-lg">Management and planning in a simple and attractive style will bring you success.</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-4 md:px-8 pb-6 z-10 max-w-5xl w-full mx-auto">
        <div className="glass-card flex-1 rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-white/10">
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'model' ? 'bg-blue-600 shadow-lg shadow-blue-500/40' : 'bg-slate-700'}`}>
                            {msg.role === 'model' ? <Bot className="w-5 h-5 text-white" /> : <UserIcon className="w-5 h-5 text-slate-300" />}
                        </div>
                        <div className={`
                            p-4 rounded-2xl max-w-[80%] leading-relaxed text-sm shadow-md
                            ${msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5'}
                        `}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/50 border-t border-white/5 backdrop-blur-md">
                {/* Quick Prompts */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {quickPrompts.map(prompt => (
                        <button
                            key={prompt}
                            onClick={() => handleSend(prompt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-xs text-slate-300 whitespace-nowrap transition-all hover:bg-slate-700"
                        >
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="relative flex items-center gap-2">
                    <button className="p-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                        <Paperclip className="w-5 h-5" />
                    </button>
                     <button className="p-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your startup..."
                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    <button 
                        onClick={() => handleSend()}
                        className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
