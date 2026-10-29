import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import {
  applyConsent,
  readConsent,
  storeConsent,
  type CookieConsentState,
} from "@/lib/marketing-tags";

export default function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsentState | null>(() => readConsent());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setConsent(saved);
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
      applyConsent(saved);
    }
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      setConsent(detail);
      setAnalytics(detail.analytics);
      setMarketing(detail.marketing);
      applyConsent(detail);
    };
    const onOpen = () => setSettingsOpen(true);
    window.addEventListener("monjarim-consent-change", onChange);
    window.addEventListener("monjarim-open-cookie-settings", onOpen);
    return () => {
      window.removeEventListener("monjarim-consent-change", onChange);
      window.removeEventListener("monjarim-open-cookie-settings", onOpen);
    };
  }, []);

  const save = (analyticsChoice: boolean, marketingChoice: boolean) => {
    const next = storeConsent(analyticsChoice, marketingChoice);
    setConsent(next);
    setSettingsOpen(false);
    applyConsent(next);
  };

  if (consent && !settingsOpen) {
    return (
      <button
        className="cookie-reopen"
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Abrir preferências de cookies"
      >
        <Cookie size={16} aria-hidden="true" /> Cookies
      </button>
    );
  }

  if (!consent && !settingsOpen) {
    return (
      <div className="cookie-backdrop cookie-banner-backdrop" role="presentation">
        <section className="cookie-panel cookie-banner-simple" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
          <div className="cookie-banner-copy">
            <div className="cookie-kicker"><Cookie size={18} /> Suas preferências</div>
            <h2 id="cookie-title">Sua privacidade importa</h2>
            <p>Usamos armazenamento essencial. Tags de análise e publicidade só são ativadas com sua permissão.</p>
          </div>
          <div className="cookie-actions">
            <button type="button" className="btn btn-outline" onClick={() => setSettingsOpen(true)}>
              <Settings2 size={16} /> Personalizar
            </button>
            <button type="button" className="btn btn-outline cookie-reject" onClick={() => save(false, false)}>
              Rejeitar opcionais
            </button>
            <button type="button" className="btn btn-primary" onClick={() => save(true, true)}>
              Aceitar todos
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="cookie-backdrop" role="presentation">
      <section className="cookie-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <button
          type="button"
          className="cookie-close"
          onClick={() => setSettingsOpen(false)}
          aria-label="Fechar preferências de cookies"
        >
          <X size={18} />
        </button>
        <div className="cookie-kicker"><Cookie size={18} /> Suas preferências</div>
        <h2 id="cookie-title">Privacidade do seu jeito</h2>
        <p>
          Usamos armazenamento essencial para manter o site funcionando. Com sua permissão,
          podemos ativar cookies e tags de análise e publicidade. A escolha pode ser alterada a qualquer momento.
        </p>
        <div className="cookie-options">
          <div className="cookie-option">
            <div><strong>Necessários</strong><small>Preferências básicas e segurança do site.</small></div>
            <span className="always-on">Sempre ativos</span>
          </div>
          <label className="cookie-option">
            <span><strong>Análise</strong><small>Medição de visitas e desempenho.</small></span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label className="cookie-option">
            <span><strong>Marketing</strong><small>Mensuração de campanhas e anúncios.</small></span>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>
        <div className="cookie-actions">
          <button type="button" className="btn btn-outline cookie-reject" onClick={() => save(false, false)}>
            Rejeitar opcionais
          </button>
          {settingsOpen ? (
            <button type="button" className="btn btn-soft" onClick={() => save(analytics, marketing)}>
              <Settings2 size={16} /> Salvar escolhas
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" onClick={() => save(true, true)}>
            Aceitar todos
          </button>
        </div>
        <p className="cookie-footnote">Nenhum pixel de marketing é carregado antes do consentimento.</p>
      </section>
    </div>
  );
}
