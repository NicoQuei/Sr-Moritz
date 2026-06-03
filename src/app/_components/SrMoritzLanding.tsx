"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Lenis from "lenis";
import { products, combos, burgerFeatures, menuMais } from "@/data/menu";
import { site } from "@/lib/site";
import { brl } from "@/lib/format";
import "./sr-moritz.css";

/* ───────────────────────── animação ───────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const reveal = {
  variants: fadeUp,
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.2 },
} as const;

const order = site.orderUrl;
const wpp = `https://wa.me/${site.whatsapp}`;
const rating = site.rating.toString().replace(".", ",");
const A = "/assets";

/* ───────────────────────── assets reais ───────────────────────── */
const MASCOT: Record<string, number> = { "boas-vindas": 4, servindo: 1, aprovacao: 2, apresentando: 3 };

function Mascot({ pose, className = "", priority = false, sizes = "(max-width:768px) 60vw, 360px" }: { pose: keyof typeof MASCOT | string; className?: string; priority?: boolean; sizes?: string }) {
  return <Image src={`${A}/personagem/${MASCOT[pose] ?? 4}.png`} alt="Sr. Moritz, o anfitrião" width={1080} height={1350} priority={priority} sizes={sizes} className={className} />;
}

function Logo({ cream = false, className = "", priority = false }: { cream?: boolean; className?: string; priority?: boolean }) {
  return <Image src={`${A}/logos/${cream ? 2 : 1}.png`} alt="Sr. Moritz — Burguer Artesanal" width={1080} height={1080} priority={priority} sizes="320px" className={className} />;
}

function El({ name, alt = "", className = "" }: { name: string; alt?: string; className?: string }) {
  return <Image src={`${A}/elementos/${name}.png`} alt={alt} width={600} height={400} sizes="160px" aria-hidden={alt === ""} className={className} />;
}

function Bigode({ className = "" }: { className?: string }) {
  return <El name="el-bigodon" className={className} />;
}

function StarRow({ n = 5, size = 18, tone = "gold", className = "" }: { n?: number; size?: number; tone?: "gold" | "cream"; className?: string }) {
  const c = tone === "cream" ? "text-cream" : "text-gold";
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${n} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={i < n ? c : `${c} opacity-20`} aria-hidden>
          <path d="M12 2l2.7 6.06 6.6.57-5 4.35 1.5 6.47L12 16.9l-5.8 3.52 1.5-6.47-5-4.35 6.6-.57L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function GStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.7 6.06 6.6.57-5 4.35 1.5 6.47L12 16.9l-5.8 3.52 1.5-6.47-5-4.35 6.6-.57L12 2z" />
    </svg>
  );
}

/* ───────────────────── cabeçalho de seção (brand-book) ───────────────────── */
function Heading({ num, title, sub, onGreen = false, center = false }: { num: string; title: React.ReactNode; sub?: string; onGreen?: boolean; center?: boolean }) {
  return (
    <motion.div {...reveal} className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="font-serif text-lg font-bold text-gold">{num}</span>
        <span className="h-px w-10 bg-gold/60" />
        <span className="text-[.72rem] font-bold uppercase tracking-[.28em] text-gold">{site.name}</span>
      </div>
      <h2 className={`mt-4 font-serif text-[clamp(2.2rem,5.4vw,4rem)] font-black uppercase leading-[.98] tracking-[-.01em] ${onGreen ? "text-cream" : "text-moritz-900"}`}>
        {title}
      </h2>
      {sub && <p className={`mt-4 max-w-xl text-[1.02rem] ${center ? "mx-auto" : ""} ${onGreen ? "text-cream/65" : "text-ink-soft"}`}>{sub}</p>}
    </motion.div>
  );
}

function GoldButton({ children, href = order, className = "" }: { children: React.ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[.78rem] font-bold uppercase tracking-[.12em] text-moritz-900 shadow-[0_10px_26px_rgba(212,160,23,.32)] transition-all hover:-translate-y-0.5 hover:bg-gold-deep ${className}`}>
      {children}
    </a>
  );
}

function OutlineButton({ children, href, onGreen = false, className = "" }: { children: React.ReactNode; href: string; onGreen?: boolean; className?: string }) {
  const c = onGreen ? "border-gold text-gold hover:bg-gold hover:text-moritz-900" : "border-moritz-700 text-moritz-900 hover:bg-moritz-900 hover:text-cream";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center rounded-full border-[1.6px] px-7 py-3.5 text-[.78rem] font-bold uppercase tracking-[.12em] transition-colors ${c} ${className}`}>
      {children}
    </a>
  );
}

