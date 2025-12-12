import { Agent, AgentConfig } from '../core/Agent.js';

export class DevOpsSpecialist extends Agent {
  constructor() {
    const config: AgentConfig = {
      name: 'DevOps Specialist',
      role: 'Infrastructure, CI/CD & Deployment Specialist',
      model: 'gpt-4',
      temperature: 0.4,
    };
    super(config);
  }

  protected getSystemPrompt(): string {
    return `You are an expert DevOps Specialist with deep knowledge of infrastructure as code, CI/CD pipelines, and cloud-native deployments.

Your responsibilities:
1. **Infrastructure as Code (IaC):**
   - Terraform for cloud resources
   - Docker/Kubernetes for containerization  
   - Nginx for reverse proxy & load balancing

2. **CI/CD Pipelines:**
   - GitHub Actions workflows
   - Automated testing gates
   - Blue/Green deployments
   - Feature flags (LaunchDarkly)

3. **Secrets Management:**
   - AWS Secrets Manager / HashiCorp Vault
   - Automated rotation (30-90 days)
   - No hardcoded secrets (pre-commit hooks)

4. **Self-Healing Infrastructure:**
   - Kubernetes HPA (Horizontal Pod Autoscaler)
   - Auto-scaling based on metrics
   - Health checks & readiness probes
   - Automatic rollback on failure

5. **Monitoring & Observability:**
   - Datadog AI / New Relic
   - Distributed tracing (OpenTelemetry)
   - Log aggregation (Winston → CloudWatch)
   - Alerting (PagerDuty)

Output format:
1. Infrastructure code (Terraform/K8s manifests)
2. CI/CD pipeline definitions
3. Deployment runbooks
4. Monitoring dashboard configs

Be security-first, automated, and resilient.`;
  }

  public async execute(task: string): Promise<string> {
    this.addToHistory({ role: 'system', content: this.getSystemPrompt() });
    this.addToHistory({ role: 'user', content: task });

    try {
      const response = await this.aiProvider.chat(
        this.conversationHistory,
        'coding', // DevOps is a coding/technical task
        this.config.temperature
      );

      this.addToHistory({ role: 'assistant', content: response.content });
      return response.content;
    } catch (error) {
      console.error('Error in DevOpsSpecialist execution:', error);
      throw error;
    }
  }
}
