import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const chakraPetch = localFont({
  src: [
    { path: "../../public/fonts/ChakraPetch-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/ChakraPetch-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/ChakraPetch-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/ChakraPetch-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/ChakraPetch-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-chakra",
  display: "swap",
});

const aeonikPro = localFont({
  src: [
    { path: "../../public/fonts/AeonikPro-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/AeonikPro-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/AeonikPro-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drone Network — La carte",
  description:
    "L'écosystème centralisé de l'industrie du drone au Canada. Trouvez un pilote, une boutique ou une école près de chez vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${chakraPetch.variable} ${aeonikPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
