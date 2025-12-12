/**
 * Perplexity Service - Hybrid Search + Coding + Reasoning
 * Specialized service for Perplexity AI with support for:
 * - Online search models (real-time web search)
 * - Chat models (pure AI reasoning)
 * - Advanced reasoning models
 */

import OpenAI from 'openai';
import { log } from '../utils/Logger.js';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface PerplexityOptions {
    model?: string;
    searchMode?: 'online' | 'chat' | 'reasoning';
    returnCitations?: boolean;
    returnImages?: boolean;
    searchDomainFilter?: string[];
    searchRecencyFilter?: 'day' | 'week' | 'month' | 'year';
    temperature?: number;
    maxTokens?: number;
}

export interface PerplexityResponse extends ChatResponse {
    content: string; // Explicitly include content
    citations?: string[];
    images?: string[];
    searchQueries?: string[];
}

export class PerplexityService {
    private client: OpenAI;
    private defaultModel: string;

    constructor(apiKey: string, baseURL: string = 'https://api.perplexity.ai') {
        this.client = new OpenAI({
            apiKey,
            baseURL,
        });
        this.defaultModel = 'llama-3.1-sonar-large-128k-online';
    }

    /**
     * Smart model selection based on task type
     */
    private selectModel(options: PerplexityOptions): string {
        if (options.model) return options.model;

        const { searchMode = 'online' } = options;

        // Model selection strategy
        const modelMap = {
            online: 'llama-3.1-sonar-large-128k-online',    // Best for research + coding
            chat: 'llama-3.1-sonar-large-128k-chat',        // Best for pure coding
            reasoning: 'sonar-pro',                         // Best for complex problem-solving
        };

        return modelMap[searchMode] || this.defaultModel;
    }

    /**
     * Main chat method with hybrid capabilities
     */
    async chat(
        messages: ChatMessage[],
        options: PerplexityOptions = {}
    ): Promise<PerplexityResponse> {
        const model = this.selectModel(options);
        const {
            temperature = 0.7,
            maxTokens = 4096,
            returnCitations = true,
            returnImages = false,
            searchDomainFilter,
            searchRecencyFilter,
        } = options;

        try {
            log.info('Perplexity request', { model, messageCount: messages.length });

            // Build request parameters
            const requestParams: any = {
                model,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                })),
                temperature,
                max_tokens: maxTokens,
            };

            // Add search parameters for online models
            if (model.includes('online') || model === 'sonar-pro') {
                if (returnCitations) {
                    requestParams.return_citations = true;
                }
                if (returnImages) {
                    requestParams.return_images = true;
                }
                if (searchDomainFilter && searchDomainFilter.length > 0) {
                    requestParams.search_domain_filter = searchDomainFilter;
                }
                if (searchRecencyFilter) {
                    requestParams.search_recency_filter = searchRecencyFilter;
                }
            }

            const completion = await this.client.chat.completions.create(requestParams);

            const content = completion.choices[0]?.message?.content || '';

            // Extract citations if available
            const citations = (completion as any).citations || [];
            const images = (completion as any).images || [];

            log.info('Perplexity response received', {
                model,
                contentLength: content.length,
                citationsCount: citations.length,
                imagesCount: images.length,
            });

            return {
                content,
                model,
                usage: {
                    promptTokens: completion.usage?.prompt_tokens || 0,
                    completionTokens: completion.usage?.completion_tokens || 0,
                    totalTokens: completion.usage?.total_tokens || 0,
                },
                citations,
                images,
            };
        } catch (error: any) {
            log.error('Perplexity API error', { error: error.message, model });
            throw new Error(`Perplexity API error: ${error.message}`);
        }
    }

    /**
     * Specialized method for web search + research
     */
    async search(
        query: string,
        options: Omit<PerplexityOptions, 'searchMode'> = {}
    ): Promise<PerplexityResponse> {
        return this.chat(
            [{ role: 'user', content: query }],
            { ...options, searchMode: 'online', returnCitations: true }
        );
    }

    /**
     * Specialized method for deep research with citations
     */
    async research(
        topic: string,
        options: Omit<PerplexityOptions, 'searchMode'> = {}
    ): Promise<PerplexityResponse> {
        const researchPrompt = `Conduct comprehensive research on: ${topic}

Please provide:
1. Key findings and insights
2. Latest developments and trends
3. Expert opinions and analysis
4. Relevant statistics and data
5. Practical implications

Include citations for all claims.`;

        return this.chat(
            [{ role: 'user', content: researchPrompt }],
            {
                ...options,
                model: 'sonar-pro',
                returnCitations: true,
                returnImages: true,
            }
        );
    }

    /**
     * Specialized method for coding tasks (no search interference)
     */
    async code(
        task: string,
        options: Omit<PerplexityOptions, 'searchMode'> = {}
    ): Promise<PerplexityResponse> {
        return this.chat(
            [{ role: 'user', content: task }],
            { ...options, searchMode: 'chat', model: 'llama-3.1-sonar-huge-128k-chat' }
        );
    }

    /**
     * Specialized method for complex reasoning
     */
    async reason(
        problem: string,
        options: Omit<PerplexityOptions, 'searchMode'> = {}
    ): Promise<PerplexityResponse> {
        return this.chat(
            [{ role: 'user', content: problem }],
            { ...options, searchMode: 'reasoning', model: 'sonar-reasoning' }
        );
    }

    /**
     * Hybrid method: Search + Code
     * First searches for latest information, then generates code
     */
    async searchAndCode(
        task: string,
        searchQuery?: string,
        options: PerplexityOptions = {}
    ): Promise<PerplexityResponse> {
        const query = searchQuery || `Latest best practices and documentation for: ${task}`;

        // Step 1: Search for latest information
        const searchResult = await this.search(query, options);

        // Step 2: Use search results to inform coding
        const codePrompt = `Based on the latest information:
${searchResult.content}

Now, ${task}

Use the most current best practices and APIs mentioned above.`;

        return this.code(codePrompt, options);
    }

    /**
     * Get available models
     */
    static getAvailableModels(): string[] {
        return [
            // Online Search Models
            'llama-3.1-sonar-huge-128k-online',
            'llama-3.1-sonar-large-128k-online',
            'llama-3.1-sonar-small-128k-online',
            // Chat Models
            'llama-3.1-sonar-huge-128k-chat',
            'llama-3.1-sonar-large-128k-chat',
            'llama-3.1-sonar-small-128k-chat',
            // Reasoning Models
            'sonar-pro',
            'sonar-reasoning',
        ];
    }

    /**
     * Get model recommendations for specific tasks
     */
    static getModelForTask(task: 'search' | 'research' | 'code' | 'reasoning' | 'hybrid'): string {
        const recommendations = {
            search: 'llama-3.1-sonar-large-128k-online',
            research: 'sonar-pro',
            code: 'llama-3.1-sonar-huge-128k-chat',
            reasoning: 'sonar-reasoning',
            hybrid: 'llama-3.1-sonar-huge-128k-online',
        };
        return recommendations[task];
    }
}
