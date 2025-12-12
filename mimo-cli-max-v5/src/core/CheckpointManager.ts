import * as fs from 'fs';
import * as path from 'path';
import { log } from '../utils/Logger.js';

export interface Checkpoint {
    id: string;
    timestamp: number;
    name: string;
    state: Record<string, any>;
    metadata: {
        workflowId: string;
        stage: string;
        progress: number;
        description: string;
    };
}

export class CheckpointManager {
    private checkpointDir: string;
    private checkpoints: Map<string, Checkpoint> = new Map();

    constructor(checkpointDir: string = '.mimo-checkpoints') {
        this.checkpointDir = path.resolve(process.cwd(), checkpointDir);
        this.initializeCheckpointDir();
        this.loadCheckpoints();
    }

    private initializeCheckpointDir(): void {
        try {
            if (!fs.existsSync(this.checkpointDir)) {
                fs.mkdirSync(this.checkpointDir, { recursive: true });
            }
        } catch (error) {
            log.warn('Failed to initialize checkpoint directory', { error });
        }
    }

    private loadCheckpoints(): void {
        try {
            if (!fs.existsSync(this.checkpointDir)) return;

            const files = fs.readdirSync(this.checkpointDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.checkpointDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const checkpoint: Checkpoint = JSON.parse(content);
                    this.checkpoints.set(checkpoint.id, checkpoint);
                }
            }

            log.info(`Loaded ${this.checkpoints.size} checkpoints`);
        } catch (error) {
            log.warn('Failed to load checkpoints', { error });
        }
    }

    createCheckpoint(
        workflowId: string,
        state: Record<string, any>,
        name: string,
        stage: string,
        progress: number
    ): string {
        const id = `${workflowId}-${Date.now()}`;

        const checkpoint: Checkpoint = {
            id,
            timestamp: Date.now(),
            name,
            state,
            metadata: {
                workflowId,
                stage,
                progress,
                description: `Checkpoint at stage: ${stage}`
            }
        };

        this.checkpoints.set(id, checkpoint);
        this.saveCheckpoint(checkpoint);

        log.info(`Checkpoint created: ${id}`, { stage, progress });
        return id;
    }

    private saveCheckpoint(checkpoint: Checkpoint): void {
        try {
            const filePath = path.join(this.checkpointDir, `${checkpoint.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(checkpoint, null, 2));
        } catch (error) {
            log.error('Failed to save checkpoint', { error });
        }
    }

    getCheckpoint(id: string): Checkpoint | null {
        const checkpoint = this.checkpoints.get(id);
        if (!checkpoint) {
            log.warn(`Checkpoint not found: ${id}`);
            return null;
        }
        return checkpoint;
    }

    getLatestCheckpoint(workflowId: string): Checkpoint | null {
        let latest: Checkpoint | null = null;

        for (const checkpoint of this.checkpoints.values()) {
            if (checkpoint.metadata.workflowId === workflowId) {
                if (!latest || checkpoint.timestamp > latest.timestamp) {
                    latest = checkpoint;
                }
            }
        }

        return latest;
    }

    getCheckpointsByStage(workflowId: string, stage: string): Checkpoint[] {
        const results: Checkpoint[] = [];

        for (const checkpoint of this.checkpoints.values()) {
            if (checkpoint.metadata.workflowId === workflowId &&
                checkpoint.metadata.stage === stage) {
                results.push(checkpoint);
            }
        }

        return results.sort((a, b) => b.timestamp - a.timestamp);
    }

    deleteCheckpoint(id: string): boolean {
        try {
            const filePath = path.join(this.checkpointDir, `${id}.json`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                this.checkpoints.delete(id);
                log.info(`Checkpoint deleted: ${id}`);
                return true;
            }
            return false;
        } catch (error) {
            log.error('Failed to delete checkpoint', { error });
            return false;
        }
    }

    deleteOldCheckpoints(workflowId: string, keepCount: number = 5): void {
        try {
            const checkpoints = Array.from(this.checkpoints.values())
                .filter(c => c.metadata.workflowId === workflowId)
                .sort((a, b) => b.timestamp - a.timestamp);

            for (let i = keepCount; i < checkpoints.length; i++) {
                this.deleteCheckpoint(checkpoints[i]!.id);
            }
        } catch (error) {
            log.warn('Failed to clean old checkpoints', { error });
        }
    }

    listCheckpoints(workflowId?: string): Checkpoint[] {
        const results: Checkpoint[] = [];

        for (const checkpoint of this.checkpoints.values()) {
            if (!workflowId || checkpoint.metadata.workflowId === workflowId) {
                results.push(checkpoint);
            }
        }

        return results.sort((a, b) => b.timestamp - a.timestamp);
    }

    clearAll(): void {
        try {
            for (const checkpoint of this.checkpoints.values()) {
                this.deleteCheckpoint(checkpoint.id);
            }
            this.checkpoints.clear();
            log.info('All checkpoints cleared');
        } catch (error) {
            log.error('Failed to clear checkpoints', { error });
        }
    }
}
