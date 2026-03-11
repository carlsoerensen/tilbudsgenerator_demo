import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Edit2, CheckCircle2, FileText, User, Sparkles, Box, TrendingUp, ChevronLeft } from 'lucide-react';

const BREAKPOINT_FRAME = 768; // Show device frame from this width up

export default function App() {
  const [appState, setAppState] = useState('idle');
  const [transcribedText, setTranscribedText] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [isFrameView, setIsFrameView] = useState(typeof window !== 'undefined' && window.innerWidth >= BREAKPOINT_FRAME);
  const fullText = "Hej, det er tømrer Hansen. Jeg står ude hos familien Jensen på Strandvejen. De skal have skiftet 4 vinduer i stuen til 3-lags træ/alu fra Velfac. Det tager nok 2 mand en hel dag inklusiv fugning og bortskaffelse af de gamle.";

  useEffect(() => {
    const onResize = () => setIsFrameView(window.innerWidth >= BREAKPOINT_FRAME);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let timeout1, timeout2, timeout3;
    let typeInterval;

    if (appState === 'recording') {
      let currentText = '';
      let i = 0;
      setTranscribedText('');

      typeInterval = setInterval(() => {
        currentText += fullText.charAt(i);
        setTranscribedText(currentText);
        i++;
        if (i >= fullText.length) {
          clearInterval(typeInterval);
          timeout1 = setTimeout(() => setAppState('generating'), 1000);
        }
      }, 30);
    }

    if (appState === 'generating') {
      const loadingSteps = [
        "Analyserer opgavebeskrivelse...",
        "Beregner materialeforbrug...",
        "Indhenter dagspriser fra grossist...",
        "Tilføjer standardavance (15%)...",
        "Genererer knivskarpt tilbud..."
      ];

      let stepIndex = 0;
      setLoadingText(loadingSteps[0]);

      const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex]);
        } else {
          clearInterval(stepInterval);
          setAppState('result');
        }
      }, 1200);

      return () => clearInterval(stepInterval);
    }

    if (appState === 'success') {
      timeout2 = setTimeout(() => {
        setAppState('idle');
        setTranscribedText('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [appState]);

  const startFlow = () => {
    if (appState === 'idle') setAppState('recording');
  };

  const handleSend = () => setAppState('success');

  const appContent = (
    <>
      {/* Status bar only on mobile (frame has its own) */}
      {!isFrameView && (
        <div className="flex justify-between items-center px-4 pointer-events-none flex-shrink-0 h-11 pt-safe-top">
          <span className="text-[14px] font-semibold text-slate-800">09:41</span>
        </div>
      )}

      <div className={`flex-1 flex flex-col min-h-0 pb-safe-bottom ${isFrameView ? 'pt-2 pb-8' : 'pt-2 pb-4'}`}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 md:w-8 md:h-8 rounded-xl md:rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Sparkles size={isFrameView ? 18 : 20} />
            </div>
            <span className="font-bold text-lg md:text-lg tracking-tight text-slate-800">Tilbudsgenerator</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        </div>

        {/* SCREEN 1: INPUT */}
        {(appState === 'idle' || appState === 'recording') && (
          <div className="flex-1 px-4 md:px-6 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-2xl font-bold text-slate-800 mb-2">Nyt tilbud på 5 min.</h2>
              <p className="text-slate-500 text-sm">Fortæl mig hvad kunden skal have lavet, så klarer jeg resten.</p>
            </div>

            <div className="relative flex flex-col items-center justify-center mb-6 md:mb-8">
              {appState === 'recording' && (
                <>
                  <div className="absolute w-32 h-32 bg-blue-500 rounded-full animate-ping opacity-20" />
                  <div className="absolute w-40 h-40 bg-blue-400 rounded-full animate-pulse opacity-10" />
                </>
              )}
              <button
                onClick={startFlow}
                className={`relative z-10 flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full shadow-2xl transition-all duration-300 touch-manipulation active:scale-95 ${
                  appState === 'recording'
                    ? 'bg-red-500 text-white shadow-red-500/40 scale-105'
                    : 'bg-blue-600 text-white shadow-blue-600/40 hover:scale-105'
                }`}
                aria-label={appState === 'recording' ? 'Lytter' : 'Indtal opgave'}
              >
                <Mic size={40} className={appState === 'recording' ? 'animate-pulse' : ''} />
              </button>
              <span className={`mt-4 md:mt-6 font-semibold transition-colors duration-300 ${appState === 'recording' ? 'text-red-500' : 'text-slate-700'}`}>
                {appState === 'recording' ? 'Lytter...' : 'Indtal opgave'}
              </span>
            </div>

            <div className={`w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[120px] transition-all duration-300 ${
              appState === 'recording' ? 'border-blue-400 ring-2 ring-blue-100' : ''
            }`}>
              {appState === 'recording' ? (
                <p className="text-slate-700 leading-relaxed text-[15px]">{transcribedText}<span className="animate-pulse">|</span></p>
              ) : (
                <p className="text-slate-400 text-[15px]">Eller beskriv opgaven her...</p>
              )}
            </div>

            <div className="mt-6 md:mt-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">AI systemet kender dine:</p>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                  <TrendingUp size={12} /> Priser & Avance
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                  <Box size={12} /> Materialer
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                  <FileText size={12} /> Standardvilkår
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: GENERATING */}
        {appState === 'generating' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-28 h-28 md:w-32 md:h-32 mb-6 md:mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-200 animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <Sparkles size={32} className="text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">Arbejder...</h2>
            <div className="h-8 flex items-center justify-center min-w-0 px-2">
              <p className="text-slate-500 font-medium animate-pulse text-center text-sm md:text-base truncate max-w-full">
                {loadingText}
              </p>
            </div>
            <div className="w-full max-w-[200px] h-1.5 bg-slate-200 rounded-full mt-6 md:mt-8 overflow-hidden">
              <div className="h-full w-0 bg-blue-600 rounded-full animate-progress" />
            </div>
          </div>
        )}

        {/* SCREEN 3: RESULT */}
        {(appState === 'result' || appState === 'success') && (
          <div className="flex-1 flex flex-col px-4 md:px-6 animate-in slide-in-from-right-8 duration-500 pb-4 md:pb-6 min-h-0 overflow-auto">
            <div className="flex items-center mb-4 md:mb-6 flex-shrink-0">
              <button type="button" className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 touch-manipulation">
                <ChevronLeft size={20} />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-slate-800 pr-10 md:pr-8">Klar til afsendelse</h2>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col flex-shrink-0">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Kunde</span>
                  <span className="font-bold text-slate-800">Familien Jensen</span>
                  <span className="text-xs text-slate-500">Strandvejen 42</span>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText size={20} />
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1 flex flex-col min-h-0 overflow-auto">
                <h3 className="font-bold text-slate-800 mb-4 text-lg">Udskiftning af 4 vinduer</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-end border-b border-slate-50 pb-2 gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-700">Materialer</span>
                      <span className="text-xs text-slate-400">Velfac træ/alu, fuger, m.m.</span>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0">18.400 kr.</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-50 pb-2 gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-700">Arbejdsløn</span>
                      <span className="text-xs text-slate-400">2 mand, 1 arbejdsdag</span>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0">11.200 kr.</span>
                  </div>
                  <div className="flex justify-between items-end gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-700">Bortskaffelse</span>
                      <span className="text-xs text-slate-400">Miljøafgift inkl.</span>
                    </div>
                    <span className="text-sm font-semibold flex-shrink-0">1.500 kr.</span>
                  </div>
                </div>
                <div className="mt-auto bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100 flex-shrink-0">
                  <span className="font-semibold text-slate-500">Total (inkl. moms)</span>
                  <span className="text-xl font-black text-slate-800">38.875 kr.</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-6 flex flex-col gap-3 flex-shrink-0">
              {appState === 'success' ? (
                <div className="w-full h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg animate-in zoom-in duration-300 shadow-lg shadow-green-500/30">
                  <CheckCircle2 size={24} />
                  Tilbud Sendt!
                </div>
              ) : (
                <>
                  <button
                    onClick={handleSend}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-95 touch-manipulation"
                  >
                    <Send size={20} />
                    Send til kunde nu
                  </button>
                  <button type="button" className="w-full h-12 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-2 font-semibold transition-all touch-manipulation">
                    <Edit2 size={18} />
                    Rediger tilbud
                  </button>
                </>
              )}
            </div>

            <p className="text-center text-xs font-medium text-slate-400 mt-4 flex items-center justify-center gap-1 flex-shrink-0">
              <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
              Du sparede lige 1 time og 45 min.
            </p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center font-sans text-slate-800 ${isFrameView ? 'bg-neutral-900 p-4' : 'bg-slate-50'}`}>
      {isFrameView && (
        <div className="mb-6 text-center max-w-md text-slate-300">
          <h1 className="text-xl font-bold text-white mb-2">🎬 Meta Ad Optagelses-mode</h1>
          <p className="text-sm opacity-80">
            Start din skærmoptagelse af telefon-rammen herunder. Klik på <strong>Mikrofonen</strong> for at starte den automatiske animation.
          </p>
        </div>
      )}

      <div
        className={`
          relative bg-slate-50 overflow-hidden flex flex-col
          ${isFrameView
            ? 'w-[375px] h-[812px] rounded-[50px] shadow-2xl border-[10px] border-black'
            : 'w-full max-w-lg mx-auto min-h-[100dvh] min-h-[100vh] rounded-none shadow-none border-0'
          }
        `}
      >
        {isFrameView && (
          <div className="absolute top-0 left-0 right-0 h-12 z-50 flex justify-between items-center px-6 pointer-events-none">
            <span className="text-[14px] font-semibold text-slate-800 mt-2">09:41</span>
            <div className="flex gap-1.5 items-center mt-2">
              <div className="w-4 h-3 bg-slate-800 rounded-sm" />
              <div className="w-3 h-3 bg-slate-800 rounded-full" />
              <div className="w-5 h-3 bg-slate-800 rounded-sm" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl" />
          </div>
        )}
        <div className={`relative w-full h-full flex flex-col transition-opacity duration-500 ${isFrameView ? 'pt-14' : ''}`}>
          {appContent}
        </div>
      </div>
    </div>
  );
}
