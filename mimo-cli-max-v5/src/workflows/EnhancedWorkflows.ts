/**
 * MIMO Enhanced Workflows
 * Plan approval, diff review, artifact management, cost budgeting
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { DiffViewer } from '../ui/DiffViewer.js';
import { CostTracker } from '../utils/CostTracker.js';
import { FileSystemTools } from '../tools/FileSystemTools.js';
import { log } from '../utils/Logger.js';

export interface PlanApproval {
    approved: boolean;
    feedback?: string;
    modifications?: string[];
}

export interface ArtifactMetadata {
    name: string;
    type: 'code' | 'document' | 'config' | 'test';
    path: string;
    createdAt: Date;
    size: number;
}

/**
 * Enhanced Workflows for MIMO
 */
export class EnhancedWorkflows {
    private fileSystemTools: FileSystemTools;
    private costTracker: CostTracker;
    private artifacts: Map<string, ArtifactMetadata> = new Map();

    constructor() {
        this.fileSystemTools = new FileSystemTools();
        this.costTracker = new CostTracker();
    }

    /**
     * Plan approval workflow
     */
    public async requestPlanApproval(plan: string, title: string = 'Implementation Plan'): Promise<PlanApproval> {
        console.log(chalk.cyan.bold(`\n═══ ${title} ═══\n`));
        console.log(plan);
        console.log(chalk.cyan.bold('\n═══════════════════════════\n'));

        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'approved',
                message: chalk.yellow('Do you approve this plan?'),
                default: true,
            },
            {
                type: 'input',
                name: 'feedback',
                message: 'Any feedback or modifications?',
                when: (answers) => !answers.approved,
            },
        ]);

        log.info('Plan approval', { approved: answers.approved });

        return {
            approved: answers.approved,
            feedback: answers.feedback,
            modifications: answers.feedback ? [answers.feedback] : [],
        };
    }

    /**
     * Diff review workflow
     */
    public async reviewDiff(
        filePath: string,
        oldContent: string,
        newContent: string
    ): Promise<boolean> {
        const approval = await DiffViewer.showDiffApproval(filePath, oldContent, newContent);

        if (approval.approved) {
            await this.fileSystemTools.writeFile(filePath, newContent);
            log.info('Diff approved and applied', { file: filePath });
            return true;
        } else {
            log.info('Diff rejected', { file: filePath, reason: approval.comment });
            return false;
        }
    }

    /**
     * Batch diff review
     */
    public async reviewMultipleDiffs(
        diffs: Array<{ file: string; oldContent: string; newContent: string }>
    ): Promise<{ approved: string[]; rejected: string[] }> {
        const approved: string[] = [];
        const rejected: string[] = [];

        for (const diff of diffs) {
            const result = await this.reviewDiff(diff.file, diff.oldContent, diff.newContent);
            if (result) {
                approved.push(diff.file);
            } else {
                rejected.push(diff.file);
            }
        }

        return { approved, rejected };
    }

    /**
     * Register artifact
     */
    public async registerArtifact(
        name: string,
        type: ArtifactMetadata['type'],
        path: string
    ): Promise<void> {
        const info = await this.fileSystemTools.getFileInfo(path);

        const metadata: ArtifactMetadata = {
            name,
            type,
            path,
            createdAt: new Date(),
            size: info.size,
        };

        this.artifacts.set(name, metadata);
        log.info('Artifact registered', { name, type, path });
    }

    /**
     * Get artifact
     */
    public getArtifact(name: string): ArtifactMetadata | undefined {
        return this.artifacts.get(name);
    }

    /**
     * List artifacts
     */
    public listArtifacts(type?: ArtifactMetadata['type']): ArtifactMetadata[] {
        const all = Array.from(this.artifacts.values());
        return type ? all.filter(a => a.type === type) : all;
    }

    /**
     * Cost budgeting workflow
     */
    public async checkBudget(
        estimatedTokens: number,
        model: string,
        maxBudget: number = 1.0
    ): Promise<{ withinBudget: boolean; estimatedCost: number; currentCost: number }> {
        const estimation = CostTracker.calculateCost(estimatedTokens, 0, model);
        const currentCost = this.costTracker.getTotalCost();
        const totalCost = currentCost + estimation.cost;

        const withinBudget = totalCost <= maxBudget;

        if (!withinBudget) {
            console.log(chalk.red.bold('\n⚠️  Budget Warning\n'));
            console.log(chalk.yellow(`Estimated cost: $${estimation.cost.toFixed(4)}`));
            console.log(chalk.yellow(`Current total: $${currentCost.toFixed(4)}`));
            console.log(chalk.yellow(`Would exceed budget of $${maxBudget.toFixed(2)}\n`));

            const answer = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: 'Proceed anyway?',
                    default: false,
                },
            ]);

            if (!answer.proceed) {
                throw new Error('Operation cancelled due to budget constraints');
            }
        }

        return {
            withinBudget,
            estimatedCost: estimation.cost,
            currentCost,
        };
    }

    /**
     * Interactive file selection
     */
    public async selectFiles(
        files: string[],
        message: string = 'Select files to process'
    ): Promise<string[]> {
        const answer = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selected',
                message,
                choices: files,
            },
        ]);

        return answer.selected;
    }

    /**
     * Confirm action
     */
    public async confirmAction(
        message: string,
        details?: string
    ): Promise<boolean> {
        if (details) {
            console.log(chalk.gray(details));
        }

        const answer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: chalk.yellow(message),
                default: false,
            },
        ]);

        return answer.confirmed;
    }

    /**
     * Progress tracking
     */
    public createProgressTracker(steps: string[]): {
        start: (step: number) => void;
        complete: (step: number) => void;
        fail: (step: number, error: string) => void;
    } {
        let currentStep = 0;

        return {
            start: (step: number) => {
                currentStep = step;
                console.log(chalk.cyan(`\n[${step + 1}/${steps.length}] ${steps[step]}...`));
            },
            complete: (step: number) => {
                console.log(chalk.green(`✓ ${steps[step]} completed`));
            },
            fail: (step: number, error: string) => {
                console.log(chalk.red(`✗ ${steps[step]} failed: ${error}`));
            },
        };
    }

    /**
     * Get cost tracker
     */
    public getCostTracker(): CostTracker {
        return this.costTracker;
    }
}
