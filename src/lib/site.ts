/**
 * Configuração central da marca. Troque os [PLACEHOLDERS] pelos dados reais
 * (cidade, endereço, horários, WhatsApp, canais de delivery).
 */
export const site = {
  name: "Sr. Moritz",
  tagline: "Burguer Artesanal",
  city: "[CIDADE]",
  neighborhood: "[bairro]",

  rating: 4.9,
  served: "+12 mil",
  deliveryTime: "~35min",

  // Contato / pedido
  whatsapp: "5500000000000", // só dígitos, com DDI/DDD
  orderUrl: "https://wa.me/5500000000000", // link principal de pedido (WhatsApp/iFood)
  menuUrl: "#cardapio",

  instagram: {
    handle: "@sr.moritz.burguer",
    url: "https://instagram.com/sr.moritz.burguer",
    teaser: true, // perfil em fase "Em breve"
  },

  // Localização
  address: {
    street: "[Rua Exemplo, 123]",
    area: "[Bairro] · [Cidade] – [UF]",
    full: "[Rua Exemplo, 123, Bairro, Cidade – UF, CEP]",
  },
  geo: { lat: 0, lng: 0 }, // preencher para JSON-LD / mapa
  mapEmbedUrl:
    "https://www.google.com/maps?q=hamburgueria&output=embed", // troque pela query/endereço real

  hours: [
    { day: "Seg", hours: "Fechado" },
    { day: "Ter – Qui", hours: "18h – 23h" },
    { day: "Sex – Sáb", hours: "18h – 00h" },
    { day: "Dom", hours: "18h – 23h" },
  ],

  delivery: {
    own: true,
    ifood: "#",
    rappi: "#",
  },
} as const;
