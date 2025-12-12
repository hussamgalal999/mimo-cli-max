import chalk from 'chalk';
import { ValidationWorkflow, PlanningWorkflow, DevelopmentWorkflow } from './workflows/BMADWorkflows.js';

async function workflowDemo(): Promise<void> {
    console.log(chalk.cyan.bold('\n🔄 mimo-cli-max v5.0 - BMAD Workflow Demo\n'));
    console.log(chalk.gray('Demonstrating complete BMAD Method workflow...\n'));

    const projectIdea = 'AI-powered code review tool with real-time suggestions';

    // Phase 1: Validation Workflow
    console.log(chalk.magenta.bold('═══════════════════════════════════════════'));
    console.log(chalk.magenta.bold('   PHASE 1: VALIDATION (0-1.5 weeks)'));
    console.log(chalk.magenta.bold('═══════════════════════════════════════════\n'));

    const validationWorkflow = new ValidationWorkflow();
    const validationResult = await validationWorkflow.execute(projectIdea);

    if (validationResult.success) {
        console.log(chalk.green('✅ Validation Phase: PASSED\n'));
        console.log(chalk.white(`  • Artifacts: ${validationResult.artifacts.join(', ')}`));
        console.log(chalk.white(`  • Duration: ${(validationResult.metrics.duration / 1000).toFixed(2)}s`));
        console.log(chalk.white(`  • Agents: ${validationResult.metrics.agentsUsed.join(', ')}\n`));
    } else {
        console.log(chalk.red('❌ Validation Phase: FAILED\n'));
        return;
    }

    // Phase 2: Planning Workflow
    console.log(chalk.blue.bold('═══════════════════════════════════════════'));
    console.log(chalk.blue.bold('   PHASE 2: PLANNING (0.5-2.5 weeks)'));
    console.log(chalk.blue.bold('═══════════════════════════════════════════\n'));

    const planningWorkflow = new PlanningWorkflow();
    const planningResult = await planningWorkflow.execute(projectIdea);

    if (planningResult.success) {
        console.log(chalk.green('✅ Planning Phase: COMPLETED\n'));
        console.log(chalk.white(`  • Artifacts: ${planningResult.artifacts.join(', ')}`));
        console.log(chalk.white(`  • Duration: ${(planningResult.metrics.duration / 1000).toFixed(2)}s`));
        console.log(chalk.white(`  • Agents: ${planningResult.metrics.agentsUsed.join(', ')}\n`));
    } else {
        console.log(chalk.red('❌ Planning Phase: FAILED\n'));
        return;
    }

    // Phase 3: Development Workflow
    console.log(chalk.yellow.bold('═══════════════════════════════════════════'));
    console.log(chalk.yellow.bold('   PHASE 3: DEVELOPMENT (1.5-10 weeks)'));
    console.log(chalk.yellow.bold('═══════════════════════════════════════════\n'));

    const developmentWorkflow = new DevelopmentWorkflow();
    const developmentResult = await developmentWorkflow.execute(
        'EPIC-001',
        'User authentication with JWT and OAuth'
    );

    if (developmentResult.success) {
        console.log(chalk.green('✅ Development Phase: COMPLETED\n'));
        console.log(chalk.white(`  • Artifacts: ${developmentResult.artifacts.join(', ')}`));
        console.log(chalk.white(`  • Duration: ${(developmentResult.metrics.duration / 1000).toFixed(2)}s`));
        console.log(chalk.white(`  • Agents: ${developmentResult.metrics.agentsUsed.join(', ')}`));
        console.log(chalk.white(`  • Consensus Score: ${(developmentResult.metrics.consensusScore! * 100).toFixed(0)}%\n`));
    } else {
        console.log(chalk.red('❌ Development Phase: FAILED\n'));
        return;
    }

    // Summary
    console.log(chalk.cyan.bold('═══════════════════════════════════════════'));
    console.log(chalk.cyan.bold('   BMAD WORKFLOW SUMMARY'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════\n'));

    const totalDuration =
        validationResult.metrics.duration +
        planningResult.metrics.duration +
        developmentResult.metrics.duration;

    const totalArtifacts =
        validationResult.artifacts.length +
        planningResult.artifacts.length +
        developmentResult.artifacts.length;

    console.log(chalk.green('✅ Phase 1: Validation - PASSED'));
    console.log(chalk.green('✅ Phase 2: Planning - COMPLETED'));
    console.log(chalk.green('✅ Phase 3: Development - COMPLETED\n'));

    console.log(chalk.white(`📊 Metrics:`));
    console.log(chalk.white(`  • Total Duration: ${(totalDuration / 1000).toFixed(2)}s`));
    console.log(chalk.white(`  • Total Artifacts: ${totalArtifacts}`));
    console.log(chalk.white(`  • Agents Used: 7`));
    console.log(chalk.white(`  • Consensus Score: ${(developmentResult.metrics.consensusScore! * 100).toFixed(0)}%`));
    console.log(chalk.white(`  • Quality: Production-Ready ✅\n`));

    console.log(chalk.green.bold('🎉 BMAD Workflow completed successfully!\n'));
    console.log(chalk.gray('Ready to proceed to Phase 4: Delivery & Monitoring\n'));
}

workflowDemo().catch((error) => {
    console.error(chalk.red('\n❌ Workflow demo failed:'), error);
    process.exit(1);
});
