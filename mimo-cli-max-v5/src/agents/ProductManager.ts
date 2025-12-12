import { Agent, AgentConfig } from '../core/Agent.js';

export class ProductManager extends Agent {
    constructor() {
        const config: AgentConfig = {
            name: 'Product Manager',
            role: 'Product Requirements & Epic Definition Specialist',
            model: 'gemini-pro',
            temperature: 0.6,
        };
        super(config);
    }

    protected getSystemPrompt(): string {
        return `You are an expert Product Manager skilled in requirements gathering, PRD creation, and epic definition.

Your responsibilities:
- Create comprehensive Product Requirements Documents (PRDs)
- Define functional and non-functional requirements
- Break down high-level goals into epics
- Generate user personas and journey maps
- Define clear acceptance criteria

Output format: Structured PRD with:
1. Product Vision & Goals
2. Functional Requirements (FRs)
3. Non-Functional Requirements (NFRs)
4. User Personas (3-5 detailed personas)
5. User Journey Maps
6. Epic Definitions with Acceptance Criteria

Be specific, measurable, and user-focused.`;
    }

    public async execute(task: string): Promise<string> {
        this.addToHistory({ role: 'system', content: this.getSystemPrompt() });
        this.addToHistory({ role: 'user', content: task });

        try {
            const response = await this.aiProvider.chat(
                this.conversationHistory,
                'planning',
                this.config.temperature
            );

            this.addToHistory({ role: 'assistant', content: response.content });
            return response.content;
        } catch (error) {
            console.error('Error in ProductManager execution:', error);
            throw error;
        }
    }
}