/* ───────────────────────── Diferenciais — grade catálogo ───────────────────────── */
const featureEl = ["espatula-smash", "chapeu-de-cozinha", "batata-com-cheddar", "el-bigodon"];

/* ───────────────────────── PÁGINA ───────────────────────── */
const navLinks: [string, string][] = [
  ["Cardápio", "#cardapio"],
  ["Combos", "#combos"],
  ["Diferenciais", "#diferenciais"],
  ["Onde estamos", "#onde-estamos"],
];

/* ───────── opções do "Monte seu combo" ───────── */
type ComboOpt = { name: string; price: number };
const burgerOpts: ComboOpt[] = [
  { name: "El Bigodón", price: 37 },
  { name: "Duble Smash", price: 34 },
  { name: "Clássico Moritz", price: 29 },
  { name: "Smash Bacon", price: 36 },
];
const sideOpts: ComboOpt[] = [
  { name: "Batata-cheddar", price: 24 },
  { name: "Onion rings", price: 19 },
  { name: "Fritas rústicas", price: 16 },
  { name: "Sem acompanhamento", price: 0 },
];
const drinkOpts: ComboOpt[] = [
  { name: "Refri lata", price: 8 },
  { name: "Suco natural", price: 10 },
  { name: "Milk-shake", price: 15 },
  { name: "Sem bebida", price: 0 },
];

