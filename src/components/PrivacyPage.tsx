import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Lock,
  Cookie,
  Megaphone,
  Share2,
  UserCheck,
  Trash2,
  Baby,
  Mail,
  Home,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { SITE_CONFIG } from '../config/siteConfig';
import { sound } from '../utils/audio';

export const PrivacyPage: React.FC = () => {
  const { settings, goHome, openContact, openSettings, openCookieModal } = useMathApp();
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
            ? `Mise à jour : ${SITE_CONFIG.privacyLastUpdated.fr}`
            : `Last updated: ${SITE_CONFIG.privacyLastUpdated.en}`}
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 shadow-xl shadow-indigo-500/15 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
              {isFr ? 'Transparence & Protection' : 'Transparency & Protection'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-0.5">
              {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 leading-relaxed">
              {isFr
                ? 'Comment MATHS PRO fonctionne, quelles données restent sur votre appareil et comment vos droits sont respectés.'
                : 'How MATHS PRO works, what data stays on your device, and how your privacy rights are respected.'}
            </p>
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-4">
        {/* 1. Données collectées */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '1. Informations collectées et stockage local' : '1. Information Collected & Local Storage'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "MATHS PRO fonctionne entièrement en mode invité, sans création de compte, sans mot de passe et sans base de données distante de joueurs."
                : 'MATHS PRO runs in guest mode with no account registration, no password, and no remote player database.'}
            </p>
            <p>
              {isFr
                ? "Les seules données liées à votre progression sont enregistrées uniquement en local sur votre propre appareil via le stockage du navigateur (localStorage) :"
                : 'The only gameplay data saved is stored strictly locally on your own device via browser storage (localStorage):'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isFr
                  ? "Profil de jeu local : pseudonyme choisi (par défaut « Champion des Maths »), avatar sélectionné, niveau, points d'expérience (XP), étoiles, pièces virtuelles, série quotidienne, badges débloqués, statistiques par opération et historique des 20 dernières parties."
                  : 'Local game profile: chosen nickname (default "Champion des Maths"), avatar, level, XP, stars, virtual coins, daily streak, unlocked badges, per-operation stats, and last 20 game records.'}
              </li>
              <li>
                {isFr
                  ? "Préférences d'interface : langue (français ou anglais), thème clair/sombre, activation des sons et de la musique, mode de saisie (QCM ou clavier), durée du mode chrono, nombre de questions en examen et difficulté par défaut."
                  : 'Interface preferences: language (French or English), light/dark theme, sound/music toggles, input mode (multiple choice or keypad), timer length, exam question count, and default difficulty.'}
              </li>
              <li>
                {isFr
                  ? "Cache hors-ligne (PWA) : les fichiers techniques de l'application (pages, scripts, icônes, polices) sont mis en cache sur votre appareil par le Service Worker afin de permettre l'utilisation hors connexion."
                  : 'Offline PWA cache: technical app assets (pages, scripts, icons, fonts) are cached on your device by the Service Worker for offline play.'}
              </li>
            </ul>
            <p>
              {isFr
                ? "Si vous utilisez volontairement le formulaire de la page Contact (lorsqu'un service d'envoi est configuré par l'administrateur), les informations saisies (nom et prénom, adresse e-mail, objet et message) sont transmises uniquement pour traiter votre demande."
                : 'If you voluntarily submit the Contact page form (when an email/form service is configured by the administrator), the information entered (full name, email address, subject, and message) is transmitted solely to answer your request.'}
            </p>
          </div>
        </section>

        {/* 2. Utilisation des données */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '2. Utilisation des données' : '2. How Data Is Used'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5">
            <p>
              {isFr
                ? 'Les données enregistrées localement et les éventuelles demandes envoyées via la page Contact servent exclusivement à :'
                : 'Locally stored data and any inquiries sent via the Contact page are used exclusively to:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isFr ? 'Sauvegarder vos scores, niveaux, trophées et réglages entre deux sessions sur votre appareil.' : 'Save your scores, levels, trophies, and preferences across sessions on your device.'}</li>
              <li>{isFr ? 'Afficher votre progression personnelle dans le classement local et votre profil.' : 'Display your personal progress in the local leaderboard and your profile.'}</li>
              <li>{isFr ? 'Assurer le fonctionnement hors-ligne de la Progressive Web App (PWA).' : 'Support offline Progressive Web App (PWA) functionality.'}</li>
              <li>{isFr ? 'Répondre aux messages que vous adressez volontairement à l’administration.' : 'Respond to messages you voluntarily send to administration.'}</li>
            </ul>
          </div>
        </section>

        {/* 3. Protection et sécurité */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '3. Protection et sécurité des données' : '3. Data Protection & Security'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "L'application web est servie via le protocole sécurisé HTTPS (chiffrement TLS en transit) sur l'infrastructure d'hébergement Vercel."
                : 'The web application is served over HTTPS (TLS encryption in transit) via Vercel hosting infrastructure.'}
            </p>
            <p>
              {isFr
                ? "Par choix de sobriété (minimisation des données), MATHS PRO ne collecte aucun mot de passe, aucune donnée bancaire et n'héberge pas votre profil de jeu sur un serveur central. Vos données de jeu restent isolées dans le navigateur de votre appareil ; toute personne ayant physiquement accès à votre appareil ou navigateur déverrouillé peut toutefois consulter ou effacer ces données locales."
                : 'By design (data minimization), MATHS PRO collects no passwords, no payment details, and does not host your game profile on a central server. Your game data stays isolated inside your device browser; anyone with physical access to your unlocked device or browser may view or clear this local data.'}
            </p>
          </div>
        </section>

        {/* 4. Cookies */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '4. Utilisation des cookies et du stockage navigateur' : '4. Cookies & Browser Storage'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "MATHS PRO n'utilise pas ses propres cookies de suivi publicitaire ou d'analyse comportementale. L'application utilise le stockage local (localStorage) et le cache PWA uniquement pour mémoriser votre partie et vos paramètres."
                : 'MATHS PRO does not set its own tracking or analytics cookies. The app relies on localStorage and PWA cache strictly to remember your game progress and settings.'}
            </p>
            <p>
              {isFr
                ? "Des services tiers intégrés pour le financement gratuit de l'application (notamment Google AdSense) peuvent déposer ou lire des cookies publicitaires uniquement après votre consentement explicite via la bannière de gestion des cookies (Google Consent Mode v2). Par défaut, avant votre choix ou en cas de refus, les requêtes publicitaires restent bloquées."
                : 'Third-party services integrated to support the free version (specifically Google AdSense) may set or read advertising cookies only after your explicit consent via the Cookie Consent Manager (Google Consent Mode v2). By default, before your choice or if declined, ad requests remain paused.'}
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                openCookieModal();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-bold transition-colors"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>{isFr ? 'Gérer mes préférences de cookies' : 'Manage Cookie Preferences'}</span>
            </button>
          </div>
        </section>

        {/* 5. Google AdSense */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '5. Google AdSense et technologies publicitaires' : '5. Google AdSense & Advertising Technologies'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "La version gratuite de MATHS PRO intègre Google AdSense (identifiant éditeur ca-pub-4256744845246337) afin de financer le maintien et l'amélioration de la plateforme."
                : 'The free version of MATHS PRO integrates Google AdSense (publisher ID ca-pub-4256744845246337) to support maintaining and improving the platform.'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {isFr
                  ? "Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures d'un utilisateur sur ce site web ou sur d'autres sites."
                  : 'Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites.'}
              </li>
              <li>
                {isFr
                  ? "Grâce aux cookies publicitaires, Google et ses partenaires peuvent proposer des annonces adaptées aux utilisateurs en fonction de leur navigation sur Internet."
                  : 'Advertising cookies enable Google and its partners to serve ads to users based on their visits to this site and/or other sites on the Internet.'}
              </li>
              <li>
                {isFr
                  ? "Respect de la concentration : les requêtes publicitaires sont suspendues pendant toute partie mathématique active et totalement désactivées lorsque le mode VIP est actif."
                  : 'Focus protection: ad requests are paused during any active math match and completely disabled when VIP mode is enabled.'}
              </li>
            </ul>
            <p>
              {isFr
                ? 'Vous pouvez désactiver la publicité personnalisée à tout moment depuis les paramètres des annonces Google :'
                : 'You can opt out of personalized advertising at any time via Google Ads Settings:'}{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 underline hover:brightness-110"
              >
                <span>adssettings.google.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              .
            </p>
          </div>
        </section>

        {/* 6. Partage avec des services tiers */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '6. Partage avec des services tiers' : '6. Sharing with Third-Party Services'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "MATHS PRO ne vend, ne loue et n'échange aucune donnée personnelle. Seuls les prestataires techniques indispensables au fonctionnement du site interviennent :"
                : 'MATHS PRO does not sell, rent, or trade any personal data. Only technical providers required to operate the site are involved:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Vercel</strong> :{' '}
                {isFr
                  ? "hébergement statique du site et journalisation technique standard des requêtes HTTP (adresse IP technique, navigateur) pour la sécurité et la disponibilité."
                  : 'static web hosting and standard technical HTTP request logs for security and uptime.'}
              </li>
              <li>
                <strong>Google AdSense</strong> :{' '}
                {isFr
                  ? "diffusion et mesure des annonces sur la version gratuite (lorsque la diffusion est activée et hors mode VIP)."
                  : 'ad delivery and measurement on the free web version (when enabled and outside VIP mode).'}
              </li>
              <li>
                <strong>Google Fonts</strong> :{' '}
                {isFr
                  ? "chargement des polices d'affichage (Outfit, Plus Jakarta Sans, Space Mono)."
                  : 'loading display typography (Outfit, Plus Jakarta Sans, Space Mono).'}
              </li>
              <li>
                {isFr
                  ? 'Service de messagerie / formulaire de contact (lorsque configuré) : utilisé uniquement pour acheminer les messages que vous choisissez d’envoyer via la page Contact.'
                  : 'Contact form / email handler (when configured): used strictly to deliver messages you choose to submit via the Contact page.'}
              </li>
            </ul>
          </div>
        </section>

        {/* 7. Droits des utilisateurs */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '7. Vos droits concernant vos données' : '7. Your Data Rights'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? "Conformément aux principes applicables en matière de protection des données (y compris le RGPD pour les utilisateurs européens), vous disposez du droit d'accès, de rectification (par exemple en modifiant votre pseudonyme ou avatar dans l'onglet Profil), d'opposition à la publicité personnalisée via votre navigateur ou les paramètres Google, ainsi que du droit à l'effacement de vos données."
              : 'In line with applicable data protection principles (including GDPR for European users), you have the right to access, rectify (e.g., editing your nickname or avatar in the Profile tab), object to personalized advertising via your browser or Google Ads Settings, and erase your data.'}
          </p>
        </section>

        {/* 8. Suppression des données */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '8. Demander ou effectuer la suppression de vos données' : '8. How to Request or Perform Data Deletion'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "1) Suppression immédiate des données de jeu locales : puisque vos scores et préférences sont stockés uniquement dans votre navigateur, vous pouvez les supprimer instantanément vous-même depuis Paramètres → Réinitialiser mes données, ou en effaçant les données du site dans les réglages de votre navigateur."
                : '1) Immediate self-service deletion of local game data: since your scores and preferences are stored only in your browser, you can erase them instantly via Settings → Reset all my data, or by clearing site data in your browser settings.'}
            </p>
            <p>
              {isFr
                ? "2) Suppression d'échanges envoyés via le formulaire Contact : si vous avez envoyé un message à l'administration, vous pouvez demander l'effacement de cet échange en écrivant via la page Contact (ou à l'adresse officielle configurée)."
                : '2) Deletion of Contact correspondence: if you previously sent a message to administration, you may request deletion of that message via the Contact page (or official email once configured).'}
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              openSettings();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isFr ? 'Ouvrir les Paramètres' : 'Open Settings'}</span>
          </button>
        </section>

        {/* 9. Protection des enfants et mineurs */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Baby className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '9. Protection des enfants et des mineurs' : '9. Protection of Children & Minors'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              {isFr
                ? "MATHS PRO est conçu comme un outil éducatif sûr pour les apprenants de tous âges : aucune inscription n'est demandée aux mineurs, et l'application ne comporte ni messagerie publique entre joueurs, ni partage de photos, ni géolocalisation."
                : 'MATHS PRO is designed as a safe educational tool for learners of all ages: minors are never asked to register an account, and the app contains no public player chat, photo uploads, or geolocation tracking.'}
            </p>
            <p>
              {isFr
                ? "Nous invitons les parents et responsables légaux à accompagner l'utilisation d'Internet par les enfants, à configurer la désactivation des annonces personnalisées si souhaité, et à nous contacter s'ils estiment qu'un mineur nous a transmis des informations personnelles via le formulaire de contact afin que nous puissions les supprimer rapidement."
                : 'Parents and legal guardians are encouraged to supervise children’s Internet use, configure ad personalization preferences as desired, and contact us if a minor has submitted personal details via the contact form so we can promptly remove them.'}
            </p>
          </div>
        </section>

        {/* 10. Contacter l'administrateur */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '10. Contacter l’administrateur concernant la confidentialité' : '10. Contacting Administration About Privacy'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {SITE_CONFIG.officialEmail
              ? isFr
                ? `Pour toute question relative à la présente politique de confidentialité ou à vos droits, vous pouvez écrire à ${SITE_CONFIG.officialEmail} ou utiliser la page Contact dédiée.`
                : `For any question regarding this privacy policy or your rights, please write to ${SITE_CONFIG.officialEmail} or use our dedicated Contact page.`
              : isFr
              ? "Pour toute question relative à la confidentialité, veuillez passer par la page Contact de l'application (les coordonnées officielles de l'administrateur y sont centralisées)."
              : 'For any privacy-related inquiry, please use the application Contact page where official administrator details are listed.'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => {
                sound.playClick();
                openContact();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>{isFr ? 'Aller à la page Contact' : 'Go to Contact Page'}</span>
            </button>

            <button
              onClick={handleBackHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
