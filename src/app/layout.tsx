import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahmoud Kassem | CS & Applied Mathematics",
  description: "Interactive portfolio showcasing experience in AI/NLP, Applied Mathematics, and Software Engineering. Explore my neural network of projects, research, and skills.",
  keywords: ["Mahmoud Kassem", "Portfolio", "AI", "NLP", "Applied Mathematics", "Software Engineering", "Machine Learning"],
  authors: [{ name: "Mahmoud Kassem" }],
  openGraph: {
    title: "Mahmoud Kassem | CS & Applied Mathematics",
    description: "Interactive portfolio showcasing experience in AI/NLP, Applied Mathematics, and Software Engineering.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahmoud Kassem | CS & Applied Mathematics",
    description: "Interactive portfolio showcasing experience in AI/NLP, Applied Mathematics, and Software Engineering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
