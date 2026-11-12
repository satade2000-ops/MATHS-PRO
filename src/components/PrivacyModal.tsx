import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useMathApp } from '../context/MathContext';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyOpen, closePrivacy, settings } = useMathApp();

  if (!isPrivacyOpen) return null;

  const isFr = settings.language === 'fr';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white font-display">
              {isFr ? 'Confidentialité & Publicité' : 'Privacy & Advertising'}
            </h2>
          </div>
          <button
            onClick={closePrivacy}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            aria-label={isFr ? 'Fermer' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-y-auto pr-1">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              {isFr ? '1. Données locales et mode invité' : '1. Local Data & Guest Mode'}
            </h3>
            <p>
              {isFr
                ? "MATHS PRO fonctionne en mode invité sans inscription. Vos scores, niveaux, badges et préférences sont enregistrés localement sur votre appareil via le stockage du navigateur (localStorage) et ne sont transmis à aucun serveur."
                : 'MATHS PRO works in guest mode with no sign-up required. Your scores, levels, badges, and preferences are stored locally on your device using browser storage (localStorage) and are not sent to any external server.'}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              {isFr ? '2. Google AdSense et cookies' : '2. Google AdSense & Cookies'}
            </h3>
            <p>
              {isFr
                ? "La version gratuite utilise Google AdSense (éditeur ca-pub-4256744845246337). Des fournisseurs tiers, dont Google, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures. Les annonces n'apparaissent jamais pendant une question mathématique en cours."
                : 'The free version uses Google AdSense (publisher ca-pub-4256744845246337). Third-party vendors, including Google, use cookies to serve ads based on prior visits. Ads never appear during an active math question.'}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              {isFr ? '3. Suppression et Mode VIP' : '3. Data Deletion & VIP Mode'}
            </h3>
            <p>
              {isFr
                ? "Vous pouvez désactiver toutes les publicités via le mode VIP ou réinitialiser l'ensemble de vos données locales à tout moment depuis les Paramètres."
                : 'You can disable all ads via VIP mode or reset all your local data at any time from Settings.'}
            </p>
          </div>
        </div>

        <button
          onClick={closePrivacy}
          className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm active:scale-98 transition-transform shrink-0"
        >
          {isFr ? 'Fermer' : 'Close'}
        </button>
      </div>
    </div>
  );
};
