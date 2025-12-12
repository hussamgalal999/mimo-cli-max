/**
 * MIMO Git Integration
 * Git operations and repository management
 */

import { TerminalTools } from '../tools/TerminalTools.js';
import { log } from '../utils/Logger.js';

export interface GitStatus {
    branch: string;
    ahead: number;
    behind: number;
    modified: string[];
    staged: string[];
    untracked: string[];
    clean: boolean;
}

export interface GitCommit {
    hash: string;
    author: string;
    date: Date;
    message: string;
}

/**
 * Git Integration for MIMO
 */
export class GitIntegration {
    private terminalTools: TerminalTools;
    private repoPath: string;

    constructor(repoPath: string = process.cwd()) {
        this.terminalTools = new TerminalTools();
        this.repoPath = repoPath;
    }

    /**
     * Get repository status
     */
    public async getStatus(): Promise<GitStatus> {
        const result = await this.terminalTools.executeGitCommand('status --porcelain -b', this.repoPath);

        const lines = result.stdout.split('\n').filter(l => l.trim());
        const branchLine = lines[0];

        // Parse branch info
        const branchMatch = branchLine.match(/## ([^\s.]+)/);
        const branch = branchMatch ? branchMatch[1] : 'unknown';

        const aheadMatch = branchLine.match(/ahead (\d+)/);
        const behindMatch = branchLine.match(/behind (\d+)/);
        const ahead = aheadMatch ? parseInt(aheadMatch[1]) : 0;
        const behind = behindMatch ? parseInt(behindMatch[1]) : 0;

        // Parse file statuses
        const modified: string[] = [];
        const staged: string[] = [];
        const untracked: string[] = [];

        lines.slice(1).forEach(line => {
            const status = line.substring(0, 2);
            const file = line.substring(3);

            if (status.includes('M')) modified.push(file);
            if (status.includes('A') || status.includes('M') && status[0] !== ' ') staged.push(file);
            if (status.includes('?')) untracked.push(file);
        });

        return {
            branch,
            ahead,
            behind,
            modified,
            staged,
            untracked,
            clean: modified.length === 0 && staged.length === 0 && untracked.length === 0,
        };
    }

    /**
     * Stage files
     */
    public async stageFiles(files: string[]): Promise<void> {
        const fileList = files.join(' ');
        await this.terminalTools.executeGitCommand(`add ${fileList}`, this.repoPath);
        log.info('Files staged', { count: files.length });
    }

    /**
     * Stage all changes
     */
    public async stageAll(): Promise<void> {
        await this.terminalTools.executeGitCommand('add .', this.repoPath);
        log.info('All changes staged');
    }

    /**
     * Commit changes
     */
    public async commit(message: string): Promise<void> {
        await this.terminalTools.executeGitCommand(`commit -m "${message}"`, this.repoPath);
        log.info('Changes committed', { message });
    }

    /**
     * Push to remote
     */
    public async push(remote: string = 'origin', branch?: string): Promise<void> {
        const branchArg = branch ? ` ${branch}` : '';
        await this.terminalTools.executeGitCommand(`push ${remote}${branchArg}`, this.repoPath);
        log.info('Pushed to remote', { remote, branch });
    }

    /**
     * Pull from remote
     */
    public async pull(remote: string = 'origin', branch?: string): Promise<void> {
        const branchArg = branch ? ` ${branch}` : '';
        await this.terminalTools.executeGitCommand(`pull ${remote}${branchArg}`, this.repoPath);
        log.info('Pulled from remote', { remote, branch });
    }

    /**
     * Create new branch
     */
    public async createBranch(branchName: string, checkout: boolean = true): Promise<void> {
        const checkoutFlag = checkout ? '-b' : '';
        await this.terminalTools.executeGitCommand(`checkout ${checkoutFlag} ${branchName}`, this.repoPath);
        log.info('Branch created', { branch: branchName, checkout });
    }

    /**
     * Switch branch
     */
    public async switchBranch(branchName: string): Promise<void> {
        await this.terminalTools.executeGitCommand(`checkout ${branchName}`, this.repoPath);
        log.info('Switched branch', { branch: branchName });
    }

    /**
     * Get commit history
     */
    public async getHistory(limit: number = 10): Promise<GitCommit[]> {
        const result = await this.terminalTools.executeGitCommand(
            `log -${limit} --pretty=format:"%H|%an|%ad|%s" --date=iso`,
            this.repoPath
        );

        const commits: GitCommit[] = [];
        const lines = result.stdout.split('\n').filter(l => l.trim());

        lines.forEach(line => {
            const [hash, author, date, message] = line.split('|');
            commits.push({
                hash,
                author,
                date: new Date(date),
                message,
            });
        });

        return commits;
    }

    /**
     * Get diff
     */
    public async getDiff(file?: string): Promise<string> {
        const fileArg = file ? ` ${file}` : '';
        const result = await this.terminalTools.executeGitCommand(`diff${fileArg}`, this.repoPath);
        return result.stdout;
    }

    /**
     * Check if repository is clean
     */
    public async isClean(): Promise<boolean> {
        const status = await this.getStatus();
        return status.clean;
    }

    /**
     * Get current branch
     */
    public async getCurrentBranch(): Promise<string> {
        const result = await this.terminalTools.executeGitCommand('branch --show-current', this.repoPath);
        return result.stdout.trim();
    }

    /**
     * Initialize git repository
     */
    public async init(): Promise<void> {
        await this.terminalTools.executeGitCommand('init', this.repoPath);
        log.info('Git repository initialized', { path: this.repoPath });
    }

    /**
     * Clone repository
     */
    public async clone(url: string, destination?: string): Promise<void> {
        const destArg = destination ? ` ${destination}` : '';
        await this.terminalTools.executeGitCommand(`clone ${url}${destArg}`, this.repoPath);
        log.info('Repository cloned', { url, destination });
    }
}
