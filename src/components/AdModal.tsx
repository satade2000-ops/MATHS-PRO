import React, { useState, useEffect } from 'react';
import { X, Tv, Sparkles, CheckCircle2 } from 'lucide-react';
import { useMathApp } from '../context/MathContext';

export const AdModal: React.FC = () => {
  const { isAdOpen, closeAdModal, doubleLastGameXp, profile } = useMathApp();
  const [countdown, setCountdown] = useState(4);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isAdOpen || profile.isPremium) {
      setCountdown(4);
      setIsCompleted(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdOpen, profile.isPremium]);

  if (!isAdOpen || profile.isPremium) return null;

  const handleClaim = () => {
    doubleLastGameXp();
    closeAdModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-700 animate-fadeIn text-center">
        {/* Ad Indicator */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold">
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>Annonce Récompensée</span>
          </span>
          {isCompleted ? (
            <button
              onClick={closeAdModal}
              className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="font-mono font-bold text-amber-400">{countdown}s</span>
          )}
        </div>

        {/* Sponsor Content */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 text-3xl">
            🧠
          </div>
          <h3 className="text-base font-extrabold text-white font-display">
            Club des Génies Scientifiques
          </h3>
          <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
            « Entraîne ton esprit tous les jours pour débloquer ton plein potentiel logique et analytique ! »
          </p>

          {/* Progress bar */}
          <div className="mt-4 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${((4 - countdown) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Claim Button */}
        {isCompleted ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>Récupérer mes 2x XP !</span>
          </button>
        ) : (
          <div className="text-xs text-slate-400 py-2">
            La récompense se débloque dans {countdown} secondes...
          </div>
        )}
      </div>
    </div>
  );
};
