import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
// Fonte Sans principal
const inter = Inter({
 variable: "--font-sans",
 subsets: ["latin"],
});
// Fonte Mono para números/códigos
const robotoMono = Roboto_Mono({
 variable: "--font-mono",
 subsets: ["latin"],
});
export const metadata: Metadata = {
 title: "Reporte das 15 H",
 description: "Dashboard corporativo de acompanhamento das 15h",
};
export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
<html lang="pt-br">
<body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
       {children}
</body>
</html>
 );
}