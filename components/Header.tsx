import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">ProHeadshot AI</h1>
            <p className="text-xs text-gray-500 font-medium">Powered by Gemini 2.5</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Professional Studio Quality
          </span>
        </div>
      </div>
    </header>
  );
};
