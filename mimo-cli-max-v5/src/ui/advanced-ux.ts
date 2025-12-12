/**
 * Advanced UX Utilities - Claude Code Style
 * Implementing 10 professional UX improvements
 */

import * as p from '@clack/prompts';
import color from 'picocolors';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Config file path
const CONFIG_PATH = path.join(os.homedir(), '.mimo-cli-config.json');

/**
 * 1. TRANSIENT NOTIFICATIONS - Messages that appear briefly
 */
export async function showTransientNotification(
    message: string,
    duration: number = 1500,
    type: 'info' | 'success' | 'warning' = 'info'
): Promise<void> {
    const icons = {
        info: 'ℹ️',
        success: '✓',
        warning: '⚠️',
    };

    const colors = {
        info: color.cyan,
        success: color.green,
        warning: color.yellow,
    };

    console.log(colors[type](`${icons[type]} ${message}`));
    await new Promise((r) => setTimeout(r, duration));
}

/**
 * 2. ROBUST ERROR HANDLING - Beautiful error display
 */
export function showRobustError(error: Error, suggestion?: string): void {
    p.log.error(color.bgRed(color.white(' 🚨 ERROR ')));

    const errorMessage =
        `${color.dim('Message:')} ${error.message}\n` +
        (suggestion ? `${color.dim('Suggestion:')} ${suggestion}` : '');

    p.note(errorMessage, color.red('❌ Action Required'));
}

/**
 * 3. SUMMARY/CONFIRMATION - Show final plan before execution
 */
export async function showExecutionSummary(summary: {
    path: string;
    mission: string;
    provider: string;
    estimatedTokens?: number;
    estimatedCost?: number;
}): Promise<boolean> {
    const summaryText =
        `${color.dim('Target Path:')}      ${color.yellow(summary.path)}\n` +
        `${color.dim('AI Mission:')}       ${color.green(summary.mission)}\n` +
        `${color.dim('Provider:')}         ${color.cyan(summary.provider)}\n` +
        `${color.dim('Estimated Tokens:')} ${color.blue('~' + (summary.estimatedTokens || 5000).toLocaleString())}\n` +
        `${color.dim('Estimated Cost:')}   ${color.green('$' + (summary.estimatedCost || 0.05).toFixed(4))}`;

    p.note(summaryText, color.bgCyan(color.black(' ✨ EXECUTION PLAN ')));

    const confirm = await p.confirm({
        message: 'Proceed with this execution plan?',
        initialValue: true,
    });

    if (p.isCancel(confirm)) {
        p.cancel('Operation cancelled by user.');
        process.exit(0);
    }

    return confirm;
}

/**
 * 4. SELECTIVE LOGGING - Non-intrusive step logging
 */
export function logStep(message: string): void {
    p.log.step(color.dim(`→ ${message}`));
}

/**
 * 5. ENHANCED OUTRO - Context-aware completion messages
 */
export function showEnhancedOutro(stats: {
    filesModified?: number;
    filesCreated?: number;
    testsGenerated?: number;
    success: boolean;
}): void {
    if (stats.success) {
        p.outro(color.bgGreen(color.black(' ✨ Mission Complete! ')));

        const details: string[] = [];
        if (stats.filesModified) {
            details.push(`${color.green('✓')} ${stats.filesModified} files modified`);
        }
        if (stats.filesCreated) {
            details.push(`${color.green('✓')} ${stats.filesCreated} files created`);
        }
        if (stats.testsGenerated) {
            details.push(`${color.green('✓')} ${stats.testsGenerated} tests generated`);
        }

        if (details.length > 0) {
            console.log('\n' + details.join('\n'));
        }

        console.log(color.dim(`\n➡️  Next Step: Review changes using ${color.cyan('git diff')}`));
    } else {
        p.outro(color.bgYellow(color.black(' ⚠️  Process Finished with Warnings ')));
        console.log(color.dim(`\n${color.yellow('!')} Some operations require manual review.`));
    }
}

