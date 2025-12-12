import { log } from '../utils/Logger.js';

export interface ProviderMetrics {
    name: string;
    avgResponseTime: number;
    successRate: number;
    averageCost: number;
    lastUsed: number;
    requestCount: number;
    failureCount: number;
    confidence: number;
}

export interface ProviderPerformance {
    provider: string;
    score: number;
    recommendation: string;
}

export class SmartProviderRouter {
    private metrics: Map<string, ProviderMetrics> = new Map();
    private taskTypePreferences: Record<string, string[]> = {
        'coding': ['anthropic', 'deepseek', 'groq'],
        'planning': ['openai', 'anthropic', 'perplexity'],
        'research': ['perplexity', 'openai'],
        'general': ['anthropic', 'openai', 'groq'],
        'fast': ['groq', 'together'],
        'economical': ['groq', 'together', 'deepseek'],
    };

    registerProvider(name: string): void {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, {
                name,
                avgResponseTime: 0,
                successRate: 1.0,
                averageCost: 0,
                lastUsed: 0,
                requestCount: 0,
                failureCount: 0,
                confidence: 0.5
            });
        }
    }

    recordSuccess(provider: string, responseTime: number, cost: number): void {
        const metrics = this.metrics.get(provider);
        if (!metrics) return;

        metrics.requestCount++;
        metrics.lastUsed = Date.now();
        metrics.avgResponseTime = (metrics.avgResponseTime * (metrics.requestCount - 1) + responseTime) / metrics.requestCount;
        metrics.averageCost = (metrics.averageCost * (metrics.requestCount - 1) + cost) / metrics.requestCount;
        metrics.successRate = (metrics.successRate * metrics.requestCount - 1) / (metrics.requestCount);
        metrics.confidence = Math.min(1.0, metrics.confidence + 0.05);

        log.debug(`Provider ${provider} success recorded`, { avgResponseTime: metrics.avgResponseTime, cost });
    }

    recordFailure(provider: string): void {
        const metrics = this.metrics.get(provider);
        if (!metrics) return;

        metrics.failureCount++;
        metrics.requestCount++;
        metrics.successRate = (metrics.requestCount - metrics.failureCount) / metrics.requestCount;
        metrics.confidence = Math.max(0.1, metrics.confidence - 0.1);

        log.warn(`Provider ${provider} failure recorded`);
    }

    selectBestProvider(
        availableProviders: string[],
        taskType: string = 'general',
        preferences: { speed?: boolean; cost?: boolean; quality?: boolean } = {}
    ): string {
        const filteredProviders = availableProviders
            .filter(p => this.metrics.has(p))
            .filter(p => {
                const m = this.metrics.get(p)!;
                return m.successRate > 0.5 && m.confidence > 0.1;
            });

        if (filteredProviders.length === 0) {
            return availableProviders[0] || 'default';
        }

        const scores = filteredProviders.map(provider => ({
            provider,
            score: this.calculateScore(provider, taskType, preferences),
            recommendation: this.getRecommendation(provider)
        }));

        scores.sort((a, b) => b.score - a.score);

        log.debug(`Provider selection for ${taskType}`, {
            topProvider: scores[0]?.provider,
            scores: scores.slice(0, 3)
        });

        return scores[0]?.provider || availableProviders[0] || 'default';
    }

    private calculateScore(
        provider: string,
        taskType: string,
        preferences: { speed?: boolean; cost?: boolean; quality?: boolean }
    ): number {
        const metrics = this.metrics.get(provider);
        if (!metrics) return 0;

        let score = metrics.successRate * metrics.confidence;

        if (preferences.speed) {
            score *= (1 - (metrics.avgResponseTime / 10000));
        }

        if (preferences.cost) {
            score *= (1 - (metrics.averageCost / 0.1));
        }

        if (preferences.quality) {
            score *= metrics.confidence;
        }

        const preferred = this.taskTypePreferences[taskType] || [];
        const preferenceBoost = preferred.includes(provider) ? 0.3 : 0;

        const recencyBoost = (Date.now() - metrics.lastUsed) < 60000 ? 0.1 : 0;

        return score + preferenceBoost + recencyBoost;
    }

    private getRecommendation(provider: string): string {
        const metrics = this.metrics.get(provider);
        if (!metrics) return 'unknown';

        if (metrics.successRate > 0.95) return 'excellent';
        if (metrics.successRate > 0.85) return 'good';
        if (metrics.successRate > 0.7) return 'acceptable';
        return 'unreliable';
    }

    getMetrics(provider: string): ProviderMetrics | undefined {
        return this.metrics.get(provider);
    }

    getAllMetrics(): ProviderMetrics[] {
        return Array.from(this.metrics.values());
    }

    resetMetrics(): void {
        for (const metrics of this.metrics.values()) {
            metrics.avgResponseTime = 0;
            metrics.successRate = 1.0;
            metrics.averageCost = 0;
            metrics.lastUsed = 0;
            metrics.requestCount = 0;
            metrics.failureCount = 0;
            metrics.confidence = 0.5;
        }
    }
}
