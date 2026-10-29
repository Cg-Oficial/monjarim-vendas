export type CheckoutChannel = "standard" | "ads";

export type OfferBottleCount = 1 | 3 | 5 | 10;

export interface AffiliateOffer {
  id: string;
  name: string;
  bottles: OfferBottleCount;
  productImage: string;
  badge?: string;
  originalPrice?: string;
  price?: string;
  installment?: string;
  term?: string;
  shipping?: string;
  standardUrl: string;
  adsUrl: string;
  featured?: boolean;
}

const affiliateId = "afi3vmxpo8";
const checkoutId = "chew4mj1";
const productImageByBottleCount: Record<OfferBottleCount, string> = {
  1: "/monjarim/kit-1-frasco-alta-resolucao.png",
  3: "/monjarim/kit-3-frascos-alta-resolucao.png",
  5: "/monjarim/bundle-5.webp",
  10: "/monjarim/kit-10-frascos-alta-resolucao.png",
};

function braipUrl(host: "ev.braip.com" | "pay.braip.co", planId: string) {
  return `https://${host}/ref?pl=${planId}&ck=${checkoutId}&af=${affiliateId}`;
}

export const salesPageUrl =
  "https://ev.braip.com/ref?pv=prodq26k&af=afi3vmxpo8";

const offerDefinitions: Omit<AffiliateOffer, "productImage">[] = [
  {
    id: "single",
    name: "MONJARIM 1 Frasco",
    bottles: 1,
    badge: "Tratamento 1 mês",
    originalPrice: "R$ 297,00",
    price: "R$ 197",
    installment: "12x de R$ 23,47",
    term: "Sem frasco extra · 1 mês (R$ 197,00/frasco)",
    shipping: "Frete R$ 29,00",
    standardUrl: braipUrl("ev.braip.com", "pla1qrk8"),
    adsUrl: braipUrl("pay.braip.co", "pla1qrk8"),
  },
  {
    id: "three",
    name: "MONJARIM 3 Frascos",
    bottles: 3,
    badge: "Tratamento 3 meses",
    originalPrice: "R$ 591,00",
    price: "R$ 297",
    installment: "12x de R$ 30,72",
    term: "Compre 2, leve 3 · 3 meses (R$ 99,00/frasco)",
    shipping: "Frete grátis",
    standardUrl: braipUrl("ev.braip.com", "plarzq9w"),
    adsUrl: braipUrl("pay.braip.co", "plarzq9w"),
  },
  {
    id: "five",
    name: "MONJARIM 5 Frascos",
    bottles: 5,
    badge: "Tratamento 5 meses",
    originalPrice: "R$ 985,00",
    price: "R$ 397",
    installment: "12x de R$ 41,06",
    term: "Compre 3, leve 5 · 5 meses (R$ 79,40/frasco)",
    shipping: "Frete grátis",
    featured: true,
    standardUrl: braipUrl("ev.braip.com", "plaooq9j"),
    adsUrl: braipUrl("pay.braip.co", "plaooq9j"),
  },
  {
    id: "ten",
    name: "MONJARIM 10 Frascos",
    bottles: 10,
    badge: "Melhor opção · 10 meses",
    originalPrice: "R$ 1.970,00",
    price: "R$ 697",
    installment: "12x de R$ 72,09",
    term: "Compre 5, leve 10 · 10 meses (R$ 69,70/frasco)",
    shipping: "Frete grátis",
    standardUrl: braipUrl("ev.braip.com", "plak8rl2"),
    adsUrl: braipUrl("pay.braip.co", "plak8rl2"),
  },
  {
    id: "single-rmkt",
    name: "MONJARIM 1 Frasco · Oferta especial",
    bottles: 1,
    badge: "Oferta especial",
    standardUrl: braipUrl("ev.braip.com", "pla81gzo"),
    adsUrl: braipUrl("pay.braip.co", "pla81gzo"),
  },
  {
    id: "five-rmkt",
    name: "MONJARIM 5 Frascos · Oferta especial",
    bottles: 5,
    badge: "Oferta especial",
    standardUrl: braipUrl("ev.braip.com", "plaj9go2"),
    adsUrl: braipUrl("pay.braip.co", "plaj9go2"),
  },
  {
    id: "three-promo",
    name: "MONJARIM 3 Frascos PROMO",
    bottles: 3,
    badge: "Promoção",
    standardUrl: braipUrl("ev.braip.com", "plawolg1"),
    adsUrl: braipUrl("pay.braip.co", "plawolg1"),
  },
  {
    id: "single-free-shipping",
    name: "MONJARIM 1 Frasco FRETE GRÁTIS",
    bottles: 1,
    badge: "Frete grátis",
    standardUrl: braipUrl("ev.braip.com", "plar4o1r"),
    adsUrl: braipUrl("pay.braip.co", "plar4o1r"),
  },
  {
    id: "single-promo",
    name: "MONJARIM 1 Frasco AÇÃO PROMOCIONAL",
    bottles: 1,
    badge: "Ação promocional",
    standardUrl: braipUrl("ev.braip.com", "plao4nx6"),
    adsUrl: braipUrl("pay.braip.co", "plao4nx6"),
  },
];

export const offers: AffiliateOffer[] = offerDefinitions.map((offer) => ({
  ...offer,
  productImage: productImageByBottleCount[offer.bottles],
}));

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "_gl",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

export function buildAffiliateUrl(offer: AffiliateOffer, channel: CheckoutChannel) {
  const target = new URL(channel === "ads" ? offer.adsUrl : offer.standardUrl);
  if (typeof window !== "undefined") {
    const incoming = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const value = incoming.get(key);
      if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
    }
  }
  return target.toString();
}

export function buildSalesPageUrl() {
  const target = new URL(salesPageUrl);
  if (typeof window !== "undefined") {
    const incoming = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const value = incoming.get(key);
      if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
    }
  }
  return target.toString();
}
