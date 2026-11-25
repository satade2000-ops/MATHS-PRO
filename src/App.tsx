import React from 'react';
import { MathProvider, useMathApp } from './context/MathContext';
import { Navbar } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { GamesTab } from './components/GamesTab';
import { ChallengesTab } from './components/ChallengesTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { ProfileTab } from './components/ProfileTab';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { SettingsModal } from './components/SettingsModal';
import { PremiumModal } from './components/PremiumModal';
import { AdModal } from './components/AdModal';
import { PlayStoreModal } from './components/PlayStoreModal';
import { PrivacyPage } from './components/PrivacyPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { TermsPage } from './components/TermsPage';
import { LegalNoticePage } from './components/LegalNoticePage';
import { LessonsPage } from './components/LessonsPage';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AppFooter } from './components/AppFooter';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    activeInfoPage,
    activeGame,
    activeResult,
    isPlayStoreOpen,
    closePlayStore,
    showExitPrompt,
    settings,
  } = useMathApp();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col items-center">
      {/* Mobile/Tablet Application Container */}
      <div className="w-full max-w-2xl min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/90 shadow-xl border-x border-slate-200/60 dark:border-slate-800/60 relative">
        {/* Navigation Top Bar */}
        <Navbar />

        {/* Dynamic Page or Tab Content */}
        <main className="flex-1 px-4 sm:px-6 pt-5">
          {activeInfoPage === 'privacy' ? (
            <PrivacyPage />
          ) : activeInfoPage === 'about' ? (
            <AboutPage />
          ) : activeInfoPage === 'contact' ? (
            <ContactPage />
          ) : activeInfoPage === 'terms' ? (
            <TermsPage />
          ) : activeInfoPage === 'legal' ? (
            <LegalNoticePage />
          ) : activeInfoPage === 'lessons' ? (
            <LessonsPage />
          ) : (
            <>
              {activeTab === 'home' && <HomeTab />}
              {activeTab === 'games' && <GamesTab />}
              {activeTab === 'challenges' && <ChallengesTab />}
              {activeTab === 'leaderboard' && <LeaderboardTab />}
              {activeTab === 'profile' && <ProfileTab />}
            </>
          )}
        </main>

        {/* Global Accessible Footer */}
        <AppFooter />

        {/* Cookie Consent CMP Banner & Modal */}
        <CookieConsentBanner />

        {/* Double-Back to Exit Toast */}
        {showExitPrompt && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-bold shadow-xl border border-slate-700/80 whitespace-nowrap pointer-events-none animate-fadeIn"
          >
            {settings.language === 'fr'
              ? "Appuyez une 2ᵉ fois sur Retour pour quitter"
              : 'Press Back again to exit the app'}
          </div>
        )}

        {/* Active Fullscreen Game Modal */}
        {activeGame && <GameScreen />}

        {/* Game Finished Result Modal */}
        {activeResult && <ResultScreen />}

        {/* Global Modals */}
        <SettingsModal />
        <PremiumModal />
        <AdModal />
        <PlayStoreModal isOpen={isPlayStoreOpen} onClose={closePlayStore} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <MathProvider>
      <MainAppContent />
    </MathProvider>
  );
}
