import { Inter, Lora, Playfair_Display, JetBrains_Mono, Pinyon_Script, Dancing_Script, Shadows_Into_Light } from "next/font/google";

// ============================================
// Font Configuration - Slindon Patisserie
// Old School French Patisserie Style (Ratatouille/Disneyland)
// ============================================

/**
 * Inter - Primary sans-serif font for UI and body text
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

/**
 * Pinyon Script - Classic French script font
 * Perfect for old school patisserie branding
 * Think: Ratatouille menus, French bakery signs
 */
export const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-script",
  weight: ["400"],
});

/**
 * Dancing Script - Casual script font for accents
 */
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dancing",
  weight: ["400", "500", "600", "700"],
});

/**
 * Shadows Into Light - Handwritten feel
 */
export const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-handwritten",
  weight: ["400"],
});

/**
 * Playfair Display - Elegant serif for headings
 * Classic, high-contrast serif perfect for bakery branding
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Lora - Serif font for long-form reading content
 */
export const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * JetBrains Mono - Monospace font for code blocks
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});