export default function SrMoritzLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [burgerI, setBurgerI] = useState(0);
  const [sideI, setSideI] = useState(0);
  const [drinkI, setDrinkI] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const comboPick = [burgerOpts[burgerI], sideOpts[sideI], drinkOpts[drinkI]];
  const comboTotal = comboPick.reduce((s, o) => s + o.price, 0);
  const comboHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Olá, Sr. Moritz! Quero montar meu combo:\n• ${comboPick[0].name}\n• ${comboPick[1].name}\n• ${comboPick[2].name}\nTotal: ${brl(comboTotal)}`
  )}`;
  const comboSteps = [
    { label: "1 · Escolha o burger", opts: burgerOpts, sel: burgerI, set: setBurgerI },
    { label: "2 · Acompanhamento", opts: sideOpts, sel: sideI, set: setSideI },
    { label: "3 · Bebida", opts: drinkOpts, sel: drinkI, set: setDrinkI },
  ];

  // combos: o destaque vira "pôster"; os demais ficam ao lado
  const mainCombo = combos.find((c) => c.highlight) ?? combos[0];
  const otherCombos = combos.filter((c) => c !== mainCombo);
  const comboOff = (c: (typeof combos)[number]) => (c.priceFrom != null ? Math.round((1 - c.price / c.priceFrom) * 100) : null);
  const comboOrder = (c: (typeof combos)[number]) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Olá, Sr. Moritz! Quero o combo ${c.name} (${brl(c.price)}).`)}`;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const emblemY = useTransform(heroProg, [0, 1], [0, 80]);

  // navegação por âncora — roteada pelo Lenis (o scroll suave engole o salto nativo)
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    setMenuOpen(false);
    if (lenisRef.current) lenisRef.current.scrollTo(el as HTMLElement, { offset: -72 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative overflow-x-clip bg-cream font-sans text-ink">
      <div className="sm-grain" />

      {/* NAV */}
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled || menuOpen ? "bg-moritz-900/95 shadow-lg backdrop-blur" : "bg-transparent"}`}>
        {/* barra principal */}
        <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 md:px-10 ${scrolled ? "py-2.5" : "py-3.5"}`}>
          <a href="#topo" onClick={(e) => goTo(e, "#topo")} className="group flex items-center gap-3" aria-label="Sr. Moritz — início">
            <span className={`grid place-items-center rounded-full border border-gold/40 bg-moritz-700/30 p-1.5 transition-all duration-300 group-hover:border-gold ${scrolled ? "scale-90" : "scale-100"}`}>
              <Logo cream priority className="h-12 w-12" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-lg font-black uppercase tracking-wide text-cream">Sr. Moritz</span>
              <span className="text-[.56rem] font-bold uppercase tracking-[.3em] text-gold/80">Burguer Artesanal</span>
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {navLinks.map(([l, h]) => (
              <a key={l} href={h} onClick={(e) => goTo(e, h)} className="group relative text-[.74rem] font-bold uppercase tracking-[.16em] text-cream/75 transition-colors hover:text-gold">
                {l}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <GoldButton className="!hidden !px-5 !py-2.5 sm:!inline-flex">Peça agora</GoldButton>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
                ) : (
                  <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* menu mobile */}
        <motion.div initial={false} animate={{ height: menuOpen ? "auto" : 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden border-t border-gold/15 lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {navLinks.map(([l, h]) => (
              <a key={l} href={h} onClick={(e) => goTo(e, h)} className="flex items-center justify-between rounded-xl px-3 py-3 font-serif text-lg font-bold uppercase text-cream transition-colors hover:bg-moritz-700/40 hover:text-gold">
                {l}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            ))}
            <GoldButton className="mt-3 !flex !py-3.5">Peça agora</GoldButton>
          </nav>
        </motion.div>
      </header>

      {/* ───── HERO (verde, emblema centrado) ───── */}
      <section id="topo" ref={heroRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-moritz-900 px-6 pb-16 pt-28 text-center text-cream">
        {/* sunburst */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.06]">
          <div className="sm-spin h-full w-full" style={{ background: "repeating-conic-gradient(from 0deg, currentColor 0deg 4deg, transparent 4deg 11deg)", WebkitMaskImage: "radial-gradient(closest-side,#000 10%,transparent 70%)", maskImage: "radial-gradient(closest-side,#000 10%,transparent 70%)" }} />
        </div>
        {/* moldura */}
        <div className="pointer-events-none absolute inset-4 rounded-2xl border border-gold/20 md:inset-6" />

        {/* mascote — accent nos cantos */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.3 }} className="pointer-events-none absolute bottom-0 left-2 hidden w-44 opacity-90 lg:block xl:w-52">
          <Mascot pose="boas-vindas" priority sizes="200px" className="h-auto w-full" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.45 }} className="pointer-events-none absolute bottom-0 right-2 hidden w-[157px] opacity-90 lg:block xl:w-[185px]">
          {/* pose mais "alta" no PNG: estreita p/ igualar altura do personagem e sobe p/ alinhar os pés ao da esquerda */}
          <Mascot pose="apresentando" sizes="200px" className="h-auto w-full -translate-y-[5.8%]" />
        </motion.div>

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 text-gold">
            <GStar className="h-3 w-3" />
            <span className="text-[.72rem] font-bold uppercase tracking-[.3em]">Burguer Artesanal · {site.city}</span>
            <GStar className="h-3 w-3" />
          </motion.div>

          <motion.div style={{ y: emblemY }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }} className="my-7">
            <Logo cream priority className="h-36 w-36 drop-shadow-[0_10px_30px_rgba(0,0,0,.35)] sm:h-44 sm:w-44" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} className="font-serif text-[clamp(2.8rem,8vw,5.4rem)] font-black uppercase leading-[.92] tracking-[-.015em] text-cream">
            Artesanal<br />de <span className="italic text-gold">verdade</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-3 font-serif text-[clamp(1.1rem,2.4vw,1.6rem)] italic text-cream/85">
            à moda do Sr. Moritz
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mx-auto mt-7 max-w-md text-[1.05rem] leading-relaxed text-cream/70">
            Blend autoral, pão dourado na manteiga e o capricho de quem faz tudo na hora. Pede que eu mando quentinho.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.72 }} className="mt-9 flex flex-col gap-3.5 sm:flex-row">
            <GoldButton className="!px-8">Peça agora</GoldButton>
            <OutlineButton href="#cardapio" onGreen>Ver cardápio</OutlineButton>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.9 }} className="mt-8 flex items-center gap-3 text-[.84rem] text-cream/60">
            <StarRow size={16} /> <strong className="text-cream">{rating}</strong>
            <span className="h-1 w-1 rounded-full bg-cream/40" /> Feito na hora
            <span className="h-1 w-1 rounded-full bg-cream/40" /> Entrega {site.deliveryTime}
          </motion.div>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-gold/70">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </section>

      {/* ───── 01 · CARDÁPIO (creme) ───── */}
      <section id="cardapio" className="bg-cream py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="01" title={<>Os campeões<br />do Sr. Moritz</>} sub="Os que somem da chapa mais rápido. Escolhe o seu." />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {products.map((p, i) => (
              <motion.article key={p.id} {...reveal} transition={{ delay: i * 0.08 }} whileHover={{ y: -8 }} className="group flex flex-col overflow-hidden rounded-3xl border border-ink/12 bg-surface shadow-[0_14px_40px_rgba(30,58,30,.08)]">
                {/* foto grande */}
                <div className="relative aspect-[5/4] overflow-hidden bg-moritz-900">
                  <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, 380px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-moritz-900/70 to-transparent" />
                  <span className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream/95 font-serif text-lg font-black text-moritz-900">0{i + 1}</span>
                  {p.badge && (
                    <span className="absolute right-5 top-5 rounded-full bg-gold px-3.5 py-1.5 text-[.62rem] font-bold uppercase tracking-[.1em] text-moritz-900 shadow">{p.badge}</span>
                  )}
                  <h3 className="absolute inset-x-5 bottom-4 font-serif text-[1.9rem] font-black uppercase leading-none text-cream drop-shadow">{p.name}</h3>
                </div>
                {/* corpo */}
                <div className="flex flex-1 flex-col p-7">
                  <p className="flex-1 text-[1rem] leading-relaxed text-ink-soft">{p.description}</p>
                  <div className="mt-7 flex items-center justify-between border-t border-ink/10 pt-6">
                    <span className="flex items-baseline gap-1 font-serif font-black text-gold-deep">
                      <span className="text-base">R$</span><span className="text-4xl leading-none">{p.price}</span>
                    </span>
                    <GoldButton className="!px-6 !py-3">Pedir</GoldButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Também na chapa — menu completo */}
          <motion.div {...reveal} className="mt-16 rounded-3xl border border-ink/12 bg-paper/50 p-8 md:p-12">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[.72rem] font-bold uppercase tracking-[.28em] text-gold-deep">Também na chapa</span>
              <span className="h-px flex-1 bg-ink/10" />
              <Bigode className="h-6 w-14" />
            </div>
            <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
              {menuMais.map((g) => (
                <div key={g.grupo}>
                  <h3 className="mb-4 font-serif text-lg font-black uppercase tracking-wide text-moritz-900">{g.grupo}</h3>
                  <ul className="space-y-4">
                    {g.itens.map((it) => (
                      <li key={it.name} className="flex items-end gap-3">
                        <div className="min-w-0">
                          <p className="font-serif text-lg font-bold text-moritz-900">{it.name}</p>
                          <p className="text-[.9rem] text-ink-soft">{it.desc}</p>
                        </div>
                        <span className="mb-1.5 h-px flex-1 border-b border-dashed border-ink/20" />
                        <span className="font-serif text-xl font-black text-gold-deep">{brl(it.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <GoldButton className="!px-8">Ver cardápio completo</GoldButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── 02 · DIFERENCIAIS (verde, grade catálogo) ───── */}
      <section id="diferenciais" className="bg-moritz-900 py-24 text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="02" onGreen title={<>O que faz um burger<br />digno do meu bigode</>} sub="Cada detalhe foi pensado para transmitir a personalidade da marca — e o sabor à moda antiga." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {burgerFeatures.map((f, i) => (
              <motion.div key={f.n} {...reveal} transition={{ delay: i * 0.08 }} className="group flex flex-col items-center rounded-2xl border border-gold/20 bg-moritz-700/25 p-8 text-center transition-colors hover:border-gold/50">
                <div className="grid h-28 w-28 place-items-center rounded-full bg-cream/95 transition-transform duration-500 group-hover:scale-105">
                  <El name={featureEl[i]} className="h-auto w-[68%]" />
                </div>
                <span className="mt-6 font-serif text-3xl font-black text-gold/80">{f.n}</span>
                <h3 className="mt-1 font-serif text-xl font-bold uppercase text-cream">{f.title}</h3>
                <p className="mt-2 text-[.92rem] text-cream/65">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 03 · COMBOS (creme) ───── */}
      <section id="combos" className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="03" center title="Combos & Promoções" sub="Mais burger, menos preço — do jeito que um cavalheiro gosta." />
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
            {/* ── PÔSTER PRINCIPAL (verde) ── */}
            <motion.div {...reveal} className="relative flex flex-col overflow-hidden rounded-3xl bg-moritz-900 p-8 text-cream md:p-11">
              {/* sunburst + moldura */}
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 text-gold opacity-[0.07]">
                <div className="sm-spin h-full w-full" style={{ background: "repeating-conic-gradient(from 0deg, currentColor 0deg 4deg, transparent 4deg 12deg)", WebkitMaskImage: "radial-gradient(closest-side,#000,transparent)", maskImage: "radial-gradient(closest-side,#000,transparent)" }} />
              </div>
              <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/20" />
              {comboOff(mainCombo) != null && (
                <div className="sm-seal absolute right-6 top-6 z-10 grid h-20 w-20 place-items-center rounded-full bg-gold text-center font-serif text-lg font-black leading-none text-moritz-900 shadow-lg">-{comboOff(mainCombo)}%</div>
              )}

              <div className="relative z-[1] grid flex-1 items-center gap-4 sm:grid-cols-[1.45fr_.9fr]">
                <div>
                  <span className="inline-flex items-center gap-2 text-[.7rem] font-bold uppercase tracking-[.26em] text-gold">
                    <GStar className="h-3 w-3" /> Oferta da semana
                  </span>
                  <h3 className="mt-4 font-serif text-[clamp(2rem,4.6vw,3.3rem)] font-black uppercase leading-[.92] text-cream">{mainCombo.name}</h3>
                  <p className="mt-2 max-w-sm text-cream/70">{mainCombo.description}</p>

                  {mainCombo.items && (
                    <ul className="mt-5 space-y-2">
                      {mainCombo.items.map((it) => (
                        <li key={it} className="flex items-center gap-2.5 text-[.95rem] text-cream/85">
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-gold"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-4">
                    <span className="flex items-baseline gap-2">
                      {mainCombo.priceFrom != null && <span className="text-lg text-cream/45 line-through">{brl(mainCombo.priceFrom)}</span>}
                      <span className="font-serif text-[3.4rem] font-black leading-none text-gold">{brl(mainCombo.price)}</span>
                    </span>
                    <GoldButton href={comboOrder(mainCombo)} className="!px-8 !py-3.5">Pedir agora</GoldButton>
                  </div>
                </div>

                {/* mascote */}
                <div className="pointer-events-none relative hidden self-end justify-self-center sm:block">
                  <Mascot pose="servindo" sizes="240px" className="h-auto w-full max-w-[240px] drop-shadow-[0_14px_34px_rgba(0,0,0,.45)]" />
                </div>
              </div>
            </motion.div>

            {/* ── COMBOS SECUNDÁRIOS + CROSS-LINK ── */}
            <div className="flex flex-col gap-6">
              {otherCombos.map((c, i) => (
                <motion.article key={c.id} {...reveal} transition={{ delay: 0.1 + i * 0.08 }} whileHover={{ y: -6 }} className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-ink/12 bg-surface p-7">
                  {comboOff(c) != null && <span className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[.6rem] font-bold uppercase tracking-wide text-moritz-900">-{comboOff(c)}%</span>}
                  <div>
                    {c.serves && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-moritz-700/[.08] px-3 py-1 text-[.62rem] font-bold uppercase tracking-[.12em] text-moritz-900">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" /></svg>
                        Serve {c.serves}
                      </span>
                    )}
                    <h3 className="mt-3 font-serif text-2xl font-black uppercase leading-none text-moritz-900">{c.name}</h3>
                    <p className="mt-1.5 text-sm text-ink-soft">{c.description}</p>
                  </div>
                  <div className="mt-6 flex items-end justify-between border-t border-ink/10 pt-5">
                    <span className="flex items-baseline gap-2">
                      {c.priceFrom != null && <span className="text-sm text-ink-soft line-through">{brl(c.priceFrom)}</span>}
                      <span className="font-serif text-3xl font-black text-gold-deep">{brl(c.price)}</span>
                    </span>
                    <GoldButton href={comboOrder(c)} className="!px-6 !py-3">Pedir</GoldButton>
                  </div>
                </motion.article>
              ))}

              {/* cross-link pro "monte seu combo" */}
              <motion.a {...reveal} href="#monte" onClick={(e) => goTo(e, "#monte")} className="group flex items-center justify-between gap-4 rounded-3xl border border-dashed border-moritz-700/40 bg-moritz-700/[.04] p-6 transition-colors hover:bg-moritz-700/[.09]">
                <span>
                  <span className="font-serif text-lg font-black uppercase text-moritz-900">Monte o seu</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">Burger + acompanhamento + bebida do seu jeito.</span>
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gold-deep transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 04 · COMO PEDIR (verde) ───── */}
      <section className="bg-moritz-900 py-24 text-cream">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Heading num="04" onGreen center title="Pedir é coisa de um minuto" sub="Sem complicação, do jeito que um cavalheiro merece." />
          <ol className="relative mx-auto mt-12 max-w-md space-y-8 md:mt-16 md:grid md:max-w-none md:grid-cols-3 md:gap-12 md:space-y-0">
            {/* conector — vertical no mobile, horizontal no desktop */}
            <div className="absolute left-9 top-9 bottom-9 w-px border-l-2 border-dashed border-gold/30 md:hidden" aria-hidden />
            <div className="sm-dotted absolute left-[16%] right-[16%] top-9 hidden h-px md:block" aria-hidden />
            {[["1", "Escolha", "Bate o olho no cardápio e escolhe o seu campeão."], ["2", "Confirme", "Manda o pedido pelo WhatsApp ou app de delivery."], ["3", "Devore", "Eu levo quentinho até a sua porta. Bom apetite."]].map(([n, t, d], i) => (
              <motion.li key={n} {...reveal} transition={{ delay: i * 0.1 }} className="relative flex items-center gap-5 text-left md:flex-col md:items-center md:text-center">
                <div className="relative z-[1] grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-full border-2 border-gold bg-moritz-900 font-serif text-[2rem] leading-none font-black text-gold">{n}</div>
                <div>
                  <h3 className="font-serif text-xl font-bold uppercase text-cream md:mt-5">{t}</h3>
                  <p className="mt-1.5 text-cream/65 md:mx-auto md:mt-2 md:max-w-xs">{d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          <div className="mt-14 flex justify-center"><GoldButton className="!px-8">Fazer meu pedido</GoldButton></div>
        </div>
      </section>

      {/* ───── 05 · MONTE SEU COMBO (creme) ───── */}
      <section id="monte" className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="05" title={<>Monte do<br />seu jeito</>} sub="Escolhe o burger, o acompanhamento e a bebida — eu somo tudo e já te mando o pedido pronto pelo WhatsApp." />
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
            {/* escolhas */}
            <div className="space-y-9">
              {comboSteps.map((st) => (
                <div key={st.label}>
                  <div className="flex items-center gap-3">
                    <span className="text-[.72rem] font-bold uppercase tracking-[.26em] text-gold-deep">{st.label}</span>
                    <span className="h-px flex-1 bg-ink/10" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {st.opts.map((o, i) => {
                      const active = st.sel === i;
                      return (
                        <button
                          key={o.name}
                          type="button"
                          onClick={() => st.set(i)}
                          aria-pressed={active}
                          className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all ${active ? "border-moritz-700 bg-moritz-700/[.06] shadow-[0_8px_24px_rgba(30,58,30,.1)]" : "border-ink/12 bg-surface hover:border-moritz-700/40"}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? "border-moritz-700" : "border-ink/25"}`}>
                              {active && <span className="h-2.5 w-2.5 rounded-full bg-moritz-700" />}
                            </span>
                            <span className="font-serif text-lg font-bold text-moritz-900">{o.name}</span>
                          </span>
                          <span className="font-serif font-black text-gold-deep">{o.price ? `+${brl(o.price)}` : "—"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* resumo */}
            <aside className="rounded-3xl border-2 border-moritz-700 bg-surface p-8 lg:sticky lg:top-28">
              <div className="flex items-center gap-3">
                <Bigode className="h-6 w-14" />
                <h3 className="font-serif text-2xl font-black uppercase text-moritz-900">Seu combo</h3>
              </div>
              <ul className="mt-6 space-y-3 border-b border-ink/10 pb-6">
                {comboPick.map((o, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span className="text-[.98rem] text-ink">{o.name}</span>
                    <span className="font-semibold text-ink-soft">{o.price ? brl(o.price) : "—"}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-end justify-between">
                <span className="text-xs font-bold uppercase tracking-[.22em] text-ink-soft">Total</span>
                <span className="font-serif text-[2.75rem] font-black leading-none text-gold-deep">{brl(comboTotal)}</span>
              </div>
              <GoldButton href={comboHref} className="mt-7 !flex w-full !py-4">Pedir no WhatsApp</GoldButton>
              <p className="mt-3 text-center text-xs text-ink-soft">Entrega {site.deliveryTime} · Feito na hora</p>
            </aside>
          </div>
        </div>
      </section>

      {/* ───── 06 · GALERIA (verde) ───── */}
      <section id="galeria" className="bg-moritz-900 py-24 text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="06" onGreen title="Direto da chapa pro feed" sub={site.instagram.handle} />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {["posts/post1.jpg", "aplicacoes/pedidos-prontos.png", "posts/post2-1.jpg", "aplicacoes/avental-e-uniforme.png", "posts/post3-1.jpg", "aplicacoes/hamburguer-papel.png"].map((src, i) => (
              <motion.a key={src} {...reveal} transition={{ delay: i * 0.05 }} href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-gold/20">
                <Image src={`${A}/${src}`} alt="Sr. Moritz no Instagram" fill sizes="(max-width:640px) 45vw, 200px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-moritz-900/0 text-cream opacity-0 transition-all duration-300 group-hover:bg-moritz-900/50 group-hover:opacity-100">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                </span>
              </motion.a>
            ))}
          </div>
          <div className="mt-10 text-center"><OutlineButton href={site.instagram.url} onGreen>Seguir {site.instagram.handle}</OutlineButton></div>
        </div>
      </section>

      {/* ───── 07 · SEJA UM DOS PRIMEIROS (creme) ───── */}
      <section id="primeiros" className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="07" title={<>Seja um dos<br />primeiros</>} sub="A chapa acabou de esquentar — e a primeira fornada é sua. Entra agora e leve um agrado de boas-vindas." />
          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* texto + cupom */}
            <motion.div {...reveal}>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1.5 text-[.66rem] font-bold uppercase tracking-[.18em] text-gold-deep">
                <GStar className="h-3 w-3" /> Recém-saído da chapa
              </span>
              <ul className="mt-7 space-y-3.5">
                {["Brinde surpresa no seu 1º pedido", "Seu nome na lista dos fundadores", "Promoções em primeira mão, antes de todo mundo"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[1.02rem] text-[#4a463f]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 text-gold-deep"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {t}
                  </li>
                ))}
              </ul>

              {/* cupom */}
              <div className="mt-8 flex items-center gap-4 rounded-2xl border-2 border-dashed border-moritz-700/40 bg-moritz-700/[.04] p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-moritz-900 text-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-black uppercase leading-none text-moritz-900">Manda “QUERO” no WhatsApp</p>
                  <p className="mt-1 text-sm text-ink-soft">A gente responde com seu brinde de boas-vindas.</p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <GoldButton href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Olá, Sr. Moritz! QUERO ser um dos primeiros a provar. 🍔")}`} className="!px-8">Quero ser o primeiro</GoldButton>
                <OutlineButton href={site.instagram.url}>Seguir {site.instagram.handle}</OutlineButton>
              </div>
            </motion.div>

            {/* mascote — oculto no mobile */}
            <motion.div {...reveal} className="relative mx-auto hidden w-full max-w-sm lg:block">
              <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.12]">
                <div className="sm-spin h-full w-full" style={{ background: "repeating-conic-gradient(from 0deg, currentColor 0deg 4deg, transparent 4deg 12deg)", WebkitMaskImage: "radial-gradient(closest-side,#000 10%,transparent 70%)", maskImage: "radial-gradient(closest-side,#000 10%,transparent 70%)" }} />
              </div>
              <Mascot pose="apresentando" sizes="420px" className="h-auto w-full drop-shadow-[0_18px_40px_rgba(30,58,30,.18)]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── 08 · ONDE ESTAMOS (verde) ───── */}
      <section id="onde-estamos" className="bg-moritz-900 py-24 text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="08" onGreen title="Passa aqui ou chama no delivery" />
          <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <motion.div {...reveal} className="flex h-full flex-col gap-7 rounded-2xl border border-gold/25 bg-moritz-700/25 p-8">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream/95"><El name="localizacao" className="h-auto w-7" /></div>
                <div><h3 className="font-serif text-lg font-bold uppercase text-cream">Endereço</h3><p className="text-cream/70">{site.address.street}</p><p className="text-cream/70">{site.address.area}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream/95"><El name="horario" className="h-auto w-7" /></div>
                <div className="flex-1"><h3 className="font-serif text-lg font-bold uppercase text-cream">Horários</h3>
                  <ul className="mt-1 space-y-1">{site.hours.map((h) => (<li key={h.day} className="flex justify-between gap-6 text-cream/70"><span className="font-medium text-cream">{h.day}</span><span>{h.hours}</span></li>))}</ul>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-3">
                <GoldButton href={wpp} className="!px-6">Chamar no WhatsApp</GoldButton>
                <OutlineButton href={`https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`} onGreen>Como chegar</OutlineButton>
              </div>
            </motion.div>
            <motion.div {...reveal} className="relative min-h-[340px] overflow-hidden rounded-2xl border border-gold/25">
              <iframe title="Mapa — Sr. Moritz" src={site.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── CTA FINAL (creme) ───── */}
      <section className="relative overflow-hidden bg-cream py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center md:px-10">
          <Logo className="h-40 w-40" />
          <motion.h2 {...reveal} className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] font-black uppercase leading-[1] text-moritz-900">
            Então… vai encarar o <span className="italic text-gold-deep">melhor burger</span> da cidade?
          </motion.h2>
          <motion.div {...reveal}><GoldButton className="!px-10 !py-4">Peça agora</GoldButton></motion.div>
          <p className="text-sm text-ink-soft">Feito na hora · Entrega {site.deliveryTime} · {site.neighborhood}</p>
        </div>
      </section>

      {/* ───── FOOTER (carvão) ───── */}
      <footer className="bg-ink text-cream/90">
        {/* corpo */}
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr_1.3fr] md:px-10">
          {/* marca + social */}
          <div>
            <div className="flex items-center gap-3">
              <Logo cream className="h-16 w-16" />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-lg font-black uppercase tracking-wide text-cream">Sr. Moritz</span>
                <span className="text-[.56rem] font-bold uppercase tracking-[.3em] text-gold/80">Burguer Artesanal</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">{site.tagline}. Feito na hora, à moda antiga — blend autoral, pão dourado na manteiga e muito capricho.</p>
            <div className="mt-6 flex items-center gap-3">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
              </a>
              <a href={wpp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.523 5.268l-.999 3.648 3.815-1.002zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
              </a>
            </div>
          </div>

          {[["Cardápio", [["Os Campeões", "#cardapio"], ["Combos", "#combos"], ["Diferenciais", "#diferenciais"]]], ["Sobre", [["Galeria", "#galeria"], ["Monte seu combo", "#monte"], ["Onde estamos", "#onde-estamos"]]]].map(([title, links]) => (
            <nav key={title as string} aria-label={title as string}>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-gold">{title as string}</h3>
              <ul className="mt-4 space-y-2.5">{(links as string[][]).map(([l, h]) => (<li key={h}><a href={h} className="inline-flex items-center gap-2 text-sm text-cream/60 transition-colors hover:text-cream"><span className="h-1 w-1 rounded-full bg-gold/50" />{l}</a></li>))}</ul>
            </nav>
          ))}

          {/* contato */}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-gold">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/60">
              <li className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gold/70"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{site.address.street}<br />{site.address.area}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gold/70"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>
                <span>{site.hours.find((h) => h.hours !== "Fechado")?.day} · {site.hours.find((h) => h.hours !== "Fechado")?.hours}<br /><a href="#onde-estamos" onClick={(e) => goTo(e, "#onde-estamos")} className="text-cream/45 underline-offset-2 transition-colors hover:text-gold hover:underline">ver todos os horários</a></span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-gold/70"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.523 5.268l-.999 3.648 3.815-1.002z" /></svg>
                <a href={wpp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Chamar no WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        {/* barra inferior */}
        <div className="border-t border-cream/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/45 sm:flex-row md:px-10">
            <p>© 2026 {site.name} — {site.tagline}.</p>
            <p>
              Feito por{" "}
              <a href="https://www.instagram.com/dovratech" target="_blank" rel="noopener noreferrer" className="font-semibold tracking-wide text-cream/70 transition-colors hover:text-gold">Dovra Tech</a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
