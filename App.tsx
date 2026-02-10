
import React, { useState, useEffect } from 'react';
import Quadrant from './components/Quadrant';
import { QuadrantData } from './types';
import { generatePosterQuadrant } from './services/geminiService';

// Genesis Content
const GENESIS_GOOD: QuadrantData = {
  id: 'gen-good',
  period: 'GENESIS',
  state: 'GOOD',
  title: 'בראשית: הבריאה והאור',
  description: 'התחלה של תקווה מוחלטת - בריאת האור והפרדתו מהחושך.',
  verse: 'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר.',
  imagePrompt: 'The first moment of light in the universe. Ethereal golden rays breaking through deep primordial shadows. Oil painting style, Michelangelo inspiration.',
  fallbackImageUrl: 'https://images.unsplash.com/photo-1518005020250-6eb5f3f2754d?auto=format&fit=crop&q=80&w=800'
};

const GENESIS_EVIL: QuadrantData = {
  id: 'gen-evil',
  period: 'GENESIS',
  state: 'EVIL',
  title: 'בראשית: קין והבל',
  description: 'החטא הקדמון של האדם נגד אחיו - רצח הבל בידי קין.',
  verse: 'וַיָּקָם קַיִן אֶל הֶבֶל אָחִיו וַיַּהַרְגֵהוּ.',
  imagePrompt: 'Dark atmospheric Baroque painting. Cain and Abel tragedy, deep shadows, emotional loss, earth tones and dramatic lighting.',
  fallbackImageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800'
};

// Modern Content - Technology
const MODERN_GOOD_SCENARIOS: QuadrantData[] = [
  {
    id: 'mod-good-tech',
    period: 'MODERN',
    state: 'GOOD',
    title: 'היום: קידמה וריפוי',
    description: 'טכנולוגיה המרחיבה את גבולות המחשבה, רובוטיקה רפואית המצילה חיים.',
    imagePrompt: 'Futuristic medical robotics and blue neural light patterns. Clean, optimistic, high-tech evolution. Cinematic photography.',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mod-good-space',
    period: 'MODERN',
    state: 'GOOD',
    title: 'היום: כיבוש הידע',
    description: 'האדם מגיע לכוכבים וחוקר את מעמקי היקום - איחוד האנושות דרך מדע.',
    imagePrompt: 'Modern space exploration, futuristic telescopes observing a nebula, silhouettes of scientists in a bright high-tech control room.',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800'
  }
];

// Modern Content - War
const MODERN_EVIL_SCENARIOS: QuadrantData[] = [
  {
    id: 'mod-evil-7oct',
    period: 'MODERN',
    state: 'EVIL',
    title: 'היום: שבעה באוקטובר',
    description: 'חורבן, כאב והרס ביישובי הדרום - עדות לרוע האנושי בעידן המודרני.',
    imagePrompt: 'Gritty documentary photography. A charred ruined wall in a kibbutz, smoke in the background, a single broken childhood item in the dust. Tragic atmosphere.',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1496568818391-f39c58eef406?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mod-evil-warfare',
    period: 'MODERN',
    state: 'EVIL',
    title: 'היום: מלחמה טכנולוגית',
    description: 'טילים וכטב"מים המופנים נגד חיי אדם - הצד האפל של הקידמה.',
    imagePrompt: 'Urban warfare, high contrast silhouettes against a fiery sky, military drones in a dark smoky atmosphere. Gritty, metallic, terrifying.',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&q=80&w=800'
  }
];

