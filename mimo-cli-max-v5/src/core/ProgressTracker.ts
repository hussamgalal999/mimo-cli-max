import { EventEmitter } from 'events';
import { log } from '../utils/Logger.js';

export interface ProgressEvent {
    operationId: string;
    current: number;
    total: number;
    percentage: number;
    status: string;
    eta?: number;
    speed?: number;
}

export interface OperationMetrics {
    operationId: string;
    name: string;
    startTime: number;
    endTime?: number;
    totalSteps: number;
    completedSteps: number;
    status: 'pending' | 'running' | 'completed' | 'failed';
    error?: Error;
    duration?: number;
}

export class ProgressTracker extends EventEmitter {
    private operations: Map<string, OperationMetrics> = new Map();
    private lastUpdateTime: Map<string, number> = new Map();

    startOperation(operationId: string, name: string, totalSteps: number): void {
        const metrics: OperationMetrics = {
            operationId,
            name,
            startTime: Date.now(),
            totalSteps,
            completedSteps: 0,
            status: 'running'
        };

        this.operations.set(operationId, metrics);
        this.lastUpdateTime.set(operationId, Date.now());

        log.debug(`Operation started: ${name}`, { operationId, totalSteps });
        this.emit('start', { operationId, name });
    }

    updateProgress(operationId: string, completedSteps: number, status?: string): void {
        const metrics = this.operations.get(operationId);
        if (!metrics) return;

        const oldCompleted = metrics.completedSteps;
        metrics.completedSteps = Math.min(completedSteps, metrics.totalSteps);

        const event = this.createProgressEvent(metrics, status);

        const now = Date.now();
        const lastUpdate = this.lastUpdateTime.get(operationId) || now;

        if (now - lastUpdate >= 100) {
            this.emit('progress', event);
            this.lastUpdateTime.set(operationId, now);
        }

        if (metrics.completedSteps === metrics.totalSteps) {
            this.completeOperation(operationId);
        }
    }

    completeOperation(operationId: string): void {
        const metrics = this.operations.get(operationId);
        if (!metrics) return;

        metrics.status = 'completed';
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;

        log.info(`Operation completed: ${metrics.name}`, {
            operationId,
            duration: metrics.duration
        });

        this.emit('complete', { operationId, metrics });
    }

    failOperation(operationId: string, error: Error): void {
        const metrics = this.operations.get(operationId);
        if (!metrics) return;

        metrics.status = 'failed';
        metrics.error = error;
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;

        log.error(`Operation failed: ${metrics.name}`, {
            operationId,
            error: error.message,
            duration: metrics.duration
        });

        this.emit('error', { operationId, error, metrics });
    }

    private createProgressEvent(metrics: OperationMetrics, status?: string): ProgressEvent {
        const percentage = (metrics.completedSteps / metrics.totalSteps) * 100;
        const elapsed = Date.now() - metrics.startTime;
        const rate = metrics.completedSteps / (elapsed / 1000);
        const eta = rate > 0 ? ((metrics.totalSteps - metrics.completedSteps) / rate) * 1000 : undefined;

        return {
            operationId: metrics.operationId,
            current: metrics.completedSteps,
            total: metrics.totalSteps,
            percentage: Math.round(percentage),
            status: status || `${metrics.completedSteps}/${metrics.totalSteps}`,
            eta: eta ? Math.ceil(eta) : undefined,
            speed: Math.round(rate)
        };
    }

    getOperation(operationId: string): OperationMetrics | undefined {
        return this.operations.get(operationId);
    }

    getAllOperations(): OperationMetrics[] {
        return Array.from(this.operations.values());
    }

    getActiveOperations(): OperationMetrics[] {
        return Array.from(this.operations.values()).filter(
            op => op.status === 'running'
        );
    }

    getCompletedOperations(): OperationMetrics[] {
        return Array.from(this.operations.values()).filter(
            op => op.status === 'completed'
        );
    }

    getFailedOperations(): OperationMetrics[] {
        return Array.from(this.operations.values()).filter(
            op => op.status === 'failed'
        );
    }

    clearCompleted(): void {
        const toDelete: string[] = [];

        for (const [id, metrics] of this.operations) {
            if (metrics.status === 'completed') {
                toDelete.push(id);
            }
        }

        for (const id of toDelete) {
            this.operations.delete(id);
            this.lastUpdateTime.delete(id);
        }
    }

    getStats(): { total: number; running: number; completed: number; failed: number } {
        return {
            total: this.operations.size,
            running: this.getActiveOperations().length,
            completed: this.getCompletedOperations().length,
            failed: this.getFailedOperations().length
        };
    }
}
