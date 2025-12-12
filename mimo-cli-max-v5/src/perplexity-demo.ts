/**
 * Perplexity Demo - Hybrid Search + Coding + Reasoning
 * Demonstrates all 8 Perplexity models and their capabilities
 */

import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { PerplexityService } from './services/PerplexityService.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.clear();

    // Header
    console.log(boxen(
        chalk.bold.cyan('🔍 PERPLEXITY HYBRID AI DEMO\n') +
        chalk.white('Search + Coding + Reasoning'),
        {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'cyan',
        }
    ));

    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey || apiKey === 'pplx-your_perplexity_key_here') {
        console.log(chalk.yellow('\n⚠️  No Perplexity API key configured'));
        console.log(chalk.white('\nTo get a FREE API key:'));
        console.log(chalk.cyan('1. Visit: https://www.perplexity.ai/settings/api'));
        console.log(chalk.cyan('2. Sign up for free'));
        console.log(chalk.cyan('3. Add to .env: PERPLEXITY_API_KEY=pplx-your-key\n'));

        console.log(chalk.bold.green('\n📊 Available Models:\n'));
        displayModels();
        return;
    }

    const service = new PerplexityService(apiKey);

    // Demo 1: Online Search
    console.log(chalk.bold.yellow('\n━━━ DEMO 1: Online Search (Real-time Web) ━━━\n'));
    await demoOnlineSearch(service);

    // Demo 2: Pure Coding (No Search)
    console.log(chalk.bold.yellow('\n━━━ DEMO 2: Pure Coding (No Search Interference) ━━━\n'));
    await demoCoding(service);

    // Demo 3: Advanced Reasoning
    console.log(chalk.bold.yellow('\n━━━ DEMO 3: Advanced Reasoning ━━━\n'));
    await demoReasoning(service);

    // Demo 4: Hybrid Search + Code
    console.log(chalk.bold.yellow('\n━━━ DEMO 4: Hybrid (Search → Code) ━━━\n'));
    await demoHybrid(service);

    // Summary
    console.log(chalk.bold.green('\n✅ All demos completed!\n'));
    displayUsageGuide();
}

async function demoOnlineSearch(service: PerplexityService) {
    const spinner = ora('Searching the web...').start();

    try {
        const result = await service.search(
            'What are the latest features in TypeScript 5.7?',
            { model: 'llama-3.1-sonar-large-128k-online' }
        );

        spinner.succeed('Search complete!');

        console.log(chalk.cyan('\n📝 Response:'));
        console.log(chalk.white(result.content.substring(0, 500) + '...'));

        if (result.citations && result.citations.length > 0) {
            console.log(chalk.cyan('\n📚 Citations:'));
            result.citations.slice(0, 3).forEach((citation, i) => {
                console.log(chalk.gray(`  ${i + 1}. ${citation}`));
            });
        }

        console.log(chalk.gray(`\n💰 Tokens: ${result.usage.totalTokens} | Model: ${result.model}`));
    } catch (error: any) {
        spinner.fail('Search failed');
        console.log(chalk.red(`Error: ${error.message}`));
    }
}

async function demoCoding(service: PerplexityService) {
    const spinner = ora('Generating code...').start();

    try {
        const result = await service.code(
            'Create a TypeScript function to validate email addresses with regex',
            { model: 'llama-3.1-sonar-large-128k-chat' }
        );

        spinner.succeed('Code generated!');

        console.log(chalk.cyan('\n💻 Generated Code:'));
        console.log(chalk.white(result.content.substring(0, 600) + '...'));
        console.log(chalk.gray(`\n💰 Tokens: ${result.usage.totalTokens} | Model: ${result.model}`));
    } catch (error: any) {
        spinner.fail('Code generation failed');
        console.log(chalk.red(`Error: ${error.message}`));
    }
}

async function demoReasoning(service: PerplexityService) {
    const spinner = ora('Deep reasoning...').start();

    try {
        const result = await service.reason(
            'Explain the time complexity of QuickSort vs MergeSort and when to use each',
            { model: 'sonar-reasoning' }
        );

        spinner.succeed('Reasoning complete!');

        console.log(chalk.cyan('\n🧠 Analysis:'));
        console.log(chalk.white(result.content.substring(0, 500) + '...'));
        console.log(chalk.gray(`\n💰 Tokens: ${result.usage.totalTokens} | Model: ${result.model}`));
    } catch (error: any) {
        spinner.fail('Reasoning failed');
        console.log(chalk.red(`Error: ${error.message}`));
    }
}

async function demoHybrid(service: PerplexityService) {
    const spinner = ora('Hybrid: Search → Code...').start();

    try {
        const result = await service.searchAndCode(
            'Create a React component using the latest React 19 features',
            'Latest React 19 features and best practices'
        );

        spinner.succeed('Hybrid task complete!');

        console.log(chalk.cyan('\n🔄 Hybrid Result:'));
        console.log(chalk.white(result.content.substring(0, 500) + '...'));
        console.log(chalk.gray(`\n💰 Tokens: ${result.usage.totalTokens} | Model: ${result.model}`));
    } catch (error: any) {
        spinner.fail('Hybrid task failed');
        console.log(chalk.red(`Error: ${error.message}`));
    }
}

function displayModels() {
    const models = [
        { name: 'Sonar Huge Online', id: 'llama-3.1-sonar-huge-128k-online', price: '$5/$5', use: 'Premium search + coding' },
        { name: 'Sonar Large Online', id: 'llama-3.1-sonar-large-128k-online', price: '$1/$1', use: 'Balanced search + coding ⭐' },
        { name: 'Sonar Small Online', id: 'llama-3.1-sonar-small-128k-online', price: '$0.2/$0.2', use: 'Fast search' },
        { name: 'Sonar Huge Chat', id: 'llama-3.1-sonar-huge-128k-chat', price: '$5/$5', use: 'Premium coding (no search)' },
        { name: 'Sonar Large Chat', id: 'llama-3.1-sonar-large-128k-chat', price: '$1/$1', use: 'Balanced coding' },
        { name: 'Sonar Small Chat', id: 'llama-3.1-sonar-small-128k-chat', price: '$0.2/$0.2', use: 'Fast coding' },
        { name: 'Sonar Pro', id: 'sonar-pro', price: '$3/$15', use: 'Advanced reasoning + search' },
        { name: 'Sonar Reasoning', id: 'sonar-reasoning', price: '$1/$5', use: 'Deep reasoning' },
    ];

    models.forEach((model, i) => {
        console.log(chalk.cyan(`${i + 1}. ${model.name}`));
        console.log(chalk.gray(`   ID: ${model.id}`));
        console.log(chalk.green(`   Price: ${model.price} per 1M tokens`));
        console.log(chalk.white(`   Use: ${model.use}\n`));
    });
}

function displayUsageGuide() {
    console.log(boxen(
        chalk.bold.white('🎯 Usage Guide\n\n') +
        chalk.cyan('1. Online Search:\n') +
        chalk.gray('   service.search("query") // Real-time web search\n\n') +
        chalk.cyan('2. Pure Coding:\n') +
        chalk.gray('   service.code("task") // No search interference\n\n') +
        chalk.cyan('3. Reasoning:\n') +
        chalk.gray('   service.reason("problem") // Deep analysis\n\n') +
        chalk.cyan('4. Hybrid:\n') +
        chalk.gray('   service.searchAndCode("task") // Search → Code\n\n') +
        chalk.cyan('5. Custom:\n') +
        chalk.gray('   service.chat(messages, { searchMode, model })'),
        {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
        }
    ));
}

main().catch(console.error);
