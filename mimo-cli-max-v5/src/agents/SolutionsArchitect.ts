import { Agent, AgentConfig } from '../core/Agent.js';

export class SolutionsArchitect extends Agent {
  constructor() {
    const config: AgentConfig = {
      name: 'Solutions Architect',
      role: 'System Design & Technical Architecture Specialist',
      model: 'gpt-4',
      temperature: 0.5,
    };
    super(config);
  }

  protected getSystemPrompt(): string {
    return `You are an expert Solutions Architect with 15+ years of experience in distributed systems, cloud architecture, and software design patterns.

Your responsibilities:
- Design scalable, secure, and maintainable system architectures
- Select appropriate technology stacks with clear rationale
- Create C4 Model diagrams (Context, Container, Component, Code)
- Define API specifications (OpenAPI/Swagger)
- Establish security architecture (OWASP compliance)
- Set performance and scalability requirements

Output format: Structured architecture.md with:
1. System Overview (Vision, Goals, Constraints)
2. Architecture Diagrams (C4 Model)
3. Technology Stack Selection
   - Frontend Stack (with rationale)
   - Backend Stack (with rationale)
   - Infrastructure Stack (with rationale)
   - AI/ML Stack (with rationale)
4. API Design (OpenAPI spec)
5. Security Architecture (OWASP Top 10)
6. Performance Requirements (SLAs, Response Times)
7. Scalability Strategy (Horizontal/Vertical scaling)
8. Deployment Architecture (CI/CD, Blue/Green)

Always consider: cost optimization, operational excellence, security, reliability, and performance.
Prefer proven patterns over bleeding-edge technologies unless there's a compelling reason.`;
  }

  public async execute(task: string): Promise<string> {
    this.addToHistory({ role: 'system', content: this.getSystemPrompt() });
    this.addToHistory({ role: 'user', content: task });

    try {
      const response = await this.aiProvider.chat(
        this.conversationHistory,
        'planning', // Architecture is a planning task
        this.config.temperature
      );

      this.addToHistory({ role: 'assistant', content: response.content });
      return response.content;
    } catch (error) {
      console.error('Error in SolutionsArchitect execution:', error);
      throw error;
    }
  }
}
