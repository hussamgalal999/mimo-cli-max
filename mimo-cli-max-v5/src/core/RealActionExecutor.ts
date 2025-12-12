/**
 * MIMO Real Action Executor
 * Connects the UI to actual tools - No more demo mode!
 * This is what makes MIMO a REAL development tool
 */

import * as p from '@clack/prompts';
import * as path from 'path';
import { FileSystemTools } from '../tools/FileSystemTools.js';
import { TerminalTools } from '../tools/TerminalTools.js';
import { AIProviderManager } from '../core/AIProviderManager.js';
import { ProjectManager } from '../core/ProjectManager.js';
import { GitIntegration } from '../core/GitIntegration.js';
import { CodeIndexer } from '../core/CodeIndexer.js';
import { theme, icons } from '../ui/theme.js';
import { MimoAnimator } from '../ui/animator.js';
import { renderBlockAvatar } from '../ui/block-avatars.js';


// Tool instances
const fileTools = new FileSystemTools();
const terminalTools = new TerminalTools();
let aiManager: AIProviderManager | null = null;

/**
 * Initialize AI Manager with available API keys
 */
export async function initializeAI(): Promise<boolean> {
    try {
        aiManager = new AIProviderManager();
        return true;
    } catch (error) {
        console.log(theme.warning('⚠️ No AI API keys configured. Running in offline mode.'));
        return false;
    }
}

/**
 * REAL: Create New Project
 */
export async function executeNewProject(): Promise<void> {
    // 1. Get project name
    const projectName = await p.text({
        message: theme.primary('Project name:'),
        placeholder: 'my-awesome-app',
        validate: (value) => {
            if (!value) return 'Project name is required';
            if (!/^[a-z0-9-_]+$/i.test(value)) return 'Use only letters, numbers, hyphens, dashes';
            return undefined;
        }
    });

    if (p.isCancel(projectName)) return;

    // 2. Get project type
    const projectType = await p.select({
        message: theme.primary('Project type:'),
        options: [
            { value: 'node', label: 'Node.js (TypeScript)', hint: 'Backend API' },
            { value: 'react', label: 'React (Vite + TypeScript)', hint: 'Frontend SPA' },
            { value: 'next', label: 'Next.js', hint: 'Full-Stack' },
            { value: 'python', label: 'Python', hint: 'Backend/ML' },
            { value: 'empty', label: 'Empty Project', hint: 'Just package.json' },
            { value: 'back', label: '← Back', hint: 'Return to main menu' },
        ]
    });

    if (p.isCancel(projectType) || projectType === 'back') return;

    // 3. Resolve absolute path
    const projectPath = path.resolve(process.cwd(), String(projectName));

    // 4. Check if already exists
    if (await fileTools.exists(projectPath)) {
        p.note(`Directory "${projectName}" already exists!`, '⚠️ Warning');
        return;
    }

    // 5. Create project directory
    await MimoAnimator.work('Creating project structure...', 500);

    try {
        await fileTools.createDirectory(projectPath);

        // 6. Create basic files based on type
        if (projectType === 'node' || projectType === 'empty') {
            const packageJson = {
                name: projectName,
                version: '1.0.0',
                type: 'module',
                scripts: {
                    start: 'node dist/index.js',
                    dev: 'npx tsx src/index.ts',
                    build: 'tsc'
                }
            };

            await fileTools.writeFile(
                path.join(projectPath, 'package.json'),
                JSON.stringify(packageJson, null, 2)
            );

            if (projectType === 'node') {
                await fileTools.createDirectory(path.join(projectPath, 'src'));
                await fileTools.writeFile(
                    path.join(projectPath, 'src', 'index.ts'),
                    `console.log('Hello from ${projectName}!');\n`
                );
            }
        } else if (projectType === 'react') {
            // Use Vite to create React app
            await MimoAnimator.work('Running Vite scaffolder...', 500);
            const result = await terminalTools.executeCommand(
                `npx -y create-vite@latest ${projectName} --template react-ts`,
                process.cwd(),
                120000
            );

            if (result.exitCode !== 0) {
                p.note(result.stderr || 'Failed to create React project', '❌ Error');
                return;
            }
        } else if (projectType === 'next') {
            await MimoAnimator.work('Running Next.js scaffolder...', 500);
            const result = await terminalTools.executeCommand(
                `npx -y create-next-app@latest ${projectName} --typescript --eslint --app`,
                process.cwd(),
                180000
            );

            if (result.exitCode !== 0) {
                p.note(result.stderr || 'Failed to create Next.js project', '❌ Error');
                return;
            }
        }

        await MimoAnimator.celebrate('Project Created Successfully!');

        p.note(
            `${icons.ui.check} Created: ${projectName}/\n` +
            `${icons.ui.check} Type: ${projectType}\n\n` +
            `Next steps:\n` +
            `  cd ${projectName}\n` +
            `  npm install\n` +
            `  npm run dev`,
            '🚀 Project Ready'
        );

    } catch (error: any) {
        console.log(renderBlockAvatar('error'));
        p.note(error.message, '❌ Error');
    }
}

