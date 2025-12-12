import OpenAI from 'openai';
import { log } from '../utils/Logger.js';
import { AIProviderError } from '../utils/Errors.js';
import * as dotenv from 'dotenv';

dotenv.config();

export interface PerplexityConfig {
    apiKey: string;
    baseURL?: string;
    model: string;
}

export interface PerplexityMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface PerplexityTool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: Record<string, any>;
    };
}

export interface PerplexityResponse {
    content: string;
    tokensUsed: number;
    model: string;
    confidence?: number;
    executionTime: number;
    toolCalls?: Array<{
        id: string;
        type: 'function';
        function: {
            name: string;
            arguments: string;
        };
    }>;
}

/**
 * Perplexity API Client
 * Uses OpenAI-compatible endpoint for Perplexity AI models
 */
export class PerplexityClient {
    private client: OpenAI;
    private config: PerplexityConfig;

    constructor(config?: PerplexityConfig) {
        // Load from environment if not provided
        this.config = config || {
            apiKey: process.env.PERPLEXITY_API_KEY || '',
            baseURL: process.env.PERPLEXITY_BASE_URL || 'https://api.perplexity.ai',
            model: process.env.PERPLEXITY_MODEL || 'llama-3.1-sonar-huge-128k-online',
        };

        if (!this.config.apiKey) {
            log.warn('Perplexity API key not configured. Client unavailable.');
        }

        // Initialize OpenAI client with Perplexity endpoint
        this.client = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseURL,
        });

        log.info('Perplexity client initialized', { model: this.config.model });
    }

    /**
     * Send chat completion request to Perplexity
     */
    public async chat(
        messages: PerplexityMessage[],
        options?: {
            temperature?: number;
            maxTokens?: number;
            tools?: PerplexityTool[];
            stream?: boolean;
        }
    ): Promise<PerplexityResponse> {
        const startTime = Date.now();

        if (!this.config.apiKey) {
            throw new AIProviderError('Perplexity API key not configured', 'Perplexity');
        }

        try {
            log.debug('Sending request to Perplexity', {
                messageCount: messages.length,
                maxTokens: options?.maxTokens,
                toolsCount: options?.tools?.length || 0,
            });

            const requestParams: any = {
                model: this.config.model,
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens,
            };

            // Add tools if provided
            if (options?.tools && options.tools.length > 0) {
                requestParams.tools = options.tools;
                requestParams.tool_choice = 'auto';
            }

            const response = await this.client.chat.completions.create(requestParams);

            const executionTime = Date.now() - startTime;

            // Extract content and tool calls
            const message = response.choices[0]?.message;
            const content = message?.content || '';
            const toolCalls = message?.tool_calls;

            log.info('Perplexity response received', {
                tokensUsed: response.usage?.total_tokens || 0,
                executionTime,
                hasToolCalls: !!toolCalls?.length,
            });

            return {
                content,
                tokensUsed: response.usage?.total_tokens || 0,
                model: response.model,
                confidence: 0.94, // Perplexity models high confidence
                executionTime,
                toolCalls: toolCalls?.map((tc) => ({
                    id: tc.id,
                    type: tc.type,
                    function: {
                        name: tc.function.name,
                        arguments: tc.function.arguments,
                    },
                })),
            };
        } catch (error: any) {
            log.error('Perplexity API error', { error: error.message });
            throw new AIProviderError(
                `Perplexity API request failed: ${error.message}`,
                'Perplexity',
                { error }
            );
        }
    }

    /**
     * Stream chat completion from Perplexity
     */
    public async *streamChat(
        messages: PerplexityMessage[],
        options?: {
            temperature?: number;
            maxTokens?: number;
        }
    ): AsyncGenerator<string, void, unknown> {
        if (!this.config.apiKey) {
            throw new AIProviderError('Perplexity API key not configured', 'Perplexity');
        }

        try {
            const stream = await this.client.chat.completions.create({
                model: this.config.model,
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    yield content;
                }
            }
        } catch (error: any) {
            log.error('Perplexity streaming error', { error: error.message });
            throw new AIProviderError(
                `Perplexity streaming failed: ${error.message}`,
                'Perplexity',
                { error }
            );
        }
    }

    /**
     * Check if client is configured and ready
     */
    public isReady(): boolean {
        return !!this.config.apiKey;
    }

    /**
     * Get current model name
     */
    public getModel(): string {
        return this.config.model;
    }
}
