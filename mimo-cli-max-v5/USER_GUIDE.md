# 📚 MIMO-CLI-MAX User Guide

## Welcome to MIMO!

This guide will help you get started with MIMO-CLI-MAX, the most comprehensive AI coding assistant available.

---

## 🎯 What is MIMO?

MIMO is an **AI-powered development platform** that uses **7 specialized agents** and **10 AI providers** to autonomously handle software development from idea to deployment.

---

## 🚀 Getting Started

### Step 1: Installation

```bash
# Clone the repository
git clone https://github.com/username/mimo-cli-max.git
cd mimo-cli-max

# Install dependencies
npm install
```

### Step 2: Configure API Keys

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add at least one API key:
   ```env
   # Recommended: Start with Groq (free, fast)
   GROQ_API_KEY=gsk-your_key_here
   
   # Or use Claude (best for coding)
   ANTHROPIC_API_KEY=sk-ant-your_key_here
   
   # Or OpenAI
   OPENAI_API_KEY=sk-your_key_here
   ```

### Step 3: Run Your First Demo

```bash
npm run mimo:demo
```

You'll see all 7 agents working together!

---

## 💡 Basic Usage

### Interactive REPL Mode

```bash
npm run mimo:repl
```

Then type your requests:
```
> Create a REST API with Express and PostgreSQL
> Add authentication with JWT
> Generate tests for the auth module
```

### View Available Models

```bash
npm run mimo:models
```

This shows all 20+ AI models you can use.

### Explore Tools

```bash
npm run mimo:tools
```

See the 50+ tools MIMO can use (file operations, terminal commands, browser automation, etc.)

---

## 🌐 Choosing an AI Provider

### For Beginners

**Start with Groq** (Free, Ultra-Fast):
```env
GROQ_API_KEY=gsk-...
GROQ_MODEL=llama-3.3-70b-versatile
```

Get your key: https://console.groq.com

### For Best Coding Quality

**Use Claude** (Premium):
```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

Get your key: https://console.anthropic.com

### For Research & Planning

**Use Perplexity** (Online Search):
```env
PERPLEXITY_API_KEY=pplx-...
PERPLEXITY_MODEL=llama-3.1-sonar-huge-128k-online
```

Get your key: https://www.perplexity.ai/settings/api

### For Privacy (Local, Free)

**Use Ollama**:
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.2

# No API key needed!
```

---

## 🎯 Common Tasks

### 1. Create a New Project

```typescript
import { ProjectManager } from './core/ProjectManager';

const project = new ProjectManager('./my-new-app');
await project.createProject(
  'My App',
  'A full-stack web application'
);
```

MIMO will create a `.mimo` directory to track your project over weeks/months.

### 2. Generate Code

```bash
npm run mimo:repl
```

```
> Create a user authentication system with:
  - Login/Signup endpoints
  - JWT tokens
  - Password hashing with bcrypt
  - Email verification
```

MIMO will:
1. Create an implementation plan
2. Ask for your approval
3. Generate the code
4. Create tests
5. Setup deployment

### 3. Search Your Codebase

```typescript
import { CodeIndexer } from './core/CodeIndexer';

const indexer = new CodeIndexer();
await indexer.indexDirectory('./src');

// Find any symbol
const userService = indexer.findDefinition('UserService');
console.log(`Found at: ${userService.file}:${userService.line}`);
```

### 4. Run Tests

```typescript
import { TestRunner } from './core/TestRunner';

const runner = new TestRunner();
const results = await runner.runWithCoverage('jest');

console.log(`✅ ${results.passed} passed`);
console.log(`❌ ${results.failed} failed`);
console.log(`📊 Coverage: ${results.coverage}%`);
```

### 5. Git Operations

```typescript
import { GitIntegration } from './core/GitIntegration';

const git = new GitIntegration();

// Check status
const status = await git.getStatus();
console.log(`Branch: ${status.branch}`);
console.log(`Modified: ${status.modified.length} files`);

// Commit changes
await git.stageAll();
await git.commit('Add new feature');
await git.push();
```

---

## 🔄 BMAD Workflows

MIMO follows the **BMAD methodology**:

### Phase 1: Validation (0-1.5 weeks)
- Market research
- Competitive analysis
- Business hypothesis

### Phase 2: Planning (0.5-2.5 weeks)
- PRD creation
- Architecture design
- Epic prioritization

### Phase 3: Development (1.5-10 weeks)
- Code generation
- Testing
- Quality assurance

### Phase 4: Delivery
- Deployment
- Monitoring
- Iteration

Run the full workflow:
```bash
npm run mimo:workflow
```

---

## 💰 Managing Costs

### View Cost Estimates

```typescript
import { CostTracker } from './utils/CostTracker';

// Estimate before running
const estimate = CostTracker.calculateCost(
  10000,  // input tokens
  5000,   // output tokens
  'claude-3-5-sonnet-20241022'
);

console.log(`Estimated cost: $${estimate.cost.toFixed(4)}`);
```