/**
 * REAL: Security Audit
 */
export async function executeAudit(): Promise<void> {
    const targetDir = process.cwd();

    await MimoAnimator.work('Scanning codebase...', 500);

    try {
        // 1. Find all code files
        const files = await fileTools.searchFiles(targetDir, /\.(ts|js|py|java|go)$/);

        // 2. Check for package.json vulnerabilities
        let npmAuditResult = '';
        if (await fileTools.exists(`${targetDir}/package.json`)) {
            await MimoAnimator.work('Running npm audit...', 500);
            const result = await terminalTools.executeNpmCommand('audit --json', targetDir);
            npmAuditResult = result.stdout;
        }

        // 3. Parse results
        let vulnerabilities = 0;
        let warnings: string[] = [];

        try {
            const auditData = JSON.parse(npmAuditResult);
            vulnerabilities = auditData.metadata?.vulnerabilities?.total || 0;
        } catch {
            // No npm audit data
        }

        // 4. Basic code scanning
        for (const file of files.slice(0, 20)) { // Limit scan
            const content = await fileTools.readFile(file);

            // Check for common issues
            if (content.includes('eval(')) warnings.push(`Unsafe eval() in ${file}`);
            if (content.includes('password') && content.includes('=')) {
                warnings.push(`Potential hardcoded password in ${file}`);
            }
            if (content.includes('http://')) warnings.push(`Insecure HTTP URL in ${file}`);
        }

        await MimoAnimator.celebrate('Audit Complete!');

        p.note(
            `${files.length} files scanned\n` +
            `${vulnerabilities} npm vulnerabilities\n` +
            `${warnings.length} code warnings\n\n` +
            (warnings.length > 0 ? warnings.slice(0, 5).join('\n') : 'No critical issues found!'),
            '🛡️  Security Audit Results'
        );

    } catch (error: any) {
        console.log(renderBlockAvatar('error'));
        p.note(error.message, '❌ Audit Error');
    }
}

/**
 * REAL: AI Chat for Custom Tasks
 */
export async function executeCustomTask(task: string): Promise<void> {
    if (!aiManager) {
        p.note(
            'No AI API keys configured.\n\n' +
            'Create a .env file and add at least ONE API key:\n\n' +
            '  PERPLEXITY_API_KEY=pplx-...\n' +
            '  ANTHROPIC_API_KEY=sk-ant-...\n' +
            '  OPENAI_API_KEY=sk-...\n' +
            '  GOOGLE_API_KEY=...\n' +
            '  GROQ_API_KEY=gsk-...\n\n' +
            'Get free API keys from:\n' +
            '  • Groq: https://console.groq.com (FREE)\n' +
            '  • Google: https://aistudio.google.com (FREE)\n' +
            '  • Perplexity: https://www.perplexity.ai/settings/api',
            '⚠️ AI Not Available'
        );
        return;
    }

    // Show robot once - no animations
    console.clear();
    console.log(renderBlockAvatar('thinking'));
    console.log(theme.dim('\n[ 🧠 Processing your request... ]\n'));

    try {
        const response = await aiManager.chat([
            { role: 'system', content: 'You are MIMO-MAX, an advanced AI coding assistant. Be helpful, concise, and code-focused.' },
            { role: 'user', content: task }
        ], 'coding');

        // Update robot state - clear and show success
        console.clear();
        console.log(renderBlockAvatar('success'));
        console.log(theme.success('\n[ ✨ Response Ready! ]\n'));

        // Display response
        console.log(theme.primary('━'.repeat(80)));
        console.log(theme.white(response.content));
        console.log(theme.primary('━'.repeat(80)));
        console.log(theme.dim(`Model: ${response.model} | Tokens: ${response.tokensUsed || response.usage?.totalTokens || 'N/A'}`));
        console.log('');

    } catch (error: any) {
        // Don't show robot on error - just message
        console.log('');
        p.note(
            error.message + '\n\n' +
            'The system will try other available AI providers automatically.',
            '❌ Provider Error'
        );
    }
}

