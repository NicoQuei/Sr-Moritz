"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import Lenis from "lenis";
import { products, combos, reviews, burgerFeatures, menuMais } from "@/data/menu";
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

function Seal({ className = "", wobble = true }: { className?: string; wobble?: boolean }) {
  return (
    <div className={`relative aspect-square ${wobble ? "sm-seal" : ""} ${className}`}>
      <Image src={`${A}/elementos/selo-feito-na-hora.png`} alt="Feito na hora" fill sizes="160px" className="object-contain" />
    </div>
  );
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

/* ───────────────────────── Avaliações: nota ───────────────────────── */
function RatingSummary() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(0);
  const target = site.rating;
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    if (reduce) { frame = requestAnimationFrame(() => setVal(target)); return () => cancelAnimationFrame(frame); }
    const start = performance.now();
    const tick = (now: number) => { const t = Math.min(1, (now - start) / 1100); setVal(target * (1 - Math.pow(1 - t, 3))); if (t < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);
  return (
    <div ref={ref} className="flex flex-col items-center justify-center rounded-2xl border border-gold/30 bg-moritz-700/30 p-10 text-center text-cream">
      <span className="font-serif text-7xl font-black text-gold">{val.toFixed(1).replace(".", ",")}</span>
      <StarRow n={5} size={18} className="mt-3" />
      <p className="mt-4 text-xs uppercase tracking-[.24em] text-cream/65">Nota média</p>
      <p className="mt-1 text-sm text-cream/55">{site.served} servidos</p>
    </div>
  );
}

/* ───────────────────────── PÁGINA ───────────────────────── */
export default function SrMoritzLanding() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const emblemY = useTransform(heroProg, [0, 1], [0, 80]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
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
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "bg-moritz-900/95 py-2.5 shadow-lg backdrop-blur" : "bg-transparent py-4"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-10">
          <a href="#topo" className="flex items-center gap-3" aria-label="Sr. Moritz — início">
            <Logo cream priority className={`transition-all ${scrolled ? "h-10 w-10" : "h-12 w-12"}`} />
            <span className="font-serif text-lg font-black uppercase tracking-wide text-cream">Sr. Moritz</span>
          </a>
          <nav className="hidden gap-9 md:flex">
            {[["Cardápio", "#cardapio"], ["Diferenciais", "#diferenciais"], ["Onde estamos", "#onde-estamos"]].map(([l, h]) => (
              <a key={l} href={h} className="text-[.74rem] font-bold uppercase tracking-[.16em] text-cream/75 transition-colors hover:text-gold">{l}</a>
            ))}
          </nav>
          <GoldButton className="!px-5 !py-2.5">Peça agora</GoldButton>
        </div>
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
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.45 }} className="pointer-events-none absolute bottom-0 right-2 hidden w-44 opacity-90 lg:block xl:w-52">
          <Mascot pose="apresentando" sizes="200px" className="h-auto w-full" />
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

      {/* MARQUEE */}
      <div className="sm-marquee overflow-hidden border-y-4 border-gold bg-moritz-900">
        <div className="sm-marquee-track">
          {[0, 1].map((k) => (
            <span key={k} className="flex items-center py-4">
              {["Carne fresca todo dia", "Pão artesanal", "Feito na hora", `★ ${rating}`, `${site.served} servidos`].map((m) => (
                <span key={m} className="flex items-center">
                  <span className="font-serif text-[1.3rem] italic text-cream">{m}</span>
                  <Bigode className="mx-7 h-7 w-16 shrink-0" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

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
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Heading num="03" title="Combos & Promoções" sub="Mais burger, menos preço — do jeito que um cavalheiro gosta." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {combos.map((c, i) => {
              const off = c.priceFrom != null ? Math.round((1 - c.price / c.priceFrom) * 100) : null;
              return (
                <motion.article key={c.id} {...reveal} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }} className={`relative rounded-2xl bg-surface p-8 ${c.highlight ? "border-2 border-moritz-700" : "border border-ink/12"}`}>
                  {off != null && <div className="sm-seal absolute -right-3 -top-3 grid h-16 w-16 place-items-center rounded-full bg-gold text-center font-serif text-sm font-black text-moritz-900 shadow-lg">-{off}%</div>}
                  <h3 className="font-serif text-2xl font-black uppercase text-moritz-900">{c.name}</h3>
                  <p className="mt-2 text-ink-soft">{c.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="flex items-baseline gap-2">
                      {c.priceFrom != null && <span className="text-base text-ink-soft line-through">{brl(c.priceFrom)}</span>}
                      <span className="font-serif text-3xl font-black text-gold-deep">{brl(c.price)}</span>
                    </span>
                    <GoldButton className="!px-6">Pedir</GoldButton>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── 04 · COMO PEDIR (verde) ───── */}
      <section className="bg-moritz-900 py-24 text-cream">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Heading num="04" onGreen center title="Pedir é coisa de um minuto" sub="Sem complicação, do jeito que um cavalheiro merece." />
          <div className="relative mt-16 grid gap-12 md:grid-cols-3">
            <div className="sm-dotted absolute left-[16%] right-[16%] top-8 hidden h-px md:block" aria-hidden />
            {[["1", "Escolha", "Bate o olho no cardápio e escolhe o seu campeão."], ["2", "Confirme", "Manda o pedido pelo WhatsApp ou app de delivery."], ["3", "Devore", "Eu levo quentinho até a sua porta. Bom apetite."]].map(([n, t, d], i) => (
              <motion.div key={n} {...reveal} transition={{ delay: i * 0.1 }} className="relative text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-gold bg-moritz-900 font-serif text-2xl font-black text-gold">{n}</div>
                <h3 className="mt-5 font-serif text-xl font-bold uppercase text-cream">{t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-cream/65">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-14 flex justify-center"><GoldButton className="!px-8">Fazer meu pedido</GoldButton></div>
        </div>
      </section>

      {/* ───── 05 · HISTÓRIA (creme) ───── */}
      <section id="historia" className="bg-cream py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:px-10">
          <motion.div {...reveal}>
            <Heading num="05" title={<>Tem nome,<br />tem história</>} />
            <div className="mt-6 space-y-4 text-[1.08rem] leading-relaxed text-[#4a463f]">
              <p>O Sr. Moritz nasceu da teimosia de fazer um hambúrguer à moda antiga — tudo na hora, sem atalho. De uma chapa e uma receita só, virou ponto de encontro de quem leva sabor a sério.</p>
              <p className="font-serif text-xl italic text-moritz-900">“Um bom burger não tem pressa. Tem capricho.”</p>
            </div>
          </motion.div>
          <motion.div {...reveal} className="relative">
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-ink/10">
              <Image src={`${A}/aplicacoes/fachada-e-placa.png`} alt="A fachada do Sr. Moritz" fill sizes="(max-width:768px) 100vw, 540px" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 w-24"><Seal /></div>
          </motion.div>
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

      {/* ───── 07 · AVALIAÇÕES (creme) ───── */}
      <section id="avaliacoes" className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Heading num="07" title="O que dizem por aí" sub="Quem provou, voltou." />
          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.7fr] lg:items-stretch">
            <RatingSummary />
            <div className="grid gap-6 sm:grid-cols-3">
              {reviews.map((r, i) => (
                <motion.article key={r.id} {...reveal} transition={{ delay: i * 0.08 }} className="flex h-full flex-col rounded-2xl border border-ink/12 bg-surface p-6">
                  <StarRow n={r.rating} size={16} />
                  <p className="mt-4 flex-1 text-[.95rem] text-ink">“{r.text}”</p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="font-serif font-bold text-moritz-900">{r.name}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft"><span className={`h-2 w-2 rounded-full ${r.source === "Google" ? "bg-moritz-500" : "bg-gold"}`} />{r.source}</span>
                  </div>
                </motion.article>
              ))}
            </div>
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
          <Logo className="h-24 w-24" />
          <motion.h2 {...reveal} className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] font-black uppercase leading-[1] text-moritz-900">
            Então… vai encarar o <span className="italic text-gold-deep">melhor burger</span> da cidade?
          </motion.h2>
          <motion.div {...reveal}><GoldButton className="!px-10 !py-4">Peça agora</GoldButton></motion.div>
          <p className="text-sm text-ink-soft">Feito na hora · Entrega {site.deliveryTime} · {site.neighborhood}</p>
        </div>
      </section>

      {/* ───── FOOTER (carvão) ───── */}
      <footer className="bg-ink text-cream/90">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
          <div>
            <Logo cream className="h-20 w-20" />
            <p className="mt-4 max-w-xs text-sm text-cream/60">{site.tagline}. Feito na hora, à moda do Sr. Moritz.</p>
          </div>
          {[["Cardápio", [["Os Campeões", "#cardapio"], ["Combos", "#combos"], ["Diferenciais", "#diferenciais"]]], ["Sobre", [["Nossa história", "#historia"], ["Onde estamos", "#onde-estamos"]]]].map(([title, links]) => (
            <nav key={title as string} aria-label={title as string}>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-gold">{title as string}</h3>
              <ul className="mt-4 space-y-2">{(links as string[][]).map(([l, h]) => (<li key={h}><a href={h} className="text-sm text-cream/65 transition-colors hover:text-cream">{l}</a></li>))}</ul>
            </nav>
          ))}
          <div>
            <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-gold">Contato</h3>
            <ul className="mt-4 space-y-2 text-sm text-cream/65">
              <li><a href={wpp} target="_blank" rel="noopener noreferrer" className="hover:text-cream">WhatsApp</a></li>
              <li><a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-cream">{site.instagram.handle}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/45 sm:flex-row md:px-10">
            <p>© 2026 {site.name} — {site.tagline}.</p>
            <p>Feito com capricho, na chapa.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
