import { z } from 'zod';

export const ConfigSchema = z.object({
    providers: z.object({
        anthropic: z.object({
            apiKey: z.string().optional(),
            model: z.string().default('claude-3-5-sonnet-20241022'),
        }).optional(),
        openai: z.object({
            apiKey: z.string().optional(),
            model: z.string().default('gpt-4'),
        }).optional(),
        google: z.object({
            apiKey: z.string().optional(),
            model: z.string().default('gemini-pro'),
        }).optional(),
        perplexity: z.object({
            apiKey: z.string().optional(),
            baseURL: z.string().default('https://api.perplexity.ai'),
            model: z.string().default('llama-3.1-sonar-huge-128k-online'),
        }).optional(),
    }),
    orchestration: z.object({
        pattern: z.enum(['supervisor', 'adaptive', 'swarm', 'hybrid']).default('hybrid'),
        consensusThreshold: z.number().min(0).max(1).default(0.67),
    }),
    tools: z.object({
        enabled: z.boolean().default(true),
        requireApproval: z.boolean().default(true),
        autoApproveRead: z.boolean().default(true),
    }).optional(),
    mcp: z.object({
        enabled: z.boolean().default(false),
        servers: z.array(z.string()).default([]),
    }).optional(),
    artifacts: z.object({
        previewEnabled: z.boolean().default(true),
        previewPort: z.number().default(5173),
    }).optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export class ConfigManager {
    private config: Config;

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): Config {
        // TODO: Load from .mimorc.json or environment variables
        return ConfigSchema.parse({
            providers: {},
            orchestration: {},
        });
    }

    public getConfig(): Config {
        return this.config;
    }

    public setProvider(provider: 'anthropic' | 'openai' | 'google' | 'perplexity', apiKey: string, options?: { model?: string; baseURL?: string }): void {
        const defaultModels = {
            anthropic: 'claude-3-5-sonnet-20241022',
            openai: 'gpt-4',
            google: 'gemini-pro',
            perplexity: 'llama-3.1-sonar-huge-128k-online',
        };

        if (provider === 'perplexity') {
            this.config.providers.perplexity = {
                apiKey,
                baseURL: options?.baseURL || 'https://api.perplexity.ai',
                model: options?.model || defaultModels.perplexity,
            };
        } else {
            const currentConfig = this.config.providers[provider] || { model: defaultModels[provider] };
            this.config.providers[provider] = {
                ...currentConfig,
                apiKey,
                model: options?.model || currentConfig.model || defaultModels[provider],
            };
        }
        // TODO: Save to .mimorc.json
    }
}
