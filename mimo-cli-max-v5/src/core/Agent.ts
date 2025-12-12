import { AIProviderManager } from './AIProviderManager.js';

export interface AgentConfig {
    name: string;
    role: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
}

export interface AgentMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export abstract class Agent {
    protected config: AgentConfig;
    protected conversationHistory: AgentMessage[];
    protected aiProvider: AIProviderManager;

    constructor(config: AgentConfig) {
        this.config = config;
        this.conversationHistory = [];
        this.aiProvider = new AIProviderManager();
    }

    public getName(): string {
        return this.config.name;
    }

    public getRole(): string {
        return this.config.role;
    }

    protected addToHistory(message: AgentMessage): void {
        this.conversationHistory.push(message);
    }

    protected getSystemPrompt(): string {
        return `You are ${this.config.name}, a ${this.config.role}. Your task is to provide expert guidance in your domain.`;
    }

    public abstract execute(task: string): Promise<string>;
}
