export interface SocialLinkConfig {
  id: 'tiktok' | 'youtube' | 'instagram' | 'x';
  label: string;
  url: string | null;
}

export interface SiteConfig {
  appName: string;
  privacyLastUpdated: {
    fr: string;
    en: string;
  };
  contactFormEndpoint: string | null;
  officialEmail: string | null;
  whatsappNumber: string | null;
  facebookPageUrl: string | null;
  otherSocials: SocialLinkConfig[];
}

const cleanEnv = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Configuration centrale des coordonnées officielles et du service d'envoi de MATHS PRO.
 * Laissez `null` (ou renseignez les variables VITE_CONTACT_* sur Vercel / .env)
 * tant que les coordonnées définitives ne sont pas fournies.
 */
export const SITE_CONFIG: SiteConfig = {
  appName: 'MATHS PRO',
  privacyLastUpdated: {
    fr: '13 novembre 2026',
    en: 'November 13, 2026',
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
};

export const getWhatsappUrl = (phone: string): string => {
  const digits = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}`;
};
