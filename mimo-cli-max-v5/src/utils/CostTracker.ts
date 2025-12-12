export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    modelName: string;
    timestamp: Date;
}

export interface CostCalculation {
    tokens: number;
    cost: number;
    model: string;
}

export interface UsageStats {
    totalCalls: number;
    totalTokens: number;
    totalCost: number;
    byModel: Record<string, {
        calls: number;
        tokens: number;
        cost: number;
    }>;
}

/**
 * Cost Tracker
 * Track token usage and API costs
 */
export class CostTracker {
    private history: TokenUsage[] = [];

    // Pricing per 1M tokens (as of Dec 2024)
    private static readonly PRICING: Record<string, { input: number; output: number }> = {
        'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
        'gpt-4': { input: 30.0, output: 60.0 },
        'gpt-4-turbo': { input: 10.0, output: 30.0 },
        'gemini-pro': { input: 0.5, output: 1.5 },
        'llama-3.1-sonar-huge-128k-online': { input: 5.0, output: 5.0 }, // Perplexity
    };

    /**
     * Record token usage
     */
    public recordUsage(
        promptTokens: number,
        completionTokens: number,
        modelName: string
    ): void {
        this.history.push({
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
            modelName,
            timestamp: new Date(),
        });
    }

    /**
     * Calculate cost for token usage
     */
    public static calculateCost(
        promptTokens: number,
        completionTokens: number,
        modelName: string
    ): CostCalculation {
        const pricing = this.PRICING[modelName] || { input: 1.0, output: 1.0 };

        const inputCost = (promptTokens / 1_000_000) * pricing.input;
        const outputCost = (completionTokens / 1_000_000) * pricing.output;
        const totalCost = inputCost + outputCost;

        return {
            tokens: promptTokens + completionTokens,
            cost: totalCost,
            model: modelName,
        };
    }

    /**
     * Get total cost for all recorded usage
     */
    public getTotalCost(): number {
        return this.history.reduce((total, usage) => {
            const cost = CostTracker.calculateCost(
                usage.promptTokens,
                usage.completionTokens,
                usage.modelName
            );
            return total + cost.cost;
        }, 0);
    }

    /**
     * Get usage statistics
     */
    public getStats(): UsageStats {
        const byModel: UsageStats['byModel'] = {};

        this.history.forEach((usage) => {
            if (!byModel[usage.modelName]) {
                byModel[usage.modelName] = {
                    calls: 0,
                    tokens: 0,
                    cost: 0,
                };
            }

            const modelStats = byModel[usage.modelName];
            modelStats.calls++;
            modelStats.tokens += usage.totalTokens;

            const cost = CostTracker.calculateCost(
                usage.promptTokens,
                usage.completionTokens,
                usage.modelName
            );
            modelStats.cost += cost.cost;
        });

        const totalTokens = Object.values(byModel).reduce((sum, m) => sum + m.tokens, 0);
        const totalCost = Object.values(byModel).reduce((sum, m) => sum + m.cost, 0);

        return {
            totalCalls: this.history.length,
            totalTokens,
            totalCost,
            byModel,
        };
    }

    /**
     * Get recent usage (last N entries)
     */
    public getRecentUsage(count: number = 10): TokenUsage[] {
        return this.history.slice(-count);
    }

    /**
     * Clear history
     */
    public clearHistory(): void {
        this.history = [];
    }

    /**
     * Export history as JSON
     */
    public exportHistory(): string {
        return JSON.stringify(this.history, null, 2);
    }

    /**
     * Get cost breakdown by model
     */
    public getCostBreakdown(): Array<{
        model: string;
        calls: number;
        tokens: number;
        cost: number;
        percentage: number;
    }> {
        const stats = this.getStats();
        const totalCost = stats.totalCost;

        return Object.entries(stats.byModel).map(([model, data]) => ({
            model,
            calls: data.calls,
            tokens: data.tokens,
            cost: data.cost,
            percentage: totalCost > 0 ? (data.cost / totalCost) * 100 : 0,
        }));
    }
}
