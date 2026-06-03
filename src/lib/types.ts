export type MascotPose =
  | "boas-vindas"
  | "servindo"
  | "apresentando"
  | "aprovacao";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string; // ex. "Mais pedido"
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  priceFrom?: number; // preço "de"
  price: number; // preço "por"
  image: string;
  highlight?: boolean;
  serves?: string; // ex. "1 pessoa", "2 pessoas"
  items?: string[]; // o que vem no combo
  badge?: string; // ex. "Mais pedido"
}

export interface Review {
  id: string;
  name: string;
  rating: number; // 1–5
  text: string;
  source: "Google" | "iFood";
}

export interface Hours {
  day: string;
  hours: string; // ex. "18h – 23h" ou "Fechado"
}
