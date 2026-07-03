import type {Metadata} from 'next';
import './globals.css'; 

export const metadata: Metadata = {
  title: 'QawmiERP - Madrasa Management',
  description: 'SaaS-based Qawmi Madrasa Management System',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
