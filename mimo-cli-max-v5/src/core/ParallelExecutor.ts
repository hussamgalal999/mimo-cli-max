import { log } from '../utils/Logger.js';

export interface Task<T = any> {
    id: string;
    name: string;
    execute: () => Promise<T>;
    dependencies?: string[];
    priority?: number;
}

export interface TaskResult<T = any> {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: T;
    error?: Error;
    duration: number;
    startTime: number;
    endTime?: number;
}

export class ParallelExecutor {
    private tasks: Map<string, Task> = new Map();
    private results: Map<string, TaskResult> = new Map();
    private concurrency: number;

    constructor(concurrency: number = 4) {
        this.concurrency = concurrency;
    }

    addTask<T>(task: Task<T>): void {
        this.tasks.set(task.id, task);
        this.results.set(task.id, {
            id: task.id,
            name: task.name,
            status: 'pending',
            duration: 0,
            startTime: 0
        });
    }

    async execute(): Promise<Map<string, TaskResult>> {
        const executing: Set<string> = new Set();
        const completed: Set<string> = new Set();
        const failed: Set<string> = new Set();

        while (completed.size + failed.size < this.tasks.size) {
            const availableTasks = this.getAvailableTasks(completed, failed);
            const tasksToStart = availableTasks.filter(() => executing.size < this.concurrency);

            if (tasksToStart.length === 0 && executing.size === 0) {
                break;
            }

            for (const taskId of tasksToStart) {
                executing.add(taskId);
                this.executeTask(taskId).then(() => {
                    executing.delete(taskId);
                    completed.add(taskId);
                }).catch(() => {
                    executing.delete(taskId);
                    failed.add(taskId);
                });
            }

            await new Promise(resolve => setTimeout(resolve, 10));
        }

        return this.results;
    }

    private getAvailableTasks(completed: Set<string>, failed: Set<string>): string[] {
        const available: string[] = [];

        for (const [taskId, task] of this.tasks) {
            if (completed.has(taskId) || failed.has(taskId)) continue;

            const result = this.results.get(taskId);
            if (result?.status !== 'pending') continue;

            const dependenciesMet = !task.dependencies || task.dependencies.every(
                depId => completed.has(depId)
            );

            if (dependenciesMet) {
                available.push(taskId);
            }
        }

        available.sort((a, b) => {
            const priorityA = this.tasks.get(a)?.priority || 0;
            const priorityB = this.tasks.get(b)?.priority || 0;
            return priorityB - priorityA;
        });

        return available;
    }

    private async executeTask(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        const result = this.results.get(taskId);

        if (!task || !result) return;

        result.status = 'running';
        result.startTime = Date.now();

        try {
            log.debug(`Task started: ${task.name}`);
            result.result = await task.execute();
            result.status = 'completed';
            log.debug(`Task completed: ${task.name}`);
        } catch (error) {
            result.status = 'failed';
            result.error = error instanceof Error ? error : new Error(String(error));
            log.error(`Task failed: ${task.name}`, { error: result.error.message });
        } finally {
            result.endTime = Date.now();
            result.duration = result.endTime - result.startTime;
        }
    }

    getResult(taskId: string): TaskResult | undefined {
        return this.results.get(taskId);
    }

    getAllResults(): TaskResult[] {
        return Array.from(this.results.values());
    }

    getSuccessfulResults(): TaskResult[] {
        return Array.from(this.results.values()).filter(r => r.status === 'completed');
    }

    getFailedResults(): TaskResult[] {
        return Array.from(this.results.values()).filter(r => r.status === 'failed');
    }

    getTotalDuration(): number {
        let maxDuration = 0;
        for (const result of this.results.values()) {
            if (result.duration > maxDuration) {
                maxDuration = result.duration;
            }
        }
        return maxDuration;
    }
}
