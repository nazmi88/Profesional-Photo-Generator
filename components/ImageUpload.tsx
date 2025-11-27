import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  onClear: () => void;
  selectedImage: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, onClear, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const match = base64String.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        onImageSelected(match[2], match[1]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 group bg-slate-100">
        <img 
          src={`data:image/jpeg;base64,${selectedImage}`} 
          alt="Original" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button 
            onClick={onClear}
            className="bg-white text-red-600 px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-red-50 transition-all shadow-xl transform hover:scale-105"
          >
            <X className="w-4 h-4" />
            Change Photo
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Photo Ready
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full aspect-[4/3] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer relative overflow-hidden
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }
      `}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
        <Upload className={`w-8 h-8 ${isDragging ? 'animate-bounce' : ''}`} />
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-1">Click to Upload</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-[220px] leading-relaxed">
        or drag and drop your selfie here.
        <br/><span className="text-xs opacity-75">Front facing, good lighting works best.</span>
      </p>
      
      <div className="flex items-center gap-3 text-xs font-medium text-slate-400 uppercase tracking-wide">
        <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span>PNG</span>
      </div>
    </div>
  );
};