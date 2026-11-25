export interface SocialLinkConfig {
  id: 'tiktok' | 'youtube' | 'instagram' | 'x';
  label: string;
  url: string | null;
}

export interface LegalEntityConfig {
  publisherName: string | null;
  publisherStatus: string | null;
  publicationDirector: string | null;
  physicalAddress: string | null;
  phoneNumber: string | null;
  registrationId: string | null;
  hostingProviderName: string;
  hostingProviderAddress: string;
  hostingProviderWebsite: string;
}

export interface SiteConfig {
  appName: string;
  siteUrl: string;
  adsensePublisherId: string;
  adsenseApproved: boolean;
  privacyLastUpdated: {
    fr: string;
    en: string;
  };
  termsLastUpdated: {
    fr: string;
    en: string;
  };
  contactFormEndpoint: string | null;
  officialEmail: string | null;
  whatsappNumber: string | null;
  facebookPageUrl: string | null;
  otherSocials: SocialLinkConfig[];
  legal: LegalEntityConfig;
}

const cleanEnv = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Configuration centrale des coordonnées officielles, mentions légales et intégrations de MATHS PRO.
 * Les champs personnels restent à `null` tant que le propriétaire ne les a pas renseignés
 * dans ce fichier ou via les variables d'environnement Vercel (`VITE_*`).
 */
export const SITE_CONFIG: SiteConfig = {
  appName: 'MATHS PRO',
  siteUrl: 'https://maths-pro-pied.vercel.app',
  adsensePublisherId: 'ca-pub-4256744845246337',
  // Passer VITE_ADSENSE_APPROVED à "true" sur Vercel uniquement après approbation effective par Google AdSense
  adsenseApproved: cleanEnv(import.meta.env.VITE_ADSENSE_APPROVED) === 'true',
  privacyLastUpdated: {
    fr: '25 novembre 2026',
    en: 'November 25, 2026',
  },
  termsLastUpdated: {
    fr: '25 novembre 2026',
    en: 'November 25, 2026',
  },
  // Exemple : endpoint Formspree ("https://formspree.io/f/xxxxxxxx") ou Web3Forms
  contactFormEndpoint: cleanEnv(import.meta.env.VITE_CONTACT_FORM_ENDPOINT),
  // Exemple : "contact@votre-domaine.com"
  officialEmail: cleanEnv(import.meta.env.VITE_CONTACT_EMAIL),
  // Exemple : "+33612345678"
  whatsappNumber: cleanEnv(import.meta.env.VITE_CONTACT_WHATSAPP),
  // Exemple : "https://www.facebook.com/votrepage"
  facebookPageUrl: cleanEnv(import.meta.env.VITE_CONTACT_FACEBOOK),
  otherSocials: [
    {
      id: 'tiktok',
      label: 'TikTok',
      url: cleanEnv(import.meta.env.VITE_CONTACT_TIKTOK),
    },
    {
      id: 'youtube',
      label: 'YouTube',
      url: cleanEnv(import.meta.env.VITE_CONTACT_YOUTUBE),
    },
    {
      id: 'instagram',
      label: 'Instagram',
      url: cleanEnv(import.meta.env.VITE_CONTACT_INSTAGRAM),
    },
    {
      id: 'x',
      label: 'X / Twitter',
      url: cleanEnv(import.meta.env.VITE_CONTACT_X),
    },
  ],
  legal: {
    publisherName: cleanEnv(import.meta.env.VITE_LEGAL_PUBLISHER_NAME),
    publisherStatus: cleanEnv(import.meta.env.VITE_LEGAL_PUBLISHER_STATUS),
    publicationDirector: cleanEnv(import.meta.env.VITE_LEGAL_DIRECTOR),
    physicalAddress: cleanEnv(import.meta.env.VITE_LEGAL_ADDRESS),
    phoneNumber: cleanEnv(import.meta.env.VITE_LEGAL_PHONE),
    registrationId: cleanEnv(import.meta.env.VITE_LEGAL_REGISTRATION),
    hostingProviderName: 'Vercel Inc.',
    hostingProviderAddress: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    hostingProviderWebsite: 'https://vercel.com',
  },
};

export const getWhatsappUrl = (phone: string): string => {
  const digits = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}`;
};
