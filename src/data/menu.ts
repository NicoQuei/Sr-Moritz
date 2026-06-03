import type { Product, Combo, Review } from "@/lib/types";

/** Cardápio em destaque — "Os Campeões". Troque por produtos/preços/fotos reais. */
export const products: Product[] = [
  {
    id: "el-bigodon",
    name: "El Bigodón",
    description:
      "O assinatura: blend 180g, bacon, cheddar e cebola caramelizada no pão brioche.",
    price: 37,
    image: "/assets/aplicacoes/hamburguer-papel.png",
    badge: "Assinatura",
  },
  {
    id: "duble-smash",
    name: "Duble Smash",
    description:
      "Dois smashes selados na chapa, cheddar derretido e molho da casa.",
    price: 34,
    image: "/assets/aplicacoes/hamburguer-pronto.png",
    badge: "Mais pedido",
  },
  {
    id: "classico-moritz",
    name: "Clássico Moritz",
    description: "Blend, queijo, picles, molho secreto e pão dourado na manteiga.",
    price: 29,
    image: "/assets/aplicacoes/pedidos-prontos.png",
  },
];

/** Demais itens do cardápio — lista "Também na chapa". */
export const menuMais = [
  {
    grupo: "Mais burgers",
    itens: [
      { name: "Smash Bacon", desc: "Dois smashes, bacon crocante e maionese defumada.", price: 36 },
      { name: "Cheddar do Cavalheiro", desc: "Blend 180g e muito cheddar cremoso.", price: 35 },
      { name: "Frango do Coronel", desc: "Filé empanado na hora, alface e molho da casa.", price: 32 },
      { name: "Veggie Moritz", desc: "Hambúrguer de grão-de-bico, queijo e rúcula.", price: 31 },
    ],
  },
  {
    grupo: "Pra acompanhar",
    itens: [
      { name: "Batata-cheddar da casa", desc: "Fritas douradas com cheddar e bacon.", price: 24 },
      { name: "Onion rings", desc: "Anéis de cebola empanados, crocantes.", price: 19 },
      { name: "Fritas rústicas", desc: "Com alecrim e sal grosso.", price: 16 },
      { name: "Refri / Suco natural", desc: "Lata gelada ou suco da fruta.", price: 8 },
    ],
  },
];

/** Combos & Promoções. */
export const combos: Combo[] = [
  {
    id: "solo-cavalheiro",
    name: "Solo do Cavalheiro",
    description: "Burger + fritas + refri.",
    priceFrom: 49,
    price: 39,
    image: "/assets/produtos/placeholder.svg",
    highlight: true,
  },
  {
    id: "dupla-moritz",
    name: "Dupla Moritz",
    description: "2 burgers + fritas grande + 2 refris.",
    price: 72,
    image: "/assets/produtos/placeholder.svg",
  },
];

/**
 * Avaliações REAIS apenas. Não inventar. Se ainda não há volume,
 * mantenha 1 avaliação real forte + a nota agregada.
 */
export const reviews: Review[] = [
  {
    id: "r1",
    name: "[Cliente real]",
    rating: 5,
    text: "[Cole aqui uma avaliação real do Google/iFood.]",
    source: "Google",
  },
  {
    id: "r2",
    name: "[Cliente real]",
    rating: 5,
    text: "[Cole aqui uma avaliação real do Google/iFood.]",
    source: "iFood",
  },
  {
    id: "r3",
    name: "[Cliente real]",
    rating: 5,
    text: "[Cole aqui uma avaliação real do Google/iFood.]",
    source: "Google",
  },
];

/** Camadas do burger para a seção sticky "digno do bigode". */
export const burgerFeatures = [
  {
    n: "01",
    title: "A carne",
    text: "Blend autoral moído todo dia, selado na chapa pra prender o suco.",
  },
  {
    n: "02",
    title: "O pão",
    text: "Dourado na manteiga, macio mas firme. Aguenta a mordida inteira.",
  },
  {
    n: "03",
    title: "O queijo",
    text: "Derretido na hora, escorrendo do jeito que dá água na boca.",
  },
  {
    n: "04",
    title: "O molho",
    text: "Receita da casa. Segredo de cavalheiro — não se conta.",
  },
];
