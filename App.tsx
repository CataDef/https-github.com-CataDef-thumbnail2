
import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultDisplay from './components/ResultDisplay';
import { analyzeVideoContext, generateThumbnailImage, editThumbnailImage } from './services/geminiService';
import { AnalysisData, AspectRatio, ImageSize } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [analysis, setAnalysis] = useState<(AnalysisData & { sources?: any[] }) | null>(null);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  
  const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatio>('16:9');
  const [currentImageSize, setCurrentImageSize] = useState<ImageSize>('1K');

  const handleGenerate = async (context: string, intent: string, authorImage: string, aspectRatio: AspectRatio, imageSize: ImageSize) => {
    if (imageSize === '2K') {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio?.openSelectKey();
      }
    }

    setLoading(true);
    setAnalysis(null);
    setThumbnails({});
    setCurrentAspectRatio(aspectRatio);
    setCurrentImageSize(imageSize);
    
    try {
      const analysisData = await analyzeVideoContext(context, intent);
      setAnalysis(analysisData);
      setLoading(false);

      for (const concept of analysisData.concepts) {
        try {
          const imgUrl = await generateThumbnailImage(concept, authorImage, aspectRatio, imageSize);
          setThumbnails(prev => ({ ...prev, [concept.style]: imgUrl }));
        } catch (err: any) {
          console.error(`Failed to generate thumbnail for ${concept.style}`, err);
          if (err.message?.includes("Requested entity was not found")) {
            alert("Model access error. Please select a valid API key via the dialog.");
            await (window as any).aistudio?.openSelectKey();
          }
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong with the AI analysis. Please try again.");
      setLoading(false);
    }
  };

  const handleEditImage = async (style: string, prompt: string) => {
    const currentImage = thumbnails[style];
    if (!currentImage) return;

    setIsEditing(true);
    try {
      const newImageUrl = await editThumbnailImage(currentImage, prompt, currentAspectRatio, currentImageSize);
      setThumbnails(prev => ({ ...prev, [style]: newImageUrl }));
    } catch (error) {
      console.error("Edit failed:", error);
      alert("AI failed to modify the image. Try a clearer instruction.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setThumbnails({});
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Header />
      
      <main>
        {!analysis && !loading && (
          <InputSection onGenerate={handleGenerate} isLoading={loading} />
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-pulse">
            <div className="text-4xl">🧠</div>
            <div className="text-center px-4">
              <h2 className="text-2xl font-bold mb-2">Analyzing Click Psychology...</h2>
              <p className="text-gray-500 text-sm">Our 2026 strategist is deconstructing your unique mechanism and intent.</p>
            </div>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[loading_2s_infinite]"></div>
            </div>
          </div>
        )}

        {(analysis || Object.keys(thumbnails).length > 0) && (
          <div className="space-y-8">
            <div className="max-w-6xl mx-auto px-4 flex justify-end gap-4">
              <div className="px-6 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                {currentAspectRatio} • {currentImageSize === '2K' ? '2K Ultra' : '1080p HD'}
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Abort & Restart
              </button>
            </div>
            <ResultDisplay 
              analysis={analysis} 
              thumbnails={thumbnails} 
              onEditImage={handleEditImage}
              isEditing={isEditing}
              aspectRatio={currentAspectRatio}
            />
          </div>
        )}
      </main>

      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
