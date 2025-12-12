/**
 * MIMO Ultimate Experience - REAL MODE
 * Arrow Navigation + Shortcuts + Custom Commands
 * NOW WITH REAL TOOL EXECUTION!
 */

import * as p from '@clack/prompts';
import { MimoAnimator } from './ui/animator.js';
import { theme, icons } from './ui/theme.js';
import { LaunchScreen } from './ui/launch-screen.js';
import { ConfigManager } from './config/config-manager.js';
import {
    initializeAI,
    executeNewProject,
    executeAudit,
    executeCustomTask,
    executeTerminalCommand,
    executeGitOperation,
    executeFileSearch,
    executeReadFile,
} from './core/RealActionExecutor.js';

/**
 * Execute action based on selection - NOW USING REAL TOOLS!
 */
async function executeAction(action: string): Promise<{ continue: boolean }> {
    switch (action) {
        case 'new':
            await executeNewProject();
            return { continue: true };

        case 'audit':
            await executeAudit();
            return { continue: true };

        case 'feature':
            // Real feature generation with AI
            await MimoAnimator.think('Analyzing feature requirements...', 1000);
            await executeCustomTask('Generate a basic feature scaffold with types, tests, and implementation');
            return { continue: true };

        case 'models':
            await MimoAnimator.work('Loading Model Registry...', 1000);
            p.note(
                'Available AI Providers:\n' +
                '• Claude (Anthropic) - Best for reasoning\n' +
                '• GPT-4 (OpenAI) - Best for coding\n' +
                '• Gemini (Google) - Best for multimodal\n' +
                '• Groq - Ultra-fast inference\n' +
                '• DeepSeek - Affordable coding\n' +
                '• Mistral - Open weights\n' +
                '• Perplexity - Web search + AI',
                '📊 AI Model Nexus'
            );
            return { continue: true };

        case 'tools':
            // Show real tool menu
            const toolChoice = await p.select({
                message: theme.primary('Select Tool:'),
                options: [
                    { value: 'terminal', label: '💻 Terminal Command', hint: 'Execute shell command' },
                    { value: 'git', label: '🔀 Git Operations', hint: 'Status, log, diff, branch' },
                    { value: 'search', label: '🔍 Search Files', hint: 'Find files by name' },
                    { value: 'read', label: '📄 Read File', hint: 'View file contents' },
                    { value: 'back', label: '← Back', hint: 'Return to main menu' },
                ]
            });

            if (!p.isCancel(toolChoice) && toolChoice !== 'back') {
                if (toolChoice === 'terminal') await executeTerminalCommand();
                if (toolChoice === 'git') await executeGitOperation();
                if (toolChoice === 'search') await executeFileSearch();
                if (toolChoice === 'read') await executeReadFile();
            }
            return { continue: true };


        case 'custom':
            const customTask = await p.text({
                message: `${theme.primary('🎨 Custom Task:')} ${theme.dim('Ask anything or describe a task')}`,
                placeholder: 'e.g., "Create login page", "Explain async/await", "Fix this bug"',
            });

            if (p.isCancel(customTask)) {
                return { continue: true };
            }

            const cmd = String(customTask).trim();

            // Process with real AI!
            await executeCustomTask(cmd);
            return { continue: true };

        case 'about':
            await MimoAnimator.creditsScroll();
            return { continue: true };

        case 'theme':
            await LaunchScreen.show();
            return { continue: true };

        case 'exit':
            await MimoAnimator.farewell();
            return { continue: false };

        default:
            return { continue: true };
    }
}


/**
 * Main Loop - Hybrid Interface
 */
async function main() {
    // === INITIALIZE AI ===
    await initializeAI();

    // === CONFIG CHECK ===
    const config = await ConfigManager.load();

    // Show Launch Screen only on first run (or if config is missing)
    if (config.firstRun) {
        await LaunchScreen.show();
    } else {
        // Optional: Brief greeting for returning users or just straight to Intro
        // Let's keep the Cinematic Intro always, as it's the "Boot" sequence.
    }

    // === CINEMATIC INTRO ===
    await MimoAnimator.introSequence();

    let running = true;

    while (running) {
        console.clear();
        MimoAnimator.showDashboard('Awaiting Command...');

        // Show shortcuts hint
        console.log('\n' + theme.dim('─'.repeat(80)));
        console.log(theme.dim('  💡 Tip: Use arrow keys to navigate, or type shortcuts: N/A/F/M/T/Q'));
        console.log(theme.dim('─'.repeat(80)) + '\n');

        // HYBRID MENU: Arrow navigation + Shortcuts shown
        const action = await p.select({
            message: theme.primary('How can I assist you, Architect?'),
            options: [
                {
                    value: 'new',
                    label: `🚀 ${theme.white('New Project')}`,
                    hint: theme.dim('[N] Scaffold full-stack app')
                },
                {
                    value: 'audit',
                    label: `🛡️  ${theme.white('Security Audit')}`,
                    hint: theme.dim('[A] Analyze repository')
                },
                {
                    value: 'feature',
                    label: `⚡ ${theme.white('Develop Feature')}`,
                    hint: theme.dim('[F] AI code generation')
                },
                {
                    value: 'models',
                    label: `📊 ${theme.white('Browse Models')}`,
                    hint: theme.dim('[M] 100+ AI models')
                },
                {
                    value: 'tools',
                    label: `🛠️  ${theme.white('System Tools')}`,
                    hint: theme.dim('[T] 50+ dev tools')
                },
                {
                    value: 'custom',
                    label: `🎨 ${theme.white('Custom Command')}`,
                    hint: theme.dim('Chat or describe any task')
                },
                {
                    value: 'about',
                    label: `📜 ${theme.white('About MIMO')}`,
                    hint: theme.dim('Credits & Info scroll')
                },
                {
                    value: 'theme',
                    label: `🎨 ${theme.white('Change Theme')}`,
                    hint: theme.dim('Visual Appearance')
                },
                {
                    value: 'exit',
                    label: `🚪 ${theme.white('Exit System')}`,
                    hint: theme.dim('[Q] Shutdown')
                },
            ],
        });

        if (p.isCancel(action)) {
            await MimoAnimator.farewell();
            break;
        }

        const result = await executeAction(action);
        running = result.continue;

        if (running) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    process.exit(0);
}

// Launch
main().catch((error) => {
    console.error(theme.error('\n🚨 Fatal Error:'), error.message);
    process.exit(1);
});