/**
 * 6. HISTORY & CACHING - Remember user preferences
 */
interface ConfigData {
    lastUsedPath?: string;
    lastProvider?: string;
    lastMission?: string;
    recentPaths?: string[];
}

export function loadConfig(): ConfigData {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        // Silent fail, return empty config
    }
    return {};
}

export function saveConfig(data: Partial<ConfigData>): void {
    try {
        const existing = loadConfig();
        const updated = { ...existing, ...data };

        // Keep only last 5 recent paths
        if (updated.recentPaths && updated.recentPaths.length > 5) {
            updated.recentPaths = updated.recentPaths.slice(0, 5);
        }

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2));
    } catch (error) {
        // Silent fail
    }
}

export function addToRecentPaths(newPath: string): void {
    const config = loadConfig();
    const recentPaths = config.recentPaths || [];

    // Remove if already exists
    const filtered = recentPaths.filter((p) => p !== newPath);

    // Add to beginning
    saveConfig({
        recentPaths: [newPath, ...filtered],
        lastUsedPath: newPath,
    });
}

/**
 * 7. COMMAND DISCOVERY - Help screen
 */
export function showCommandDiscovery(): void {
    console.clear();

    p.intro(color.bgCyan(color.black(' MIMO-CLI-MAX v5.0 ')));

    p.log.info(color.cyan('Available Commands:'));

    const commands = [
        ['mimo:pro', 'Professional AI interaction with all features'],
        ['mimo:demo', 'Show all 7 agents in action'],
        ['mimo:models', 'Browse 100+ AI models'],
        ['mimo:tools', 'Explore 50+ available tools'],
        ['mimo:perplexity', 'Perplexity hybrid demos'],
        ['mimo:workflows', 'BMAD workflow demonstrations'],
    ];

    commands.forEach(([cmd, desc]) => {
        console.log(`  ${color.green('npm run ' + cmd).padEnd(35)} ${color.dim(desc)}`);
    });

    console.log('\n' + color.yellow('💡 Tip: Run any command to see it in action!'));

    p.outro('Ready to start');
}

/**
 * 8. PROGRESS BAR - Visual progress tracking
 */
export class ProgressBar {
    private current: number = 0;
    private total: number;
    private message: string;
    private width: number = 30;

    constructor(total: number, message: string = 'Processing...') {
        this.total = total;
        this.message = message;
    }

    update(current: number, customMessage?: string): void {
        this.current = current;
        if (customMessage) {
            this.message = customMessage;
        }
        this.render();
    }

    increment(customMessage?: string): void {
        this.update(this.current + 1, customMessage);
    }

    private render(): void {
        const percentage = Math.floor((this.current / this.total) * 100);
        const filled = Math.floor((this.current / this.total) * this.width);
        const empty = this.width - filled;

        const bar = color.green('█'.repeat(filled)) + color.dim('░'.repeat(empty));
        const display = `${bar} ${percentage}% ${color.dim(this.message)}`;

        process.stdout.write(`\r${display}`);

        if (this.current >= this.total) {
            process.stdout.write('\n');
        }
    }

    complete(message?: string): void {
        this.update(this.total, message || 'Complete!');
    }
}

/**
 * 9. WARNING OUTRO - Specific warning messages
 */
export function showWarningOutro(warnings: string[]): void {
    p.outro(color.bgYellow(color.black(' ⚠️  Completed with Warnings ')));

    warnings.forEach((warning, i) => {
        console.log(color.yellow(`  ${i + 1}. ${warning}`));
    });

    console.log(color.dim(`\n💡 Review warnings before proceeding.`));
}

/**
 * 10. MULTI-LINE INPUT - Support for complex inputs
 */
export async function getMultilineInput(
    message: string,
    placeholder?: string
): Promise<string> {
    const input = await p.text({
        message,
        placeholder: placeholder || 'Enter details... (Press Enter twice to finish)',
    });

    if (p.isCancel(input)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }

    return input;
}
