import chalk from 'chalk';
import boxen from 'boxen';
import { diffLines, Change } from 'diff';
import inquirer from 'inquirer';
import { log } from '../utils/Logger.js';

export interface DiffViewOptions {
    showLineNumbers?: boolean;
    contextLines?: number;
    colorized?: boolean;
}

export interface DiffApproval {
    approved: boolean;
    comment?: string;
}

/**
 * Diff Viewer
 * Display code diffs with approval workflow
 */
export class DiffViewer {
    /**
     * Display unified diff with colors
     */
    public static displayDiff(
        fileName: string,
        oldContent: string,
        newContent: string,
        options?: DiffViewOptions
    ): void {
        const showLineNumbers = options?.showLineNumbers ?? true;
        const colorized = options?.colorized ?? true;

        console.log(chalk.bold.cyan(`\n╔═══ Diff: ${fileName} ═══╗\n`));

        const changes: Change[] = diffLines(oldContent, newContent);
        let oldLineNum = 1;
        let newLineNum = 1;

        changes.forEach((change) => {
            const lines = change.value.split('\n').filter((line) => line !== '');

            lines.forEach((line) => {
                let prefix = ' ';
                let color = chalk.white;
                let lineNumber = '';

                if (change.added) {
                    prefix = '+';
                    color = colorized ? chalk.green : chalk.white;
                    lineNumber = showLineNumbers ? chalk.gray(`${newLineNum}`.padStart(4)) : '';
                    newLineNum++;
                } else if (change.removed) {
                    prefix = '-';
                    color = colorized ? chalk.red : chalk.white;
                    lineNumber = showLineNumbers ? chalk.gray(`${oldLineNum}`.padStart(4)) : '';
                    oldLineNum++;
                } else {
                    prefix = ' ';
                    color = chalk.gray;
                    lineNumber = showLineNumbers ? chalk.gray(`${oldLineNum}`.padStart(4)) : '';
                    oldLineNum++;
                    newLineNum++;
                }

                const formattedLine = showLineNumbers
                    ? `${lineNumber} ${prefix} ${line}`
                    : `${prefix} ${line}`;

                console.log(color(formattedLine));
            });
        });

        console.log(chalk.bold.cyan(`\n╚═════════════════════════╝\n`));
    }

    /**
     * Display side-by-side comparison
     */
    public static displaySideBySide(
        fileName: string,
        oldContent: string,
        newContent: string,
        maxWidth: number = 80
    ): void {
        console.log(chalk.bold.cyan(`\n╔═══ Side-by-Side: ${fileName} ═══╗\n`));

        const oldLines = oldContent.split('\n');
        const newLines = newContent.split('\n');
        const maxLines = Math.max(oldLines.length, newLines.length);
        const columnWidth = Math.floor(maxWidth / 2) - 3;

        // Header
        console.log(
            chalk.bold.red('ORIGINAL'.padEnd(columnWidth)) +
            chalk.gray(' │ ') +
            chalk.bold.green('MODIFIED'.padEnd(columnWidth))
        );
        console.log(chalk.gray('─'.repeat(columnWidth) + '─┼─' + '─'.repeat(columnWidth)));

        for (let i = 0; i < maxLines; i++) {
            const oldLine = (oldLines[i] || '').substring(0, columnWidth).padEnd(columnWidth);
            const newLine = (newLines[i] || '').substring(0, columnWidth).padEnd(columnWidth);

            const oldColor = oldLines[i] !== newLines[i] ? chalk.red : chalk.gray;
            const newColor = oldLines[i] !== newLines[i] ? chalk.green : chalk.gray;

            console.log(
                oldColor(oldLine) +
                chalk.gray(' │ ') +
                newColor(newLine)
            );
        }

        console.log(chalk.bold.cyan(`\n╚═════════════════════════════╝\n`));
    }

    /**
     * Show diff and request approval
     */
    public static async showDiffApproval(
        fileName: string,
        oldContent: string,
        newContent: string,
        options?: DiffViewOptions
    ): Promise<DiffApproval> {
        // Display diff
        this.displayDiff(fileName, oldContent, newContent, options);

        // Calculate stats
        const changes = diffLines(oldContent, newContent);
        const additions = changes.filter((c) => c.added).reduce((sum, c) => sum + c.value.split('\n').length - 1, 0);
        const deletions = changes.filter((c) => c.removed).reduce((sum, c) => sum + c.value.split('\n').length - 1, 0);

        console.log(
            chalk.gray(`  Changes: `) +
            chalk.green(`+${additions}`) +
            chalk.gray(' / ') +
            chalk.red(`-${deletions}`) +
            chalk.gray(' lines\n')
        );

        // Request approval
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'approved',
                message: chalk.yellow(`Apply changes to ${fileName}?`),
                default: false,
            },
            {
                type: 'input',
                name: 'comment',
                message: 'Optional comment:',
                when: (answers) => !answers.approved,
            },
        ]);

        log.info('Diff approval', {
            fileName,
            approved: answers.approved,
            additions,
            deletions,
        });

        return {
            approved: answers.approved,
            comment: answers.comment,
        };
    }

    /**
     * Display diff summary
     */
    public static displayDiffSummary(
        files: Array<{
            name: string;
            additions: number;
            deletions: number;
        }>
    ): void {
        console.log(chalk.bold.cyan('\n╔═══ Diff Summary ═══╗\n'));

        files.forEach((file) => {
            const stats =
                chalk.green(`+${file.additions}`.padStart(6)) +
                chalk.gray(' / ') +
                chalk.red(`-${file.deletions}`.padEnd(6));

            console.log(`  ${stats}  ${chalk.white(file.name)}`);
        });

        const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
        const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

        console.log(chalk.gray('\n  ─────────────────────'));
        console.log(
            `  ${chalk.bold.green(`+${totalAdditions}`.padStart(6))}` +
            chalk.gray(' / ') +
            `${chalk.bold.red(`-${totalDeletions}`.padEnd(6))}  ${chalk.bold('TOTAL')}`
        );

        console.log(chalk.bold.cyan('\n╚═════════════════════╝\n'));
    }

    /**
     * Format diff for terminal output
     */
    public static formatDiffForTerminal(
        oldContent: string,
        newContent: string
    ): string {
        const changes = diffLines(oldContent, newContent);
        let output = '';

        changes.forEach((change) => {
            const prefix = change.added ? '+ ' : change.removed ? '- ' : '  ';
            const lines = change.value.split('\n').filter((line) => line !== '');
            lines.forEach((line) => {
                output += `${prefix}${line}\n`;
            });
        });

        return output;
    }
}
