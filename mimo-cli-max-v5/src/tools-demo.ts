/**
 * MIMO Tools Demo
 * Showcase all available tools (FileSystem, Terminal, Browser)
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { MimoUI } from './ui/MimoUI.js';
import { ToolRegistry } from './tools/ToolRegistry.js';
import { FileSystemTools } from './tools/FileSystemTools.js';
import { TerminalTools } from './tools/TerminalTools.js';

async function toolsDemo(): Promise<void> {
    await MimoUI.showSplashScreen();

    console.log(chalk.cyan.bold('\n🛠️ MIMO Tools Demo\n'));
    console.log(chalk.gray('Demonstrating all available development tools\n'));

    const registry = new ToolRegistry({ requireApproval: false, autoApproveRead: true });
    const stats = registry.getStats();

    // Summary
    const summaryBox = boxen(
        [
            chalk.bold.yellow('📊 Tool Registry Statistics'),
            '',
            `${chalk.gray('Total Tools:')} ${chalk.white(stats.total)}`,
            `${chalk.gray('FileSystem Tools:')} ${chalk.green(stats.byCategory['filesystem'] || 0)}`,
            `${chalk.gray('Terminal Tools:')} ${chalk.blue(stats.byCategory['terminal'] || 0)}`,
            `${chalk.gray('Browser Tools:')} ${chalk.magenta(stats.byCategory['browser'] || 0)}`,
            `${chalk.gray('Require Approval:')} ${chalk.yellow(stats.requireApproval)}`,
        ].join('\n'),
        { padding: 1, borderStyle: 'round', borderColor: 'yellow' }
    );
    console.log(summaryBox);

    // FileSystem Tools Demo
    console.log(chalk.cyan.bold('\n═══ FileSystem Tools ═══\n'));

    const fsTools = registry.getToolsByCategory('filesystem');
    for (const tool of fsTools) {
        const approval = tool.requiresApproval ? chalk.yellow('⚠️') : chalk.green('✓');
        console.log(`${approval} ${chalk.white(tool.name)}`);
        console.log(`   ${chalk.gray(tool.description)}`);
    }

    // Demo: Read current directory
    console.log(chalk.yellow('\n📂 Demo: Reading current directory...\n'));
    const fsToolsInstance = new FileSystemTools();
    try {
        const files = await fsToolsInstance.listDirectory(process.cwd());
        console.log(chalk.gray(`Found ${files.length} items:`));
        files.slice(0, 5).forEach(f => console.log(`   ${chalk.cyan('→')} ${f}`));
        if (files.length > 5) console.log(chalk.gray(`   ... and ${files.length - 5} more`));
    } catch (e: any) {
        console.log(chalk.red(`Error: ${e.message}`));
    }

    // Terminal Tools Demo
    console.log(chalk.cyan.bold('\n═══ Terminal Tools ═══\n'));

    const termTools = registry.getToolsByCategory('terminal');
    for (const tool of termTools) {
        const approval = tool.requiresApproval ? chalk.yellow('⚠️') : chalk.green('✓');
        console.log(`${approval} ${chalk.white(tool.name)}`);
        console.log(`   ${chalk.gray(tool.description)}`);
    }

    // Demo: Get current directory
    console.log(chalk.yellow('\n💻 Demo: Getting current directory...\n'));
    const termToolsInstance = new TerminalTools();
    console.log(`   ${chalk.cyan('CWD:')} ${termToolsInstance.getCurrentDirectory()}`);

    // Browser Tools Demo
    console.log(chalk.cyan.bold('\n═══ Browser Tools ═══\n'));

    const browserTools = registry.getToolsByCategory('browser');
    for (const tool of browserTools) {
        const approval = tool.requiresApproval ? chalk.yellow('⚠️') : chalk.green('✓');
        console.log(`${approval} ${chalk.white(tool.name)}`);
        console.log(`   ${chalk.gray(tool.description)}`);
    }

    console.log(chalk.gray('\n💡 Browser tools require Chrome/Chromium installed.\n'));

    // Tool Definitions for AI
    console.log(chalk.cyan.bold('\n═══ AI Tool Calling Format ═══\n'));
    console.log(chalk.gray('Tool definitions can be passed to AI models for function calling:'));

    const toolDefs = registry.getToolDefinitions();
    console.log(chalk.gray(`\nTotal callable tools: ${toolDefs.length}`));
    console.log(chalk.gray('Sample tool definition:'));
    console.log(chalk.yellow(JSON.stringify(toolDefs[0], null, 2).slice(0, 300) + '...'));

    // Approval System
    console.log(chalk.cyan.bold('\n═══ Approval System ═══\n'));
    console.log(chalk.white('Tools have different approval requirements:'));
    console.log(`  ${chalk.green('✓ Auto-approved:')} Read operations (when autoApproveRead=true)`);
    console.log(`  ${chalk.yellow('⚠️ Requires approval:')} Write, delete, execute operations`);
    console.log(`  ${chalk.red('❌ Blocked:')} Dangerous commands (rm -rf /, format, etc.)`);

    console.log(chalk.green.bold('\n✨ All tools ready for use!\n'));

    console.log(chalk.gray('Try running tools with:'));
    console.log(chalk.yellow('  const result = await registry.executeTool("fs_read_file", ["/path/to/file"]);\n'));
}

toolsDemo().catch(console.error);
