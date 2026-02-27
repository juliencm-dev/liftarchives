// Shared email styles -- matches client design language
// Colors converted from OKLCH to hex for email client compatibility

export const colors = {
  primary: "#0d9488",       // oklch(0.55 0.18 200)
  foreground: "#0f172a",    // oklch(0.18 0.02 240)
  background: "#f7fffe",    // oklch(0.99 0.002 200)
  card: "#ffffff",          // oklch(1 0 0)
  mutedForeground: "#64748b", // oklch(0.5 0.02 240)
  border: "#e2e8f0",        // oklch(0.92 0.01 200)
} as const;

export const fontFamily =
  '"Geist", "Geist Fallback", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Inline SVG of a dumbbell icon (white, 28x28)
export const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 2L6 22"/><path d="M18 2L18 22"/><path d="M3 6h3"/><path d="M3 18h3"/><path d="M18 6h3"/><path d="M18 18h3"/><path d="M12 2v20"/></svg>`;
