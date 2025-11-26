import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

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
      // Extract pure base64 and mime type
      const match = base64String.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        onImageSelected(match[2], match[1]); // Send pure base64 data and mime type separately if needed by API, but service handles standard data URI usually. 
        // Note: The service expects pure base64 for inlineData.data, but prompts usually work with data URIs too if parsed.
        // My service implementation splits it properly? 
        // Let's pass the raw base64 data part (match[2]) and mimeType (match[1]) to the parent.
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
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-gray-100 group">
        <img 
          src={`data:image/jpeg;base64,${selectedImage}`} 
          alt="Original" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onClear}
            className="bg-white/90 text-red-600 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
            Remove Photo
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          Original
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
        w-full aspect-[3/4] rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 text-center cursor-pointer
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'}
      `}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
        <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Photo</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-[200px]">
        Drag & drop or click to browse. Use a clear front-facing photo.
      </p>
      
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <ImageIcon className="w-3 h-3" />
        <span>JPG, PNG supported</span>
      </div>
    </div>
  );
};
