/**
 * Professional Interaction UI - Claude Code Style
 * با "روح" (With Soul) - Professional micro-interactions
 */

import * as p from '@clack/prompts';
import color from 'picocolors';
import gradient from 'gradient-string';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface ProjectInput {
    mission: 'audit' | 'feature' | 'explain' | 'refactor' | 'test' | 'debug';
    path: string;
    description?: string;
    provider?: string;
}

/**
 * 1. VISUAL HIERARCHY - Gradient Logo (بدلاً من خلفية ثقيلة)
 */
function showProfessionalLogo(): void {
    console.clear();

    // Gradient logo - أنيق وخفيف
    console.log(gradient.morning('\n   ╔═══════════════════════════╗'));
    console.log(gradient.morning('   ║   MIMO-CLI-MAX v5.0       ║'));
    console.log(gradient.morning('   ╚═══════════════════════════╝\n'));
    console.log(color.dim('   AI-Powered Development Architect\n'));
}

/**
 * 2. CONTEXTUAL AWARENESS - System context detection
 * FIXED: Git error handling with silent stderr suppression
 */
function detectContext(): { git: string; node: string; files: number; dir: string } {
    let gitBranch = 'none';
    let fileCount = 0;
    const currentDir = process.cwd();

    // Detect Git branch - SILENT ERROR HANDLING (prevents "fatal: not a git repository")
    try {
        gitBranch = execSync('git branch --show-current', {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'] // CRITICAL: Suppress stderr
        }).trim();

        if (!gitBranch) {
            gitBranch = 'none';
        }
    } catch (e) {
        gitBranch = 'not a git repo'; // Graceful fallback
    }

    // Count files in current directory
    try {
        const files = fs.readdirSync(currentDir);
        fileCount = files.filter(f => {
            try {
                return fs.statSync(path.join(currentDir, f)).isFile();
            } catch {
                return false;
            }
        }).length;
    } catch (e) {
        fileCount = 0;
    }

    return {
        git: gitBranch,
        node: process.version,
        files: fileCount,
        dir: path.basename(currentDir),
    };
}

/**
 * Show context note with beautiful formatting
 * ENHANCED: Better Git status display
 */
function showContext(context: ReturnType<typeof detectContext>): void {
    // Beautiful Git status display
    const gitDisplay = (context.git === 'not a git repo' || context.git === 'none')
        ? color.dim('Not a Git Repo (Local Mode)')
        : color.green(`✓ ${context.git}`);

    const contextInfo =
        `${color.dim('Directory:')}  ${color.cyan(context.dir)}\n` +
        `${color.dim('Git Branch:')} ${gitDisplay}\n` +
        `${color.dim('Node Ver:')}   ${color.yellow(context.node)}\n` +
        `${color.dim('Files:')}      ${color.white(context.files.toString())}`;

    p.note(contextInfo, '📊 Context Detected');
}

/**
 * Professional startup with all improvements
 */
