import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { BRAND_CONFIG } from '@/data/brand';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} | Experiencia de Masajes Masculinos en Miraflores`,
  description: `${BRAND_CONFIG.name} en Miraflores, Lima. Espacio privado de masajes terapéuticos, revitalización corporal y ritual energético INTI para hombres.`,
  keywords: [
    'Masajes masculinos Lima',
    'Masajes para hombres Miraflores',
    'Men for men spa Lima',
    'Masaje terapeutico Miraflores',
    'Ritual Inti',
    'Espacio Intimo'
  ],
  authors: [{ name: 'Espacio Intimo' }],
  icons: { icon: '/assets/logo.jpg' },
  openGraph: {
    title: 'ESPACIO INTIMO | Masajes Exclusivos para Hombres en Miraflores',
    description: 'Un espacio donde todo guerrero merece descansar y recargar energias. Atencion 100% privada.',
    images: ['/assets/hero.jpg'],
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: '#0a0e0a',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
