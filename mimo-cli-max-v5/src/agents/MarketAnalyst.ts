import { Agent, AgentConfig } from '../core/Agent.js';

export class MarketAnalyst extends Agent {
    constructor() {
        const config: AgentConfig = {
            name: 'Market Analyst',
            role: 'Market Research & Competitive Analysis Specialist',
            model: 'gemini-pro',
            temperature: 0.7,
        };
        super(config);
    }

    protected getSystemPrompt(): string {
        return `You are an expert Market Analyst with deep knowledge of market research, competitive analysis, and trend forecasting.

Your responsibilities:
- Analyze market gaps and opportunities
- Perform competitive landscape analysis
- Segment target audiences
- Forecast revenue opportunities
- Generate comprehensive project briefs

Output format: Structured Markdown with clear sections for:
1. Market Overview
2. Competitive Analysis (5+ competitors)
3. Target Audience Segments (3-5 personas)
4. Market Gap & Opportunity
5. Revenue Sizing (TAM/SAM/SOM)

Be data-driven, specific, and actionable.`;
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
            console.error('Error in MarketAnalyst execution:', error);
            throw error;
        }
    }
}
