import React from 'react';
import { ShieldCheck, Info, Mail } from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';

export const AppFooter: React.FC = () => {
  const { settings, activeInfoPage, openPrivacy, openAbout, openContact } = useMathApp();
  const isFr = settings.language === 'fr';

  const handleNav = (fn: () => void) => {
    sound.playClick();
    fn();
  };

  return (
    <footer className="mt-6 pt-5 pb-24 px-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-tight text-slate-700 dark:text-slate-200 font-display">
          <span>MATHS PRO</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {isFr ? 'Jeux de Mathématiques' : 'Mathematics Games'}
          </span>
        </div>

        <nav
          aria-label={isFr ? 'Liens de pied de page' : 'Footer links'}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <button
            onClick={() => handleNav(openPrivacy)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeInfoPage === 'privacy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isFr ? 'Confidentialité' : 'Privacy'}</span>
          </button>

          <button
            onClick={() => handleNav(openAbout)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeInfoPage === 'about'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{isFr ? 'À propos' : 'About'}</span>
          </button>

          <button
            onClick={() => handleNav(openContact)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeInfoPage === 'contact'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isFr ? 'Contact' : 'Contact'}</span>
          </button>
        </nav>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} MATHS PRO
        </p>
      </div>
    </footer>
  );
};
