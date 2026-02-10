
import React from 'react';
import { QuadrantData } from '../types';

interface QuadrantProps {
  data: QuadrantData;
  imageUrl: string;
  isLoading: boolean;
  onRefresh: () => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ data, imageUrl, isLoading, onRefresh }) => {
  const isGood = data.state === 'GOOD';
  const isPast = data.period === 'GENESIS';

  // Position content based on quadrant location to avoid the center slogan
  const horizontalClass = isPast ? 'right-0 text-right' : 'left-0 text-left';
  const paddingClass = isPast ? 'pr-8 md:pr-12 pl-16 md:pl-24' : 'pl-8 md:pl-12 pr-16 md:pr-24';

  return (
    <div className="relative h-full w-full group overflow-hidden bg-black border border-white/5">
      {/* Background Image with loading states */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isLoading ? 'scale-110 blur-xl opacity-20' : 'scale-100 opacity-60 group-hover:opacity-100 group-hover:scale-110'}`}
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Subtle Inner Frame */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none z-10 opacity-20 group-hover:opacity-40 transition-opacity" />

      {/* Atmospheric Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-t ${isGood ? 'from-amber-900/40' : 'from-red-950/40'} via-transparent to-transparent opacity-80 group-hover:opacity-40`} />
      
      {/* Content Area - Corner Positioned to stay clear of the center */}
      <div className={`absolute bottom-0 ${horizontalClass} ${paddingClass} pb-8 md:pb-12 z-20 w-full`}>
        
        {/* Biblical Verse - Styled in Bright distinct color */}
        {isPast && data.verse && (
          <div className="max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden mb-4">
            <p className="font-serif-hebrew text-amber-300 text-lg md:text-3xl leading-tight italic border-r-4 border-amber-500 pr-4 drop-shadow-[0_2px_15px_rgba(0,0,0,1)]">
              "{data.verse}"
            </p>
          </div>
        )}

        {/* Title */}
        <div className="transform transition-all duration-500 group-hover:-translate-y-1">
           <h4 className={`text-xl md:text-4xl font-black ${isPast ? 'font-serif-hebrew' : 'font-sans'} text-white drop-shadow-[0_4px_20px_rgba(0,0,0,1)]`}>
            {data.title}
          </h4>
        </div>

        {/* Description & Interactive Button */}
        <div className="max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden mt-3">
          <p className="text-[11px] md:text-sm text-zinc-100 leading-relaxed font-medium drop-shadow-md bg-black/50 backdrop-blur-md p-3 rounded inline-block">
            {data.description}
          </p>
          <div className="mt-5">
            <button 
              onClick={(e) => { e.stopPropagation(); onRefresh(); }}
              className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] bg-amber-600 hover:bg-amber-500 text-black rounded-sm shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              {isLoading ? 'יוצר...' : 'שנה תרחיש'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className={`absolute top-8 ${isPast ? 'right-8' : 'left-8'} z-20 pointer-events-none group-hover:opacity-0 transition-opacity duration-300`}>
        <div className="flex flex-col">
          <span className={`h-1.5 w-10 ${isGood ? 'bg-amber-500' : 'bg-red-600'} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}></span>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/80 backdrop-blur-xl">
           <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin shadow-[0_0_20px_rgba(245,158,11,0.4)]"></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Quadrant;
