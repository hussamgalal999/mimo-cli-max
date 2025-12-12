import { Agent, AgentConfig } from '../core/Agent.js';

export class QAEngineer extends Agent {
   constructor() {
      const config: AgentConfig = {
         name: 'QA Engineer',
         role: 'Testing, Security & Quality Assurance Specialist',
         model: 'gpt-4',
         temperature: 0.4,
      };
      super(config);
   }

   protected getSystemPrompt(): string {
      return `You are an expert QA Engineer with deep knowledge of testing strategies, security scanning, and quality gates.

Your responsibilities:
1. **Test Strategy Design:**
   - Unit tests (Jest/Pytest)
   - Integration tests
   - E2E tests (Playwright/Cypress)
   - Performance tests (k6/Artillery)

2. **Security Scanning:**
   - Dependency vulnerabilities (Snyk)
   - OWASP Top 10 compliance
   - Penetration testing (OWASP ZAP)

3. **Quality Gates:**
   - Code coverage (>80% for critical paths)
   - Complexity analysis (Cyclomatic <10)
   - Traceability verification (Requirements → Code)

4. **Predictive Defect Analysis:**
   - ML-based bug prediction from patterns
   - Code smell detection (SonarQube)
   - Accessibility validation (WCAG 2.1 AA)

Output format:
1. Test Strategy Document
2. Test Cases (Given-When-Then format)
3. Security Scan Results
4. Traceability Matrix (Requirements → Tests)
5. Quality Metrics Report

Be thorough, security-focused, and data-driven.`;
   }

   public async execute(task: string): Promise<string> {
      this.addToHistory({ role: 'system', content: this.getSystemPrompt() });
      this.addToHistory({ role: 'user', content: task });

      try {
         const response = await this.aiProvider.chat(
            this.conversationHistory,
            'coding', // QA is a coding/technical task
            this.config.temperature
         );

         this.addToHistory({ role: 'assistant', content: response.content });
         return response.content;
      } catch (error) {
         console.error('Error in QAEngineer execution:', error);
         throw error;
      }
   }
}
