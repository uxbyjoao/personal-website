/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-surface": "var(--accent-surface)",
        "accent-on": "var(--accent-on)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--text-secondary)",
            "--tw-prose-headings": "var(--text-primary)",
            "--tw-prose-links": "var(--accent)",
            "--tw-prose-code": "var(--text-primary)",
            "--tw-prose-pre-bg": "var(--surface)",
            "--tw-prose-pre-code": "var(--text-secondary)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--text-secondary)",
            "--tw-prose-quote-borders": "var(--accent)",
            h1: { fontFamily: '"Outfit", sans-serif', fontWeight: "800" },
            h2: { fontFamily: '"Outfit", sans-serif', fontWeight: "800" },
            h3: { fontFamily: '"Outfit", sans-serif', fontWeight: "600" },
            code: { fontFamily: '"JetBrains Mono", monospace' },
            a: { textDecoration: "none", borderBottom: "1px solid var(--accent)" },
            "a:hover": { color: "var(--accent-hover)" },
            img: { borderRadius: "8px" },
          },
        },
      },
    },
  },
};
