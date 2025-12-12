/**
 * MIMO Unified Menu System
 * Single comprehensive menu for all MIMO features
 */

import inquirer from 'inquirer';
import { MimoUI } from './ui/MimoUI.js';
import * as RealActions from './core/RealActionExecutor.js';

export class UnifiedMenu {
    private isRunning = true;

    /**
     * Start the unified menu system
     */
    async start(): Promise<void> {
        // Initialize AI providers
        await RealActions.initializeAI();

        // Show enhanced splash screen
        await MimoUI.showSplashScreen();

        // Main loop
        while (this.isRunning) {
            const { action } = await this.showMainMenu();
            await this.handleAction(action);
        }
    }

    /**
     * Display the main menu
     */
    private async showMainMenu() {
        return await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '🎯 What would you like to do?',
                choices: [
                    // PROJECT MANAGEMENT
                    new inquirer.Separator('📁 PROJECT MANAGEMENT'),
                    { name: '  🚀 New Project', value: 'new-project' },

                    // DEVELOPMENT
                    new inquirer.Separator('💻 DEVELOPMENT'),
                    { name: '  💬 AI Chat', value: 'ai-chat' },
                    { name: '  ⚡ Quick Code Generation', value: 'code-gen' },

                    // BMAD WORKFLOW
                    new inquirer.Separator('🏗️  BMAD WORKFLOW'),
                    { name: '  🚀 Full BMAD Workflow', value: 'bmad-full' },
                    { name: '  🔍 Market Validation', value: 'bmad-validate' },
                    { name: '  📋 Create PRD & Plan', value: 'bmad-plan' },
                    { name: '  ⚡ Develop Feature', value: 'bmad-dev' },

                    // TOOLS
                    new inquirer.Separator('🛠️  TOOLS'),
                    { name: '  📊 Security Audit', value: 'audit' },
                    { name: '  🔍 File Search', value: 'file-search' },
                    { name: '  📄 Read File', value: 'read-file' },
                    { name: '  ⌨️  Terminal Command', value: 'terminal' },

                    // GIT OPERATIONS
                    new inquirer.Separator('🔗 GIT OPERATIONS'),
                    { name: '  📊 Git Status', value: 'git-status' },
                    { name: '  📜 Git Log', value: 'git-log' },
                    { name: '  📝 Git Diff', value: 'git-diff' },
                    { name: '  🔀 Git Branches', value: 'git-branches' },

                    // SYSTEM
                    new inquirer.Separator('⚙️  SYSTEM'),
                    { name: '  📊 System Info', value: 'system-info' },
                    { name: '  🤖 Show Robot', value: 'show-robot' },
                    { name: '  ❓ Help', value: 'help' },
                    { name: '  🚪 Exit', value: 'exit' },
                ],
                pageSize: 25,
                loop: false
            }
        ]);
    }

    /**
     * Handle user action
     */
    private async handleAction(action: string): Promise<void> {
        console.log(''); // Add spacing

        try {
            switch (action) {
                // PROJECT MANAGEMENT
                case 'new-project':
                    await RealActions.executeNewProject();
                    break;

                // DEVELOPMENT
                case 'ai-chat':
                    const question = await this.promptForInput('💬 Ask AI anything:', 'What would you like to know?');
                    if (question) await RealActions.executeCustomTask(question);
                    break;

                case 'code-gen':
                    const codeTask = await this.promptForInput('⚡ Code generation task:', 'Describe what you want to build');
                    if (codeTask) await RealActions.executeCustomTask(codeTask);
                    break;

                // BMAD WORKFLOW
                case 'bmad-full':
                    await this.runBMADWorkflow('full');
                    break;

                case 'bmad-validate':
                    await this.runBMADWorkflow('validate');
                    break;

                case 'bmad-plan':
                    await this.runBMADWorkflow('plan');
                    break;

                case 'bmad-dev':
                    await this.runBMADWorkflow('dev');
                    break;

                // TOOLS
                case 'audit':
                    await RealActions.executeAudit();
                    break;

                case 'file-search':
                    await RealActions.executeFileSearch();
                    break;

                case 'read-file':
                    await RealActions.executeReadFile();
                    break;

                case 'terminal':
                    await RealActions.executeTerminalCommand();
                    break;

                // GIT OPERATIONS
                case 'git-status':
                case 'git-log':
                case 'git-diff':
                case 'git-branches':
                    await RealActions.executeGitOperation();
                    break;

                // SYSTEM
                case 'system-info':
                    await MimoUI.showSystemStats();
                    await this.pressEnterToContinue();
                    break;

                case 'show-robot':
                    await this.showRobotDemo();
                    break;

                case 'help':
                    await this.showHelp();
                    break;

                case 'exit':
                    await this.exit();
                    break;

                default:
                    console.log('Unknown action');
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }

        // Add spacing before next menu
        if (this.isRunning) {
            console.log('');
            await this.pressEnterToContinue();
        }
    }

    /**
     * Run BMAD workflow
     */
    private async runBMADWorkflow(type: 'full' | 'validate' | 'plan' | 'dev'): Promise<void> {
        const { ValidationWorkflow, PlanningWorkflow, DevelopmentWorkflow } = await import('./workflows/BMADWorkflows.js');

        const idea = await this.promptForInput('💡 Project idea:', 'Describe your project');
        if (!idea) return;

        if (type === 'full' || type === 'validate') {
            await MimoUI.header('Phase 1: Validation');
            const validation = new ValidationWorkflow();
            await validation.execute(idea);
        }

        if (type === 'full' || type === 'plan') {
            await MimoUI.header('Phase 2: Planning');
            const planning = new PlanningWorkflow();
            await planning.execute(idea);
        }

        if (type === 'full' || type === 'dev') {
            await MimoUI.header('Phase 3: Development');
            const development = new DevelopmentWorkflow();
            await development.execute('EPIC-001', 'Initial MVP Setup');
        }
    }

    /**
     * Show robot animation demo
     */
    private async showRobotDemo(): Promise<void> {
        console.log('\n🤖 Robot Animation Demo\n');

        await MimoUI.showRobot('idle');
        await new Promise(r => setTimeout(r, 1000));

        await MimoUI.showRobot('thinking');
        await new Promise(r => setTimeout(r, 1000));

        await MimoUI.showRobot('success');
        await new Promise(r => setTimeout(r, 1000));
    }

    /**
     * Show help information
     */
    private async showHelp(): Promise<void> {
        const greeting = await MimoUI.getGreeting();

        console.log(`
╭─────────────────────────────────────────────────────────────╮
│                    MIMO-CLI-MAX v5.0                        │
│              AI-Powered Development Assistant               │
╰─────────────────────────────────────────────────────────────╯

${greeting}

📚 FEATURES:

  📁 Project Management
     • Create new projects (Node.js, React, Next.js, Python)
     • Automated project setup

  💻 Development
     • AI-powered code generation
     • Interactive AI chat
     • Code assistance

  🏗️  BMAD Workflow
     • Market validation
     • PRD generation
     • Architecture planning
     • Feature development

  🛠️  Tools
     • Security auditing
     • File operations
     • Terminal integration
     • Git operations

  ⚙️  System
     • System statistics
     • Dynamic themes
     • Robot animations

🎯 USAGE:

  Interactive Mode:
    npm run mimo

  Navigation:
    ↑↓  Navigate menu
    ⏎   Select option
    Ctrl+C  Exit

📖 DOCUMENTATION:

  GitHub: https://github.com/username/mimo-cli-max
  Issues: https://github.com/username/mimo-cli-max/issues

💡 TIP: Use the AI Chat for any coding questions!

`);
    }

    /**
     * Exit the application
     */
    private async exit(): Promise<void> {
        this.isRunning = false;
        const { RobotAvatar } = await import('./ui/enhanced-features.js');
        console.log('\n');
        console.log(RobotAvatar.getFrame('success', 0));
        console.log('\n👋 Goodbye! Thanks for using MIMO-CLI-MAX\n');
        process.exit(0);
    }

    /**
     * Prompt for user input
     */
    private async promptForInput(message: string, placeholder: string): Promise<string> {
        const { input } = await inquirer.prompt([
            {
                type: 'input',
                name: 'input',
                message,
                default: placeholder
            }
        ]);
        return input === placeholder ? '' : input;
    }

    /**
     * Press enter to continue
     */
    private async pressEnterToContinue(): Promise<void> {
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: 'Press Enter to continue...',
            }
        ]);
    }
}
