/**
 * MIMO Project Manager
 * Manages long-term project state, memory, and context
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { log } from '../utils/Logger.js';

export interface ProjectConfig {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    model: string;
    status: 'active' | 'paused' | 'completed';
}

export interface ConversationEntry {
    id: string;
    timestamp: Date;
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokensUsed?: number;
    model?: string;
}

export interface Checkpoint {
    id: string;
    timestamp: Date;
    description: string;
    files: string[];
    contextSnapshot: string;
}

export interface ProjectState {
    config: ProjectConfig;
    conversations: ConversationEntry[];
    checkpoints: Checkpoint[];
    artifacts: string[];
    totalTokens: number;
    totalCost: number;
}

/**
 * Project Manager - Enables months-long project development
 */
export class ProjectManager {
    private projectDir: string;
    private mimoDir: string;
    private state: ProjectState | null = null;

    constructor(projectPath: string) {
        this.projectDir = projectPath;
        this.mimoDir = path.join(projectPath, '.mimo');
    }

    /**
     * Initialize or load existing project
     */
    public async initialize(): Promise<void> {
        try {
            const exists = await this.projectExists();

            if (exists) {
                await this.loadProject();
                log.info('Project loaded', { name: this.state?.config.name });
            } else {
                log.info('No existing project found');
            }
        } catch (error: any) {
            log.error('Error initializing project', { error: error.message });
        }
    }

    /**
     * Create new project
     */
    public async createProject(name: string, description: string, model: string = 'auto'): Promise<void> {
        // Create .mimo directory
        await fs.mkdir(this.mimoDir, { recursive: true });
        await fs.mkdir(path.join(this.mimoDir, 'conversations'), { recursive: true });
        await fs.mkdir(path.join(this.mimoDir, 'checkpoints'), { recursive: true });
        await fs.mkdir(path.join(this.mimoDir, 'artifacts'), { recursive: true });

        // Initialize state
        this.state = {
            config: {
                name,
                description,
                createdAt: new Date(),
                updatedAt: new Date(),
                model,
                status: 'active',
            },
            conversations: [],
            checkpoints: [],
            artifacts: [],
            totalTokens: 0,
            totalCost: 0,
        };

        await this.saveProject();
        log.info('Project created', { name, path: this.mimoDir });
    }

