
import React, { useState, useRef } from 'react';
import { AspectRatio, ImageSize } from '../types';

interface InputSectionProps {
  onGenerate: (context: string, intent: string, authorImage: string, aspectRatio: AspectRatio, imageSize: ImageSize) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [context, setContext] = useState('');
  const [intent, setIntent] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setIsCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    setImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setContext('');
    setIntent('');
    setImage(null);
    setAspectRatio('16:9');
    setImageSize('1K');
    if (isCameraActive) stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (context && image) {
      onGenerate(context, intent, image, aspectRatio, imageSize);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pb-20">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              URL / SOURCE
            </label>
            <textarea
              required
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none font-medium"
              placeholder="Paste your video URL here. The AI will browse the content."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              YOUR INTENT
            </label>
            <textarea
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none font-medium"
              placeholder="What do you want to transmit? (e.g., 'I want to show extreme vulnerability' or 'A feeling of sudden wealth')"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Format & Ratio</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase transition-all ${aspectRatio === '16:9' ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
              >
                16:9 Landscape
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase transition-all ${aspectRatio === '9:16' ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
              >
                9:16 Portrait
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Visual Quality</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setImageSize('1K')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase transition-all ${imageSize === '1K' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
              >
                1080p HD
              </button>
              <button
                type="button"
                onClick={() => setImageSize('2K')}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase transition-all ${imageSize === '2K' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
              >
                2K Ultra (Pro)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Identity Input</label>
            <div className="relative aspect-square w-full border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden bg-white/5 transition-all group">
              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full border-4 border-gray-300 shadow-xl"
                  ></button>
                </div>
              ) : image ? (
                <>
                  <img src={image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase">Upload New</button>
                    <button type="button" onClick={startCamera} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase">Use Camera</button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="text-4xl opacity-50">📸</div>
                  <div className="space-y-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="block w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase transition-colors">Upload Reference</button>
                    <button type="button" onClick={startCamera} className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase transition-colors">Live Capture</button>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="space-y-6 pt-4">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl">
              <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Logic: Viral 2026
              </h4>
              <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                <li>{imageSize === '2K' ? 'Gemini 3 Pro High Fidelity Engine' : 'Standard 1080p Generation'}</li>
                <li>Aspect Ratio Optimized: {aspectRatio}</li>
                <li>Zero-Cliché Expression Tuning</li>
                <li>Global Environment Relighting</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                disabled={isLoading || !context || !image}
                type="submit"
                className="group relative w-full py-5 bg-white text-black rounded-xl font-extrabold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ORCHESTRATING STRATEGY...
                  </span>
                ) : (
                  'GENERATE 2026 ASSETS'
                )}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Reset Architecture
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default InputSection;