### Set Budget Limits

```typescript
import { EnhancedWorkflows } from './workflows/EnhancedWorkflows';

const workflows = new EnhancedWorkflows();

// Check budget before execution
await workflows.checkBudget(
  10000,  // estimated tokens
  'claude-3-5-sonnet',
  1.0     // max budget: $1.00
);
```

### Cost-Saving Tips

1. **Use Groq for fast iterations** (cheapest)
2. **Use DeepSeek for coding** (affordable, good quality)
3. **Use Claude only for critical tasks** (premium)
4. **Use Ollama for experimentation** (free, local)

---

## 🛠️ Advanced Features

### MCP Server (Claude Desktop Integration)

```typescript
import { MCPServer } from './core/MCPServer';

const server = new MCPServer();
await server.start();

// Now Claude Desktop can use MIMO's tools!
```

### Code Indexing

```bash
# Index your entire codebase
npm run mimo
```

```typescript
> Index the current project
```

MIMO will:
- Scan all TypeScript/JavaScript files
- Extract classes, functions, interfaces
- Build a searchable index
- Enable instant symbol lookup

### Project Persistence

MIMO automatically saves:
- All conversations
- Checkpoints
- Cost tracking
- Artifacts

Resume anytime:
```typescript
const project = new ProjectManager('./my-app');
await project.resumeProject();

// Get recent context
const context = project.getRecentContext(50);
```

---

## 🎨 Customization

### Change Default Model

Edit `.env`:
```env
# Use a different default model
ANTHROPIC_MODEL=claude-3-opus-20240229
OPENAI_MODEL=gpt-4-turbo
GROQ_MODEL=mixtral-8x7b-32768
```

### Adjust Orchestration

```env
# Change orchestration pattern
DEFAULT_ORCHESTRATION_PATTERN=swarm

# Adjust consensus threshold
CONSENSUS_THRESHOLD=0.75
```

### Enable/Disable Features

```env
# Disable tool approval
TOOLS_REQUIRE_APPROVAL=false

# Enable MCP
MCP_ENABLED=true

# Auto-checkpoint every 30 minutes
AUTO_CHECKPOINT_INTERVAL=30
```

---

## 🐛 Troubleshooting

### Issue: "No AI provider configured"

**Solution:** Add at least one API key to `.env`

### Issue: "Module not found"

**Solution:** Run `npm install`

### Issue: "Permission denied"

**Solution:** Some operations require approval. Check terminal for prompts.

### Issue: "Rate limit exceeded"

**Solution:** 
1. Switch to a different provider
2. Add delays between requests
3. Use a cheaper model (Groq, DeepSeek)

---

## 📚 Examples

### Example 1: Build a Blog

```
> Create a blog with:
  - Next.js 14 (App Router)
  - MDX for posts
  - Tailwind CSS
  - Dark mode
  - SEO optimization
```

### Example 2: Add Authentication

```
> Add authentication to my Express app:
  - JWT tokens
  - Refresh tokens
  - Password reset
  - Email verification
  - Rate limiting
```

### Example 3: Generate Tests

```
> Generate comprehensive tests for src/auth/AuthService.ts:
  - Unit tests
  - Integration tests
  - Edge cases
  - 100% coverage
```

---

## 🎓 Best Practices

### 1. Start Small
Begin with simple tasks to understand how MIMO works.

### 2. Review Plans
Always review implementation plans before approval.

### 3. Use Checkpoints
Create checkpoints after major milestones:
```typescript
await project.createCheckpoint('Authentication complete');
```

### 4. Track Costs
Monitor spending regularly:
```typescript
const summary = project.getProjectSummary();
console.log(`Total cost: $${summary.totalCost.toFixed(2)}`);
```

### 5. Leverage Multiple Models
- **Planning:** Perplexity (online search)
- **Coding:** Claude or DeepSeek
- **Review:** GPT-4
- **Fast iterations:** Groq

---

## 🚀 Next Steps

1. **Try the demos:**
   ```bash
   npm run mimo:demo
   npm run mimo:models
   npm run mimo:tools
   ```

2. **Create your first project:**
   ```bash
   npm run mimo:repl
   > Create a REST API with Express
   ```

3. **Explore the codebase:**
   - `src/agents/` - 7 specialized agents
   - `src/core/` - Core systems
   - `src/tools/` - 50+ tools
   - `src/workflows/` - BMAD workflows

4. **Join the community:**
   - Discord: [Join here](https://discord.gg/mimo)
   - GitHub: [Star the repo](https://github.com/username/mimo-cli-max)

---

## 📞 Need Help?

- 📖 Read the [README](README.md)
- 💬 Ask on [Discord](https://discord.gg/mimo)
- 🐛 Report [Issues](https://github.com/username/mimo-cli-max/issues)
- 📧 Email: support@mimo-cli-max.com

---

**Happy coding with MIMO! 🚀**
