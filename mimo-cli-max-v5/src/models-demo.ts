/**
 * MIMO Models Demo
 * Showcase all available AI models in the registry
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { ModelRegistry } from './core/ModelRegistry.js';
import { MimoUI } from './ui/MimoUI.js';

async function modelsDemo(): Promise<void> {
    await MimoUI.showSplashScreen();

    console.log(chalk.cyan.bold('\n🤖 MIMO Model Encyclopedia\n'));
    console.log(chalk.gray('Complete catalog of supported AI models\n'));

    // Summary
    const providers = ModelRegistry.getProviders();
    const allModels = ModelRegistry.getAllModels();

    const summaryBox = boxen(
        [
            chalk.bold.yellow('📊 Model Registry Statistics'),
            '',
            `${chalk.gray('Total Providers:')} ${chalk.white(providers.length)}`,
            `${chalk.gray('Total Models:')} ${chalk.white(allModels.length)}`,
            `${chalk.gray('Fast Models:')} ${chalk.green(ModelRegistry.getFastModels().length)}`,
            `${chalk.gray('Premium Models:')} ${chalk.magenta(allModels.filter(m => m.quality === 'premium').length)}`,
        ].join('\n'),
        { padding: 1, borderStyle: 'round', borderColor: 'yellow' }
    );
    console.log(summaryBox);

    // Providers List
    console.log(chalk.cyan.bold('\n═══ Available Providers ═══\n'));

    for (const provider of providers) {
        const models = ModelRegistry.getModelsByProvider(provider.name.toLowerCase().replace(' ', ''));
        const modelCount = models.length || provider.models.length;

        console.log(`${chalk.bold.white(provider.name)} ${chalk.gray(`(${modelCount} models)`)}`);
        console.log(`  ${chalk.gray('Base URL:')} ${provider.baseURL}`);
        console.log(`  ${chalk.gray('API Key:')} ${chalk.yellow(provider.apiKeyEnv)}`);
        console.log('');
    }

    // Top Models by Task
    console.log(chalk.cyan.bold('\n═══ Best Models by Task ═══\n'));

    const tasks: Array<{ task: 'code' | 'chat' | 'research' | 'vision' | 'reasoning'; icon: string }> = [
        { task: 'code', icon: '💻' },
        { task: 'chat', icon: '💬' },
        { task: 'research', icon: '🔍' },
        { task: 'vision', icon: '👁️' },
        { task: 'reasoning', icon: '🧠' },
    ];

    for (const { task, icon } of tasks) {
        const models = ModelRegistry.getBestForTask(task);
        console.log(`${icon} ${chalk.bold(task.toUpperCase())}`);
        models.slice(0, 3).forEach(m => {
            console.log(`   ${chalk.cyan('→')} ${m.name} ${chalk.gray(`(${m.provider})`)}`);
        });
        console.log('');
    }

    // Cheapest Models
    console.log(chalk.cyan.bold('\n═══ Most Affordable Models ═══\n'));

    const cheapest = ModelRegistry.getCheapestModels(5);
    cheapest.forEach((m, i) => {
        const totalPrice = (m.inputPrice + m.outputPrice).toFixed(2);
        console.log(`${i + 1}. ${chalk.white(m.name)} - ${chalk.green(`$${totalPrice}/1M tokens`)}`);
    });

    // Detailed Model Info (sample)
    console.log(chalk.cyan.bold('\n═══ Featured Models ═══\n'));

    const featured = ['claude-3-5-sonnet-20241022', 'gpt-4o', 'llama-3.1-sonar-huge-128k-online'];

    for (const modelId of featured) {
        const model = ModelRegistry.getModel(modelId);
        if (!model) continue;

        const modelBox = boxen(
            [
                chalk.bold.cyan(model.name),
                '',
                `${chalk.gray('Provider:')} ${model.provider}`,
                `${chalk.gray('Context:')} ${(model.contextWindow / 1000).toFixed(0)}K tokens`,
                `${chalk.gray('Speed:')} ${model.speed === 'fast' ? chalk.green(model.speed) : chalk.yellow(model.speed)}`,
                `${chalk.gray('Quality:')} ${model.quality === 'premium' ? chalk.magenta(model.quality) : model.quality}`,
                `${chalk.gray('Price:')} $${model.inputPrice}/${model.outputPrice} per 1M tokens`,
                '',
                chalk.gray('Capabilities:'),
                `  ${model.capabilities.map(c => chalk.cyan(c)).join(', ')}`,
            ].join('\n'),
            { padding: 1, borderStyle: 'round', borderColor: 'cyan', width: 50 }
        );
        console.log(modelBox);
    }

    // Usage Instructions
    console.log(chalk.cyan.bold('\n═══ How to Use ═══\n'));
    console.log(chalk.white('1. Copy the API key environment variable name'));
    console.log(chalk.white('2. Add it to your .env file with your key'));
    console.log(chalk.white('3. MIMO will automatically detect and use it\n'));

    console.log(chalk.gray('Example .env:'));
    console.log(chalk.yellow('  PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxx'));
    console.log(chalk.yellow('  GROQ_API_KEY=gsk_xxxxxxxxxxxx'));
    console.log(chalk.yellow('  OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx\n'));

    console.log(chalk.green.bold('✨ All models ready for integration!\n'));
}

modelsDemo().catch(console.error);
