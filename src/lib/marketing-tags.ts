/**
 * IDs públicos de mensuração. Preencher somente após o proprietário localizar os IDs.
 * Sem IDs válidos, nenhum script de mensuração é carregado. Não inserir senhas ou chaves privadas aqui.
 * Se GTM for usado, configure nele Google Ads/Meta/TikTok e evite carregar os mesmos pixels
 * também por esta camada, para não duplicar eventos. GA4 direto usa consentimento de análise.
 */
export const trackingConfig = {
  googleAnalyticsId: "",
  googleAdsId: "",
  googleAdsConversionLabel: "",
  googleTagManagerId: "",
  metaPixelId: "",
  tikTokPixelId: "",
};

export interface CookieConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const CONSENT_KEY = "monjarim-cookie-consent-v1";
const configuredGoogleTags = new Set<string>();

function isValidGa4Id(id: string) {
  return /^G-[A-Z0-9]+$/i.test(id);
}

export function readConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function storeConsent(analytics: boolean, marketing: boolean): CookieConsentState {
  const state: CookieConsentState = {
    necessary: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<CookieConsentState>("monjarim-consent-change", { detail: state }));
  return state;
}

function queueConsent(state: CookieConsentState) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: unknown[]) { window.dataLayer?.push(args); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
  window.gtag("consent", "update", {
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
  });
}

function appendScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function revokeThirdPartyConsent() {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("consent", "revoke");
  const ttq = (window as Window & { ttq?: { revokeConsent?: () => void } }).ttq;
  ttq?.revokeConsent?.();
}

export function applyConsent(state: CookieConsentState) {
  if (typeof window === "undefined") return;
  const { googleAnalyticsId, googleAdsId, googleTagManagerId, metaPixelId, tikTokPixelId } = trackingConfig;
  const hasConfiguredId = Boolean(googleAnalyticsId || googleTagManagerId || googleAdsId || metaPixelId || tikTokPixelId);
  if (!hasConfiguredId) return;

  if (!state.analytics && !state.marketing) {
    revokeThirdPartyConsent();
    return;
  }

  queueConsent(state);
  // GTM é genérico e pode incluir tags de publicidade; exigir consentimento de marketing.
  if (googleTagManagerId && state.marketing) {
    if (!document.getElementById("monjarim-gtm")) {
      window.dataLayer?.push({ "gtm.start": Date.now(), event: "gtm.js" });
      appendScript(
        `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(googleTagManagerId)}`,
        "monjarim-gtm",
      );
    }
    return;
  }

  const ga4Allowed = state.analytics && isValidGa4Id(googleAnalyticsId);
  const adsAllowed = state.marketing && Boolean(googleAdsId);
  const googleTagToLoad = ga4Allowed ? googleAnalyticsId : adsAllowed ? googleAdsId : "";
  if (googleTagToLoad) {
    appendScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagToLoad)}`,
      "monjarim-gtag",
    );
    window.gtag?.("js", new Date());
    if (ga4Allowed && !configuredGoogleTags.has(googleAnalyticsId)) {
      window.gtag?.("config", googleAnalyticsId, { send_page_view: true });
      configuredGoogleTags.add(googleAnalyticsId);
    }
    if (adsAllowed && !configuredGoogleTags.has(googleAdsId)) {
      window.gtag?.("config", googleAdsId, { send_page_view: true, conversion_linker: true });
      configuredGoogleTags.add(googleAdsId);
    }
  }

  if (state.marketing && metaPixelId && !document.getElementById("monjarim-meta-pixel")) {
    const fb = document.createElement("script");
    fb.id = "monjarim-meta-pixel";
    fb.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId.replace(/[^a-zA-Z0-9]/g, "")}');fbq('track','PageView');`;
    document.head.appendChild(fb);
  }
  if (state.marketing && tikTokPixelId && !document.getElementById("monjarim-tiktok-pixel")) {
    const tt = document.createElement("script");
    tt.id = "monjarim-tiktok-pixel";
    tt.text = `!function (w, d, t) { w.TiktokAnalyticsObject=t; var ttq=w[t]=w[t]||[]; ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent']; ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}; for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]); ttq.load=function(e,n){var r='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement('script');o.type='text/javascript';o.async=true;o.src=r+'?sdkid='+e+'&lib='+t;var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(o,s)}; ttq.load('${tikTokPixelId.replace(/[^a-zA-Z0-9]/g, "")}');ttq.page(); }(window, document, 'ttq');`;
    document.head.appendChild(tt);
  }
}

export function trackAffiliateCheckoutClick(offerId: string, channel: "standard" | "ads") {
  const consent = readConsent();
  if (!consent) return;
  const eventData = { offer_id: offerId, checkout_channel: channel };
  const ga4Allowed = consent.analytics && isValidGa4Id(trackingConfig.googleAnalyticsId);
  if (ga4Allowed) window.gtag?.("event", "affiliate_checkout_click", eventData);
  if (!consent.marketing) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "braip_outbound_click", ...eventData });
  // Este evento é um clique de saída, não uma conversão de venda.
  if (!ga4Allowed) window.gtag?.("event", "affiliate_checkout_click", eventData);
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("trackCustom", "AffiliateCheckoutClick", eventData);
  const ttq = (window as Window & { ttq?: { track?: (event: string, data?: object) => void } }).ttq;
  ttq?.track?.("ClickButton", { content_id: offerId, checkout_channel: channel });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
