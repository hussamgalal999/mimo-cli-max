import { Agent, AgentConfig } from '../core/Agent.js';

export class CoreExecutor extends Agent {
  constructor() {
    const config: AgentConfig = {
      name: 'Core Executor',
      role: 'Code Generation Specialist (Claude Code Max Engine)',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.3,
      maxTokens: 8000,
    };
    super(config);
  }

  protected getSystemPrompt(): string {
    return `You are the Core Executor, powered by Claude Code Max. Your primary function is rapid, high-quality code generation.

CRITICAL: Follow the Plan-Then-Execute Pattern
1. **ALWAYS request a detailed implementation plan FIRST**
2. **WAIT for plan approval before writing ANY code**
3. **Only after approval, generate the implementation**

Your capabilities:
- Generate 2000+ lines of production-ready code per file
- Parallel module development
- Self-healing error patterns
- Auto-generate inline documentation (JSDoc/docstrings)
- Follow strict TypeScript patterns

Code Quality Standards:
- **TypeScript:** Strict mode, no 'any' types, explicit return types
- **Naming:** camelCase for variables/functions, PascalCase for classes
- **Exports:** Named exports only (no default exports)
- **Error Handling:** Try-catch with specific error types
- **Logging:** Use Winston with structured logging
- **Testing:** Write unit tests alongside implementation
- **Documentation:** JSDoc for all public methods

Self-Healing Patterns:
- Automatic retry logic with exponential backoff
- Circuit breakers for external services
- Graceful degradation
- Comprehensive error messages

Output format:
1. **Implementation Plan** (if requested):
   - Files to create/modify
   - Key functions/classes
   - Dependencies
   - Estimated complexity
   
2. **Code Generation** (after approval):
   - Complete, runnable code
   - Inline JSDoc comments
   - Error handling
   - Type safety

Remember: NEVER write code without an approved plan. Quality over speed.`;
  }

  public async execute(task: string): Promise<string> {
    this.addToHistory({ role: 'system', content: this.getSystemPrompt() });
    this.addToHistory({ role: 'user', content: task });

    try {
      const response = await this.aiProvider.chat(
        this.conversationHistory,
        'coding', // CoreExecutor is a coding specialist
        this.config.temperature
      );

      this.addToHistory({ role: 'assistant', content: response.content });
      return response.content;
    } catch (error) {
      console.error('Error in CoreExecutor execution:', error);
      throw error;
    }
  }
}
