import React from 'react';
import {
  ArrowLeft,
  Home,
  Landmark,
  Server,
  Copyright,
  ShieldCheck,
  Mail,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { SITE_CONFIG } from '../config/siteConfig';
import { sound } from '../utils/audio';

export const LegalNoticePage: React.FC = () => {
  const { settings, goHome, openContact, openPrivacy, openTerms } = useMathApp();
  const isFr = settings.language === 'fr';
  const { legal } = SITE_CONFIG;

  const handleBackHome = () => {
    sound.playClick();
    goHome();
  };

  const missingOwnerFields =
    !legal.publisherName || !legal.publicationDirector || !legal.physicalAddress;

  const renderFieldValue = (val: string | null, placeholderFr: string, placeholderEn: string) => {
    if (val) {
      return <span className="font-semibold text-slate-900 dark:text-white">{val}</span>;
    }
    return (
      <span className="italic text-amber-700 dark:text-amber-300">
        {isFr ? placeholderFr : placeholderEn}
      </span>
    );
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
          {SITE_CONFIG.appName}
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-700 via-slate-800 to-slate-900 text-white p-6 shadow-xl shadow-indigo-500/15 overflow-hidden">
        <div className="absolute -bottom-12 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
              {isFr ? 'Informations légales' : 'Legal Disclosures'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-0.5">
              {isFr ? 'Mentions Légales' : 'Legal Notice'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1.5 leading-relaxed">
              {isFr
                ? `Identification de l'éditeur, de l'hébergeur et cadre légal du site ${SITE_CONFIG.siteUrl}.`
                : `Publisher identification, hosting provider, and legal information for ${SITE_CONFIG.siteUrl}.`}
            </p>
          </div>
        </div>
      </div>

      {missingOwnerFields && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <strong className="block font-bold">
              {isFr ? "Champs de l'éditeur à compléter par le propriétaire" : 'Publisher fields awaiting owner configuration'}
            </strong>
            <span>
              {isFr
                ? 'Pour éviter toute information fictive, les mentions personnelles non encore fournies restent en attente. Renseignez les variables VITE_LEGAL_* sur Vercel (ou dans src/config/siteConfig.ts) avant la mise en conformité finale.'
                : 'To avoid fabricated details, owner identity fields remain pending until you set VITE_LEGAL_* variables on Vercel (or in src/config/siteConfig.ts).'}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* 1. Éditeur */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '1. Éditeur du site' : '1. Website Publisher'}
            </h2>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {isFr ? 'Nom / Raison sociale' : 'Publisher Name'}
              </dt>
              <dd>
                {renderFieldValue(
                  legal.publisherName,
                  'À renseigner par le propriétaire (VITE_LEGAL_PUBLISHER_NAME)',
                  'To be configured by owner (VITE_LEGAL_PUBLISHER_NAME)'
                )}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {isFr ? 'Statut juridique' : 'Legal Status'}
              </dt>
              <dd>
                {renderFieldValue(
                  legal.publisherStatus,
                  'Particulier / Entreprise — À préciser',
                  'Individual / Company — To be specified'
                )}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {isFr ? 'Directeur de la publication' : 'Publication Director'}
              </dt>
              <dd>
                {renderFieldValue(
                  legal.publicationDirector,
                  'À renseigner (VITE_LEGAL_DIRECTOR)',
                  'To be configured (VITE_LEGAL_DIRECTOR)'
                )}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {isFr ? 'Adresse postale' : 'Address'}
              </dt>
              <dd>
                {renderFieldValue(
                  legal.physicalAddress,
                  'À renseigner (VITE_LEGAL_ADDRESS)',
                  'To be configured (VITE_LEGAL_ADDRESS)'
                )}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {isFr ? 'E-mail de contact' : 'Contact Email'}
              </dt>
              <dd>
                {SITE_CONFIG.officialEmail ? (
                  <a
                    href={`mailto:${SITE_CONFIG.officialEmail}`}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                  >
                    {SITE_CONFIG.officialEmail}
                  </a>
                ) : (
                  <span className="italic text-amber-700 dark:text-amber-300">
                    {isFr ? 'À renseigner (VITE_CONTACT_EMAIL)' : 'To be configured (VITE_CONTACT_EMAIL)'}
                  </span>
                )}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {isFr ? 'Téléphone / Immatriculation' : 'Phone / Registration'}
              </dt>
              <dd>
                {legal.phoneNumber || legal.registrationId
                  ? [legal.phoneNumber, legal.registrationId].filter(Boolean).join(' · ')
                  : isFr
                  ? 'Optionnel — À renseigner si applicable'
                  : 'Optional — If applicable'}
              </dd>
            </div>
          </dl>
        </section>

        {/* 2. Hébergeur */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '2. Hébergement technique' : '2. Technical Hosting'}
            </h2>
          </div>
          <div className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
            <p>
              <strong>{legal.hostingProviderName}</strong>
            </p>
            <p>{legal.hostingProviderAddress}</p>
            <p>
              <a
                href={legal.hostingProviderWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>{legal.hostingProviderWebsite}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </section>

        {/* 3. Propriété intellectuelle & AdSense */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Copyright className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '3. Propriété intellectuelle et publicité' : '3. Intellectual Property & Advertising'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? `L'ensemble des contenus éducatifs, cours, exercices, graphismes et code applicatif de MATHS PRO est protégé par les lois sur la propriété intellectuelle. Le site est déclaré pour l'affichage publicitaire Google AdSense sous l'identifiant éditeur ${SITE_CONFIG.adsensePublisherId}, dont le fichier de vérification officiel est publié à l'adresse /ads.txt.`
              : `All educational lessons, exercises, graphics, and source code of MATHS PRO are protected by copyright law. The site declares Google AdSense publisher ID ${SITE_CONFIG.adsensePublisherId}, publicly verifiable at /ads.txt.`}
          </p>
        </section>

        {/* 4. Protection des données & liens */}
        <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              {isFr ? '4. Données personnelles et documents associés' : '4. Privacy & Related Documents'}
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFr
              ? "Consultez notre Politique de Confidentialité et nos Conditions Générales d'Utilisation pour connaître le fonctionnement du stockage local, la gestion des cookies et vos droits."
              : 'Read our Privacy Policy and Terms of Use for full details on local storage, cookie preferences, and your rights.'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                openPrivacy();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <span>{isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                openTerms();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <span>{isFr ? 'CGU' : 'Terms of Use'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                openContact();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isFr ? 'Contacter l’administration' : 'Contact Administration'}</span>
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
