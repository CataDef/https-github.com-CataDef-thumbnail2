
import React, { useState } from 'react';
import { ThumbnailConcept, AnalysisData, AspectRatio } from '../types';

interface ResultDisplayProps {
  analysis: (AnalysisData & { sources?: any[] }) | null;
  thumbnails: { [key: string]: string };
  onEditImage: (style: string, prompt: string) => Promise<void>;
  isEditing: boolean;
  aspectRatio: AspectRatio;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ analysis, thumbnails, onEditImage, isEditing, aspectRatio }) => {
  const [editingStyle, setEditingStyle] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');

  if (!analysis) return null;

  const downloadImage = (base64: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `${filename.replace(/\s+/g, '_').toLowerCase()}_${aspectRatio.replace(':', 'x')}_thumbnail.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStyle && editPrompt) {
      await onEditImage(editingStyle, editPrompt);
      setEditingStyle(null);
      setEditPrompt('');
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-l-blue-500 hover:bg-white/[0.05] transition-colors">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">The Hook Promise</div>
          <p className="text-sm font-semibold leading-relaxed">{analysis.promise}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-l-purple-500 hover:bg-white/[0.05] transition-colors">
          <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">Unique Mechanism</div>
          <p className="text-sm font-semibold leading-relaxed">{analysis.mechanism}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-l-pink-500 hover:bg-white/[0.05] transition-colors">
          <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Target Audience</div>
          <p className="text-sm font-semibold leading-relaxed">{analysis.audience}</p>
        </div>
      </div>

      <div className="space-y-32">
        {analysis.concepts.map((concept, idx) => (
          <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-8 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                  Template {idx + 1}: {concept.style}
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                  {concept.hookText}
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="glass p-8 rounded-3xl relative overflow-hidden">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Click Psychology Insights</h4>
                  <p className="text-gray-300 text-lg leading-relaxed font-medium">
                    {concept.psychology}
                  </p>
                </div>

                <div className="flex gap-4">
                  {thumbnails[concept.style] && (
                    <>
                      <button 
                        onClick={() => downloadImage(thumbnails[concept.style], concept.style)}
                        className="px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                      </button>
                      <button 
                        disabled={isEditing}
                        onClick={() => setEditingStyle(concept.style)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit AI
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={`relative ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl opacity-50"></div>
              {/* Correctly switch aspect ratio class based on orientation */}
              <div className={`relative ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'} max-h-[70vh] mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group`}>
                {thumbnails[concept.style] ? (
                  <img 
                    src={thumbnails[concept.style]} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt={concept.style} 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-6 bg-black/40 backdrop-blur-xl">
                    <div className="w-16 h-16 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Synthesizing Visuals</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-xl p-8 rounded-[2rem] border border-white/20 space-y-6 animate-in zoom-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Edit Architecture</h3>
                <p className="text-gray-500 text-sm font-medium">Instruction for "{editingStyle}"</p>
              </div>
              <button onClick={() => setEditingStyle(null)} className="p-2 text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <textarea
                required
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all resize-none font-medium"
                placeholder="Ex: 'Change my expression', 'Add an object', 'Change the lighting'..."
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Apply Edit Protocol
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          Recalibrating Visual Assets...
        </div>
      )}
    </section>
  );
};

export default ResultDisplay;
