import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline} | ${site.city}`,
  description:
    "Blend autoral, pão dourado na manteiga e o capricho de quem faz tudo na hora. Peça o melhor burger artesanal da cidade com o Sr. Moritz.",
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Artesanal de verdade, à moda do Sr. Moritz. Feito na hora, entregue quentinho.",
    type: "website",
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.name,
  servesCuisine: "Hambúrguer Artesanal",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.city,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating,
    bestRating: 5,
  },
  telephone: site.whatsapp,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
