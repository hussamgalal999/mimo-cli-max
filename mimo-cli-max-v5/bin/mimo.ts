#!/usr/bin/env node

/**
 * MIMO-CLI-MAX v5.0
 * Main Entry Point - Unified Menu System
 */

import { UnifiedMenu } from '../src/UnifiedMenu.js';
import { log } from '../src/utils/Logger.js';
import chalk from 'chalk';

/**
 * Main function
 */
async function main() {
    try {
        // Start unified menu
        const menu = new UnifiedMenu();
        await menu.start();
    } catch (error: any) {
        log.error('Fatal error', { error: error.message, stack: error.stack });
        console.error(chalk.red('\n❌ Fatal Error:'), error.message);
        process.exit(1);
    }
}

// Global Error Handlers
process.on('uncaughtException', (error: Error) => {
    log.error('Uncaught Exception', { error: error.message, stack: error.stack });
    console.error(chalk.red('\n❌ Uncaught Exception:'), error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
    log.error('Unhandled Rejection', { reason });
    console.error(chalk.red('\n❌ Unhandled Promise Rejection:'),
        reason instanceof Error ? reason.message : reason);
    process.exit(1);
});

// Run main
main().catch((error) => {
    log.error('CLI execution failed', { error });
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
});
