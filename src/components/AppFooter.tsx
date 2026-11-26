import React from 'react';
import {
  ShieldCheck,
  Info,
  Mail,
  FileText,
  Landmark,
  BookOpen,
  Cookie,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';
import { shouldDisplayBottomAdBanner } from '../config/adConfig';

export const AppFooter: React.FC = () => {
  const {
    settings,
    profile,
    activeGame,
    cookieConsent,
    activeInfoPage,
    openLessons,
    openPrivacy,
    openAbout,
    openContact,
    openTerms,
    openLegalNotice,
    openCookieModal,
  } = useMathApp();
  const isFr = settings.language === 'fr';
  const isBottomBannerVisible = shouldDisplayBottomAdBanner({
    isPremium: profile.isPremium,
    hasActiveGame: Boolean(activeGame),
    consentDecided: cookieConsent.decided,
    consentAds: cookieConsent.ads,
  });

  const handleNav = (fn: () => void) => {
    sound.playClick();
    fn();
  };

  const navItems = [
    {
      id: 'lessons',
      label: isFr ? 'Cours & Fiches' : 'Lessons',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      action: openLessons,
      active: activeInfoPage === 'lessons',
    },
    {
      id: 'about',
      label: isFr ? 'À propos' : 'About',
      icon: <Info className="w-3.5 h-3.5" />,
      action: openAbout,
      active: activeInfoPage === 'about',
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail className="w-3.5 h-3.5" />,
      action: openContact,
      active: activeInfoPage === 'contact',
    },
    {
      id: 'privacy',
      label: isFr ? 'Confidentialité' : 'Privacy',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      action: openPrivacy,
      active: activeInfoPage === 'privacy',
    },
    {
      id: 'terms',
      label: isFr ? 'CGU' : 'Terms',
      icon: <FileText className="w-3.5 h-3.5" />,
      action: openTerms,
      active: activeInfoPage === 'terms',
    },
    {
      id: 'legal',
      label: isFr ? 'Mentions légales' : 'Legal Notice',
      icon: <Landmark className="w-3.5 h-3.5" />,
      action: openLegalNotice,
      active: activeInfoPage === 'legal',
    },
  ];

  return (
    <footer
      className={`mt-6 pt-5 px-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 ${
        isBottomBannerVisible ? 'pb-36' : 'pb-24'
      }`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-tight text-slate-700 dark:text-slate-200 font-display">
          <span>MATHS PRO</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {isFr ? 'Plateforme Éducative de Mathématiques' : 'Interactive Math Learning Platform'}
          </span>
        </div>

        <nav
          aria-label={isFr ? 'Liens de pied de page' : 'Footer links'}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.action)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold transition-all active:scale-95 ${
                item.active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => handleNav(openCookieModal)}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all active:scale-95"
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>{isFr ? 'Cookies' : 'Cookies'}</span>
          </button>
        </nav>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} MATHS PRO ·{' '}
          {isFr ? 'Tous droits réservés' : 'All rights reserved'}
        </p>
      </div>
    </footer>
  );
};
