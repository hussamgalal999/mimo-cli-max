import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import inquirer from 'inquirer';
import { DiffViewer } from './DiffViewer.js';
import { CostTracker, CostCalculation } from '../utils/CostTracker.js';

export class MimoUI {
    /**
     * Display the modern, enhanced Splash Screen with dynamic features
     */
    public static async showSplashScreen(): Promise<void> {
        // Use enhanced splash screen with all features
        const { showEnhancedSplash } = await import('./enhanced-features.js');
        await showEnhancedSplash();
    }

    /**
     * Show robot avatar with animation
     */
    public static async showRobot(state: 'idle' | 'thinking' | 'success' = 'idle'): Promise<void> {
        const { RobotAvatar } = await import('./enhanced-features.js');
        console.log(RobotAvatar.getFrame(state, 0));
    }

    /**
     * Display system statistics
     */
    public static async showSystemStats(): Promise<void> {
        const { SystemStats } = await import('./enhanced-features.js');
        await SystemStats.display();
    }

    /**
     * Get time-based greeting
     */
    public static async getGreeting(): Promise<string> {
        const { getTimeBasedGreeting } = await import('./enhanced-features.js');
        return getTimeBasedGreeting();
    }

    /**
     * Display a section header with dynamic colors
     */
    public static async header(title: string): Promise<void> {
        const { getTimeBasedColors } = await import('./enhanced-features.js');
        const colors = getTimeBasedColors();
        console.log(colors.primary(`\n═══ ${title} ═══\n`));
    }

    /**
     * Display a success message
     */
    public static success(message: string): void {
        console.log(chalk.green(`✅ ${message}`));
    }

    /**
     * Display an error message
     */
    public static error(message: string): void {
        console.log(chalk.red(`❌ ${message}`));
    }

    /**
     * Display an info message
     */
    public static info(message: string): void {
        console.log(chalk.blue(`ℹ️  ${message}`));
    }

    /**
     * Display a warning message
     */
    public static warning(message: string): void {
        console.log(chalk.yellow(`⚠️  ${message}`));
    }

    /**
     * Create a spinner
     */
    public static spinner(text: string) {
        return ora({
            text,
            color: 'cyan',
            spinner: 'dots',
        });
    }

    /**
     * Format agent output like Claude Code
     */
    public static formatAgentOutput(agentName: string, content: string): void {
        const box = boxen(content.trim(), {
            title: agentName,
            titleAlignment: 'left',
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan',
        });
        console.log(box);
    }

    /**
     * Show diff with approval prompt
     */
    public static async showDiffApproval(
        file: string,
        oldContent: string,
        newContent: string
    ): Promise<boolean> {
        const result = await DiffViewer.showDiffApproval(file, oldContent, newContent);
        return result.approved;
    }

    /**
     * Display cost tracking information
     */
    public static showCostTracking(
        tokens: number,
        cost: number,
        model: string
    ): void {
        const content = [
            chalk.bold.yellow('💰 Token Usage & Cost'),
            '',
            chalk.gray('Tokens:') + ' ' + chalk.white(tokens.toLocaleString()),
            chalk.gray('Cost:') + '   ' + chalk.green(`$${cost.toFixed(4)}`),
            chalk.gray('Model:') + '  ' + chalk.cyan(model),
        ].join('\n');

        const box = boxen(content, {
            padding: 1,
            margin: 0,
            borderStyle: 'round',
            borderColor: 'yellow',
        });

        console.log(box);
    }

    /**
     * Render markdown content to terminal
     */
    public static async renderMarkdown(content: string): Promise<void> {
        // Simple markdown rendering without external renderer
        // Just print the content with basic formatting
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.startsWith('# ')) {
                console.log(chalk.bold.cyan(line.substring(2)));
            } else if (line.startsWith('## ')) {
                console.log(chalk.bold.blue(line.substring(3)));
            } else if (line.startsWith('### ')) {
                console.log(chalk.bold(line.substring(4)));
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                console.log(chalk.gray('  •') + ' ' + line.substring(2));
            } else if (line.match(/^\d+\. /)) {
                console.log(chalk.gray(line));
            } else {
                console.log(line);
            }
        }
    }

    /**
     * Display tool execution result
     */
    public static showToolExecution(
        toolName: string,
        args: any[],
        output: any,
        success: boolean
    ): void {
        const status = success ? chalk.green('✅ SUCCESS') : chalk.red('❌ FAILED');
        const argsDisplay = args.length > 0 ? chalk.gray(`Args: ${JSON.stringify(args).substring(0, 50)}...`) : '';

        console.log(chalk.bold.cyan(`\n🛠️  Tool Execution: ${toolName}`));
        console.log(status);
        if (argsDisplay) console.log(argsDisplay);

        if (success && output) {
            const outputStr = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
            const preview = outputStr.substring(0, 200);
            console.log(chalk.gray('Output:'));
            console.log(chalk.white(preview));
            if (outputStr.length > 200) {
                console.log(chalk.gray('... (truncated)'));
            }
        }
        console.log('');
    }

    /**
     * Create progress bar for multi-step operations
     */
    public static createProgressBar(steps: string[]): {
        start: (index: number) => void;
        complete: (index: number) => void;
        finish: () => void;
    } {
        let currentStep = 0;

        const displayProgress = () => {
            console.log(chalk.bold.cyan('\nProgress:'));
            steps.forEach((step, index) => {
                const status = index < currentStep
                    ? chalk.green('✅')
                    : index === currentStep
                        ? chalk.yellow('⏳')
                        : chalk.gray('⬜');

                console.log(`${status} ${index + 1}/${steps.length} - ${step}`);
            });
        };

        return {
            start: (index: number) => {
                currentStep = index;
                displayProgress();
            },
            complete: (index: number) => {
                currentStep = index + 1;
                displayProgress();
            },
            finish: () => {
                currentStep = steps.length;
                displayProgress();
                console.log(chalk.bold.green('\n🎉 All steps completed!\n'));
            },
        };
    }

    /**
     * Display usage statistics dashboard
     */
    public static showUsageDashboard(stats: {
        totalCalls: number;
        totalTokens: number;
        totalCost: number;
        byModel: Record<string, { calls: number; tokens: number; cost: number }>;
    }): void {
        const content = [
            chalk.bold.yellow('📊 Usage Dashboard'),
            '',
            chalk.gray('Total API Calls:') + ' ' + chalk.white(stats.totalCalls.toLocaleString()),
            chalk.gray('Total Tokens:') + '   ' + chalk.white(stats.totalTokens.toLocaleString()),
            chalk.gray('Total Cost:') + '     ' + chalk.green(`$${stats.totalCost.toFixed(4)}`),
            '',
            chalk.bold('By Model:'),
            ...Object.entries(stats.byModel).map(([model, data]) =>
                `  ${chalk.cyan(model.substring(0, 25))}: ${chalk.white(data.calls)} calls, $${data.cost.toFixed(4)}`
            ),
        ].join('\n');

        const box = boxen(content, {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'yellow',
        });

        console.log(box);
    }
}
