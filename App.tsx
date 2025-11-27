import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { OUTFIT_OPTIONS, DAILY_GENERATION_LIMIT } from './constants';
import { Gender, BackgroundColor } from './types';
import { generateProfessionalHeadshot } from './services/geminiService';
import { Loader2, Download, Wand2, RefreshCw, AlertCircle, Camera, Ban, User, User2, Check, Sparkles } from 'lucide-react';

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
  
  // Refs for scrolling
  const resultRef = useRef<HTMLDivElement>(null);

  // Derived state
  const availableOutfits = OUTFIT_OPTIONS.filter(o => o.gender === gender || o.gender === 'All');
  const currentOutfit = OUTFIT_OPTIONS.find(o => o.id === selectedOutfitId);

  // Auto-scroll to result on generation finish
  useEffect(() => {
    if (generatedImage && resultRef.current) {
        // On mobile, scroll to result
        if (window.innerWidth < 1024) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
  }, [generatedImage]);

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

    if (!checkRateLimit()) {
      setShowLimitModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Professional AI Headshots <br className="hidden sm:block" />
            <span className="text-indigo-600">in seconds.</span>
          </h1>
          <p className="text-lg text-slate-600">
            Transform your selfies into studio-quality passport photos and professional profiles without leaving your home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Input & Configuration */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Upload Section */}
            <section className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 ring-1 ring-slate-900/5">
              <div className="p-5 border-b border-slate-50">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">1</span>
                  Upload Your Photo
                </h2>
              </div>
              <div className="p-5">
                <ImageUpload 
                  onImageSelected={handleImageSelected} 
                  onClear={handleClear} 
                  selectedImage={sourceImage} 
                />
              </div>
            </section>

            {/* 2. Configuration Section */}
            <section 
              className={`bg-white rounded-2xl shadow-sm border border-slate-100 ring-1 ring-slate-900/5 transition-all duration-500 ease-in-out ${
                !sourceImage ? 'opacity-60 pointer-events-none grayscale-[0.5]' : 'opacity-100'
              }`}
            >
              <div className="p-5 border-b border-slate-50">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">2</span>
                  Customize Style
                </h2>
              </div>

              <div className="p-6 space-y-8">
                {/* Gender Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Subject Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setGender(Gender.MALE);
                        const firstValid = OUTFIT_OPTIONS.find(o => o.gender === Gender.MALE)?.id;
                        if (firstValid) setSelectedOutfitId(firstValid);
                      }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        gender === Gender.MALE 
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-6 h-6" />
                      <span className="font-medium">Male</span>
                    </button>
                    <button
                      onClick={() => {
                        setGender(Gender.FEMALE);
                        const firstValid = OUTFIT_OPTIONS.find(o => o.gender === Gender.FEMALE)?.id;
                        if (firstValid) setSelectedOutfitId(firstValid);
                      }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        gender === Gender.FEMALE 
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <User2 className="w-6 h-6" />
                      <span className="font-medium">Female</span>
                    </button>
                  </div>
                </div>

                {/* Outfit Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Outfit Style</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {availableOutfits.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => setSelectedOutfitId(outfit.id)}
                        className={`group text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 relative ${
                          selectedOutfitId === outfit.id
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm z-10'
                            : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`font-semibold text-sm ${selectedOutfitId === outfit.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {outfit.label}
                          </span>
                          {selectedOutfitId === outfit.id && (
                            <Check className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <p className={`text-xs ${selectedOutfitId === outfit.id ? 'text-indigo-700/80' : 'text-slate-500'}`}>
                          {outfit.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Background</label>
                  <div className="flex flex-wrap gap-4">
                    {Object.values(BackgroundColor).map((bg) => (
                      <div key={bg} className="flex flex-col items-center gap-2">
                         <button
                            onClick={() => setSelectedBg(bg)}
                            className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-105 relative overflow-hidden ${
                              selectedBg === bg ? 'ring-2 ring-offset-2 ring-indigo-600' : 'ring-1 ring-slate-200'
                            }`}
                            style={{
                              backgroundColor: 
                                bg === BackgroundColor.WHITE ? '#F5F5F5' :
                                bg === BackgroundColor.BLUE ? '#2E9AFF' :
                                bg === BackgroundColor.GREY ? '#9ca3af' : '#f3f4f6'
                            }}
                          >
                            {bg === BackgroundColor.OFFICE && (
                              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=80')] bg-cover opacity-60" />
                            )}
                            {selectedBg === bg && (
                              <Check className={`w-5 h-5 ${bg === BackgroundColor.WHITE ? 'text-slate-800' : 'text-white'} relative z-10 drop-shadow-md`} />
                            )}
                         </button>
                         <span className="text-xs font-medium text-slate-600">{bg.replace('Blurred ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex justify-between">
                    Extra Instructions
                    <span className="text-slate-400 font-normal normal-case text-xs bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Add glasses, make me smile slightly..."
                    className="w-full text-sm p-4 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none h-24 shadow-sm"
                  />
                </div>
              </div>
            </section>
            
            {/* Desktop Generate Button */}
            <div className="hidden lg:block">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !sourceImage}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] hover:-translate-y-1 ${
                    isGenerating || !sourceImage
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6" />
                      Generate Photoshoot
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">
                    ~5-10 seconds processing time • Powered by Gemini 2.5
                </p>
            </div>

          </div>

          {/* Right Column: Result Display */}
          <div className="lg:col-span-7 flex flex-col h-full" ref={resultRef}>
             {/* Sticky container for desktop */}
             <div className="sticky top-24 space-y-6">
                
                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Generation Failed</h3>
                      <p className="text-sm opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-3xl p-1 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative min-h-[500px] flex flex-col">
                  {/* Result Header */}
                  <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        Result Gallery
                    </h2>
                    {generatedImage && !isGenerating && (
                      <div className="flex gap-2">
                          <button
                            onClick={handleGenerate} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                            title="Regenerate with same settings"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Retry</span>
                          </button>
                          <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-200"
                          >
                            <Download className="w-4 h-4" />
                            Save
                          </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow flex items-center justify-center bg-slate-50/50 relative">
                    
                    {isGenerating ? (
                      <div className="text-center p-8 space-y-6 max-w-sm animate-in fade-in zoom-in duration-500">
                        <div className="relative w-24 h-24 mx-auto">
                          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
                          <div className="relative bg-white p-4 rounded-full shadow-lg border border-indigo-50">
                            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Crafting your photo...</h3>
                          <p className="text-slate-500 mt-2">
                            Applying {currentOutfit?.label} and setting up studio lighting. This only takes a moment.
                          </p>
                        </div>
                      </div>
                    ) : generatedImage ? (
                      <div className="w-full h-full p-6 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-in fade-in duration-700">
                         <div className="relative group max-w-lg w-full shadow-2xl shadow-indigo-900/10 rounded-xl overflow-hidden border-4 border-white transition-transform hover:scale-[1.01] duration-300">
                            <img 
                              src={generatedImage} 
                              alt="Generated Headshot" 
                              className="w-full h-auto object-contain bg-white"
                            />
                         </div>
                      </div>
                    ) : (
                      <div className="text-center p-12 opacity-50 flex flex-col items-center">
                        <div className="w-32 h-32 bg-slate-100 rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-inner">
                          <Camera className="w-12 h-12 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Create</h3>
                        <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
                          Your professional photos will appear here. Start by uploading a selfie on the left.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>

       {/* Mobile Sticky Action Bar */}
       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40 safe-area-pb">
        <button
            onClick={handleGenerate}
            disabled={isGenerating || !sourceImage}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
              isGenerating || !sourceImage
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600'
            }`}
          >
            {isGenerating ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <Wand2 className="w-5 h-5" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Photoshoot'}
          </button>
       </div>

       {/* Rate Limit Modal */}
       {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="p-4 bg-red-50 rounded-full ring-8 ring-red-50/50">
                <Ban className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Daily Limit Reached</h3>
                <p className="text-slate-500 mt-2 text-base leading-relaxed">
                  You have used all {DAILY_GENERATION_LIMIT} free generations for today. 
                  <br/>Please come back tomorrow!
                </p>
              </div>
              <button 
                onClick={() => setShowLimitModal(false)}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-slate-900/20"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}