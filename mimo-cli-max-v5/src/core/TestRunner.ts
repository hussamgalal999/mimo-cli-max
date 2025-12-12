/**
 * MIMO Test Runner
 * Automated testing with multiple frameworks
 */

import { TerminalTools, CommandResult } from '../tools/TerminalTools.js';
import { FileSystemTools } from '../tools/FileSystemTools.js';
import { log } from '../utils/Logger.js';

export interface TestResult {
    framework: string;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    coverage?: number;
    output: string;
}

export interface TestConfig {
    framework: 'jest' | 'mocha' | 'vitest' | 'playwright' | 'cypress';
    testDir?: string;
    coverage?: boolean;
    watch?: boolean;
}

/**
 * Automated Test Runner
 */
export class TestRunner {
    private terminalTools: TerminalTools;
    private fileSystemTools: FileSystemTools;
    private projectPath: string;

    constructor(projectPath: string = process.cwd()) {
        this.terminalTools = new TerminalTools();
        this.fileSystemTools = new FileSystemTools();
        this.projectPath = projectPath;
    }

    /**
     * Run tests with specified framework
     */
    public async runTests(config: TestConfig): Promise<TestResult> {
        log.info('Running tests', { framework: config.framework });
        const startTime = Date.now();

        let command: string;
        let result: CommandResult;

        switch (config.framework) {
            case 'jest':
                command = this.buildJestCommand(config);
                result = await this.terminalTools.executeNpmCommand(command, this.projectPath);
                break;
            case 'mocha':
                command = this.buildMochaCommand(config);
                result = await this.terminalTools.executeNpmCommand(command, this.projectPath);
                break;
            case 'vitest':
                command = this.buildVitestCommand(config);
                result = await this.terminalTools.executeNpmCommand(command, this.projectPath);
                break;
            case 'playwright':
                command = 'run playwright test';
                result = await this.terminalTools.executeNpmCommand(command, this.projectPath);
                break;
            case 'cypress':
                command = 'run cypress run';
                result = await this.terminalTools.executeNpmCommand(command, this.projectPath);
                break;
            default:
                throw new Error(`Unsupported test framework: ${config.framework}`);
        }

        const duration = Date.now() - startTime;
        return this.parseTestResults(config.framework, result, duration);
    }

    /**
     * Detect test framework from package.json
     */
    public async detectFramework(): Promise<string | null> {
        try {
            const packageJson = await this.fileSystemTools.readFile(`${this.projectPath}/package.json`);
            const pkg = JSON.parse(packageJson);

            const devDeps = pkg.devDependencies || {};
            const deps = pkg.dependencies || {};

            if (devDeps.jest || deps.jest) return 'jest';
            if (devDeps.vitest || deps.vitest) return 'vitest';
            if (devDeps.mocha || deps.mocha) return 'mocha';
            if (devDeps.playwright || deps.playwright) return 'playwright';
            if (devDeps.cypress || deps.cypress) return 'cypress';

            return null;
        } catch (error) {
            log.warn('Could not detect test framework', { error });
            return null;
        }
    }

    /**
     * Run tests with coverage
     */
    public async runWithCoverage(framework: 'jest' | 'vitest' = 'jest'): Promise<TestResult> {
        return this.runTests({ framework, coverage: true });
    }

    /**
     * Run tests in watch mode
     */
    public async runWatch(framework: 'jest' | 'vitest' = 'jest'): Promise<void> {
        const command = framework === 'jest' ? 'run jest --watch' : 'run vitest --watch';
        await this.terminalTools.executeNpmCommand(command, this.projectPath);
    }

    /**
     * Run specific test file
     */
    public async runTestFile(filePath: string, framework: string = 'jest'): Promise<TestResult> {
        const command = `run ${framework} ${filePath}`;
        const result = await this.terminalTools.executeNpmCommand(command, this.projectPath);
        return this.parseTestResults(framework, result, 0);
    }

    /**
     * Build Jest command
     */
    private buildJestCommand(config: TestConfig): string {
        let cmd = 'run jest';
        if (config.coverage) cmd += ' --coverage';
        if (config.watch) cmd += ' --watch';
        if (config.testDir) cmd += ` ${config.testDir}`;
        return cmd;
    }

    /**
     * Build Mocha command
     */
    private buildMochaCommand(config: TestConfig): string {
        let cmd = 'run mocha';
        if (config.testDir) cmd += ` ${config.testDir}`;
        return cmd;
    }

    /**
     * Build Vitest command
     */
    private buildVitestCommand(config: TestConfig): string {
        let cmd = 'run vitest run';
        if (config.coverage) cmd += ' --coverage';
        if (config.watch) cmd += ' --watch';
        return cmd;
    }

    /**
     * Parse test results from output
     */
    private parseTestResults(framework: string, result: CommandResult, duration: number): TestResult {
        const output = result.stdout + result.stderr;

        // Jest/Vitest format
        const jestMatch = output.match(/Tests:\s+(\d+)\s+passed.*?(\d+)\s+failed.*?(\d+)\s+total/);
        if (jestMatch) {
            return {
                framework,
                passed: parseInt(jestMatch[1]),
                failed: parseInt(jestMatch[2]),
                skipped: parseInt(jestMatch[3]) - parseInt(jestMatch[1]) - parseInt(jestMatch[2]),
                duration,
                output,
            };
        }

        // Mocha format
        const mochaMatch = output.match(/(\d+)\s+passing.*?(\d+)\s+failing/);
        if (mochaMatch) {
            return {
                framework,
                passed: parseInt(mochaMatch[1]),
                failed: parseInt(mochaMatch[2]),
                skipped: 0,
                duration,
                output,
            };
        }

        // Fallback - parse from exit code
        return {
            framework,
            passed: result.exitCode === 0 ? 1 : 0,
            failed: result.exitCode === 0 ? 0 : 1,
            skipped: 0,
            duration,
            output,
        };
    }

    /**
     * Get coverage report
     */
    public async getCoverageReport(): Promise<string | null> {
        const coveragePath = `${this.projectPath}/coverage/lcov-report/index.html`;

        try {
            const exists = await this.fileSystemTools.exists(coveragePath);
            if (exists) {
                return coveragePath;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}