    /**
     * Check if project exists
     */
    public async projectExists(): Promise<boolean> {
        try {
            await fs.access(path.join(this.mimoDir, 'project.json'));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Load existing project
     */
    public async loadProject(): Promise<void> {
        const projectFile = path.join(this.mimoDir, 'project.json');
        const content = await fs.readFile(projectFile, 'utf-8');
        this.state = JSON.parse(content);

        // Update last accessed
        if (this.state) {
            this.state.config.updatedAt = new Date();
            await this.saveProject();
        }
    }

    /**
     * Save project state
     */
    public async saveProject(): Promise<void> {
        if (!this.state) return;

        const projectFile = path.join(this.mimoDir, 'project.json');
        await fs.writeFile(projectFile, JSON.stringify(this.state, null, 2));
        log.debug('Project saved');
    }

    /**
     * Add conversation entry
     */
    public async addConversation(entry: Omit<ConversationEntry, 'id' | 'timestamp'>): Promise<void> {
        if (!this.state) return;

        const fullEntry: ConversationEntry = {
            ...entry,
            id: `conv-${Date.now()}`,
            timestamp: new Date(),
        };

        this.state.conversations.push(fullEntry);

        if (entry.tokensUsed) {
            this.state.totalTokens += entry.tokensUsed;
        }

        // Save conversation to file for long-term storage
        const convFile = path.join(
            this.mimoDir,
            'conversations',
            `${new Date().toISOString().split('T')[0]}.jsonl`
        );

        await fs.appendFile(convFile, JSON.stringify(fullEntry) + '\n');
        await this.saveProject();
    }

    /**
     * Create checkpoint (snapshot of project state)
     */
    public async createCheckpoint(description: string): Promise<Checkpoint> {
        if (!this.state) throw new Error('No project loaded');

        const checkpoint: Checkpoint = {
            id: `cp-${Date.now()}`,
            timestamp: new Date(),
            description,
            files: await this.getProjectFiles(),
            contextSnapshot: JSON.stringify(this.state.conversations.slice(-50)), // Last 50 messages
        };

        this.state.checkpoints.push(checkpoint);

        // Save checkpoint
        const checkpointFile = path.join(this.mimoDir, 'checkpoints', `${checkpoint.id}.json`);
        await fs.writeFile(checkpointFile, JSON.stringify(checkpoint, null, 2));
        await this.saveProject();

        log.info('Checkpoint created', { id: checkpoint.id, description });
        return checkpoint;
    }

    /**
     * Resume from checkpoint
     */
    public async resumeFromCheckpoint(checkpointId: string): Promise<void> {
        if (!this.state) throw new Error('No project loaded');

        const checkpoint = this.state.checkpoints.find(cp => cp.id === checkpointId);
        if (!checkpoint) throw new Error(`Checkpoint ${checkpointId} not found`);

        // Load conversation context from checkpoint
        const contextData = JSON.parse(checkpoint.contextSnapshot);
        log.info('Resumed from checkpoint', { id: checkpointId, messages: contextData.length });
    }

    /**
     * Get recent context (for AI calls)
     */
    public getRecentContext(maxMessages: number = 20): ConversationEntry[] {
        if (!this.state) return [];
        return this.state.conversations.slice(-maxMessages);
    }

    /**
     * Get project files (for context)
     */
    public async getProjectFiles(extensions: string[] = ['.ts', '.js', '.py', '.md']): Promise<string[]> {
        const files: string[] = [];

        const scanDir = async (dir: string, depth: number = 0) => {
            if (depth > 5) return; // Max depth

            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);

                    // Skip node_modules, .git, dist, etc.
                    if (['node_modules', '.git', 'dist', '.mimo'].includes(entry.name)) continue;

                    if (entry.isDirectory()) {
                        await scanDir(fullPath, depth + 1);
                    } else {
                        const ext = path.extname(entry.name);
                        if (extensions.includes(ext)) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (error) {
                // Ignore permission errors
            }
        };

        await scanDir(this.projectDir);
        return files;
    }

    /**
     * Get project summary
     */
    public getProjectSummary(): {
        name: string;
        status: string;
        duration: string;
        conversations: number;
        checkpoints: number;
        totalTokens: number;
        totalCost: number;
    } | null {
        if (!this.state) return null;

        const created = new Date(this.state.config.createdAt);
        const now = new Date();
        const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

        return {
            name: this.state.config.name,
            status: this.state.config.status,
            duration: days === 0 ? 'Today' : `${days} days`,
            conversations: this.state.conversations.length,
            checkpoints: this.state.checkpoints.length,
            totalTokens: this.state.totalTokens,
            totalCost: this.state.totalCost,
        };
    }

    /**
     * Add artifact reference
     */
    public async addArtifact(artifactPath: string): Promise<void> {
        if (!this.state) return;

        if (!this.state.artifacts.includes(artifactPath)) {
            this.state.artifacts.push(artifactPath);
            await this.saveProject();
        }
    }

    /**
     * Update project cost
     */
    public async addCost(tokens: number, cost: number): Promise<void> {
        if (!this.state) return;

        this.state.totalTokens += tokens;
        this.state.totalCost += cost;
        await this.saveProject();
    }

    /**
     * Pause project
     */
    public async pauseProject(): Promise<void> {
        if (!this.state) return;

        this.state.config.status = 'paused';
        await this.createCheckpoint('Auto-checkpoint before pause');
        await this.saveProject();

        log.info('Project paused', { name: this.state.config.name });
    }

    /**
     * Resume project
     */
    public async resumeProject(): Promise<void> {
        if (!this.state) return;

        this.state.config.status = 'active';
        this.state.config.updatedAt = new Date();
        await this.saveProject();

        log.info('Project resumed', { name: this.state.config.name });
    }

    /**
     * Complete project
     */
    public async completeProject(): Promise<void> {
        if (!this.state) return;

        this.state.config.status = 'completed';
        await this.createCheckpoint('Final checkpoint - project completed');
        await this.saveProject();

        log.info('Project completed', {
            name: this.state.config.name,
            totalTokens: this.state.totalTokens,
            totalCost: this.state.totalCost,
        });
    }

    /**
     * Get project state (for display)
     */
    public getState(): ProjectState | null {
        return this.state;
    }
}
