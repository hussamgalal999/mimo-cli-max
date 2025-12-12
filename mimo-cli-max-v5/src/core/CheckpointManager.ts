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

    /**
     * Initializes the checkpoint directory if it does not exist.
     */
    private initializeCheckpointDir(): void {
        try {
            if (!fs.existsSync(this.checkpointDir)) {
                fs.mkdirSync(this.checkpointDir, { recursive: true });
            }
        } catch (error) {
            log.warn('Failed to initialize checkpoint directory', { error });
        }
    }

    /**
     * Loads checkpoints from the specified directory.
     *
     * This function checks if the checkpoint directory exists and reads all JSON files within it.
     * For each JSON file, it parses the content into a Checkpoint object and stores it in the
     * checkpoints map using the checkpoint's ID as the key. If any errors occur during this
     * process, a warning is logged.
     */
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

    /**
     * Creates a checkpoint with the given parameters and saves it.
     */
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

    /**
     * Saves a checkpoint to a JSON file.
     */
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

    /**
     * Retrieves the latest checkpoint for a given workflow.
     *
     * The function iterates through all checkpoints and checks if the
     * checkpoint's metadata matches the provided workflowId. It keeps track
     * of the latest checkpoint based on the timestamp, returning the most
     * recent one or null if none are found.
     *
     * @param workflowId - The ID of the workflow for which to find the latest checkpoint.
     */
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

    /**
     * Retrieves checkpoints for a specific workflow and stage, sorted by timestamp.
     */
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

    /**
     * Deletes a checkpoint by its ID.
     *
     * This function constructs the file path for the checkpoint using the provided ID and checks if the file exists.
     * If the file is found, it deletes the file and removes the checkpoint from the internal collection.
     * In case of any errors during the process, it logs the error and returns false.
     *
     * @param id - The identifier of the checkpoint to be deleted.
     */
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

    /**
     * Retrieves and sorts checkpoints by timestamp, optionally filtering by workflowId.
     */
    listCheckpoints(workflowId?: string): Checkpoint[] {
        const results: Checkpoint[] = [];

        for (const checkpoint of this.checkpoints.values()) {
            if (!workflowId || checkpoint.metadata.workflowId === workflowId) {
                results.push(checkpoint);
            }
        }

        return results.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Clears all checkpoints and logs the result.
     */
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
