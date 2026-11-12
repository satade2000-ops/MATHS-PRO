import React from 'react';
import { X, Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useMathApp } from '../context/MathContext';

export const PremiumModal: React.FC = () => {
  const { isPremiumOpen, closePremium, profile, togglePremium, t } = useMathApp();

  if (!isPremiumOpen) return null;

  const handleActivate = () => {
    togglePremium(true);
    closePremium();
  };

  const handleDeactivate = () => {
    togglePremium(false);
    closePremium();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-2xl border border-indigo-500/40 animate-fadeIn overflow-hidden">
        {/* Glow behind */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closePremium}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Crown Header */}
        <div className="text-center pt-2 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30 mb-3">
            <Crown className="w-9 h-9 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white">
            {t('premiumTitle')}
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {t('slogan')}
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-3 mb-6">
          {[
            { text: t('premiumBenefit1'), icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
            { text: t('premiumBenefit2'), icon: <Zap className="w-4 h-4 text-amber-400" /> },
            { text: t('premiumBenefit3'), icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
            { text: t('premiumBenefit4'), icon: <Crown className="w-4 h-4 text-orange-400" /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-semibold"
            >
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span className="text-slate-100">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        {profile.isPremium ? (
          <div className="space-y-2">
            <div className="w-full py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center text-xs flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>{t('premiumActive')}</span>
            </div>
            <button
              onClick={handleDeactivate}
              className="w-full py-2 text-xs text-slate-400 hover:text-white"
            >
              Désactiver l'abonnement VIP
            </button>
          </div>
        ) : (
          <button
            onClick={handleActivate}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>{t('activatePremium')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
