/**
 * Ultra-Compact Branding - 4 Lines Only!
 * Unified dashboard design with ALL features preserved
 */

import gradient from 'gradient-string';
import color from 'picocolors';
import { MimoAvatar } from './avatar.js';
import { setTimeout } from 'timers/promises';

/**
 * Show ultra-compact banner (4 lines instead of 25!)
 * Preserves ALL information: Logo + Status + Engine + Developer + Location
 */
export async function showCompactBanner(): Promise<void> {
    console.clear();

    // Optional: Bot wake animation (can be disabled for even faster load)
    await MimoAvatar.playBootAnimation();

    // Dashboard configuration
    const W = 68; // Total width
    const border = color.dim('─');
    const vert = color.dim('│');

    // Status and version
    const online = color.green('● Online');
    const version = color.dim('v5.0.0');

    // Data
    const appName = 'MIMO-CLI-MAX';
    const engine = 'QudsSystem Hybrid';
    const dev = 'Eng. Hossam Galal';
    const loc = 'Egypt, Minya';
    const copyright = '© 2025';

    // Build the 4-line dashboard
    const topBorder = color.dim(`╭${'─'.repeat(W)}╮`);

    // Line 1: App name + Version + Status
    const line1Left = `  ${gradient.atlas(appName)} ${version}`;
    const line1Right = online;
    const line1Padding = W - appName.length - version.length - 9; // Adjust for colors
    const line1 = `${vert}${line1Left}${' '.repeat(line1Padding)}${line1Right}  ${vert}`;

    // Separator
    const separator = `${vert}  ${color.dim('─'.repeat(W - 4))}  ${vert}`;

    // Line 2: Engine + Developer + Location + Copyright
    const engineIcon = color.cyan('⚡');
    const devIcon = color.cyan('👨‍💻');
    const locIcon = color.cyan('🌍');

    const line2Content =
        `${engineIcon} ${color.dim('Engine:')} ${color.white(engine)}  ` +
        `${devIcon} ${color.dim('Dev:')} ${color.white(dev)}  ` +
        `${locIcon} ${color.white(loc)}  ` +
        `${color.dim(copyright)}`;

    const line2 = `${vert}  ${line2Content}${' '.repeat(2)}${vert}`;

    // Bottom border
    const bottomBorder = color.dim(`╰${'─'.repeat(W)}╯`);

    // Print the unified dashboard
    console.log(topBorder);
    console.log(line1);
    console.log(separator);
    console.log(line2);
    console.log(bottomBorder);
    console.log(''); // Single blank line

    await setTimeout(300);
}

/**
 * Legacy function for compatibility - now calls compact version
 */
export async function showWelcomeBanner(): Promise<void> {
    await showCompactBanner();
}

/**
 * Show simplified logo for subsequent screens
 */
export function showSimpleLogo(): void {
    console.log(gradient.pastel('\n  MIMO-CLI-MAX v5.0'));
    console.log(color.dim('  AI-Powered Development Architect\n'));
}

/**
 * Show compact status bar with bot
 */
export function showStatusBar(status: string, state: 'idle' | 'busy' | 'error' = 'idle'): void {
    const icon = MimoAvatar.getExpression(state);
    console.log(`${icon} ${status}`);
}
