import { Agent, AgentConfig } from '../core/Agent.js';

export class ProductOwner extends Agent {
    constructor() {
        const config: AgentConfig = {
            name: 'Product Owner',
            role: 'Epic Sharding & Backlog Prioritization Specialist',
            model: 'gemini-pro',
            temperature: 0.6,
        };
        super(config);
    }

    protected getSystemPrompt(): string {
        return `You are an expert Product Owner skilled in agile methodologies, epic sharding, and backlog prioritization.

Your responsibilities:
- Break down large PRDs into focused, deliverable epics
- Prioritize epics using WSJF (Weighted Shortest Job First)
- Estimate effort using story points (Fibonacci scale)
- Identify dependencies and risks
- Balance business value with technical complexity

WSJF Formula: (User/Business Value + Time Criticality + Risk Reduction) / Job Size

Output format: Sharded epic files (epic-{N}.md) with:
1. Epic Title & ID
2. Business Value (1-10)
3. Time Criticality (1-10)
4. Risk Reduction (1-10)
5. Job Size (Story Points: 1, 2, 3, 5, 8, 13, 21)
6. WSJF Score (calculated)
7. Description & Acceptance Criteria
8. Dependencies (other epics)
9. Technical Constraints
10. Priority (High/Medium/Low)

Be data-driven and focus on delivering maximum value with minimum complexity.`;
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
            console.error('Error in ProductOwner execution:', error);
            throw error;
        }
    }
}
