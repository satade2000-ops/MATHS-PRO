import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Music,
  Globe,
  Trash2,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { sound } from '../utils/audio';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    openPlayStore,
    openPrivacy,
    settings,
    updateSettings,
    resetAllData,
    t,
  } = useMathApp();

  const [confirmReset, setConfirmReset] = useState(false);

  if (!isSettingsOpen) return null;

  const handleReset = () => {
    resetAllData();
    setConfirmReset(false);
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-850 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-fadeIn flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
            {t('settingsTitle')}
          </h2>
          <button
            onClick={closeSettings}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 text-xs font-semibold">
          {/* Langue */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>{t('language')}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateSettings({ language: 'fr' })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  settings.language === 'fr'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Français 🇫🇷
              </button>
              <button
                onClick={() => updateSettings({ language: 'en' })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  settings.language === 'en'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                English 🇬🇧
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              {settings.darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{t('theme')}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateSettings({ darkMode: false })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  !settings.darkMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('light')}
              </button>
              <button
                onClick={() => updateSettings({ darkMode: true })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  settings.darkMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('dark')}
              </button>
            </div>
          </div>

          {/* Effets Sonores */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span>{t('soundEffects')}</span>
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
            />
          </div>

          {/* Musique */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Music className="w-4 h-4 text-violet-500" />
              <span>{t('music')}</span>
            </span>
            <input
              type="checkbox"
              checked={settings.musicEnabled}
              onChange={(e) => updateSettings({ musicEnabled: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
            />
          </div>

          {/* Mode de saisie par défaut */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">{t('inputMethod')}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateSettings({ defaultInputMethod: 'multiple_choice' })}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  settings.defaultInputMethod === 'multiple_choice'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('multipleChoice')}
              </button>
              <button
                onClick={() => updateSettings({ defaultInputMethod: 'numpad' })}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  settings.defaultInputMethod === 'numpad'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('numpad')}
              </button>
            </div>
          </div>

          {/* Google Play Store Export Guide */}
          <div className="pt-1">
            <button
              onClick={() => {
                closeSettings();
                openPlayStore();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
            >
              <span>📲</span>
              <span>Guide d'exportation Google Play Store (.aab)</span>
            </button>
          </div>

          {/* Privacy & AdSense disclosure */}
          <div>
            <button
              onClick={() => {
                closeSettings();
                openPrivacy();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>🔒</span>
              <span>{settings.language === 'fr' ? 'Confidentialité & Publicité' : 'Privacy & Advertising'}</span>
            </button>
          </div>

          {/* Reset All Data */}
          <div className="pt-2">
            {confirmReset ? (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
                <p className="text-rose-700 dark:text-rose-300 text-[11px] font-semibold leading-relaxed">
                  {t('resetConfirm')}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                  >
                    {t('confirm')}
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-98 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('resetData')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
