import React from 'react';
import { X, Smartphone, Download, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Play } from 'lucide-react';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Google Play Badge */}
        <div className="text-center pt-2 mb-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20 mb-3">
            <Smartphone className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
            Exportation vers Google Play Store
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            MATHS PRO est 100% conforme aux standards PWA / TWA du Play Store !
          </p>
        </div>

        {/* Status Checklist */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 mb-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Web App Manifest configuré (192px, 512px, maskable)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Mode hors-ligne (Service Worker autonome 100% local)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Ergonomie tactile mobile native (boutons 48px minimum)</span>
          </div>
        </div>

        {/* 3 Simple Steps */}
        <div className="space-y-3.5 mb-6 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Comment publier sur Google Play en 3 étapes :
          </span>

          {/* Étape 1 */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">1</span>
              <span>Générer le package Android (.aab)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Utilise <strong>PWABuilder</strong> (outil officiel soutenu par Google et Microsoft) ou <strong>Google Bubblewrap CLI</strong> :
            </p>
            <div className="mt-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 select-all">
              pwabuilder.com ➔ Entrer l'URL ➔ Télécharger le package Android (.aab)
            </div>
          </div>

          {/* Étape 2 */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">2</span>
              <span>Google Play Console</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Sur ton compte développeur Google Play, clique sur <em>Créer une application</em>, choisis le nom <strong>MATHS PRO</strong> et la catégorie <em>Éducation / Jeux</em>.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white mb-1">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">3</span>
              <span>Uploader le bundle et publier</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Dépose le fichier <code>.aab</code> signé dans la section <em>Production</em> de Google Play Console. L'application sera disponible mondialement !
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-98 transition-transform"
        >
          C'est compris !
        </button>
      </div>
    </div>
  );
};
