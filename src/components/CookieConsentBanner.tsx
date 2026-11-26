import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Sliders, X, Check } from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';
import { shouldDisplayBottomAdBanner } from '../config/adConfig';

export const CookieConsentBanner: React.FC = () => {
  const {
    cookieConsent,
    isCookieModalOpen,
    openCookieModal,
    closeCookieModal,
    acceptAllCookies,
    rejectOptionalCookies,
    saveCustomCookieConsent,
    openPrivacy,
    settings,
    profile,
    activeGame,
  } = useMathApp();

  const isFr = settings.language === 'fr';
  const isBottomBannerVisible = shouldDisplayBottomAdBanner({
    isPremium: profile.isPremium,
    hasActiveGame: Boolean(activeGame),
    consentDecided: cookieConsent.decided,
    consentAds: cookieConsent.ads,
  });
  const [adsToggle, setAdsToggle] = useState<boolean>(cookieConsent.ads);

  useEffect(() => {
    setAdsToggle(cookieConsent.ads);
  }, [cookieConsent.ads, isCookieModalOpen]);

  // Do not interrupt active gameplay with the initial consent prompt
  const shouldShowBanner = !cookieConsent.decided && !isCookieModalOpen && !activeGame;

  return (
    <>
      {/* Initial GDPR / CMP Banner */}
      {shouldShowBanner && (
        <aside
          role="dialog"
          aria-live="polite"
          aria-label={isFr ? 'Gestion des cookies' : 'Cookie Consent'}
          className={`fixed left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-1.5rem)] max-w-xl rounded-3xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg border border-slate-200 dark:border-slate-700 shadow-2xl p-4 sm:p-5 animate-fadeIn ${
            isBottomBannerVisible ? 'bottom-32' : 'bottom-20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                {isFr ? 'Respect de votre vie privée et cookies' : 'Your Privacy & Cookies'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isFr
                  ? "MATHS PRO utilise le stockage local essentiel pour sauvegarder vos scores hors-ligne. Avec votre accord, Google AdSense peut utiliser des cookies publicitaires (désactivés par défaut avant votre choix). "
                  : 'MATHS PRO uses essential local storage to save your offline game progress. With your consent, Google AdSense may use advertising cookies (disabled by default until you choose). '}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    openPrivacy();
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 underline hover:brightness-110"
                >
                  {isFr ? 'En savoir plus' : 'Learn more'}
                </button>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    rejectOptionalCookies();
                  }}
                  className="px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  {isFr ? 'Tout refuser' : 'Reject non-essential'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    openCookieModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 text-xs font-bold transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Personnaliser' : 'Customize'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    acceptAllCookies();
                  }}
                  className="px-4 py-2 min-h-[40px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-colors ml-auto"
                >
                  {isFr ? 'Tout accepter' : 'Accept all'}
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Detailed Cookie Preferences Modal */}
      {isCookieModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isFr ? 'Préférences de cookies' : 'Cookie Preferences'}
          className="fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                  {isFr ? 'Préférences de cookies' : 'Cookie Preferences'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCookieModal}
                aria-label={isFr ? 'Fermer' : 'Close'}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Essential Storage (Always ON) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isFr ? 'Stockage local essentiel (obligatoire)' : 'Essential Local Storage (Required)'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isFr
                      ? 'Sauvegarde de vos scores, progression, langue, thème sombre/clair et choix de confidentialité sur votre appareil.'
                      : 'Saves your scores, progression, language, theme, and privacy choices locally on your device.'}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] shrink-0">
                  {isFr ? 'Toujours actif' : 'Always on'}
                </span>
              </div>

              {/* Advertising Cookies (Google AdSense) */}
              <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isFr ? 'Cookies publicitaires (Google AdSense)' : 'Advertising Cookies (Google AdSense)'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isFr
                      ? "Permet l'affichage et la mesure des annonces gratuites hors des parties actives et hors mode VIP."
                      : 'Enables ad delivery and measurement outside active gameplay and VIP mode.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={adsToggle}
                  onChange={(e) => setAdsToggle(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer rounded mt-0.5 shrink-0"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  rejectOptionalCookies();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                {isFr ? 'Tout refuser' : 'Reject all'}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  saveCustomCookieConsent(adsToggle);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{isFr ? 'Enregistrer mes choix' : 'Save preferences'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
