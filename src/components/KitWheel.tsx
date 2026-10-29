import { useEffect, useRef, useState } from "react";
import { ArrowRight, Gift, X } from "lucide-react";
import {
  buildAffiliateUrl,
  type AffiliateOffer,
} from "@/lib/affiliate-links";
import { trackAffiliateCheckoutClick } from "@/lib/marketing-tags";

const colors = ["#bd0064", "#6b2d72", "#d48a26", "#442947"];

export default function KitWheel({ options }: { options: AffiliateOffer[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<AffiliateOffer | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSpinning) setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSpinning]);

  const close = () => {
    if (!isSpinning) setIsOpen(false);
  };

  const spin = () => {
    if (isSpinning) return;
    const index = Math.floor(Math.random() * options.length);
    const segmentCenter = (index * 90 + 315) % 360;
    const targetRotation = (270 - segmentCenter + 360) % 360;
    setSelectedOffer(null);
    setIsSpinning(true);
    setRotation((current) => current + 2160 + targetRotation);
    timer.current = window.setTimeout(() => {
      setSelectedOffer(options[index]);
      setIsSpinning(false);
      timer.current = null;
    }, 2700);
  };

  return (
    <>
      <section className="kit-wheel-invitation" aria-labelledby="wheel-invitation-title">
        <div className="kit-wheel-invitation-copy">
          <span className="eyebrow">UM JEITO DIVERTIDO DE ESCOLHER</span>
          <h3 id="wheel-invitation-title">Qual kit combina com você?</h3>
          <p>Gire a roleta para sortear uma das opções disponíveis. O resultado indica um kit — não cria cupom nem altera preços ou condições.</p>
        </div>
        <button type="button" className="btn btn-primary kit-wheel-open" onClick={() => setIsOpen(true)}>
          <Gift size={18} /> Clique para escolher seu kit
        </button>
      </section>

      {isOpen ? (
        <div className="kit-wheel-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="kit-wheel-dialog" role="dialog" aria-modal="true" aria-labelledby="wheel-title">
            <button type="button" className="kit-wheel-close" aria-label="Fechar roleta" onClick={close} disabled={isSpinning}><X size={20} /></button>
            <span className="eyebrow">Monjarim · escolha seu kit</span>
            <h2 id="wheel-title">Gire e descubra uma opção</h2>
            <p className="kit-wheel-intro">Cada resultado corresponde a um plano disponível nesta página.</p>
            <div className="kit-wheel-stage">
              <span className="kit-wheel-pointer" aria-hidden="true" />
              <div className={`kit-wheel-graphic ${isSpinning ? "is-spinning" : ""}`} style={{ transform: `rotate(${rotation}deg)` }}>
                <svg viewBox="0 0 400 400" role="img" aria-label="Roleta com opções de kit de 1, 3, 5 e 10 frascos">
                  <g>
                    <path d="M200 200 L200 20 A180 180 0 0 1 380 200 Z" fill={colors[0]} />
                    <path d="M200 200 L380 200 A180 180 0 0 1 200 380 Z" fill={colors[1]} />
                    <path d="M200 200 L200 380 A180 180 0 0 1 20 200 Z" fill={colors[2]} />
                    <path d="M200 200 L20 200 A180 180 0 0 1 200 20 Z" fill={colors[3]} />
                    <circle cx="200" cy="200" r="179" fill="none" stroke="#fff4e8" strokeWidth="5" />
                    <text x="286" y="113" textAnchor="middle">1 frasco</text>
                    <text x="286" y="300" textAnchor="middle">3 frascos</text>
                    <text x="113" y="300" textAnchor="middle">5 frascos</text>
                    <text x="113" y="113" textAnchor="middle">10 frascos</text>
                  </g>
                  <circle cx="200" cy="200" r="39" fill="#fff8f1" stroke="#f1d2e2" strokeWidth="6" />
                  <text className="wheel-center" x="200" y="205" textAnchor="middle">M</text>
                </svg>
              </div>
            </div>
            <button type="button" className="btn btn-primary kit-wheel-spin" onClick={spin} disabled={isSpinning}>
              {isSpinning ? "A roleta está girando…" : selectedOffer ? "Girar novamente" : "Girar a roleta"}
            </button>
            {selectedOffer ? (
              <div className="kit-wheel-result" aria-live="polite">
                <strong>Sua opção sorteada: kit com {selectedOffer.bottles} {selectedOffer.bottles === 1 ? "frasco" : "frascos"}</strong>
                <span>Preço, frete e condições são os apresentados no checkout da Braip.</span>
                <a className="btn btn-primary" href={buildAffiliateUrl(selectedOffer, "standard")} target="_blank" rel="sponsored nofollow noopener" onClick={() => trackAffiliateCheckoutClick(selectedOffer.id, "standard")}>
                  Continuar com este kit <ArrowRight size={17} />
                </a>
              </div>
            ) : null}
            <p className="kit-wheel-disclaimer">A roleta apenas escolhe entre os kits listados. Não há cupom, desconto adicional ou prêmio em dinheiro; confirme os valores e a disponibilidade no checkout.</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
