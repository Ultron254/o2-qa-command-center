/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Azure DevOps Dark Theme Palette */
        bg: {
          primary: '#1e1e1e',        /* Main background - rgb(30,30,30) */
          secondary: '#252526',       /* Cards, panels - rgb(37,37,37) */
          elevated: '#2d2d2d',        /* Table headers, callouts - rgb(45,45,45) */
          inset: '#1b1b1b',           /* Inputs, inset areas */
          hover: '#2a2d2e',           /* Row/item hover */
          header: '#000000',          /* Top header bar - pure black */
          sidebar: '#333333',         /* Left sidebar */
        },
        text: {
          primary: 'rgba(255,255,255,0.95)',
          secondary: 'rgba(255,255,255,0.70)',
          muted: 'rgba(255,255,255,0.45)',
          inverse: '#1e1e1e',
          link: '#4fc3f7',            /* Azure link blue */
        },
        border: {
          default: 'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.05)',
          strong: 'rgba(255,255,255,0.14)',
          focus: '#0078d4',
        },
        /* Azure DevOps Status Colors */
        status: {
          pass: '#339933',           /* Green - Passed/Active */
          'pass-bg': 'rgba(51,153,51,0.12)',
          fail: '#e81123',           /* Red - Failed */
          'fail-bg': 'rgba(232,17,35,0.12)',
          blocked: '#f2c811',        /* Yellow - Blocked/Warning */
          'blocked-bg': 'rgba(242,200,17,0.12)',
          skip: '#8a8886',           /* Neutral gray */
          'skip-bg': 'rgba(138,136,134,0.12)',
          running: '#0078d4',        /* Azure blue - Running/In Progress */
          'running-bg': 'rgba(0,120,212,0.12)',
        },
        /* Azure DevOps Priority Colors */
        priority: {
          critical: '#e81123',       /* Red */
          high: '#ff8c00',           /* Orange */
          medium: '#f2c811',         /* Yellow */
          low: '#8a8886',            /* Gray */
        },
        /* Azure DevOps Core Accent */
        azure: {
          blue: '#0078d4',           /* Primary brand blue */
          'blue-hover': '#106ebe',   /* Hover state */
          'blue-pressed': '#005a9e', /* Active/pressed */
          'blue-light': '#deecf9',   /* Light blue bg */
          'blue-text': '#4fc3f7',    /* Blue text on dark */
        },
        /* Work item type accent bars */
        wit: {
          epic: '#773b93',           /* Purple - Epics */
          feature: '#107c41',        /* Green - Features */
          story: '#0078d4',          /* Blue - User Stories */
          bug: '#e81123',            /* Red - Bugs */
          task: '#f2c811',           /* Yellow - Tasks */
        },
      },
      fontFamily: {
        body: ['"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"Cascadia Code"', '"Consolas"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        sm: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.10)',
        md: '0 3.2px 7.2px rgba(0,0,0,0.13), 0 0.6px 1.8px rgba(0,0,0,0.10)',
        lg: '0 6.4px 14.4px rgba(0,0,0,0.13), 0 1.2px 3.6px rgba(0,0,0,0.10)',
        callout: '0 2px 4px rgba(0,0,0,0.18), 0 0 2px rgba(0,0,0,0.12)',
      },
      fontSize: {
        'xxs': '10px',
      },
    },
  },
  plugins: [],
}
