import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Flame,
  Leaf,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
  Zap,
} from "lucide-react";
import CookieConsent from "@/components/CookieConsent";
import {
  buildAffiliateUrl,
  buildSalesPageUrl,
  offers,
  type AffiliateOffer,
  type CheckoutChannel,
} from "@/lib/affiliate-links";
import { trackAffiliateCheckoutClick } from "@/lib/marketing-tags";
import "../App.css";

const productPhoto = "/monjarim/asset-1.webp";
const storyPhotoOne = "/monjarim/asset-2.webp";
const storyPhotoTwo = "/monjarim/asset-3.webp";
const storyPhotoWeighing = "/monjarim/asset-5.webp";

const ingredients = [
  {
    initials: "CV",
    title: "CAFÉ VERDE",
    text: "Ingrediente apresentado pelo fabricante. Consulte o rótulo vigente para verificar a composição, a quantidade por porção e as informações atualizadas.",
    tone: "green",
    image: "/monjarim/ingredient-cafe-verde.svg",
  },
  {
    initials: "C3®",
    title: "C3 REDUCT®",
    text: "Ingrediente identificado pelo fabricante como parte da fórmula. Consulte o rótulo vigente para verificar a composição, a quantidade por porção e as informações atualizadas.",
    tone: "purple",
    image: "/monjarim/ingredient-curcuma.svg",
  },
  {
    initials: "LM",
    title: "LARANJA MORO",
    text: "Ingrediente apresentado na fórmula do produto. Consulte o rótulo vigente para conferir a composição e as informações fornecidas pelo fabricante.",
    tone: "orange",
    image: "/monjarim/ingredient-laranja.svg",
  },
  {
    initials: "CR",
    title: "CROMO",
    text: "Mineral listado entre os ingredientes apresentados pelo fabricante. Confira no rótulo a forma, a quantidade por porção e as orientações de consumo.",
    tone: "pink",
    image: "/monjarim/ingredient-cromo.svg",
  },
];