export async function startProfessionalInteraction(): Promise<ProjectInput> {
    // 1. Beautiful logo
    showProfessionalLogo();

    // 2. Professional intro
    p.intro(color.bgBlue(color.white(' 🚀 System Online ')));

    // 3. Show context
    const context = detectContext();
    showContext(context);

    // 4. Smart grouped questions
    const project = await p.group(
        {
            mission: () =>
                p.select({
                    message: '🎯 What is your mission?',
                    options: [
                        {
                            value: 'audit',
                            label: '🔍 Audit Codebase',
                            hint: 'Find bugs & security issues'
                        },
                        {
                            value: 'feature',
                            label: '✨ Build Feature',
                            hint: 'Generate new code'
                        },
                        {
                            value: 'explain',
                            label: '📖 Explain Project',
                            hint: 'Create documentation'
                        },
                        {
                            value: 'refactor',
                            label: '♻️  Refactor Code',
                            hint: 'Improve code quality'
                        },
                        {
                            value: 'test',
                            label: '🧪 Generate Tests',
                            hint: 'Add test coverage'
                        },
                        {
                            value: 'debug',
                            label: '🐛 Debug Issue',
                            hint: 'Find and fix bugs'
                        },
                    ],
                }),

            path: ({ results }) =>
                p.select({
                    message: '📂 Where should we start analysis?',
                    options: [
                        {
                            value: '.',
                            label: 'Current Directory',
                            hint: `(${context.dir}) - Recommended`
                        },
                        {
                            value: './src',
                            label: 'Source Directory',
                            hint: './src'
                        },
                        {
                            value: 'custom',
                            label: 'Enter Custom Path',
                            hint: 'Type manually'
                        },
                    ],
                }),

            customPath: ({ results }) => {
                if (results.path === 'custom') {
                    return p.text({
                        message: '📁 Enter custom path:',
                        placeholder: './my-project',
                        validate: (value) => {
                            if (!value) return 'Please enter a path';
                            if (value.includes(' ')) return 'No spaces allowed in path';
                        },
                    });
                }
                return Promise.resolve(undefined);
            },

            description: ({ results }) =>
                p.text({
                    message: `📝 Describe your ${results.mission} task:`,
                    placeholder: 'e.g., Add JWT authentication to Express API',
                    validate: (value) => {
                        if (!value || value.length < 10) {
                            return 'Please provide more details (min 10 chars)';
                        }
                    },
                }),

            provider: () =>
                p.select({
                    message: '🤖 Select AI Provider:',
                    options: [
                        {
                            value: 'claude',
                            label: '🧠 Claude 3.5 Sonnet',
                            hint: 'Best for coding'
                        },
                        {
                            value: 'gpt4',
                            label: '⚡ GPT-4o',
                            hint: 'General purpose'
                        },
                        {
                            value: 'perplexity',
                            label: '🔍 Perplexity Sonar',
                            hint: 'Search + Code'
                        },
                        {
                            value: 'groq',
                            label: '🚀 Groq Llama',
                            hint: 'Ultra-fast, FREE'
                        },
                        {
                            value: 'deepseek',
                            label: '💰 DeepSeek',
                            hint: 'Affordable'
                        },
                    ],
                }),
        },
        {
            onCancel: () => {
                p.cancel('Operation cancelled by user.');
                process.exit(0);
            },
        }
    );

    // Get final path
    const finalPath = project.customPath || project.path || '.';

    return {
        mission: project.mission as any,
        path: finalPath,
        description: project.description,
        provider: project.provider,
    };
}

/**
 * Confirmation with beautiful formatting
 */
export async function confirmAction(message: string, defaultValue: boolean = false): Promise<boolean> {
    const confirmed = await p.confirm({
        message,
        initialValue: defaultValue,
    });

    if (p.isCancel(confirmed)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }

    return confirmed;
}

/**
 * Show success with gradient
 */
export function showSuccess(message: string = '✨ MIMO completed successfully!'): void {
    p.outro(gradient.pastel(message));
}

/**
 * Show error with color
 */
export function showError(message: string): void {
    p.outro(color.red('✗ ' + message));
}

/**
 * Show info note
 */
export function showInfo(message: string, title?: string): void {
    p.note(message, title || color.cyan('ℹ Info'));
}

/**
 * Show warning
 */
export function showWarning(message: string): void {
    p.note(message, color.yellow('⚠️  Warning'));
}

/**
 * Professional step-by-step progress
 */
export function showProgressSteps(steps: string[], currentStep: number): void {
    const stepsText = steps
        .map((step, i) => {
            if (i < currentStep) {
                return color.green(`✓ ${step}`);
            } else if (i === currentStep) {
                return color.cyan(`→ ${step}`);
            } else {
                return color.dim(`  ${step}`);
            }
        })
        .join('\n');

    p.note(stepsText, '📋 Progress');
}

/**
 * Show cost summary with beautiful formatting
 */
export function showCostSummary(
    inputTokens: number,
    outputTokens: number,
    cost: number,
    model: string
): void {
    const summary =
        `${color.dim('Model:')}         ${color.cyan(model)}\n` +
        `${color.dim('Input Tokens:')}  ${color.white(inputTokens.toLocaleString())}\n` +
        `${color.dim('Output Tokens:')} ${color.white(outputTokens.toLocaleString())}\n` +
        `${color.dim('Total Cost:')}    ${color.green('$' + cost.toFixed(4))}`;

    p.note(summary, '💰 Cost Summary');
}

/**
 * Show agent activity
 */
export function showAgentActivity(agent: string, action: string, status: 'working' | 'done' | 'error'): void {
    const icons = {
        working: '⚡',
        done: '✓',
        error: '✗',
    };

    const colors = {
        working: color.cyan,
        done: color.green,
        error: color.red,
    };

    const message = `${icons[status]} ${agent}: ${action}`;
    console.log(colors[status](message));
}
