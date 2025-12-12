import { log } from '../utils/Logger.js';

export interface RecoveryStrategy {
    name: string;
    maxRetries: number;
    backoffMs: number;
    exponentialBackoff: boolean;
    shouldRetry: (error: Error) => boolean;
}

export interface RecoveryResult {
    success: boolean;
    attempts: number;
    finalError?: Error;
    recoveredValue?: any;
}

export class ErrorRecovery {
    private strategies: Map<string, RecoveryStrategy> = new Map();
    private defaultStrategy: RecoveryStrategy;

    constructor() {
        this.defaultStrategy = {
            name: 'default',
            maxRetries: 3,
            backoffMs: 1000,
            exponentialBackoff: true,
            shouldRetry: (error) => {
                const retriableErrors = [
                    'ECONNREFUSED',
                    'ETIMEDOUT',
                    'ENOTFOUND',
                    'rate_limit',
                    'timeout'
                ];
                return retriableErrors.some(msg => error.message.toLowerCase().includes(msg));
            }
        };

        this.registerDefaultStrategies();
    }

    private registerDefaultStrategies(): void {
        this.strategies.set('api_call', {
            name: 'api_call',
            maxRetries: 5,
            backoffMs: 1000,
            exponentialBackoff: true,
            shouldRetry: (error) => {
                const retriableErrors = ['rate_limit', 'timeout', 'ECONNREFUSED'];
                return retriableErrors.some(msg => error.message.toLowerCase().includes(msg));
            }
        });

        this.strategies.set('file_operation', {
            name: 'file_operation',
            maxRetries: 3,
            backoffMs: 500,
            exponentialBackoff: false,
            shouldRetry: (error) => {
                const retriableErrors = ['EACCES', 'EAGAIN', 'EBUSY'];
                return retriableErrors.some(msg => error.message.includes(msg));
            }
        });

        this.strategies.set('network', {
            name: 'network',
            maxRetries: 4,
            backoffMs: 2000,
            exponentialBackoff: true,
            shouldRetry: () => true
        });
    }

    registerStrategy(strategy: RecoveryStrategy): void {
        this.strategies.set(strategy.name, strategy);
    }

    async executeWithRecovery<T>(
        operation: () => Promise<T>,
        strategyName?: string
    ): Promise<RecoveryResult> {
        const strategy = strategyName ? this.strategies.get(strategyName) : this.defaultStrategy;
        if (!strategy) {
            throw new Error(`Strategy not found: ${strategyName}`);
        }

        let attempts = 0;
        let lastError: Error | undefined;

        for (attempts = 1; attempts <= strategy.maxRetries; attempts++) {
            try {
                const result = await operation();
                log.debug(`Operation succeeded on attempt ${attempts}`);
                return { success: true, attempts, recoveredValue: result };
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                if (!strategy.shouldRetry(lastError)) {
                    log.debug(`Operation failed and is not retriable: ${lastError.message}`);
                    return { success: false, attempts, finalError: lastError };
                }

                if (attempts < strategy.maxRetries) {
                    const delay = this.calculateBackoff(attempts, strategy);
                    log.warn(`Operation failed (attempt ${attempts}/${strategy.maxRetries}). Retrying in ${delay}ms...`,
                        { error: lastError.message });
                    await this.sleep(delay);
                } else {
                    log.error(`Operation failed after ${attempts} attempts`, { error: lastError.message });
                }
            }
        }

        return { success: false, attempts, finalError: lastError };
    }

    private calculateBackoff(attempt: number, strategy: RecoveryStrategy): number {
        if (!strategy.exponentialBackoff) {
            return strategy.backoffMs;
        }

        return strategy.backoffMs * Math.pow(2, attempt - 1) + Math.random() * 100;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export class CircuitBreaker {
    private failureCount: number = 0;
    private successCount: number = 0;
    private lastFailureTime: number = 0;
    private state: 'closed' | 'open' | 'half_open' = 'closed';

    constructor(
        private failureThreshold: number = 5,
        private resetTimeoutMs: number = 60000
    ) {}

    async executeWithCircuitBreaker<T>(
        operation: () => Promise<T>
    ): Promise<T> {
        if (this.state === 'open') {
            if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
                this.state = 'half_open';
                this.successCount = 0;
            } else {
                throw new Error('Circuit breaker is open');
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failureCount = 0;
        if (this.state === 'half_open') {
            this.successCount++;
            if (this.successCount >= 2) {
                this.state = 'closed';
                this.successCount = 0;
            }
        }
    }

    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'open';
        }
    }

    getState(): 'closed' | 'open' | 'half_open' {
        return this.state;
    }

    reset(): void {
        this.failureCount = 0;
        this.successCount = 0;
        this.state = 'closed';
    }
}
