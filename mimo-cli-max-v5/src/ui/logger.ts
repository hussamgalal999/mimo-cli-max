/**
 * Dimmed Logging Utility - Professional Step Logging
 * Non-intrusive logging that doesn't distract from main output
 */

import color from 'picocolors';

/**
 * Log a step with dimmed formatting
 * Perfect for technical details that user doesn't need to focus on
 */
export function logStep(message: string): void {
    console.log(`${color.dim('│')}  ${color.dim(message)}`);
}

/**
 * Log with specific icon and color
 */
export function logInfo(message: string): void {
    console.log(`${color.dim('│')}  ${color.cyan('ℹ')} ${color.dim(message)}`);
}

/**
 * Log success step
 */
export function logSuccess(message: string): void {
    console.log(`${color.dim('│')}  ${color.green('✓')} ${color.dim(message)}`);
}

/**
 * Log warning step
 */
export function logWarning(message: string): void {
    console.log(`${color.dim('│')}  ${color.yellow('⚠')} ${color.dim(message)}`);
}

/**
 * Log error step (still dimmed, but with red icon)
 */
export function logError(message: string): void {
    console.log(`${color.dim('│')}  ${color.red('✗')} ${color.dim(message)}`);
}

/**
 * Start a logging section
 */
export function logSectionStart(title: string): void {
    console.log(`${color.dim('┌─')} ${color.dim(title)}`);
}

/**
 * End a logging section
 */
export function logSectionEnd(): void {
    console.log(color.dim('└─'));
}

/**
 * Log with custom prefix
 */
export function logCustom(prefix: string, message: string, prefixColor: 'cyan' | 'green' | 'yellow' | 'red' = 'cyan'): void {
    const coloredPrefix = color[prefixColor](prefix);
    console.log(`${color.dim('│')}  ${coloredPrefix} ${color.dim(message)}`);
}
