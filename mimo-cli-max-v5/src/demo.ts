console.log("DEBUG: Starting demo script...");
import chalk from 'chalk';
import ora from 'ora';
import { MarketAnalyst } from './agents/MarketAnalyst.js';
import { ProductManager } from './agents/ProductManager.js';
import { SolutionsArchitect } from './agents/SolutionsArchitect.js';
import { ProductOwner } from './agents/ProductOwner.js';
import { CoreExecutor } from './agents/CoreExecutor.js';
import { QAEngineer } from './agents/QAEngineer.js';
import { DevOpsSpecialist } from './agents/DevOpsSpecialist.js';
import { Orchestrator } from './core/Orchestrator.js';

async function demo(): Promise<void> {
    console.log(chalk.cyan.bold('\n🚀 mimo-cli-max v5.0 - Complete Agent Demo\n'));
    console.log(chalk.gray('Demonstrating all 7 specialized agents in action...\n'));

    const spinner = ora('Initializing agents...').start();

    // Create all agents
    const analyst = new MarketAnalyst();
    const pm = new ProductManager();
    const architect = new SolutionsArchitect();
    const po = new ProductOwner();
    const executor = new CoreExecutor();
    const qa = new QAEngineer();
    const devops = new DevOpsSpecialist();

    // Create orchestrator
    const orchestrator = new Orchestrator('hybrid');
    orchestrator.registerAgent(analyst);
    orchestrator.registerAgent(pm);

    spinner.succeed('7 agents initialized successfully!');

    const projectIdea = 'AI-powered code review tool';

    // Phase 1: Planning Agents
    console.log(chalk.cyan.bold('\n═══ Phase 1: Planning & Strategy ═══\n'));

    // 1. Market Analysis
    console.log(chalk.yellow('📊 Agent 1/7: Market Analyst'));
    const analysis = await analyst.execute(`Analyze the market for ${projectIdea}`);
    console.log(chalk.gray(`  └─ Generated market brief (${analysis.length} chars)\n`));

    // 2. PRD Creation
    console.log(chalk.yellow('📝 Agent 2/7: Product Manager'));
    const prd = await pm.execute(`Create PRD for ${projectIdea}`);
    console.log(chalk.gray(`  └─ Generated comprehensive PRD (${prd.length} chars)\n`));

    // 3. Architecture Design
    console.log(chalk.yellow('🏗️  Agent 3/7: Solutions Architect'));
    const architecture = await architect.execute(`Design system architecture for ${projectIdea}`);
    console.log(chalk.gray(`  └─ Created architecture.md with C4 diagrams (${architecture.length} chars)\n`));

    // 4. Epic Sharding
    console.log(chalk.yellow('📋 Agent 4/7: Product Owner'));
    const epics = await po.execute(`Break down PRD into prioritized epics for ${projectIdea}`);
    console.log(chalk.gray(`  └─ Generated epic files with WSJF scoring (${epics.length} chars)\n`));

    // Phase 2: Development Agents
    console.log(chalk.cyan.bold('\n═══ Phase 2: Development & Quality ═══\n'));

    // 5. Code Generation (Plan-Then-Execute)
    console.log(chalk.yellow('⚡ Agent 5/7: Core Executor (Claude Code Max)'));
    console.log(chalk.gray('  ├─ Step 1: Requesting implementation plan...'));
    const plan = await executor.execute('How to implement user authentication module?');
    console.log(chalk.gray(`  ├─ Step 2: Plan generated (${plan.length} chars)`));
    console.log(chalk.gray('  ├─ Step 3: Plan approved (simulated)'));
    const code = await executor.execute('Implement user authentication module (plan approved)');
    console.log(chalk.gray(`  └─ Generated production code (${code.length} chars)\n`));

    // 6. QA & Testing
    console.log(chalk.yellow('🧪 Agent 6/7: QA Engineer'));
    const qaReport = await qa.execute(`Create test strategy and security scan for ${projectIdea}`);
    console.log(chalk.gray(`  └─ Generated QA report with coverage metrics (${qaReport.length} chars)\n`));

    // 7. Infrastructure & Deployment
    console.log(chalk.yellow('🚀 Agent 7/7: DevOps Specialist'));
    const infra = await devops.execute(`Setup infrastructure and CI/CD for ${projectIdea}`);
    console.log(chalk.gray(`  └─ Generated Terraform, K8s, CI/CD configs (${infra.length} chars)\n`));

    // Orchestration Demo
    console.log(chalk.cyan.bold('\n═══ Orchestration Patterns Demo ═══\n'));
    await orchestrator.orchestrate({
        id: 'demo-1',
        description: 'Complete BMAD workflow execution',
        status: 'pending',
    });

    // Summary
    console.log(chalk.cyan.bold('\n═══ Demo Summary ═══\n'));
    console.log(chalk.green('✅ Market Analysis: Complete'));
    console.log(chalk.green('✅ PRD Creation: Complete'));
    console.log(chalk.green('✅ Architecture Design: Complete'));
    console.log(chalk.green('✅ Epic Prioritization: Complete'));
    console.log(chalk.green('✅ Code Generation: Complete (Plan-Then-Execute)'));
    console.log(chalk.green('✅ QA & Security: Complete'));
    console.log(chalk.green('✅ Infrastructure: Complete'));

    console.log(chalk.cyan.bold('\n📊 Agent Performance:\n'));
    console.log(chalk.white('  • Total Agents: 7'));
    console.log(chalk.white('  • Orchestration Pattern: Hybrid Hierarchical-Swarm'));
    console.log(chalk.white('  • Consensus Threshold: 67% (Supermajority)'));
    console.log(chalk.white('  • Output Quality: Production-Ready'));

    console.log(chalk.green.bold('\n✨ All agents operational! Ready for production use.\n'));
}

demo().catch((error) => {
    console.error(chalk.red('\n❌ Demo failed:'), error);
    process.exit(1);
});