const App: React.FC = () => {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [modernGoodIdx, setModernGoodIdx] = useState(0);
  const [modernEvilIdx, setModernEvilIdx] = useState(0);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    // Initial placeholders
    setImages({
      'gen-good': GENESIS_GOOD.fallbackImageUrl,
      'gen-evil': GENESIS_EVIL.fallbackImageUrl,
      'mod-good': MODERN_GOOD_SCENARIOS[0].fallbackImageUrl,
      'mod-evil': MODERN_EVIL_SCENARIOS[0].fallbackImageUrl,
    });

    // Check for API key selection
    const checkKey = async () => {
      try {
        if ((window as any).aistudio?.hasSelectedApiKey) {
          const selected = await (window as any).aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } else {
          setHasKey(true); // Assume process.env.API_KEY is available if the bridge is missing
        }
      } catch {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const openKeyDialog = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasKey(true); // Proceed assuming success
    }
  };

  const refreshQuadrant = async (quadrantType: 'gen-good' | 'gen-evil' | 'mod-good' | 'mod-evil') => {
    let data: QuadrantData;
    
    if (quadrantType === 'mod-good') {
      const nextIdx = (modernGoodIdx + 1) % MODERN_GOOD_SCENARIOS.length;
      setModernGoodIdx(nextIdx);
      data = MODERN_GOOD_SCENARIOS[nextIdx];
    } else if (quadrantType === 'mod-evil') {
      const nextIdx = (modernEvilIdx + 1) % MODERN_EVIL_SCENARIOS.length;
      setModernEvilIdx(nextIdx);
      data = MODERN_EVIL_SCENARIOS[nextIdx];
    } else if (quadrantType === 'gen-good') {
      data = GENESIS_GOOD;
    } else {
      data = GENESIS_EVIL;
    }

    setLoading(prev => ({ ...prev, [quadrantType]: true }));
    const result = await generatePosterQuadrant(data.imagePrompt);
    if (result) {
      setImages(prev => ({ ...prev, [quadrantType]: result }));
    }
    setLoading(prev => ({ ...prev, [quadrantType]: false }));
  };

  const generateFullPoster = async () => {
    const types: ('gen-good' | 'gen-evil' | 'mod-good' | 'mod-evil')[] = ['gen-good', 'gen-evil', 'mod-good', 'mod-evil'];
    for (const t of types) {
      refreshQuadrant(t);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#050505] py-8 md:py-20 px-4" dir="rtl">
      
      {/* Key Selection Prompt if missing */}
      {hasKey === false && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-600 text-black py-2 px-4 flex justify-between items-center text-sm font-bold">
          <span>נדרש מפתח API תקין ליצירת תמונות באיכות גבוהה</span>
          <button onClick={openKeyDialog} className="bg-black text-amber-500 px-4 py-1 rounded-sm uppercase text-xs tracking-widest">
            בחר מפתח
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12 md:mb-24 max-w-2xl">
        <h1 className="text-6xl md:text-9xl font-serif-hebrew font-black text-amber-50 mb-6 drop-shadow-2xl tracking-tighter">
          בראשית <span className="text-amber-500 font-normal opacity-50">/</span> היום
        </h1>
        <p className="text-zinc-500 text-sm md:text-xl mb-10 font-light tracking-wide max-w-md mx-auto">
          דיאלוג חזותי בין המקורות לעידן המודרני
        </p>
        <button 
          onClick={generateFullPoster}
          className="group relative bg-transparent border-2 border-amber-600/50 hover:border-amber-500 text-amber-500 px-10 md:px-20 py-4 md:py-6 font-black transition-all shadow-[0_0_40px_rgba(217,119,6,0.1)]"
        >
          <span className="relative z-10 uppercase tracking-[0.4em] text-[10px] md:text-base">צור כרזה מלאה</span>
          <div className="absolute inset-0 bg-amber-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
      </div>

      {/* POSTER GRID */}
      <div 
        className="poster-canvas relative w-full max-w-[1150px] aspect-[4/5] md:aspect-[16/10] grid grid-cols-2 grid-rows-2 border-[12px] md:border-[20px] border-[#0a0a0a] shadow-[0_0_120px_rgba(0,0,0,1)]"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {/* Quadrants */}
        <Quadrant 
          data={GENESIS_GOOD} 
          imageUrl={images['gen-good']} 
          isLoading={loading['gen-good']} 
          onRefresh={() => refreshQuadrant('gen-good')} 
        />
        <Quadrant 
          data={MODERN_GOOD_SCENARIOS[modernGoodIdx]} 
          imageUrl={images['mod-good']} 
          isLoading={loading['mod-good']} 
          onRefresh={() => refreshQuadrant('mod-good')} 
        />
        <Quadrant 
          data={GENESIS_EVIL} 
          imageUrl={images['gen-evil']} 
          isLoading={loading['gen-evil']} 
          onRefresh={() => refreshQuadrant('gen-evil')} 
        />
        <Quadrant 
          data={MODERN_EVIL_SCENARIOS[modernEvilIdx]} 
          imageUrl={images['mod-evil']} 
          isLoading={loading['mod-evil']} 
          onRefresh={() => refreshQuadrant('mod-evil')} 
        />

        {/* Divider Lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] md:w-[4px] bg-black/90 z-30 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-600/15 z-40 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] md:h-[4px] bg-black/90 z-30 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-600/15 z-40 pointer-events-none" />

        {/* CENTRAL MESSAGE */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none transition-all duration-1000 ${isAnyHovered ? 'scale-75 opacity-0 blur-2xl' : 'scale-100 opacity-100'}`}>
          <div className="bg-[#050505]/95 backdrop-blur-3xl border border-amber-600/20 p-8 md:p-16 shadow-[0_0_150px_rgba(0,0,0,1)] text-center min-w-[280px] md:min-w-[450px]">
            <h2 className="text-2xl md:text-6xl font-serif-hebrew font-black text-amber-50 leading-tight drop-shadow-2xl">
              "התפאורה משתנה,<br/>הבחירה נשארת"
            </h2>
            <div className="h-[2px] w-16 md:w-24 bg-amber-600/20 mx-auto mt-8 md:mt-12" />
          </div>
        </div>

        {/* Ambient Vignette */}
        <div className="vignette" />
      </div>

    </div>
  );
};

export default App;
