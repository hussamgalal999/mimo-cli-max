import inquirer from 'inquirer';
import chalk from 'chalk';
import { MimoUI } from './ui/MimoUI.js';
import { ValidationWorkflow, PlanningWorkflow, DevelopmentWorkflow } from './workflows/BMADWorkflows.js';

export class MimoREPL {
    private isRunning: boolean = true;
    private validationWorkflow: ValidationWorkflow;
    private planningWorkflow: PlanningWorkflow;
    private developmentWorkflow: DevelopmentWorkflow;

    constructor() {
        this.validationWorkflow = new ValidationWorkflow();
        this.planningWorkflow = new PlanningWorkflow();
        this.developmentWorkflow = new DevelopmentWorkflow();
    }

    /**
     * Start the interactive REPL loop
     */
    public async start(): Promise<void> {
        await MimoUI.showSplashScreen();

        while (this.isRunning) {
            const { command } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'command',
                    message: 'mimo > What would you like to do?',
                    choices: [
                        { name: '🚀 New Project (Validation -> Planning -> Dev)', value: 'new' },
                        { name: '🔍 Market Validation', value: 'validate' },
                        { name: '📝 Create PRD & Plan', value: 'plan' },
                        { name: '⚡ Develop Feature', value: 'dev' },
                        new inquirer.Separator(),
                        { name: '⚙️  Settings', value: 'settings' },
                        { name: '❓ Help', value: 'help' },
                        { name: '🚪 Exit', value: 'exit' },
                    ],
                    pageSize: 10,
                },
            ]);

            await this.handleCommand(command);
        }
    }

    private async handleCommand(command: string): Promise<void> {
        switch (command) {
            case 'new':
                await this.runFullWorkflow();
                break;
            case 'validate':
                await this.runValidation();
                break;
            case 'plan':
                await this.runPlanning();
                break;
            case 'dev':
                await this.runDevelopment();
                break;
            case 'settings':
                MimoUI.info('Settings menu coming soon...');
                break;
            case 'help':
                this.showHelp();
                break;
            case 'exit':
                this.isRunning = false;
                MimoUI.success('Goodbye! See you next time. 👋');
                process.exit(0);
            // break; // Unreachable code removed
        }

        // Add a small pause for better UX
        console.log('');
    }

    private async runFullWorkflow(): Promise<void> {
        const { idea } = await inquirer.prompt([
            {
                type: 'input',
                name: 'idea',
                message: '💡 Describe your project idea:',
                validate: (input) => input.length > 5 || 'Please provide a longer description.',
            },
        ]);

        MimoUI.header('Phase 1: Validation');
        await this.validationWorkflow.execute(idea);

        MimoUI.header('Phase 2: Planning');
        await this.planningWorkflow.execute(idea);

        MimoUI.header('Phase 3: Development');
        await this.developmentWorkflow.execute('EPIC-001', 'Initial MVP Setup');
    }

    private async runValidation(): Promise<void> {
        const { idea } = await inquirer.prompt([
            {
                type: 'input',
                name: 'idea',
                message: '💡 Project Idea:',
            },
        ]);
        await this.validationWorkflow.execute(idea);
    }

    private async runPlanning(): Promise<void> {
        const { brief } = await inquirer.prompt([
            {
                type: 'input',
                name: 'brief',
                message: '📄 Project Brief:',
            },
        ]);
        await this.planningWorkflow.execute(brief);
    }

    private async runDevelopment(): Promise<void> {
        const { feature } = await inquirer.prompt([
            {
                type: 'input',
                name: 'feature',
                message: '⚡ Feature to build:',
            },
        ]);
        await this.developmentWorkflow.execute('TASK-001', feature);
    }

    private showHelp(): void {
        console.log(`
${chalk.bold.cyan('Shortcuts & Commands:')}
  ${chalk.yellow('new')}       - Start a full end-to-end project
  ${chalk.yellow('val')}       - Run market validation only
  ${chalk.yellow('plan')}      - Generate PRD and Architecture
  ${chalk.yellow('dev')}       - Generate code for a feature
  ${chalk.yellow('exit')}      - Quit the application
    `);
    }
}
