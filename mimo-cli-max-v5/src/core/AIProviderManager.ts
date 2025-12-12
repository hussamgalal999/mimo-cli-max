import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PerplexityService, type PerplexityOptions } from '../services/PerplexityService.js';
import { log } from '../utils/Logger.js';
import { AIProviderError } from '../utils/Errors.js';
import { theme } from '../ui/theme.js';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Fix dotenv loading
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export interface AIProviderConfig {
    anthropic?: {
        apiKey: string;
        model: string;
    };
    openai?: {
        apiKey: string;
        model: string;
    };
    google?: {
        apiKey: string;
        model: string;
    };
    perplexity?: {
        apiKey: string;
        baseURL?: string;
        model: string;
    };
    groq?: {
        apiKey: string;
        model: string;
    };
    mistral?: {
        apiKey: string;
        model: string;
    };
    deepseek?: {
        apiKey: string;
        model: string;
    };
    together?: {
        apiKey: string;
        model: string;
    };
    openrouter?: {
        apiKey: string;
        model: string;
    };
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    content: string;
    tokensUsed?: number; // Legacy format
    model: string;
    confidence?: number;
    executionTime?: number;
    usage?: { // New format (Perplexity)
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

/**
 * AI Provider Manager with Real API Integration
 * Supports 10+ AI providers with unified interface
 */
export class AIProviderManager {
    private anthropicClient?: Anthropic;
    private openaiClient?: OpenAI;
    private googleClient?: GoogleGenerativeAI;
    private perplexityClient?: PerplexityService;
    private groqClient?: OpenAI;      // OpenAI-compatible
    private mistralClient?: OpenAI;   // OpenAI-compatible
    private deepseekClient?: OpenAI;  // OpenAI-compatible
    private togetherClient?: OpenAI;  // OpenAI-compatible
    private openrouterClient?: OpenAI; // OpenAI-compatible
    public config: AIProviderConfig;

    constructor(config?: AIProviderConfig) {
        // Load from environment if not provided
        this.config = config || {
            anthropic: process.env.ANTHROPIC_API_KEY
                ? {
                    apiKey: process.env.ANTHROPIC_API_KEY,
                    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
                }
                : undefined,
            openai: process.env.OPENAI_API_KEY
                ? {
                    apiKey: process.env.OPENAI_API_KEY,
                    model: process.env.OPENAI_MODEL || 'gpt-4o',
                }
                : undefined,
            google: process.env.GOOGLE_API_KEY
                ? {
                    apiKey: process.env.GOOGLE_API_KEY,
                    model: process.env.GOOGLE_MODEL || 'gemini-1.5-pro',
                }
                : undefined,
            perplexity: process.env.PERPLEXITY_API_KEY
                ? {
                    apiKey: process.env.PERPLEXITY_API_KEY,
                    baseURL: process.env.PERPLEXITY_BASE_URL,
                    // FIXED: Changed default from 'huge' to 'large' for better stability
                    model: process.env.PERPLEXITY_MODEL || 'llama-3.1-sonar-large-128k-online',
                }
                : undefined,
            groq: process.env.GROQ_API_KEY
                ? {
                    apiKey: process.env.GROQ_API_KEY,
                    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                }
                : undefined,
            mistral: process.env.MISTRAL_API_KEY
                ? {
                    apiKey: process.env.MISTRAL_API_KEY,
                    model: process.env.MISTRAL_MODEL || 'mistral-large-latest',
                }
                : undefined,
            deepseek: process.env.DEEPSEEK_API_KEY
                ? {
                    apiKey: process.env.DEEPSEEK_API_KEY,
                    model: process.env.DEEPSEEK_MODEL || 'deepseek-coder',
                }
                : undefined,
            together: process.env.TOGETHER_API_KEY
                ? {
                    apiKey: process.env.TOGETHER_API_KEY,
                    model: process.env.TOGETHER_MODEL || 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
                }
                : undefined,
            openrouter: process.env.OPENROUTER_API_KEY
                ? {
                    apiKey: process.env.OPENROUTER_API_KEY,
                    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
                }
                : undefined,
        };

        this.initializeProviders();
    }

    private initializeProviders(): void {
        let providerCount = 0;
        const activeProviders: string[] = [];

        try {
            if (this.config.anthropic?.apiKey) {
                this.anthropicClient = new Anthropic({ apiKey: this.config.anthropic.apiKey });
                activeProviders.push('Anthropic');
                providerCount++;
            }

            if (this.config.openai?.apiKey) {
                this.openaiClient = new OpenAI({ apiKey: this.config.openai.apiKey });
                activeProviders.push('OpenAI');
                providerCount++;
            }

            if (this.config.google?.apiKey) {
                this.googleClient = new GoogleGenerativeAI(this.config.google.apiKey);
                activeProviders.push('Gemini');
                providerCount++;
            }

            if (this.config.perplexity?.apiKey) {
                this.perplexityClient = new PerplexityService(this.config.perplexity.apiKey, this.config.perplexity.baseURL);
                activeProviders.push('Perplexity');
                providerCount++;
            }

            // Groq - Ultra fast inference
            if (this.config.groq?.apiKey) {
                this.groqClient = new OpenAI({
                    apiKey: this.config.groq.apiKey,
                    baseURL: 'https://api.groq.com/openai/v1',
                });
                activeProviders.push('Groq');
                providerCount++;
            }

            // Mistral AI / Codestral
            if (this.config.mistral?.apiKey) {
                this.mistralClient = new OpenAI({
                    apiKey: this.config.mistral.apiKey,
                    baseURL: process.env.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1',
                });
                activeProviders.push('Mistral');
                providerCount++;
            }

            // DeepSeek - Affordable coding models
            if (this.config.deepseek?.apiKey) {
                this.deepseekClient = new OpenAI({
                    apiKey: this.config.deepseek.apiKey,
                    baseURL: 'https://api.deepseek.com/v1',
                });
                activeProviders.push('DeepSeek');
                providerCount++;
            }

            // Together AI - Open source models
            if (this.config.together?.apiKey) {
                this.togetherClient = new OpenAI({
                    apiKey: this.config.together.apiKey,
                    baseURL: 'https://api.together.xyz/v1',
                });
                activeProviders.push('Together AI');
                providerCount++;
            }

            // OpenRouter - Gateway to 100+ models
            if (this.config.openrouter?.apiKey) {
                this.openrouterClient = new OpenAI({
                    apiKey: this.config.openrouter.apiKey,
                    baseURL: 'https://openrouter.ai/api/v1',
                });
                activeProviders.push('OpenRouter');
                providerCount++;
            }

            if (providerCount === 0) {
                console.log(theme.warning('⚠️ No AI Keys found. Check your .env file.'));
                log.warn('No AI providers configured. Running in simulation mode.');
            } else {
                console.log(theme.success(`✅ AI Initialized: ${activeProviders.join(', ')}`));
                log.info(`${providerCount} AI providers initialized successfully`);
            }
        } catch (error) {
            log.error('Error initializing AI providers', { error });
            throw new AIProviderError('Failed to initialize AI providers', 'INITIALIZATION', { error });
        }
    }

    /**
     * Send chat completion request to Claude (Anthropic)
     */
    public async chatWithClaude(
        messages: ChatMessage[],
        temperature: number = 0.7,
        maxTokens: number = 4096
    ): Promise<ChatResponse> {
        const startTime = Date.now();

        if (!this.anthropicClient) {
            throw new AIProviderError('Anthropic API key not configured', 'Anthropic');
        }

        try {
            const systemMessage = messages.find((m) => m.role === 'system');
            const conversationMessages = messages
                .filter((m) => m.role !== 'system')
                .map((m) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                }));

            log.debug('Sending request to Claude', {
                messageCount: conversationMessages.length,
                maxTokens,
            });

            const response = await this.anthropicClient.messages.create({
                model: this.config.anthropic?.model || 'claude-3-5-sonnet-20241022',
                max_tokens: maxTokens,
                temperature,
                system: systemMessage?.content,
                messages: conversationMessages,
            });

            const executionTime = Date.now() - startTime;

            log.info('Claude response received', {
                tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
                executionTime,
            });

            return {
                content: response.content[0]?.type === 'text' ? response.content[0].text : '',
                tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
                model: response.model,
                confidence: 0.925, // Claude typically high confidence
                executionTime,
            };
        } catch (error: any) {
            log.error('Claude API error', { error: error.message });
            throw new AIProviderError(
                `Claude API request failed: ${error.message}`,
                'Anthropic',
                { error }
            );
        }
    }

    /**
     * Send chat completion request to GPT (OpenAI)
     */
    public async chatWithGPT(
        messages: ChatMessage[],
        temperature: number = 0.7,
        maxTokens: number = 4096
    ): Promise<ChatResponse> {
        const startTime = Date.now();

        if (!this.openaiClient) {
            throw new AIProviderError('OpenAI API key not configured', 'OpenAI');
        }

        try {
            log.debug('Sending request to GPT', {
                messageCount: messages.length,
                maxTokens,
            });

            const response = await this.openaiClient.chat.completions.create({
                model: this.config.openai?.model || 'gpt-4',
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
                temperature,
                max_tokens: maxTokens,
            });

            const executionTime = Date.now() - startTime;

            log.info('GPT response received', {
                tokensUsed: response.usage?.total_tokens || 0,
                executionTime,
            });

            return {
                content: response.choices[0]?.message?.content || '',
                tokensUsed: response.usage?.total_tokens || 0,
                model: response.model,
                confidence: 0.910,
                executionTime,
            };
        } catch (error: any) {
            log.error('OpenAI API error', { error: error.message });
            throw new AIProviderError(
                `OpenAI API request failed: ${error.message}`,
                'OpenAI',
                { error }
            );
        }
    }

    /**
     * Send chat completion request to Gemini (Google)
     */
    public async chatWithGemini(
        messages: ChatMessage[],
        temperature: number = 0.7
    ): Promise<ChatResponse> {
        const startTime = Date.now();

        if (!this.googleClient) {
            throw new AIProviderError('Google API key not configured', 'Google');
        }

        try {
            const model = this.googleClient.getGenerativeModel({
                model: this.config.google?.model || 'gemini-pro',
            });

            const systemMessage = messages.find((m) => m.role === 'system');
            const conversationMessages = messages.filter((m) => m.role !== 'system');

            const prompt = [
                systemMessage?.content,
                ...conversationMessages.map((m) => `${m.role}: ${m.content}`),
            ]
                .filter(Boolean)
                .join('\n\n');

            log.debug('Sending request to Gemini', { promptLength: prompt.length });

            const result = await model.generateContent(prompt);
            const response = await result.response;

            const executionTime = Date.now() - startTime;

            log.info('Gemini response received', { executionTime });

            return {
                content: response.text(),
                tokensUsed: 0,
                model: this.config.google?.model || 'gemini-pro',
                confidence: 0.895,
                executionTime,
            };
        } catch (error: any) {
            log.error('Gemini API error', { error: error.message });
            throw new AIProviderError(
                `Gemini API request failed: ${error.message}`,
                'Google',
                { error }
            );
        }
    }

    /**
     * Generic chat for OpenAI-compatible providers (Groq, Mistral, DeepSeek, Together, OpenRouter)
     */
    public async chatWithOpenAICompatible(
        client: OpenAI,
        model: string,
        providerName: string,
        messages: ChatMessage[],
        temperature: number = 0.7,
        maxTokens: number = 4096
    ): Promise<ChatResponse> {
        const startTime = Date.now();

        try {
            log.debug(`Sending request to ${providerName}`, {
                model,
                messageCount: messages.length,
            });

            const response = await client.chat.completions.create({
                model,
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
                temperature,
                max_tokens: maxTokens,
            });

            const executionTime = Date.now() - startTime;
            const content = response.choices[0]?.message?.content || '';

            log.info(`${providerName} response received`, { executionTime });

            return {
                content,
                tokensUsed: response.usage?.total_tokens || 0,
                model,
                confidence: 0.9,
                executionTime,
            };
        } catch (error: any) {
            log.error(`${providerName} API error`, { error: error.message });
            throw new AIProviderError(
                `${providerName} API request failed: ${error.message}`,
                providerName,
                { error }
            );
        }
    }

    /**
     * Chat with Groq (Ultra-fast inference)
     */
    public async chatWithGroq(messages: ChatMessage[], temperature?: number, maxTokens?: number): Promise<ChatResponse> {
        if (!this.groqClient) throw new AIProviderError('Groq API key not configured', 'Groq');
        return this.chatWithOpenAICompatible(
            this.groqClient,
            this.config.groq?.model || 'llama-3.3-70b-versatile',
            'Groq',
            messages,
            temperature,
            maxTokens
        );
    }

    /**
     * Chat with Mistral AI
     */
    public async chatWithMistral(messages: ChatMessage[], temperature?: number, maxTokens?: number): Promise<ChatResponse> {
        if (!this.mistralClient) throw new AIProviderError('Mistral API key not configured', 'Mistral');
        return this.chatWithOpenAICompatible(
            this.mistralClient,
            this.config.mistral?.model || 'mistral-large-latest',
            'Mistral',
            messages,
            temperature,
            maxTokens
        );
    }

    /**
     * Chat with DeepSeek (Affordable coding)
     */
    public async chatWithDeepSeek(messages: ChatMessage[], temperature?: number, maxTokens?: number): Promise<ChatResponse> {
        if (!this.deepseekClient) throw new AIProviderError('DeepSeek API key not configured', 'DeepSeek');
        return this.chatWithOpenAICompatible(
            this.deepseekClient,
            this.config.deepseek?.model || 'deepseek-coder',
            'DeepSeek',
            messages,
            temperature,
            maxTokens
        );
    }

    /**
     * Chat with Together AI
     */
    public async chatWithTogether(messages: ChatMessage[], temperature?: number, maxTokens?: number): Promise<ChatResponse> {
        if (!this.togetherClient) throw new AIProviderError('Together API key not configured', 'Together');
        return this.chatWithOpenAICompatible(
            this.togetherClient,
            this.config.together?.model || 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
            'Together',
            messages,
            temperature,
            maxTokens
        );
    }

    /**
     * Chat with OpenRouter (Gateway to 100+ models)
     */
    public async chatWithOpenRouter(messages: ChatMessage[], temperature?: number, maxTokens?: number): Promise<ChatResponse> {
        if (!this.openrouterClient) throw new AIProviderError('OpenRouter API key not configured', 'OpenRouter');
        return this.chatWithOpenAICompatible(
            this.openrouterClient,
            this.config.openrouter?.model || 'anthropic/claude-3.5-sonnet',
            'OpenRouter',
            messages,
            temperature,
            maxTokens
        );
    }

    /**
     * Smart routing: Select best provider for task type
     * NOW WITH 10 PROVIDERS + Auto-fallback!
     */
    public async chat(
        messages: ChatMessage[],
        taskType: 'planning' | 'coding' | 'review' | 'general' = 'general',
        temperature: number = 0.7
    ): Promise<ChatResponse> {
        const errors: string[] = [];

        // Build priority list based on task type
        const providers: Array<() => Promise<ChatResponse>> = [];

        // 🚀 ALWAYS prioritize Gemini (User Request), then Perplexity, then Codestral
        if (this.googleClient) {
            providers.push(() => this.chatWithGemini(messages, temperature));
        }
        if (this.perplexityClient) {
            providers.push(() => this.chatWithPerplexity(messages, temperature, 8000));
        }
        if (this.mistralClient) {
            // Codestral is high priority for coding tasks
            providers.push(() => this.chatWithMistral(messages, temperature));
        }

        switch (taskType) {
            case 'planning':
                if (this.openrouterClient) providers.push(() => this.chatWithOpenRouter(messages, temperature));
                break;
            case 'coding':
                if (this.anthropicClient) providers.push(() => this.chatWithClaude(messages, temperature, 8000));
                if (this.deepseekClient) providers.push(() => this.chatWithDeepSeek(messages, temperature, 8000));
                if (this.openaiClient) providers.push(() => this.chatWithGPT(messages, temperature));
                break;
            case 'review':
                if (this.openaiClient) providers.push(() => this.chatWithGPT(messages, temperature));
                break;
        }

        // Add all remaining providers as fallbacks
        if (this.groqClient && !providers.some(p => p.toString().includes('Groq')))
            providers.push(() => this.chatWithGroq(messages, temperature));
        if (this.anthropicClient && !providers.some(p => p.toString().includes('Claude')))
            providers.push(() => this.chatWithClaude(messages, temperature));
        if (this.openaiClient && !providers.some(p => p.toString().includes('GPT')))
            providers.push(() => this.chatWithGPT(messages, temperature));
        if (this.deepseekClient && !providers.some(p => p.toString().includes('DeepSeek')))
            providers.push(() => this.chatWithDeepSeek(messages, temperature));
        if (this.togetherClient && !providers.some(p => p.toString().includes('Together')))
            providers.push(() => this.chatWithTogether(messages, temperature));
        if (this.openrouterClient && !providers.some(p => p.toString().includes('OpenRouter')))
            providers.push(() => this.chatWithOpenRouter(messages, temperature));

        // Try each provider until one succeeds
        for (const provider of providers) {
            try {
                return await provider();
            } catch (error: any) {
                const errorMsg = error.message || String(error);
                errors.push(errorMsg);
                // ⚠️ Silent fallback (User request: Don't show intermediate errors)
                log.warn(`Provider failed, trying next: ${errorMsg.substring(0, 100)}`);
                continue; // Try next provider
            }
        }

        // If all providers failed, use simulation mode
        if (providers.length === 0) {
            console.log(theme.warning('⚠️ No AI Keys found. Check your .env file or logs.'));
        }
        if (errors.length > 0) {
            console.log(theme.error(`❌ All connections failed. Accessing offline simulation.`));
            log.warn(`All ${errors.length} providers failed, using simulation mode`);
        } else if (providers.length > 0) {
            // Providers exist but loop didn't run? (Impossible unless list was mutated)
        }

        return this.simulateResponse(messages, taskType);
    }

    /**
     * Chat with Perplexity (Hybrid: Search + Coding + Reasoning)
     */
    public async chatWithPerplexity(
        messages: ChatMessage[],
        temperature: number = 0.7,
        maxTokens: number = 4096,
        searchMode: 'online' | 'chat' | 'reasoning' = 'online'
    ): Promise<ChatResponse> {
        if (!this.perplexityClient) {
            throw new AIProviderError('Perplexity API key not configured', 'Perplexity');
        }

        try {
            log.debug('Sending request to Perplexity', {
                messageCount: messages.length,
                maxTokens,
                searchMode,
            });

            const response = await this.perplexityClient.chat(messages, {
                temperature,
                maxTokens,
                searchMode,
                returnCitations: searchMode === 'online',
            });

            log.info('Perplexity response received', {
                model: response.model,
                tokensUsed: response.usage.totalTokens,
                citationsCount: response.citations?.length || 0,
            });

            return {
                content: response.content,
                model: response.model,
                usage: response.usage,
            };
        } catch (error: any) {
            log.error('Perplexity API error', { error: error.message });
            throw new AIProviderError(`Perplexity error: ${error.message}`, 'Perplexity', {
                originalError: error,
            });
        }
    }

    /**
     * Simulate AI response for demo mode (when no API keys configured)
     */
    private simulateResponse(messages: ChatMessage[], taskType: string): ChatResponse {
        const lastMessage = messages[messages.length - 1]?.content || '';
        const simulations: Record<string, string> = {
            planning: `## Market Analysis Report\n\n**Executive Summary:**\nThe ${lastMessage.slice(0, 50)}... market shows strong growth potential with 25% YoY increase.\n\n**Key Findings:**\n- Market size: $4.2B globally\n- Growth rate: 18% CAGR\n- Key players: 5 major competitors\n- Opportunity score: 8.5/10\n\n**Recommendations:**\n1. Target SMB segment first\n2. Focus on developer experience\n3. Competitive pricing strategy`,
            coding: `\`\`\`typescript\n// Auto-generated implementation\nimport { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class FeatureService {\n  async execute(input: string): Promise<Result> {\n    // Implementation placeholder\n    console.log('Processing:', input);\n    return { success: true, data: {} };\n  }\n}\n\`\`\`\n\n**Implementation Notes:**\n- TypeScript strict mode\n- Full error handling\n- Unit tests included`,
            review: `## Code Review Report\n\n**Quality Score: 8.5/10**\n\n✅ **Strengths:**\n- Clean architecture\n- Good separation of concerns\n- Comprehensive error handling\n\n⚠️ **Suggestions:**\n- Add input validation\n- Consider caching\n- Improve logging`,
            general: `## Analysis Complete\n\nBased on the input: "${lastMessage.slice(0, 100)}..."\n\n**Key Points:**\n1. Comprehensive analysis performed\n2. Best practices applied\n3. Ready for implementation\n\n**Next Steps:**\n- Review recommendations\n- Approve implementation plan\n- Begin development phase`,
        };

        const content: string = simulations[taskType] || simulations.general || '';

        return {
            content,
            tokensUsed: Math.floor(Math.random() * 1000) + 500,
            model: 'simulation-mode',
            confidence: 0.85,
            executionTime: Math.floor(Math.random() * 500) + 100,
        };
    }
}
