import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        'surface-dim': "var(--surface-dim)",
        'surface-bright': "var(--surface-bright)",
        'surface-container-lowest': "var(--surface-container-lowest)",
        'surface-container-low': "var(--surface-container-low)",
        'surface-container': "var(--surface-container)",
        'surface-container-high': "var(--surface-container-high)",
        'surface-container-highest': "var(--surface-container-highest)",
        'on-surface': "var(--on-surface)",
        'on-surface-variant': "var(--on-surface-variant)",
        outline: "var(--outline)",
        'outline-variant': "var(--outline-variant)",
        
        primary: "var(--primary)",
        'on-primary': "var(--on-primary)",
        'primary-container': "var(--primary-container)",
        'on-primary-container': "var(--on-primary-container)",
        
        secondary: "var(--secondary)",
        'on-secondary': "var(--on-secondary)",
        'secondary-container': "var(--secondary-container)",
        'on-secondary-container': "var(--on-secondary-container)",
        
        tertiary: "var(--tertiary)",
        'on-tertiary': "var(--on-tertiary)",
        'tertiary-container': "var(--tertiary-container)",
        'on-tertiary-container': "var(--on-tertiary-container)",

        error: "var(--error)",
        'on-error': "var(--on-error)",
        'error-container': "var(--error-container)",
        'on-error-container': "var(--on-error-container)",
        
        'accent-primary': "var(--accent-primary)",
        'accent-secondary': "var(--accent-secondary)",
        'accent-tertiary': "var(--accent-tertiary)",
      },
      fontFamily: {
        serif: ["Instrument Serif", "serif"],
        dm: ["DM Sans", "sans-serif"],
        geist: ["Geist Mono", "monospace"],
        ibm: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aurora': 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      }
    },
  },
  plugins: [],
};
export default config;
