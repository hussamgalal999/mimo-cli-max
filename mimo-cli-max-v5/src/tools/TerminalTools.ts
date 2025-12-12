import { spawn, exec, ChildProcess } from 'child_process';
import { log } from '../utils/Logger.js';

export interface CommandResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    executionTime: number;
}

export interface ProcessInfo {
    pid: number;
    command: string;
    startTime: Date;
    status: 'running' | 'completed' | 'failed';
}

/**
 * Terminal Tools
 * Provides safe command execution with guards
 */
export class TerminalTools {
    private activeProcesses: Map<number, ProcessInfo> = new Map();
    private dangerousCommands = [
        'rm -rf /',
        'format',
        'del /f /s /q',
        'mkfs',
        ':(){:|:&};:',  // Fork bomb
    ];

    /**
     * Execute shell command with safety guards
     */
    public async executeCommand(
        command: string,
        cwd?: string,
        timeout: number = 30000
    ): Promise<CommandResult> {
        const startTime = Date.now();

        // Safety check
        if (this.isDangerousCommand(command)) {
            log.error('Dangerous command blocked', { command });
            throw new Error(`Dangerous command blocked: ${command}`);
        }

        log.debug('Executing command', { command, cwd });

        return new Promise((resolve, reject) => {
            exec(
                command,
                {
                    cwd: cwd || process.cwd(),
                    timeout,
                    maxBuffer: 1024 * 1024 * 10, // 10MB
                },
                (error, stdout, stderr) => {
                    const executionTime = Date.now() - startTime;

                    if (error) {
                        log.error('Command execution failed', {
                            command,
                            error: error.message,
                            exitCode: error.code,
                        });
                        resolve({
                            stdout: stdout.toString(),
                            stderr: stderr.toString(),
                            exitCode: error.code || 1,
                            executionTime,
                        });
                    } else {
                        log.info('Command executed successfully', {
                            command,
                            executionTime,
                        });
                        resolve({
                            stdout: stdout.toString(),
                            stderr: stderr.toString(),
                            exitCode: 0,
                            executionTime,
                        });
                    }
                }
            );
        });
    }

    /**
     * Spawn long-running process
     */
    public spawnProcess(
        command: string,
        args: string[],
        cwd?: string
    ): Promise<ProcessInfo> {
        return new Promise((resolve, reject) => {
            if (this.isDangerousCommand(command)) {
                reject(new Error(`Dangerous command blocked: ${command}`));
                return;
            }

            log.debug('Spawning process', { command, args });

            const childProcess = spawn(command, args, {
                cwd: cwd || process.cwd(),
                shell: true,
            });

            const processInfo: ProcessInfo = {
                pid: childProcess.pid!,
                command: `${command} ${args.join(' ')}`,
                startTime: new Date(),
                status: 'running',
            };

            this.activeProcesses.set(childProcess.pid!, processInfo);

            childProcess.on('error', (error) => {
                log.error('Process spawn error', { command, error: error.message });
                processInfo.status = 'failed';
                reject(error);
            });

            childProcess.on('exit', (code) => {
                log.info('Process exited', { command, exitCode: code });
                processInfo.status = code === 0 ? 'completed' : 'failed';
            });

            log.info('Process spawned', { pid: childProcess.pid, command });
            resolve(processInfo);
        });
    }

    /**
     * Get process status
     */
    public getProcessStatus(pid: number): ProcessInfo | undefined {
        return this.activeProcesses.get(pid);
    }

    /**
     * Kill process by PID
     */
    public async killProcess(pid: number): Promise<boolean> {
        try {
            log.debug('Killing process', { pid });
            process.kill(pid, 'SIGTERM');

            // Wait a bit then force kill if still running
            setTimeout(() => {
                try {
                    process.kill(pid, 'SIGKILL');
                } catch {
                    // Process already dead
                }
            }, 5000);

            this.activeProcesses.delete(pid);
            log.info('Process killed', { pid });
            return true;
        } catch (error: any) {
            log.error('Error killing process', { pid, error: error.message });
            return false;
        }
    }

    /**
     * Get list of active processes managed by this tool
     */
    public getActiveProcesses(): ProcessInfo[] {
        return Array.from(this.activeProcesses.values());
    }

    /**
     * Check if command contains dangerous patterns
     */
    private isDangerousCommand(command: string): boolean {
        const lowerCommand = command.toLowerCase().trim();

        return this.dangerousCommands.some(dangerous =>
            lowerCommand.includes(dangerous.toLowerCase())
        );
    }

    /**
     * Execute npm command (special case with verification)
     */
    public async executeNpmCommand(
        npmCommand: string,
        cwd?: string
    ): Promise<CommandResult> {
        log.debug('Executing npm command', { command: npmCommand, cwd });

        // Add npm prefix for safety
        const fullCommand = `npm ${npmCommand}`;

        return this.executeCommand(fullCommand, cwd, 120000); // 2 min timeout
    }

    /**
     * Execute git command
     */
    public async executeGitCommand(
        gitCommand: string,
        cwd?: string
    ): Promise<CommandResult> {
        log.debug('Executing git command', { command: gitCommand, cwd });

        const fullCommand = `git ${gitCommand}`;

        return this.executeCommand(fullCommand, cwd);
    }

    /**
     * Get current working directory
     */
    public getCurrentDirectory(): string {
        return process.cwd();
    }

    /**
     * Change working directory
     */
    public changeDirectory(path: string): void {
        try {
            process.chdir(path);
            log.info('Changed directory', { path });
        } catch (error: any) {
            log.error('Error changing directory', { path, error: error.message });
            throw new Error(`Failed to change directory to ${path}: ${error.message}`);
        }
    }
}
