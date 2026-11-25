import React from 'react';
import {
  ArrowLeft,
  Home,
  FileText,
  BookOpen,
  Gamepad2,
  ShieldCheck,
  AlertTriangle,
  Copyright,
  Scale,
  Mail,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { SITE_CONFIG } from '../config/siteConfig';
import { sound } from '../utils/audio';

export const TermsPage: React.FC = () => {
  const { settings, goHome, openPrivacy, openLegalNotice, openContact } = useMathApp();
  const isFr = settings.language === 'fr';

  const handleBackHome = () => {
    sound.playClick();
    goHome();
  };

  return (
    <div className="space-y-5 pb-6 animate-fadeIn select-text">
      {/* Top Return Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>

        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60">
          {isFr
            ? `Mise à jour : ${SITE_CONFIG.termsLastUpdated.fr}`
            : `Last updated: ${SITE_CONFIG.termsLastUpdated.en}`}
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 via-indigo-900 to-violet-900 text-white p-6 shadow-xl shadow-indigo-500/15 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
              {isFr ? 'Cadre d’utilisation' : 'Terms of Service'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-0.5">
              {isFr ? "Conditions Générales d'Utilisation" : 'Terms & Conditions of Use'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 leading-relaxed">
              {isFr
                ? 'Règles d’accès et d’utilisation de la plateforme éducative interactive MATHS PRO.'
                : 'Rules governing access to and use of the MATHS PRO interactive educational platform.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. Objet */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '1. Objet et description du service' : '1. Purpose & Service Description'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? `MATHS PRO (${SITE_CONFIG.siteUrl}) est une application web éducative gratuite dédiée à l'apprentissage et au perfectionnement en mathématiques (arithmétique, algèbre, géométrie, fractions, équations, fonctions, statistiques et probabilités) via des cours, des fiches méthode et des exercices interactifs.`
              : `MATHS PRO (${SITE_CONFIG.siteUrl}) is a free educational web application dedicated to learning and practicing mathematics (arithmetic, algebra, geometry, fractions, equations, functions, statistics, and probability) through structured lessons, method guides, and interactive exercises.`}
          </p>
        </section>

        {/* 2. Accès et utilisation loyale */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '2. Accès libre et bon usage' : '2. Free Access & Acceptable Use'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5">
            <p>
              {isFr
                ? "L'accès aux jeux, aux cours et aux pages d'information est ouvert gratuitement sans création de compte obligatoire. L'utilisateur s'engage à utiliser l'application de manière loyale et respectueuse :"
                : 'Access to games, lessons, and information pages is free without mandatory account registration. Users agree to use the platform fairly and lawfully:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isFr
                  ? "Ne pas perturber le fonctionnement technique du site (automatisation abusive, tentatives d'intrusion, surcharge volontaire)."
                  : 'Do not disrupt technical operation (abusive scraping, intrusion attempts, or deliberate overload).'}
              </li>
              <li>
                {isFr
                  ? "Ne pas choisir de pseudonyme local portant atteinte aux droits de tiers ou contenant des propos illicites."
                  : 'Do not enter local nicknames that infringe third-party rights or contain unlawful language.'}
              </li>
              <li>
                {isFr
                  ? "Les fonctionnalités marquées « Démo » (telles que l'activation locale du mode VIP ou le classement de référence hors-ligne) sont fournies à titre purement fonctionnel sans transaction financière sur le web."
                  : 'Features marked "Demo" (such as local VIP preview or offline reference leaderboard) are provided purely as local functionality with no real-money web checkout.'}
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Propriété intellectuelle */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Copyright className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '3. Propriété intellectuelle' : '3. Intellectual Property'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? "Les textes pédagogiques, cours, illustrations, logos, interfaces graphiques et le code source propres à MATHS PRO sont protégés par les règles applicables en matière de propriété intellectuelle. L'usage personnel, familial et scolaire (en classe ou en révision individuelle) est librement autorisé ; toute reproduction commerciale ou redistribution massive sans autorisation écrite préalable est interdite."
              : 'Educational texts, lessons, illustrations, logos, UI designs, and original source code of MATHS PRO are protected by applicable intellectual property laws. Personal, family, and classroom study use is freely permitted; commercial reproduction or bulk redistribution without prior written consent is prohibited.'}
          </p>
        </section>

        {/* 4. Publicité & cookies */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '4. Financement publicitaire et vie privée' : '4. Advertising & Privacy'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? "Afin de maintenir un accès gratuit, MATHS PRO peut intégrer des emplacements publicitaires via Google AdSense (sous réserve d'approbation du site par Google et de votre consentement explicite aux cookies publicitaires). Le détail complet du traitement des données et des cookies figure dans notre Politique de Confidentialité."
              : 'To keep the platform free, MATHS PRO may integrate Google AdSense placements (subject to Google approval and your explicit cookie consent). Full details on data processing and cookies are available in our Privacy Policy.'}
          </p>
        </section>

        {/* 5. Responsabilité */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '5. Disponibilité et limitation de responsabilité' : '5. Availability & Disclaimer'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? "Nous veillons à la qualité pédagogique des exercices et à la continuité d'accès au service. Toutefois, MATHS PRO est fourni « en l'état » à titre d'outil d'entraînement et de révision : il ne se substitue pas à un enseignement scolaire officiel. La sauvegarde locale dépendant du navigateur de l'utilisateur, la suppression du cache ou des données du navigateur entraîne l'effacement des scores locaux."
              : 'We strive to ensure accurate educational content and reliable access. However, MATHS PRO is provided "as is" as a study and practice tool and does not replace formal schooling. Because local game progress relies on browser storage, clearing browser site data resets local scores.'}
          </p>
        </section>

        {/* 6. Modification & Liens */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '6. Évolution des CGU et contact' : '6. Updates & Contact'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? "Les présentes conditions peuvent être mises à jour à tout moment pour refléter l'évolution des fonctionnalités ou de la réglementation. En continuant d'utiliser MATHS PRO après publication d'une mise à jour, vous acceptez la version révisée."
              : 'These terms may be updated to reflect new features or regulatory changes. Continuing to use MATHS PRO after updates implies acceptance of the revised terms.'}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                sound.playClick();
                openPrivacy();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <span>{isFr ? 'Confidentialité' : 'Privacy Policy'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                openLegalNotice();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <span>{isFr ? 'Mentions légales' : 'Legal Notice'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                openContact();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isFr ? 'Contact' : 'Contact'}</span>
            </button>
          </div>
        </section>
      </div>

      <div>
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>
      </div>
    </div>
  );
};
