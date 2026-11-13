import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Mail,
  Send,
  MessageCircle,
  Globe,
  Share2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useMathApp } from '../context/MathContext';
import { SITE_CONFIG, getWhatsappUrl } from '../config/siteConfig';
import { sound } from '../utils/audio';

type SubmitState =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

export const ContactPage: React.FC = () => {
  const { settings, goHome } = useMathApp();
  const isFr = settings.language === 'fr';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ type: 'idle' });

  const hasFormEndpoint = Boolean(SITE_CONFIG.contactFormEndpoint);
  const hasOfficialEmail = Boolean(SITE_CONFIG.officialEmail);
  const isDeliveryConfigured = hasFormEndpoint || hasOfficialEmail;

  const handleBackHome = () => {
    sound.playClick();
    goHome();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setSubmitState({
        type: 'error',
        message: isFr
          ? 'Veuillez remplir tous les champs du formulaire.'
          : 'Please complete all fields in the form.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setSubmitState({
        type: 'error',
        message: isFr
          ? 'Veuillez saisir une adresse e-mail valide.'
          : 'Please enter a valid email address.',
      });
      return;
    }

    // Refuse de simuler un envoi si aucun service réel n'est configuré
    if (!isDeliveryConfigured) {
      setSubmitState({
        type: 'error',
        message: isFr
          ? "Aucun service d'envoi ou e-mail officiel n'est encore configuré. Configurez VITE_CONTACT_FORM_ENDPOINT ou les coordonnées dans src/config/siteConfig.ts pour activer l'envoi réel."
          : 'No sending service or official email is configured yet. Set VITE_CONTACT_FORM_ENDPOINT or official contact details in src/config/siteConfig.ts to enable real delivery.',
      });
      return;
    }

    // Mode 1 : Envoi réel HTTP POST vers un endpoint configuré (ex. Formspree / Web3Forms)
    if (SITE_CONFIG.contactFormEndpoint) {
      setSubmitState({ type: 'submitting' });
      try {
        const response = await fetch(SITE_CONFIG.contactFormEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject,
            message: trimmedMessage,
            source: 'MATHS PRO Web App',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setFullName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSubmitState({
          type: 'success',
          message: isFr
            ? 'Votre message a bien été transmis à l’administration de MATHS PRO.'
            : 'Your message has been delivered to MATHS PRO administration.',
        });
      } catch {
        setSubmitState({
          type: 'error',
          message: isFr
            ? "L'envoi vers le service configuré a échoué. Vérifiez votre connexion ou utilisez nos coordonnées directes ci-dessous."
            : 'Delivery to the configured endpoint failed. Check your connection or use our direct contact details below.',
        });
      }
      return;
    }

    // Mode 2 : Ouverture réelle du client de messagerie vers l'adresse officielle configurée
    if (SITE_CONFIG.officialEmail) {
      const mailtoSubject = encodeURIComponent(`[MATHS PRO] ${trimmedSubject}`);
      const mailtoBody = encodeURIComponent(
        `Nom et prénom : ${trimmedName}\nE-mail : ${trimmedEmail}\n\nMessage :\n${trimmedMessage}`
      );
      window.location.href = `mailto:${SITE_CONFIG.officialEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
      setSubmitState({
        type: 'success',
        message: isFr
          ? `Votre application de messagerie a été ouverte pour envoyer le message à ${SITE_CONFIG.officialEmail}.`
          : `Your email client has been opened to send your message to ${SITE_CONFIG.officialEmail}.`,
      });
    }
  };

  return (
    <div className="space-y-5 pb-6 animate-fadeIn select-text">
      {/* Top Return Navigation */}
      <div>
        <button
          onClick={handleBackHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{isFr ? "Retour à l'accueil" : 'Back to Home'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-700 text-white p-6 shadow-xl shadow-indigo-500/15 overflow-hidden">
        <div className="absolute -bottom-12 -right-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-100">
              {isFr ? 'Support & Administration' : 'Support & Administration'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight mt-0.5">
              {isFr ? 'Contactez MATHS PRO' : 'Contact MATHS PRO'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/95 mt-1.5 leading-relaxed">
              {isFr
                ? 'Une question, une suggestion pédagogique, un signalement technique ou une demande liée à la confidentialité ? Écrivez-nous facilement.'
                : 'Have a question, educational suggestion, technical issue, or privacy request? Reach out easily.'}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Card */}
      <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
            {isFr ? 'Envoyer un message' : 'Send a Message'}
          </h2>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              isDeliveryConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            {hasFormEndpoint
              ? isFr
                ? 'Envoi direct actif'
                : 'Direct send active'
              : hasOfficialEmail
              ? isFr
                ? 'Via messagerie e-mail'
                : 'Via email app'
              : isFr
              ? 'Service en attente de config.'
              : 'Service awaiting config'}
          </span>
        </div>

        {/* Honest configuration notice when neither endpoint nor official email is configured */}
        {!isDeliveryConfigured && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <strong className="block font-bold">
                {isFr
                  ? "Service d'envoi non encore configuré"
                  : 'Sending service not configured yet'}
              </strong>
              <span>
                {isFr
                  ? "Aucun envoi factice n'est simulé. Dès que vous aurez renseigné VITE_CONTACT_FORM_ENDPOINT (ex. Formspree) ou votre adresse e-mail officielle dans src/config/siteConfig.ts, ce formulaire transmettra réellement les messages."
                  : 'No fake delivery is simulated. Once you configure VITE_CONTACT_FORM_ENDPOINT (e.g. Formspree) or your official email in src/config/siteConfig.ts, this form will send messages for real.'}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Nom et prénom */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {isFr ? 'Nom et prénom' : 'Full Name'} <span className="text-rose-500">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isFr ? 'Votre nom et prénom' : 'Your full name'}
              required
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all"
            />
          </div>

          {/* Adresse e-mail */}
          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {isFr ? 'Adresse e-mail' : 'Email Address'} <span className="text-rose-500">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isFr ? 'vous@exemple.com' : 'you@example.com'}
              required
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all"
            />
          </div>

          {/* Objet du message */}
          <div>
            <label
              htmlFor="contact-subject"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {isFr ? 'Objet du message' : 'Subject'} <span className="text-rose-500">*</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                isFr ? 'Ex. Suggestion, Question, Confidentialité...' : 'E.g. Suggestion, Question, Privacy...'
              }
              required
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {isFr ? 'Message' : 'Message'} <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isFr ? 'Écrivez votre message ici...' : 'Write your message here...'}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all resize-y min-h-[120px]"
            />
          </div>

          {/* Feedback banner */}
          {submitState.type === 'error' && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitState.message}</span>
            </div>
          )}

          {submitState.type === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitState.message}</span>
            </div>
          )}

          {/* Bouton ENVOYER */}
          <button
            type="submit"
            disabled={submitState.type === 'submitting'}
            className="w-full py-3 px-5 min-h-[48px] rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-105 disabled:opacity-60 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-98 transition-all"
          >
            {submitState.type === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isFr ? 'ENVOI EN COURS...' : 'SENDING...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isFr ? 'ENVOYER' : 'SEND'}</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Configurable Official Contact Channels */}
      <section className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isFr ? 'Canaux officiels' : 'Official Channels'}
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-white font-display mt-0.5">
            {isFr ? 'Coordonnées & Réseaux sociaux' : 'Contact Details & Social Networks'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Adresse e-mail officielle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {isFr ? 'Adresse e-mail officielle' : 'Official Email'}
              </span>
              {SITE_CONFIG.officialEmail ? (
                <a
                  href={`mailto:${SITE_CONFIG.officialEmail}`}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all mt-0.5 inline-block"
                >
                  {SITE_CONFIG.officialEmail}
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {isFr ? 'Emplacement provisoire — À configurer' : 'Placeholder slot — To be configured'}
                </span>
              )}
            </div>
          </div>

          {/* Numéro WhatsApp */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {isFr ? 'Numéro WhatsApp' : 'WhatsApp Number'}
              </span>
              {SITE_CONFIG.whatsappNumber ? (
                <a
                  href={getWhatsappUrl(SITE_CONFIG.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5 inline-flex items-center gap-1"
                >
                  <span>{SITE_CONFIG.whatsappNumber}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {isFr ? 'Emplacement provisoire — À configurer' : 'Placeholder slot — To be configured'}
                </span>
              )}
            </div>
          </div>

          {/* Page Facebook */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {isFr ? 'Page Facebook' : 'Facebook Page'}
              </span>
              {SITE_CONFIG.facebookPageUrl ? (
                <a
                  href={SITE_CONFIG.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-0.5 inline-flex items-center gap-1 break-all"
                >
                  <span>{isFr ? 'Visiter la page Facebook' : 'Visit Facebook Page'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {isFr ? 'Emplacement provisoire — À configurer' : 'Placeholder slot — To be configured'}
                </span>
              )}
            </div>
          </div>

          {/* Autres réseaux sociaux */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {isFr ? 'Autres réseaux sociaux' : 'Other Social Networks'}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {SITE_CONFIG.otherSocials.map((social) =>
                  social.url ? (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold hover:underline"
                    >
                      <span>{social.label}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span
                      key={social.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold"
                    >
                      {social.label} · {isFr ? 'À configurer' : 'TBD'}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Return Button */}
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
