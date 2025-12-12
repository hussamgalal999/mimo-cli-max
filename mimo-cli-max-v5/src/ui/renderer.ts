/**
 * Modern Renderer - Claude Code Style
 * Beautiful terminal output with syntax highlighting
 */

import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import color from 'picocolors';
import * as p from '@clack/prompts';

// Configure marked
marked.setOptions({
    renderer: new TerminalRenderer({
        code: color.cyan,
        blockquote: color.gray,
        heading: color.green,
        strong: color.bold,
        em: color.italic,
        codespan: color.cyan,
        link: color.blue,
    }),
});

/**
 * Render markdown content
 */
export function renderMarkdown(content: string): string {
    return marked(content) as string;
}

/**
 * Display a note/info box (Claude Code style)
 */
export function displayNote(message: string, title?: string): void {
    p.note(message, title);
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
    console.log(color.green('✓ ' + message));
}

/**
 * Display error message
 */
export function displayError(message: string): void {
    console.log(color.red('✗ ' + message));
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
    console.log(color.yellow('⚠ ' + message));
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
    console.log(color.cyan('ℹ ' + message));
}

/**
 * Display a list of items
 */
export function displayList(items: string[], title?: string): void {
    if (title) {
        console.log(color.bold(title));
    }
    items.forEach((item, i) => {
        console.log(color.dim(`  ${i + 1}.`) + ' ' + item);
    });
}

/**
 * Display a table (simple)
 */
export function displayTable(headers: string[], rows: string[][]): void {
    // Header
    console.log(color.bold(headers.join(' | ')));
    console.log(color.dim('-'.repeat(headers.join(' | ').length)));

    // Rows
    rows.forEach((row) => {
        console.log(row.join(' | '));
    });
}

/**
 * Display code diff
 */
export function displayDiff(oldCode: string, newCode: string): void {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');

    const maxLines = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLines; i++) {
        const oldLine = oldLines[i] || '';
        const newLine = newLines[i] || '';

        if (oldLine !== newLine) {
            if (oldLine) {
                console.log(color.red('- ' + oldLine));
            }
            if (newLine) {
                console.log(color.green('+ ' + newLine));
            }
        } else {
            console.log(color.dim('  ' + oldLine));
        }
    }
}

/**
 * Display file tree
 */
export function displayFileTree(tree: any, indent: number = 0): void {
    const prefix = '  '.repeat(indent);

    if (typeof tree === 'string') {
        console.log(prefix + color.dim('├─ ') + tree);
    } else if (typeof tree === 'object') {
        for (const [key, value] of Object.entries(tree)) {
            console.log(prefix + color.cyan('📁 ' + key));
            displayFileTree(value, indent + 1);
        }
    }
}

/**
 * Display cost summary
 */
export function displayCostSummary(
    inputTokens: number,
    outputTokens: number,
    cost: number,
    model: string
): void {
    const summary = `
${color.bold('Cost Summary')}
${color.dim('─'.repeat(40))}
Model:         ${color.cyan(model)}
Input Tokens:  ${color.white(inputTokens.toLocaleString())}
Output Tokens: ${color.white(outputTokens.toLocaleString())}
Total Cost:    ${color.green('$' + cost.toFixed(4))}
    `.trim();

    p.note(summary, '💰 Cost');
}

/**
 * Display agent activity
 */
export function displayAgentActivity(agent: string, action: string, status: 'working' | 'done' | 'error'): void {
    const icons = {
        working: '⚙️',
        done: '✓',
        error: '✗',
    };

    const colors = {
        working: color.cyan,
        done: color.green,
        error: color.red,
    };

    console.log(colors[status](`${icons[status]} ${agent}: ${action}`));
}

/**
 * Display progress bar
 */
export function displayProgressBar(current: number, total: number, width: number = 30): void {
    const percentage = Math.floor((current / total) * 100);
    const filled = Math.floor((current / total) * width);
    const empty = width - filled;

    const bar = color.green('█'.repeat(filled)) + color.dim('░'.repeat(empty));
    process.stdout.write(`\r${bar} ${percentage}%`);

    if (current === total) {
        process.stdout.write('\n');
    }
}

/**
 * Clear screen (Claude Code style)
 */
export function clearScreen(): void {
    console.clear();
}

/**
 * Display separator
 */
export function displaySeparator(char: string = '─', length: number = 50): void {
    console.log(color.dim(char.repeat(length)));
}