const FAQs = [
  {
    question: "O site é seguro para realizar a minha compra?",
    answer: "Os botões desta página levam ao checkout da Braip. Antes de concluir, confira o endereço exibido, o plano, o preço, o frete e as condições da oferta. Para informações sobre pagamento, privacidade e segurança da transação, consulte os termos e os canais oficiais da Braip.",
  },
  {
    question: "O Monjarim pode causar algum efeito colateral?",
    answer: "A resposta a suplementos pode variar entre pessoas; não é possível garantir ausência de efeitos indesejados. Leia a composição e as advertências do rótulo. Se notar uma reação, interrompa o uso e procure orientação de um profissional de saúde; em caso de sintomas intensos, busque atendimento.",
  },
  {
    question: "Existe alguma contraindicação para o uso?",
    answer: "As recomendações dependem da composição, da idade e do histórico de saúde. Siga a rotulagem do fabricante e converse com um profissional de saúde antes de usar se estiver grávida ou amamentando, tiver uma condição de saúde, usar medicamentos ou tiver qualquer dúvida. Não use fora das indicações do rótulo.",
  },
  {
    question: "Quanto tempo leva para ver os primeiros resultados?",
    answer: "Não é possível prometer um prazo, uma quantidade de peso ou um resultado. A resposta varia de pessoa para pessoa e depende de diversos fatores. O Monjarim é apresentado como suplemento alimentar e não substitui orientação profissional de saúde.",
  },
  {
    question: "Existe um limite de idade para usar o Monjarim?",
    answer: "Confira a faixa etária indicada no rótulo. Não é possível afirmar que o produto seja adequado para todas as idades; menores de idade, pessoas idosas ou quem tenha uma condição de saúde devem conversar com um profissional de saúde antes de usar.",
  },
  {
    question: "O Monjarim causa o chamado efeito rebote ao parar de tomar?",
    answer: "Não há como garantir que não haverá reganho de peso após interromper uma estratégia de controle do peso. Mudanças corporais dependem de vários fatores, e esta página não promete que um suplemento previna esse efeito. Procure orientação profissional para um plano adequado à sua situação.",
  },
  {
    question: "O Monjarim é autorizado ou aprovado pela ANVISA?",
    answer: "A página de referência não apresenta um identificador de regularização que possa ser confirmado aqui. Confira o rótulo, a identificação do fabricante e os dados atualizados nos canais oficiais antes de comprar. Por isso, esta resposta não afirma aprovação específica da ANVISA.",
  },
  {
    question: "Como devo tomar o Monjarim?",
    answer: "Siga a dose e as instruções do rótulo do produto e não exceda o recomendado. Esta página não acrescenta orientação de horário ou dosagem além da rotulagem. Em caso de dúvida, consulte o fabricante ou um profissional de saúde.",
  },
  {
    question: "Qual é o prazo de entrega e como acompanho meu pedido?",
    answer: "O prazo e o valor do frete dependem do CEP, do plano e das condições apresentadas no checkout. Após a compra, consulte o e-mail de confirmação e os canais indicados pelo vendedor para obter atualizações e o código de rastreamento.",
  },
  {
    question: "Quais são as formas de pagamento disponíveis?",
    answer: "As opções de pagamento, parcelamento e aprovação são exibidas no checkout da Braip e podem variar conforme o plano, a oferta vigente e a instituição financeira. Confira as condições antes de finalizar a compra.",
  },
  {
    question: "O que é o C3 Reduct® e qual é o seu diferencial?",
    answer: "O material do produto identifica o C3 Reduct® como um dos ingredientes da fórmula. Afirmações específicas sobre mecanismos, comparações quantitativas ou resultados devem ser avaliadas com base em documentação técnica e estudos aplicáveis. Para detalhes atualizados, consulte o rótulo e o fabricante.",
  },
  {
    question: "Posso comprar o Monjarim em farmácias ou marketplaces?",
    answer: "Esta página encaminha para o checkout da Braip por links de afiliado. A disponibilidade em outros canais pode variar; antes de comprar, confira a origem do vendedor, o rótulo e as condições da oferta.",
  },
  {
    question: "Por que o Monjarim é superior aos demais tratamentos do mercado?",
    answer: "Não é possível afirmar superioridade em relação a outros tratamentos sem evidências comparativas verificáveis. Compare composição, informações de regularização e condições da oferta, e converse com um profissional de saúde. Suplementos alimentares não substituem medicamentos ou tratamentos prescritos.",
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
    <article className={`offer-card ${offer.featured ? "offer-card-featured" : ""} ${compact ? "offer-card-compact" : ""}`}>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const primaryOffers = [offers[3], offers[2], offers[1], offers[0]];
  const specialOffers = offers.slice(4);
  const genericOffer = offers[0];
  const genericHref = buildSalesPageUrl();

  const openCookieSettings = () => window.dispatchEvent(new Event("monjarim-open-cookie-settings"));

  return (
    <div className="site-shell">
      <div className="top-strip">Transformando vidas através do digital <span>•</span> Conheça Monjarim</div>
      <header className="site-header">
        <a className="brand-mark" href="#inicio" aria-label="Monjarim, início">
          <span className="brand-symbol"><Leaf size={18} /></span>
          <span>monjarim<small>nutra</small></span>
        </a>
        <a className="mobile-faq-button" href="#duvidas" aria-label="Ir para dúvidas frequentes">Dúvidas</a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        <nav className={mobileMenuOpen ? "main-nav nav-open" : "main-nav"} aria-label="Navegação principal">
          <a href="#produto" onClick={() => setMobileMenuOpen(false)}>O produto</a>
          <a href="#formula" onClick={() => setMobileMenuOpen(false)}>A fórmula</a>
          <a href="#depoimentos" onClick={() => setMobileMenuOpen(false)}>Depoimentos</a>
          <a className="nav-faq-button" href="#duvidas" aria-label="Ir para dúvidas frequentes" onClick={() => setMobileMenuOpen(false)}>Dúvidas</a>
          <a className="btn btn-primary nav-cta" href="#compra" onClick={() => setMobileMenuOpen(false)}>Ver ofertas</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> CONHEÇA MONJARIM</span>
            <h1>Conheça o <strong>Monjarim</strong> e descubra uma nova forma de cuidar de você.</h1>
            <p className="hero-lead"><b>Um suplemento alimentar com ingredientes apresentados pelo fabricante.</b> Conheça a fórmula e confira as informações do rótulo.</p>
            <p className="hero-subline">Informação clara para uma escolha consciente.</p>
            <a className="btn btn-primary hero-button" href="#compra">Quero emagrecer com Monjarim <ArrowRight size={18} /></a>
            <p className="hero-caption">Compra finalizada com segurança no checkout da Braip.</p>
          </div>
          <div className="hero-art" aria-label="Embalagens do suplemento Monjarim">
            <div className="hero-glow" />
            <img src={productPhoto} alt="Embalagens oficiais do suplemento alimentar Monjarim" />
            <div className="hero-float float-top"><Leaf size={17} /> Fórmula com ativos naturais</div>
            <div className="hero-float float-bottom"><ShieldCheck size={17} /> Checkout Braip</div>
          </div>
          <div className="hero-trust">
            <span><Truck size={18} /> Frete grátis*</span>
            <span><ShieldCheck size={18} /> Compra 100% segura</span>
            <span><Check size={18} /> Garantia conforme a oferta</span>
          </div>
          <a href="#produto" className="scroll-cue"><ArrowDown size={15} /> Role para conhecer</a>
        </section>

        <div className="promise-bar" aria-label="Conheça o produto">
          <div className="promise-track">COMPOSIÇÃO <span>•</span> INFORMAÇÃO <span>•</span> ESCOLHA CONSCIENTE <span>•</span> CUIDADO COM VOCÊ <span>•</span> COMPRA NA BRAIP <span>•</span> COMPOSIÇÃO <span>•</span> INFORMAÇÃO <span>•</span> ESCOLHA CONSCIENTE <span>•</span> CUIDADO COM VOCÊ <span>•</span> COMPRA NA BRAIP</div>
        </div>

        <section className="story-section section-pad" id="produto">
          <div className="section-heading centered">
            <span className="eyebrow">UM NOVO COMEÇO</span>
            <h2>Não permita que a obesidade tire a sua alegria de viver!</h2>
            <p>Liberte-se das amarras do passado. O caminho para o seu novo corpo é guiado por inovação científica, autonomia e performance real.</p>
          </div>
          <div className="story-grid">
            <article className="story-card story-card-photo">
              <img src={storyPhotoOne} alt="Imagem da campanha Monjarim retratando uma mulher diante do espelho" loading="lazy" />
              <div><span>01 / RECOMEÇO</span><h3>Já se sentiu preso num corpo que não te representa?</h3><p>A roupa aperta, o espelho machuca, a vontade de sumir aparece.</p></div>
            </article>
            <div className="story-side">
              <article className="story-card story-card-photo story-card-weighing">
                <img src={storyPhotoWeighing} alt="Imagem ilustrativa de uma mulher diante de uma balança em ambiente doméstico." loading="lazy" />
                <div><span>02 / SEM CULPA</span><h3>Você se pesa… e desiste de novo.</h3><p>Não é falta de força de vontade. É falta de uma solução que funcione de verdade.</p></div>
              </article>
              <article className="story-card story-card-photo story-card-small">
                <img src={storyPhotoTwo} alt="Imagem da campanha Monjarim sobre uma escolha alimentar consciente" loading="lazy" />
                <div><span>03 / NOVOS HÁBITOS</span><h3>Existe outro caminho.</h3><p>Parar de comer o que gosta não é disciplina, é tortura. Emagrecimento inteligente, simples e real.</p></div>
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
            <div className="feature-pills"><span><Flame size={16} /> Queima de gordura*</span><span><Zap size={16} /> Mais disposição*</span><span><Leaf size={16} /> Ativos naturais</span><span><Check size={16} /> Sem rebote*</span></div>
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
            <h2>Conheça a fórmula exclusiva de Monjarim.</h2>
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
            <span className="eyebrow">RELATOS SOBRE O MONJARIM</span>
            <h2>Histórias compartilhadas por consumidores.</h2>
            <p>Relatos fornecidos pelo anunciante; autenticidade, autorização e resultados devem ser confirmados antes da publicação.</p>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial-card testimonial-featured">
              <div className="testimonial-content"><div className="testimonial-avatar" aria-hidden="true">FA</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“O MONJARIM foi um divisor de águas para mim. Já tinha tentado de tudo — dietas malucas, remédios caros e até cirurgia. Em 4 semanas usando Monjarim, perdi 7 kg e o inchaço diminuiu absurdamente. Minha qualidade de vida mudou completamente.”</blockquote><strong>Fernando Aragão</strong><small>S.J. Rio Preto, SP · 38 anos</small></div>
            </article>
            <article className="testimonial-card"><div className="testimonial-avatar" aria-hidden="true">ML</div><div className="quote-mark">“</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“Agradeço à equipe por esse produto incrível. Minha qualidade de vida melhorou 100% desde que comecei a usar o MONJARIM. A compulsão alimentar foi embora na primeira semana. Já indiquei para toda a família!”</blockquote><strong>Maria Leão</strong><small>Contagem, MG · 45 anos</small></article>
            <article className="testimonial-card"><div className="testimonial-avatar" aria-hidden="true">JF</div><div className="quote-mark">“</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“O MONJARIM transformou a minha vida! Eu sofria com inchaço abdominal, sensação de peso e dificuldade para controlar o apetite. Em menos de 30 dias, minhas roupas já estavam mais largas e eu me sentia muito mais leve.”</blockquote><strong>Juliana Ferreira</strong><small>Rio de Janeiro, RJ · 33 anos</small></article>
            <article className="testimonial-card"><div className="testimonial-avatar" aria-hidden="true">FP</div><div className="quote-mark">“</div><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote>“Após anos lutando contra a obesidade e a frustração de não conseguir emagrecer, encontrei no MONJARIM a solução que eu precisava. Os resultados aparecem rápido e o melhor: sem efeito rebote!”</blockquote><strong>Fernanda Pimenta</strong><small>Curitiba, PR · 41 anos</small></article>
          </div>
          <p className="testimonial-disclaimer">Os relatos foram fornecidos pelo anunciante e não foram verificados independentemente. Resultados individuais variam.</p>
        </section>

        <section className="expert-section section-pad">
          <div className="expert-mark"><ShieldCheck size={30} /></div>
          <div className="expert-copy">
            <span className="eyebrow">INFORMAÇÕES SOBRE O PRODUTO</span>
            <h2>“Tive o prazer de conhecer o Monjarim...”</h2>
            <blockquote>“Tive o prazer de conhecer o MONJARIM em um evento internacional de estudos do caso. Após avaliar rigorosamente sua composição, os efeitos e os estudos clínicos que embasam cada ingrediente, posso afirmar com segurança: esta fórmula é inovadora. O mecanismo de ação similar ao da tirzepatida, aliado ao uso de ativos naturais, torna o MONJARIM uma alternativa segura e eficaz para pacientes que buscam emagrecimento sustentável sem recorrer a medicamentos injetáveis.”</blockquote>
            <p><strong>Dra. Caliandra Marques</strong><span>Identificação e declaração fornecidas pelo anunciante; confirme credenciais, autorização e origem antes de publicar.</span></p>
          </div>
          <div className="expert-stars" aria-hidden="true">★★★★★</div>
        </section>

        <section className="quality-section section-pad">
          <div className="quality-copy"><span className="eyebrow">CUIDADOS EM CADA ETAPA</span><h2>Informações de composição e fabricação.</h2><p>Consulte o rótulo e a documentação vigente do fabricante para verificar composição, regularização e condições de fabricação do Monjarim.</p><a className="text-link" href="#duvidas">Leia as dúvidas frequentes <ArrowRight size={16} /></a></div>
          <div className="quality-stamps">
            <div><ShieldCheck /><span>Consulte a regularização</span></div>
            <div><Check /><span>Informações do fabricante</span></div>
            <div><Leaf /><span>Composição no rótulo</span></div>
            <div><ShoppingBag /><span>Dados de fabricação</span></div>
          </div>
          <p className="quality-note">Consulte os documentos vigentes do fabricante e as informações regulatórias aplicáveis.</p>
        </section>

        <section className="guarantee-section section-pad">
          <div className="guarantee-seal"><ShieldCheck size={42} /><span>90</span><small>DIAS</small></div>
          <div><span className="eyebrow">GARANTIA LEGAL</span><h2>Experimente sem risco.</h2><p>Garantia de 90 dias, com reembolso conforme os protocolos, prazos e critérios de elegibilidade vigentes da plataforma e do fabricante. Confira as condições no checkout antes de comprar.</p><a className="btn btn-primary" href="#compra">Quero conhecer as ofertas <ArrowRight size={17} /></a></div>
        </section>

        <section className="offers-section section-pad" id="compra">
          <div className="section-heading centered">
            <span className="eyebrow">OFERTA ESPECIAL</span>
            <h2>Escolha sua opção Monjarim.</h2>
            <p>Para um resultado eficaz e sem efeito rebote, a página de referência recomenda tratamento de 5 a 10 meses. Preço, frete, estoque e condições devem ser confirmados no checkout Braip antes do pagamento.</p>
          </div>
          <div className="offers-grid">
            {primaryOffers.map((offer) => <OfferCard offer={offer} key={offer.id} />)}
          </div>
          <div className="special-offers-head"><span>Ofertas</span><p>Variações promocionais informadas pelo afiliado. Confira o plano e as condições no checkout.</p></div>
          <div className="special-offers-grid">
            {specialOffers.map((offer) => <OfferCard offer={offer} compact key={offer.id} />)}
          </div>
          <div className="checkout-assurance"><ShieldCheck /><span>Compra realizada no checkout seguro da Braip</span><span>•</span><span>Parcelamento e frete conforme o checkout</span></div>
        </section>

        <section className="faq-section section-pad" id="duvidas">
          <div className="faq-intro"><span className="eyebrow">AINDA ESTÁ EM DÚVIDA?</span><h2>Confira as perguntas mais frequentes.</h2><p>Se sua dúvida não estiver aqui, consulte a página oficial e os detalhes exibidos pela Braip antes de concluir a compra.</p><a href={genericHref} className="text-link" rel="sponsored nofollow noopener" target="_blank">Ver página de vendas oficial <ArrowRight size={16} /></a></div>
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
          <div className="footer-column"><strong>Explore</strong><a href="#produto">O produto</a><a href="#formula">A fórmula</a><a href="#compra">Planos e ofertas</a><a href="#duvidas">Dúvidas frequentes</a></div>
          <div className="footer-column"><strong>Informações</strong><a href="https://pulsepro.com.br/politica-de-privacidade/" target="_blank" rel="noopener noreferrer">Política de Privacidade</a><a href="https://pulsepro.com.br/termos-e-condicoes/" target="_blank" rel="noopener noreferrer">Termos e Condições</a><a href="https://pulsepro.com.br/aviso-legal" target="_blank" rel="noopener noreferrer">Aviso Legal</a><a href="https://pulsepro.com.br/politica-de-troca/" target="_blank" rel="noopener noreferrer">Política de Troca e Devolução</a><button type="button" onClick={openCookieSettings}>Preferências de cookies</button></div>
          <div className="footer-column"><strong>Atendimento</strong><a href="mailto:sacmonjarim@gmail.com">sacmonjarim@gmail.com</a><a href="https://mga.phdesenvolvimento.online/rastreio" target="_blank" rel="noopener noreferrer">Rastrear pedido</a><span>Entrega conforme as condições no checkout.</span></div>
        </div>
        <div className="footer-legal"><p>CNPJ: 43.793.013/0001-78 · Monjarim © Copyright 2023–2026</p><p>Este produto não é um medicamento, e sim um suplemento alimentar. As informações apresentadas neste site são informativas e não substituem consulta médica ou nutricional.</p><p>Este site reproduz o material de referência informado pelo proprietário. As condições da oferta são as que aparecem no checkout Braip.</p></div>
        <div className="footer-bottom"><span>Monjarim</span><span>Links de afiliado · Compra finalizada na Braip</span></div>
      </footer>
      <CookieConsent />
      <a className="floating-buy" href="#compra" aria-label="Ir para as ofertas Monjarim"><ShoppingBag size={18} /><span>Ver ofertas</span></a>
    </div>
  );
}
