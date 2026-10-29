import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Flame,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import CookieConsent from "@/components/CookieConsent";
import KitWheel from "@/components/KitWheel";
import {
  buildAffiliateUrl,
  buildSalesPageUrl,
  offers,
  type AffiliateOffer,
  type CheckoutChannel,
} from "@/lib/affiliate-links";
import { trackAffiliateCheckoutClick } from "@/lib/marketing-tags";
import "../App.css";
import "../monjarim-interactions.css";

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const productPhoto = publicAsset("monjarim/asset-1.webp");
const storyPhotoOne = publicAsset("monjarim/asset-2.webp");
const storyPhotoTwo = publicAsset("monjarim/asset-3.webp");
const storyPhotoWeighing = publicAsset("monjarim/asset-5.webp");

const ingredients = [
  {
    initials: "CV",
    title: "CAFÉ VERDE",
    text: "Ingrediente apresentado pelo fabricante. Consulte o rótulo vigente para verificar a composição, a quantidade por porção e as informações atualizadas.",
    tone: "green",
    image: publicAsset("monjarim/ingredient-cafe-verde.svg"),
  },
  {
    initials: "C3®",
    title: "C3 REDUCT®",
    text: "Ingrediente identificado pelo fabricante como parte da fórmula. Consulte o rótulo vigente para verificar a composição, a quantidade por porção e as informações atualizadas.",
    tone: "purple",
    image: publicAsset("monjarim/ingredient-curcuma.svg"),
  },
  {
    initials: "LM",
    title: "LARANJA MORO",
    text: "Ingrediente apresentado na fórmula do produto. Consulte o rótulo vigente para conferir a composição e as informações fornecidas pelo fabricante.",
    tone: "orange",
    image: publicAsset("monjarim/ingredient-laranja.svg"),
  },
  {
    initials: "CR",
    title: "CROMO",
    text: "Mineral listado entre os ingredientes apresentados pelo fabricante. Confira no rótulo a forma, a quantidade por porção e as orientações de consumo.",
    tone: "pink",
    image: publicAsset("monjarim/ingredient-cromo.svg"),
  },
];

const FAQs = [
  {
    question: "O site é seguro para realizar a minha compra?",
    answer: "Ao escolher um plano, você será encaminhado ao checkout da Braip. Confira o endereço, o produto, o preço, o frete e as condições antes de pagar. Os dados da transação são tratados no ambiente da plataforma; consulte os canais oficiais da Braip para detalhes de segurança e privacidade. Garantias, quando aplicáveis, seguem as regras apresentadas no checkout.",
  },
  {
    question: "O Monjarim pode causar efeitos colaterais?",
    answer: "A resposta a suplementos pode variar, e não é possível garantir ausência de efeitos indesejados. Leia a composição e as advertências do rótulo. Se notar uma reação, suspenda o uso e procure orientação de um profissional de saúde; diante de sintomas intensos, busque atendimento.",
  },
  {
    question: "Quem deve consultar um profissional antes de usar?",
    answer: "A adequação depende da composição, da idade e do histórico de saúde. Siga o rótulo. Se estiver grávida ou amamentando, tiver alguma condição de saúde, usar medicamentos ou tiver dúvidas, converse com um profissional de saúde antes de consumir.",
  },
  {
    question: "Em quanto tempo posso esperar resultados?",
    answer: "Não é possível prever prazo, quantidade de peso ou resultado individual. A resposta depende de vários fatores. Consulte o rótulo e um profissional de saúde para orientações adequadas ao seu caso. Suplementos alimentares não substituem alimentação equilibrada nem acompanhamento profissional.",
  },
  {
    question: "Existe uma idade máxima para usar o Monjarim?",
    answer: "Confira no rótulo a faixa etária indicada. Não é possível afirmar que o produto seja adequado para todas as idades ou condições. Pessoas idosas, menores de idade e pessoas com dúvidas sobre o uso devem conversar com um profissional de saúde.",
  },
  {
    question: "O Monjarim evita o efeito rebote?",
    answer: "Não há como garantir que não haverá reganho de peso após interromper o uso. Mudanças de peso dependem de diversos fatores, e esta página não afirma que o suplemento previna o efeito rebote. Procure orientação profissional para um plano de cuidado individualizado.",
  },
  {
    question: "O Monjarim é regularizado ou aprovado pela ANVISA?",
    answer: "A regularização aplicável depende da categoria do produto e das regras sanitárias vigentes. Não dispomos aqui de dados suficientes para confirmar uma aprovação específica. Confira o rótulo, os dados do fabricante e os registros ou notificações aplicáveis nos canais oficiais da ANVISA.",
  },
  {
    question: "Como devo consumir o Monjarim?",
    answer: "Siga a dose, o modo de uso e as advertências do rótulo vigente; não exceda a recomendação. Esta página não orienta horários ou associação com refeições. Em caso de dúvida, consulte o fabricante ou um profissional de saúde.",
  },
  {
    question: "Qual é o prazo de entrega e como acompanho o pedido?",
    answer: "Prazo, frete e disponibilidade dependem do CEP, do plano e das condições exibidas no checkout. Depois da compra, consulte a confirmação do pedido e os canais indicados pelo vendedor para acompanhar o envio e obter o rastreamento, quando disponível.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "As formas de pagamento, o parcelamento e os critérios de aprovação são informados no checkout da Braip e podem variar conforme a oferta e a instituição financeira. Revise os valores e as condições antes de finalizar a compra.",
  },
  {
    question: "O que é o C3 Reduct®?",
    answer: "O fabricante identifica o C3 Reduct® como um ingrediente da fórmula. Para conferir a composição, a quantidade por porção e as alegações específicas sobre mecanismo ou eficácia, consulte o rótulo e a documentação técnica do fabricante. Não confirmamos aqui comparações de desempenho ou resultados clínicos.",
  },
  {
    question: "Onde posso comprar o Monjarim?",
    answer: "Os botões desta página direcionam a ofertas no checkout da Braip por links de afiliado. A disponibilidade em outros canais pode variar. Em qualquer compra, confira a identificação do vendedor, a procedência do produto, o rótulo e as condições da oferta.",
  },
  {
    question: "O Monjarim é superior a outros produtos ou tratamentos?",
    answer: "Não afirmamos superioridade sem evidências comparativas verificáveis. Compare a composição, as informações de regularização e as condições da oferta. Suplementos alimentares não substituem medicamentos, tratamentos prescritos ou orientação de um profissional de saúde.",
  },
];

