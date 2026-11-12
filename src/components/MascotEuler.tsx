import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'teaching';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MascotEuler: React.FC<MascotProps> = ({
  mood = 'teaching',
  message,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }[size];

  return (
    <div className="flex items-center gap-3">
      {/* Illustrated SVG Avatar for Euler Mascot */}
      <div className={`relative ${sizeClasses} shrink-0`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md flex items-center justify-center overflow-hidden border-2 border-white/40 dark:border-indigo-400/30">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Background sparkle */}
            <circle cx="50" cy="50" r="45" fill="url(#eulerGrad)" opacity="0.3" />
            <defs>
              <linearGradient id="eulerGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>

            {/* Hat / Hair */}
            <path d="M25 40 Q50 18 75 40" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="50" cy="28" rx="14" ry="7" fill="#F59E0B" />
            <rect x="42" y="22" width="16" height="5" rx="2" fill="#D97706" />

            {/* Face */}
            <circle cx="50" cy="52" r="26" fill="#FDE68A" />

            {/* Glasses */}
            <circle cx="41" cy="50" r="8" stroke="#1E293B" strokeWidth="2.5" fill="white" fillOpacity="0.4" />
            <circle cx="59" cy="50" r="8" stroke="#1E293B" strokeWidth="2.5" fill="white" fillOpacity="0.4" />
            <line x1="49" y1="50" x2="51" y2="50" stroke="#1E293B" strokeWidth="2.5" />

            {/* Eyes */}
            <circle cx="41" cy="50" r="3" fill="#1E293B" />
            <circle cx="59" cy="50" r="3" fill="#1E293B" />
            <circle cx="42" cy="48.5" r="1" fill="#FFFFFF" />
            <circle cx="60" cy="48.5" r="1" fill="#FFFFFF" />

            {/* Cheeks */}
            <ellipse cx="33" cy="58" rx="4" ry="2" fill="#F43F5E" opacity="0.4" />
            <ellipse cx="67" cy="58" rx="4" ry="2" fill="#F43F5E" opacity="0.4" />

            {/* Smile / Mouth */}
            {mood === 'celebrating' || mood === 'happy' ? (
              <path d="M43 62 Q50 72 57 62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="#DC2626" />
            ) : mood === 'thinking' ? (
              <path d="M44 65 Q50 62 56 65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M44 63 Q50 69 56 63" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Mustache / Beard */}
            <path d="M42 59 Q46 64 50 60 Q54 64 58 59" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Floating Math Symbols */}
            <text x="12" y="32" fill="#60A5FA" fontSize="12" fontWeight="bold">π</text>
            <text x="76" y="34" fill="#34D399" fontSize="12" fontWeight="bold">∑</text>
            <text x="74" y="80" fill="#F472B6" fontSize="12" fontWeight="bold">√</text>
          </svg>
        </div>

        {/* Small Mood Badge */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold shadow-sm">
          {mood === 'celebrating' ? '🎉' : mood === 'happy' ? '⭐' : mood === 'thinking' ? '💡' : '📐'}
        </div>
      </div>

      {/* Message speech bubble if present */}
      {message && (
        <div className="relative flex-1 bg-white dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 shadow-sm text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b border-l border-slate-200/80 dark:border-slate-700/80 rotate-45" />
          <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5 flex items-center gap-1.5">
            <span>Professeur Euler</span>
            <span className="text-[10px] text-slate-400 font-normal">· Guide Mathématique</span>
          </div>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};
