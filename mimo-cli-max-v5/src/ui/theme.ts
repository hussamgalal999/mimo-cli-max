/**
 * MIMO Theme System - Unified Visual Identity
 * Dynamic Theme Engine for Live Previews
 */

import color from 'picocolors';
import gradient from 'gradient-string';

// Theme Definitions
const THEMES: Record<string, any> = {
    dark: {
        primary: color.cyan,
        secondary: color.magenta,
        success: color.green,
        warning: color.yellow,
        error: color.red,
        dim: color.dim,
        white: color.white,
        blue: color.blue,
        bg: (t: string) => t,
        logoGradient: gradient(['#00FFFF', '#FF00FF']),
    },
    ocean: {
        primary: color.blue,
        secondary: color.cyan,
        success: color.green,
        warning: color.yellow,
        error: color.red,
        dim: color.gray,
        white: color.cyan,
        blue: color.blue,
        bg: (t: string) => t,
        logoGradient: gradient(['#00BFFF', '#1E90FF']),
    },
    cyberpunk: {
        primary: color.magenta,
        secondary: color.yellow,
        success: color.green,
        warning: color.cyan,
        error: color.red,
        dim: color.gray,
        white: color.yellow,
        blue: color.blue,
        bg: (t: string) => t,
        logoGradient: gradient(['#FF00FF', '#FFFF00']),
    },
    forest: {
        primary: color.green,
        secondary: color.yellow,
        success: color.cyan,
        warning: color.magenta,
        error: color.red,
        dim: color.gray,
        white: color.green,
        blue: color.blue,
        bg: (t: string) => t,
        logoGradient: gradient(['#32CD32', '#228B22']),
    },
    sunset: {
        primary: color.red,
        secondary: color.yellow,
        success: color.green,
        warning: color.magenta,
        error: color.cyan,
        dim: color.gray,
        white: color.red,
        blue: color.blue,
        bg: (t: string) => t,
        logoGradient: gradient(['#FF4500', '#FFD700']),
    },
    light: {
        primary: color.blue,
        secondary: color.magenta,
        success: color.green,
        warning: color.yellow,
        error: color.red,
        dim: color.gray,
        white: color.black,
        blue: color.blue,
        bg: (t: string) => color.bgWhite(t),
        logoGradient: gradient(['#333333', '#666666']),
    }
};

let currentTheme = 'dark';

// Dynamic Theme Accessor
export const theme = {
    get primary() { return THEMES[currentTheme].primary; },
    get secondary() { return THEMES[currentTheme].secondary; },
    get success() { return THEMES[currentTheme].success; },
    get warning() { return THEMES[currentTheme].warning; },
    get error() { return THEMES[currentTheme].error; },
    get dim() { return THEMES[currentTheme].dim; },
    get white() { return THEMES[currentTheme].white; },
    get blue() { return THEMES[currentTheme].blue; },
    get bg() { return THEMES[currentTheme].bg; },
    get logoGradient() { return THEMES[currentTheme].logoGradient; },
    setTheme: (name: string) => {
        if (THEMES[name]) {
            currentTheme = name;
            // Try to apply terminal background (Works in Windows Terminal, iTerm2, etc.)
            applyTerminalBackground(name);
        }
    },
    getCurrent: () => currentTheme,
};

/**
 * Apply terminal background color via OSC escape sequence
 * This works in modern terminals like Windows Terminal, iTerm2, Hyper, etc.
 * Note: Does NOT work in basic CMD.exe or PowerShell legacy
 */
function applyTerminalBackground(themeName: string): void {
    const bgColors: Record<string, string> = {
        dark: '0d/0d/0d',      // Almost black
        ocean: '0a/1a/2a',     // Deep ocean blue
        cyberpunk: '1a/0a/2a', // Dark purple
        forest: '0a/1a/0a',    // Dark green
        sunset: '2a/0a/0a',    // Dark red
        light: 'f0/f0/f0',     // Light gray
    };

    const bgColor = bgColors[themeName] || bgColors.dark;

    // OSC 11 - Set background color (supported by many modern terminals)
    process.stdout.write(`\x1b]11;rgb:${bgColor}\x07`);
}

// 🎭 Sentient Drone Identity - Standardized Avatar System
export interface AvatarState {
    face: string;
    limbs?: string; // Optional: Some states don't have limbs
}

export const icons = {
    // Standardized Avatar States
    avatar: {
        idle: { face: '( ●  v  ● )', limbs: null },
        working: { face: '( ●  3  ● )', limbs: '  /  []  \\  ' },
        thinking: { face: '( o  ~  o )', limbs: '   . .. .   ' },
        success: { face: '( ^  ▽  ^ )', limbs: ' \\      / ' },
        scanning: { face: '( ◕  v  ◕ )', limbs: '  : :  : :  ' },
        error: { face: '( ò  _  ó )', limbs: '   /  !  \\  ' },
        sad: { face: '( .  _  . )', limbs: '   /     \\  ' },
        shy: { face: '( #  v  # )', limbs: '   👉   👈  ' },
        shock: { face: '( ⊙  _  ⊙ )', limbs: '   /  !  \\  ' },

        // Legacy/Alternates mapping if needed
        wink: { face: '( ◠‿− )', limbs: null }, // Keep for specific legacy calls
        happy: { face: '( ◠‿◠ )', limbs: null },
    },
    // Keep UI icons
    ui: {
        get check() { return theme.success('✓'); },
        get cross() { return theme.error('✗'); },
        get arrow() { return theme.primary('»'); },
        get bullet() { return theme.dim('•'); },
        star: '★',
        pyramid: '△', // Keeping pyramid for launch screen
    }
};

// 📐 Layout Constants
export const layout = {
    dashboardWidth: 80,
    animationSpeed: 20,
    pulseSpeed: 40,
};
