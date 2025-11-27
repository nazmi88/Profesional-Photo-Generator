
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { OUTFIT_OPTIONS, BACKGROUND_PROMPTS, DAILY_GENERATION_LIMIT } from './constants';
import { Gender, BackgroundColor, OutfitOption } from './types';
import { generateProfessionalHeadshot } from './services/geminiService';
import { Loader2, Download, Wand2, RefreshCw, AlertCircle, Camera, Ban } from 'lucide-react';

export default function App() {
  // State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Configuration State
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(OUTFIT_OPTIONS[0].id);
  const [selectedBg, setSelectedBg] = useState<BackgroundColor>(BackgroundColor.WHITE);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Derived state
  const availableOutfits = OUTFIT_OPTIONS.filter(o => o.gender === gender || o.gender === 'All');
  const currentOutfit = OUTFIT_OPTIONS.find(o => o.id === selectedOutfitId);

  // Rate Limit Helpers
  const checkRateLimit = () => {
    const today = new Date().toDateString();
    const storageKey = 'proheadshot_daily_usage';
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
          return data.count < DAILY_GENERATION_LIMIT;
        }
      }
      return true; // No data or new day
    } catch (e) {
      console.error("Error reading usage data", e);
      return true;
    }
  };

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const storageKey = 'proheadshot_daily_usage';
    try {
      const stored = localStorage.getItem(storageKey);
      let count = 0;
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
          count = data.count;
        }
      }
      localStorage.setItem(storageKey, JSON.stringify({
        date: today,
        count: count + 1
      }));
    } catch (e) {
      console.error("Failed to save usage", e);
    }
  };

  // Handlers
  const handleImageSelected = (base64: string, mime: string) => {
    setSourceImage(base64);
    setMimeType(mime);
    setGeneratedImage(null);
    setError(null);
  };

  const handleClear = () => {
    setSourceImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!sourceImage || !currentOutfit) return;

    // Check Daily Limit
    if (!checkRateLimit()) {
      setShowLimitModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Track usage on attempt
    incrementUsage();

    try {
      const result = await generateProfessionalHeadshot(
        sourceImage,
        mimeType,
        gender,
        currentOutfit,
        selectedBg,
        customPrompt
      );
      setGeneratedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `professional-headshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Configuration */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Upload Photo
              </h2>
              <ImageUpload 
                onImageSelected={handleImageSelected} 
                onClear={handleClear} 
                selectedImage={sourceImage} 
              />
            </div>

            {/* 2. Configuration Section - Only show if image uploaded */}
            <div className={`transition-all duration-300 ${!sourceImage ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Configure Style
                </h2>

                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Gender</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                    {[Gender.MALE, Gender.FEMALE].map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setGender(g);
                          // Reset outfit if switching gender to ensure valid selection
                          const firstValid = OUTFIT_OPTIONS.find(o => o.gender === g)?.id;
                          if (firstValid) setSelectedOutfitId(firstValid);
                        }}
                        className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          gender === g 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Outfit</label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {availableOutfits.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => setSelectedOutfitId(outfit.id)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          selectedOutfitId === outfit.id
                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-gray-900 text-sm">{outfit.label}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{outfit.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.values(BackgroundColor).map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setSelectedBg(bg)}
                        className={`relative group flex flex-col items-center gap-1 transition-all ${selectedBg === bg ? 'scale-105' : 'hover:scale-105'}`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full border-2 shadow-sm ${
                            selectedBg === bg ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-200'
                          }`}
                          style={{
                            backgroundColor: 
                              bg === BackgroundColor.WHITE ? '#F5F5F5' :
                              bg === BackgroundColor.BLUE ? '#2E9AFF' :
                              bg === BackgroundColor.GREY ? '#9ca3af' : '#f3f4f6'
                          }}
                        >
                          {bg === BackgroundColor.OFFICE && (
                            <div className="w-full h-full rounded-full overflow-hidden opacity-50 bg-[url('https://picsum.photos/id/4/50/50')] bg-cover" />
                          )}
                        </div>
                        <span className={`text-[10px] font-medium ${selectedBg === bg ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {bg}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., Make it look vintage, add glasses, etc."
                    className="w-full text-sm p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-20"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !sourceImage}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    isGenerating || !sourceImage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Photoshoot
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Result Display */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
             {/* Error Message */}
             {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Generation Failed</h3>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Result Gallery</h2>
                {generatedImage && (
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>

              <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden relative">
                
                {isGenerating ? (
                  <div className="text-center p-8 space-y-4 max-w-md">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Creating your masterpiece</h3>
                      <p className="text-gray-500 text-sm mt-2">
                        Gemini is analyzing your photo, tailoring the {currentOutfit?.label}, and setting up the studio lighting. This usually takes 5-10 seconds.
                      </p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-4 items-center justify-center">
                     <div className="relative group max-w-md w-full shadow-2xl rounded-lg overflow-hidden">
                        <img 
                          src={generatedImage} 
                          alt="Generated Headshot" 
                          className="w-full h-auto object-contain"
                        />
                     </div>
                  </div>
                ) : (
                  <div className="text-center p-12 opacity-60">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Image Generated Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Upload your photo on the left, choose your style, and hit generate to see the magic happen.
                    </p>
                  </div>
                )}
              </div>
              
              {generatedImage && !isGenerating && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                        // Reset prompt to trigger a slight variation if clicked again? 
                        // Actually just a 'Regenerate' using same settings is useful.
                        handleGenerate();
                    }} 
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate with same settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

       {/* Mobile Sticky Action Bar */}
       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <button
            onClick={handleGenerate}
            disabled={isGenerating || !sourceImage}
            className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
              isGenerating || !sourceImage
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          </button>
       </div>

       {/* Rate Limit Modal */}
       {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Ban className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Daily Limit Reached</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  You have used all {DAILY_GENERATION_LIMIT} free generations for today. 
                  Please come back tomorrow to create more professional headshots.
                </p>
              </div>
              <button 
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors shadow-lg"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icon
function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M9 3v4" />
      <path d="M3 5h4" />
      <path d="M3 9h4" />
    </svg>
  );
}