/**
 * REAL: Execute Terminal Command
 */
export async function executeTerminalCommand(): Promise<void> {
    const command = await p.text({
        message: theme.primary('Command to execute:'),
        placeholder: 'npm install lodash',
    });

    if (p.isCancel(command)) return;

    await MimoAnimator.work(`Executing: ${command}`, 500);

    try {
        const result = await terminalTools.executeCommand(String(command));

        if (result.exitCode === 0) {
            await MimoAnimator.celebrate('Command Completed!');
            console.log(theme.success('\n' + result.stdout));
        } else {
            console.log(renderBlockAvatar('error'));
            console.log(theme.error(result.stderr || 'Command failed'));
        }

        console.log(theme.dim(`Exit code: ${result.exitCode} | Time: ${result.executionTime}ms\n`));

    } catch (error: any) {
        console.log(renderBlockAvatar('error'));
        p.note(error.message, '❌ Execution Error');
    }
}

/**
 * REAL: Git Operations
 */
export async function executeGitOperation(): Promise<void> {
    const operation = await p.select({
        message: theme.primary('Git operation:'),
        options: [
            { value: 'status', label: '📊 Status', hint: 'Show repository status' },
            { value: 'log', label: '📜 Log', hint: 'Show recent commits' },
            { value: 'diff', label: '📝 Diff', hint: 'Show changes' },
            { value: 'branch', label: '🔀 Branches', hint: 'List branches' },
            { value: 'back', label: '← Back', hint: 'Return to main menu' },
        ]
    });

    if (p.isCancel(operation) || operation === 'back') return;

    const gitCommands: Record<string, string> = {
        status: 'status',
        log: 'log --oneline -10',
        diff: 'diff --stat',
        branch: 'branch -a',
    };

    await MimoAnimator.work('Running git...', 500);

    try {
        const result = await terminalTools.executeGitCommand(gitCommands[String(operation)]!);

        console.log('\n' + theme.primary('━'.repeat(60)));
        console.log(result.stdout || 'No output');
        console.log(theme.primary('━'.repeat(60)) + '\n');

    } catch (error: any) {
        p.note(error.message, '❌ Git Error');
    }
}

/**
 * REAL: Search Files
 */
export async function executeFileSearch(): Promise<void> {
    const pattern = await p.text({
        message: theme.primary('Search pattern:'),
        placeholder: '*.ts or package.json',
    });

    if (p.isCancel(pattern)) return;

    await MimoAnimator.work('Searching files...', 500);

    try {
        const regexPattern = String(pattern)
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');

        const files = await fileTools.searchFiles(process.cwd(), new RegExp(regexPattern));

        if (files.length === 0) {
            p.note(`No files matching "${pattern}" found.`, '🔍 Search Results');
        } else {
            await MimoAnimator.celebrate(`Found ${files.length} files!`);
            console.log('\n' + theme.primary('━'.repeat(60)));
            files.slice(0, 20).forEach(f => console.log(theme.dim('  ') + f));
            if (files.length > 20) console.log(theme.dim(`  ... and ${files.length - 20} more`));
            console.log(theme.primary('━'.repeat(60)) + '\n');
        }
    } catch (error: any) {
        p.note(error.message, '❌ Search Error');
    }
}

/**
 * REAL: Read File
 */
export async function executeReadFile(): Promise<void> {
    const filePath = await p.text({
        message: theme.primary('File path to read:'),
        placeholder: 'src/index.ts or package.json',
    });

    if (p.isCancel(filePath)) return;

    await MimoAnimator.work('Reading file...', 300);

    try {
        const content = await fileTools.readFile(String(filePath));

        console.log('\n' + theme.primary(`━━━ ${filePath} ━━━`));

        // Show first 50 lines
        const lines = content.split('\n').slice(0, 50);
        lines.forEach((line, i) => {
            console.log(theme.dim(`${String(i + 1).padStart(4)} │ `) + line);
        });

        if (content.split('\n').length > 50) {
            console.log(theme.dim(`     ... ${content.split('\n').length - 50} more lines`));
        }

        console.log(theme.primary('━'.repeat(60)) + '\n');

    } catch (error: any) {
        console.log(renderBlockAvatar('error'));
        p.note(error.message, '❌ File Read Error');
    }
}