function CheckoutLink({
  offer,
  channel,
  children,
  className,
}: {
  offer: AffiliateOffer;
  channel: CheckoutChannel;
  children: React.ReactNode;
  className?: string;
}) {
  const href = useMemo(() => buildAffiliateUrl(offer, channel), [offer, channel]);
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackAffiliateCheckoutClick(offer.id, channel)}
      rel="sponsored nofollow noopener"
      target="_blank"
    >
      {children}
    </a>
  );
}

function OfferCard({ offer, compact = false }: { offer: AffiliateOffer; compact?: boolean }) {
  return (
    <article id={offer.featured ? "melhor-opcao" : undefined} className={`offer-card ${offer.featured ? "offer-card-featured" : ""} ${compact ? "offer-card-compact" : ""}`}>
      {offer.badge ? <span className="offer-badge">{offer.badge}</span> : null}
      <div className="offer-bottle-count"><span>{offer.bottles}</span><small>{offer.bottles === 1 ? "frasco" : "frascos"}</small></div>
      <h3>{offer.name}</h3>
      <img
        className="offer-product-image"
        src={offer.productImage}
        alt={`Kit Monjarim com ${offer.bottles} ${offer.bottles === 1 ? "frasco" : "frascos"}`}
        loading="eager"
        decoding="async"
      />
      {offer.originalPrice ? <p className="offer-old">De: <s>{offer.originalPrice}</s></p> : null}
      {offer.price ? <p className="offer-price">{offer.price}</p> : null}
      {offer.installment ? <p className="offer-installments">{offer.installment}</p> : null}
      {offer.term ? <p className="offer-term">{offer.term}</p> : null}
      {offer.shipping ? <p className="offer-shipping"><Truck size={16} /> {offer.shipping}</p> : null}
      <CheckoutLink offer={offer} channel="standard" className="btn btn-primary offer-buy">
        <ShoppingBag size={17} /> Comprar agora
      </CheckoutLink>
    </article>
  );
}

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const primaryOffers = [offers[3], offers[2], offers[1], offers[0]];
  const wheelOffers = [offers[0], offers[1], offers[2], offers[3]];
  const specialOffers = offers.slice(4, 7);
  const genericOffer = offers[0];
  const genericHref = buildSalesPageUrl();

  useEffect(() => {
    const root = document.querySelector(".site-shell");
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();
    while (textNode) {
      textNode.nodeValue = textNode.nodeValue?.split("MONJARIM").join("Monjarim") ?? "";
      textNode = walker.nextNode();
    }
    const avatarImage = `url("${import.meta.env.BASE_URL}monjarim/depoimentos-referencia.png")`;
    root.querySelectorAll<HTMLElement>(".testimonial-avatar").forEach((avatar) => {
      avatar.style.backgroundImage = avatarImage;
    });
    const doctorPortrait = root.querySelector<HTMLElement>(".expert-portrait");
    if (doctorPortrait) {
      doctorPortrait.style.backgroundImage = `url("${import.meta.env.BASE_URL}monjarim/doutora-referencia.png")`;
    }
  }, []);

  const openCookieSettings = () => window.dispatchEvent(new Event("monjarim-open-cookie-settings"));

  return (
    <div className="site-shell">
      <div className="top-strip">Transformando vidas através do digital <span>•</span> Conheça Monjarim</div>
      <header className="site-header">
        <a className="brand-mark" href="#inicio" aria-label="Monjarim, início">
          <span className="brand-symbol"><Leaf size={18} /></span>
          <span>monjarim<small>nutra</small></span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#produto">O Produto</a>
          <a href="#formula">A Fórmula</a>
          <a href="#depoimentos">Depoimentos</a>
          <a className="nav-faq-button" href="#duvidas" aria-label="Ir para dúvidas frequentes">Dúvidas</a>
          <a className="btn btn-primary nav-cta" href="#compra">Ver ofertas</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> CONHEÇA MONJARIM</span>
            <h1>Conheça o <strong>Monjarim</strong> e descubra uma nova forma de <em>cuidar de você.</em></h1>
            <p className="hero-lead"><b>Um suplemento alimentar com ingredientes apresentados pelo fabricante.</b> Conheça a fórmula e confira as informações do rótulo.</p>
            <p className="hero-subline">Informação clara para uma escolha consciente.</p>
            <a className="btn btn-primary hero-button" href="#compra">Quero conhecer o Monjarim <ArrowRight size={18} /></a>
            <p className="hero-caption">Finalize sua compra diretamente no checkout da Braip.</p>
          </div>
          <div className="hero-art" aria-label="Embalagens do suplemento Monjarim">
            <div className="hero-glow" />
            <img src={productPhoto} alt="Embalagens oficiais do suplemento alimentar Monjarim" />
            <div className="hero-float float-top"><Leaf size={17} /> Fórmula com ativos naturais</div>
          </div>
          <div className="hero-trust">
            <span><Truck size={18} /> Frete grátis em kits selecionados</span>
            <span><ShieldCheck size={18} /> Checkout Braip</span>
            <span><Check size={18} /> Condições da oferta</span>
          </div>
          <a href="#produto" className="scroll-cue"><ArrowDown size={15} /> Role para conhecer</a>
        </section>

        <div className="promise-bar" aria-label="Conheça o produto">
          <div className="promise-track">COMPOSIÇÃO <span>•</span> INFORMAÇÃO <span>•</span> ESCOLHA CONSCIENTE <span>•</span> CUIDADO COM VOCÊ <span>•</span> COMPRA NA BRAIP <span>•</span> COMPOSIÇÃO <span>•</span> INFORMAÇÃO <span>•</span> ESCOLHA CONSCIENTE <span>•</span> CUIDADO COM VOCÊ <span>•</span> COMPRA NA BRAIP</div>
        </div>

        <section className="story-section section-pad" id="produto">
          <div className="section-heading centered">
            <span className="eyebrow">INFORMAÇÃO PARA UMA ESCOLHA CONSCIENTE</span>
            <h2>Conheça o Monjarim e as informações do produto.</h2>
            <p>Veja a composição, as orientações do fabricante e as condições da oferta antes de decidir.</p>
          </div>
          <div className="story-grid">
            <article className="story-card story-card-photo">
              <img src={storyPhotoOne} alt="Imagem da campanha Monjarim retratando uma mulher diante do espelho" loading="lazy" />
              <div><span>01 / CONHEÇA O PRODUTO</span><h3>Quer saber mais sobre o Monjarim?</h3><p>Veja a apresentação do produto e confira as informações fornecidas pelo fabricante.</p></div>
            </article>
            <div className="story-side">
              <article className="story-card story-card-photo story-card-weighing">
                <img src={storyPhotoWeighing} alt="Imagem ilustrativa de uma mulher diante de uma balança em ambiente doméstico." loading="lazy" />
                <div><span>02 / INFORMAÇÃO</span><h3>Leia o rótulo antes de decidir.</h3><p>Confira a composição, as orientações de uso e as advertências do fabricante.</p></div>
              </article>
              <article className="story-card story-card-photo story-card-small">
                <img src={storyPhotoTwo} alt="Imagem da campanha Monjarim sobre uma escolha alimentar consciente" loading="lazy" />
                <div><span>03 / COMPARE AS OPÇÕES</span><h3>Escolha com autonomia.</h3><p>Compare os kits e confirme preço, frete e condições diretamente no checkout.</p></div>
              </article>
            </div>
          </div>
          <div className="center-action"><a className="btn btn-dark" href="#compra">Quero conhecer o Monjarim <ArrowRight size={17} /></a></div>
        </section>

        <section className="product-section section-pad">
          <div className="product-image-card"><img src={productPhoto} alt="Frascos Monjarim, suplemento alimentar em cápsulas" loading="lazy" /><span className="image-caption">Monjarim · suplemento alimentar</span></div>
          <div className="product-copy">
            <span className="eyebrow">A FÓRMULA MONJARIM</span>
            <h2>Conheça o produto com informação e autonomia.</h2>
            <p>Monjarim é apresentado pelo fabricante como suplemento alimentar. Confira no rótulo a composição completa e as informações atualizadas antes de decidir.</p>
            <p>Este suplemento não é medicamento e não substitui alimentação equilibrada, acompanhamento profissional ou tratamentos prescritos.</p>
            <div className="feature-pills"><span><Flame size={16} /> Composição</span><span><Zap size={16} /> Informação clara</span><span><Leaf size={16} /> Suplemento alimentar</span><span><Check size={16} /> Compra na Braip</span></div>
            <a className="text-link" href="#formula">Conheça os ingredientes <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="benefits-section section-pad">
          <div className="section-heading centered light-heading">
            <span className="eyebrow">INFORMAÇÃO TRANSPARENTE</span>
            <h2>Conheça a composição antes de escolher.</h2>
            <p>Suplementos alimentares não substituem cuidados profissionais ou tratamentos de saúde.</p>
          </div>
          <div className="benefit-grid">
            <article><span className="benefit-icon"><Zap /></span><h3>Ingredientes</h3><p>Confira os ingredientes e suas quantidades no rótulo vigente do produto.</p></article>
            <article><span className="benefit-icon"><Flame /></span><h3>Modo de uso</h3><p>Siga as orientações de uso e advertências informadas na rotulagem.</p></article>
            <article><span className="benefit-icon"><Leaf /></span><h3>Escolha consciente</h3><p>Converse com um profissional de saúde se tiver dúvidas sobre o uso.</p></article>
            <article><span className="benefit-icon"><ShieldCheck /></span><h3>Condições da oferta</h3><p>Confira preço, frete e elegibilidade diretamente no checkout da Braip.</p></article>
          </div>
          <div className="center-action"><a className="btn btn-white" href="#compra">Quero conhecer as opções <ArrowRight size={17} /></a></div>
        </section>

        <section className="formula-section section-pad" id="formula">
          <div className="section-heading centered">
            <span className="eyebrow">ATIVOS DA FÓRMULA</span>
            <h2>Conheça os ingredientes de Monjarim.</h2>
            <p>Veja os ingredientes destacados pelo fabricante e confira a composição completa no rótulo.</p>
          </div>
          <div className="ingredient-grid">
            {ingredients.map((item) => (
              <article className={`ingredient-card tone-${item.tone}`} key={item.title}>
                <img className="ingredient-photo" src={item.image} alt="" aria-hidden="true" loading="lazy" />
                <span className="ingredient-initials">{item.initials}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="ingredient-number">0{ingredients.indexOf(item) + 1}</span>
              </article>
            ))}
          </div>
          <p className="fine-print">Confira a composição completa e as informações vigentes no rótulo do fabricante. Suplementos alimentares não substituem orientação profissional.</p>
        </section>

        <section className="testimonials-section section-pad" id="depoimentos">
          <div className="section-heading centered">
            <span className="eyebrow">AVALIAÇÕES DE CLIENTES</span>
            <h2>Experiências compartilhadas sobre o Monjarim.</h2>
            <p>Conheça os relatos apresentados pelo anunciante.</p>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial-card testimonial-featured">
              <div className="testimonial-content"><div className="testimonial-avatar" aria-hidden="true">FA</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“O MONJARIM foi um divisor de águas para mim. Já tinha tentado de tudo — dietas malucas, remédios caros e até cirurgia. Em 4 semanas usando Monjarim, perdi 7 kg e o inchaço diminuiu absurdamente. Minha qualidade de vida mudou completamente.”</blockquote><strong>Fernando Aragão</strong><small>S.J. Rio Preto, SP · 38 anos</small></div>
            </article>
            <article className="testimonial-card"><div className="testimonial-avatar" aria-hidden="true">ML</div><div className="quote-mark">“</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“Agradeço à equipe por esse produto incrível. Minha qualidade de vida melhorou 100% desde que comecei a usar o MONJARIM. A compulsão alimentar foi embora na primeira semana. Já indiquei para toda a família!”</blockquote><strong>Maria Leão</strong><small>Contagem, MG · 45 anos</small></article>
            <article className="testimonial-card"><div className="testimonial-avatar" aria-hidden="true">JF</div><div className="quote-mark">“</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“O MONJARIM transformou a minha vida! Eu sofria com inchaço abdominal, sensação de peso e dificuldade para controlar o apetite. Em menos de 30 dias, minhas roupas já estavam mais largas e eu me sentia muito mais leve.”</blockquote><strong>Juliana Ferreira</strong><small>Rio de Janeiro, RJ · 33 anos</small></article>
            <article className="testimonial-card"><div className="testimonial-avatar" aria-hidden="true">FP</div><div className="quote-mark">“</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“Após anos lutando contra a obesidade e a frustração de não conseguir emagrecer, encontrei no MONJARIM a solução que eu precisava. Os resultados aparecem rápido e o melhor: sem efeito rebote!”</blockquote><strong>Fernanda Pimenta</strong><small>Curitiba, PR · 41 anos</small></article>
          </div>
          <p className="testimonial-disclaimer">Relatos fornecidos pelo anunciante, sem verificação independente. Não garantem resultados. Confirme sua autenticidade, a autorização de uso e a documentação antes de publicar.</p>
        </section>

        <section className="expert-section section-pad">
          <div className="expert-mark expert-portrait" role="img" aria-label="Retrato fornecido de Dra. Caliandra Marques" />
          <div className="expert-copy">
            <span className="eyebrow">RELATO ENVIADO PELO ANUNCIANTE</span>
            <h2>Conheça o relato atribuído à Dra. Caliandra Marques.</h2>
            <blockquote>“Tive o prazer de conhecer o Monjarim em um evento internacional de estudos do caso.”</blockquote>
            <p><strong>Dra. Caliandra Marques</strong><span>Trecho e identificação fornecidos pelo anunciante; confirme autoria, credenciais e autorização de uso antes de publicar.</span></p>
          </div>
          <a className="btn btn-primary expert-cta" href="#compra">Ver ofertas <ArrowRight size={16} /></a>
        </section>

        <section className="quality-section section-pad">
          <div className="quality-copy"><span className="eyebrow">CUIDADOS EM TODAS AS ETAPAS</span><h2>Informações de composição e fabricação.</h2><p>Consulte o rótulo e a documentação vigente do fabricante para verificar composição, regularização e condições de fabricação do Monjarim.</p><a className="text-link" href="#duvidas">Leia as dúvidas frequentes <ArrowRight size={16} /></a></div>
          <div className="quality-stamps">
            <div><ShieldCheck /><span>Consulte a regularização</span></div>
            <div><Check /><span>Informações do fabricante</span></div>
            <div><Leaf /><span>Composição no rótulo</span></div>
            <div><ShoppingBag /><span>Dados de fabricação</span></div>
          </div>
          <p className="quality-note">Consulte os documentos vigentes do fabricante e as informações regulatórias aplicáveis.</p>
        </section>

        <section className="guarantee-section section-pad">
          <div className="guarantee-seal"><ShieldCheck size={42} /><span>i</span><small>INFO</small></div>
          <div><span className="eyebrow">CONDIÇÕES DE COMPRA</span><h2>Confira os detalhes antes de comprar.</h2><p>Consulte no checkout da Braip os prazos, as regras de garantia e as condições de reembolso aplicáveis ao plano escolhido.</p><a className="btn btn-primary" href="#compra">Ver ofertas <ArrowRight size={17} /></a></div>
        </section>

        <section className="offers-section section-pad" id="compra">
          <div className="section-heading centered">
            <a className="btn btn-primary offer-special-button" href="#melhor-opcao">Oferta especial <ArrowRight size={16} /></a>
            <h2>Comprar o Monjarim é fácil.</h2>
            <p>Escolha seu kit e finalize o pedido no checkout da Braip. Compare as opções e confira os preços, descontos, frete e disponibilidade antes de concluir.</p>
            <div className="offer-selection-note"><strong>Compare e escolha a melhor opção para você.</strong><span>As condições e o estoque atual são confirmados no checkout.</span></div>
          </div>
          <div className="offers-grid">
            {primaryOffers.map((offer) => <OfferCard offer={offer} key={offer.id} />)}
          </div>
          <div className="special-offers-head"><span>Ofertas</span><p>Variações promocionais informadas pelo afiliado. Confira o plano e as condições no checkout.</p></div>
          <div className="special-offers-grid">
            {specialOffers.map((offer) => <OfferCard offer={offer} compact key={offer.id} />)}
          </div>
          <KitWheel options={wheelOffers} />
          <div className="checkout-assurance"><ShieldCheck /><span>Compra realizada no checkout seguro da Braip</span><span>•</span><span>Parcelamento e frete conforme o checkout</span></div>
        </section>

        <section className="faq-section section-pad" id="duvidas">
          <div className="faq-intro"><span className="eyebrow">AINDA ESTÁ EM DÚVIDA?</span><h2>Confira as perguntas mais frequentes.</h2><p>Se sua dúvida não estiver aqui, consulte as informações do fabricante e as condições exibidas no checkout da Braip.</p><a href={genericHref} className="text-link" rel="sponsored nofollow noopener" target="_blank">Ver oferta na Braip <ArrowRight size={16} /></a></div>
          <div className="faq-list">
            {FAQs.map((faq, index) => (
              <article className={activeFaq === index ? "faq-item faq-active" : "faq-item"} key={faq.question}>
                <button type="button" aria-expanded={activeFaq === index} onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                  <span>{faq.question}</span><ChevronDown size={19} />
                </button>
                {activeFaq === index ? <p>{faq.answer}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div><span className="eyebrow">SUA JORNADA COMEÇA COM INFORMAÇÃO</span><h2>Conheça Monjarim e escolha seu plano.</h2><p>Confira as condições e finalize sua compra na Braip.</p></div>
          <a href="#compra" className="btn btn-white">Ver planos <ArrowRight size={18} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="brand-mark" href="#inicio"><span className="brand-symbol"><Leaf size={18} /></span><span>monjarim<small>nutra</small></span></a><p>Suplemento alimentar em cápsulas. Conheça a composição e confira os detalhes de compra na Braip.</p></div>
          <div className="footer-column"><strong>Explore</strong><a href="#produto">O Produto</a><a href="#formula">A Fórmula</a><a href="#compra">Planos e ofertas</a><a href="#duvidas">Dúvidas frequentes</a></div>
          <div className="footer-column"><strong>Informações</strong><a href="https://pulsepro.com.br/politica-de-privacidade/" target="_blank" rel="noopener noreferrer">Política de Privacidade</a><a href="https://pulsepro.com.br/termos-e-condicoes/" target="_blank" rel="noopener noreferrer">Termos e Condições</a><a href="https://pulsepro.com.br/aviso-legal" target="_blank" rel="noopener noreferrer">Aviso Legal</a><a href="https://pulsepro.com.br/politica-de-troca/" target="_blank" rel="noopener noreferrer">Política de Troca e Devolução</a><button type="button" onClick={openCookieSettings}>Preferências de cookies</button></div>
          <div className="footer-column"><strong>Atendimento</strong><a href="mailto:sacmonjarim@gmail.com">sacmonjarim@gmail.com</a><a href="https://mga.phdesenvolvimento.online/rastreio" target="_blank" rel="noopener noreferrer">Rastrear pedido</a><span>Entrega conforme as condições no checkout.</span></div>
        </div>
        <div className="footer-legal"><p>CNPJ: 43.793.013/0001-78 · Monjarim © Copyright 2023–2026</p><p>Este produto não é um medicamento, e sim um suplemento alimentar. As informações apresentadas neste site são informativas e não substituem consulta médica ou nutricional.</p><p>Este site reproduz o material de referência informado pelo proprietário. As condições da oferta são as que aparecem no checkout Braip.</p></div>
        <div className="footer-bottom"><span>Monjarim</span><span>Página independente de afiliado · Compra finalizada na Braip</span></div>
      </footer>
      <CookieConsent />
      <a className="floating-buy" href="#compra" aria-label="Ir para as ofertas Monjarim"><ShoppingBag size={18} /><span>Ver ofertas</span></a>
    </div>
  );
}
