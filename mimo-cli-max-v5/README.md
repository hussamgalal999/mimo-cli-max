# 🚀 MIMO-CLI-MAX v5.0 - Ultimate AI Coding Assistant

> **Production-grade multi-agent CLI platform with 10 AI providers, 20+ models, and months-long project support**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)
[![AI Providers](https://img.shields.io/badge/AI%20Providers-10-purple)](https://github.com)
[![Models](https://img.shields.io/badge/Models-20%2B-orange)](https://github.com)

---

## 🎯 Overview

**MIMO-CLI-MAX** is the **most comprehensive AI coding assistant** available, combining the power of **10 AI providers**, **20+ models**, and **7 specialized agents** to handle autonomous software development from ideation to deployment.

### 🌟 What Makes MIMO Special

- 🤖 **10 AI Providers** - OpenAI, Anthropic, Google, Perplexity, Groq, Mistral, DeepSeek, Together, OpenRouter, Ollama
- 🧠 **20+ AI Models** - From GPT-4o to Claude 3.5 Sonnet to Llama 3.3
- 📅 **Months-Long Projects** - Full persistence, checkpoints, conversation history
- 🛠️ **50+ Tools** - FileSystem, Terminal, Browser, Git, Testing
- 🔄 **BMAD Workflows** - Validation → Planning → Development → Delivery
- 🎨 **Claude Code Features** - MCP, Code Indexing, Semantic Search
- 💰 **Cost Tracking** - Real-time budget monitoring across all providers

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [AI Providers](#-ai-providers)
- [Commands](#-commands)
- [Architecture](#-architecture)
- [Advanced Features](#-advanced-features)
- [Examples](#-examples)
- [Contributing](#-contributing)

---

## ✨ Features

### 🧠 Multi-Agent System (7 Specialized Agents)

1. **Market Analyst** - Market research & competitive analysis
2. **Product Manager** - PRD creation & epic definition
3. **Solutions Architect** - System design with C4 diagrams
4. **Product Owner** - Epic sharding & WSJF prioritization
5. **Core Executor** - Code generation (Claude Code Max adapter)
6. **QA Engineer** - Testing, security scanning, quality gates
7. **DevOps Specialist** - IaC, CI/CD, deployment automation

### 🌐 Multi-Model AI Support (10 Providers, 20+ Models)

| Provider | Models | Best For |
|----------|--------|----------|
| **OpenAI** | GPT-4o, GPT-4 Turbo, O1 | General purpose, reasoning |
| **Anthropic** | Claude 3.5 Sonnet, Opus | Coding, analysis |
| **Google** | Gemini 1.5 Pro, Flash | Long context (2M tokens) |
| **Perplexity** | Sonar Huge | Research, online search |
| **Groq** | Llama 3.3 70B | Ultra-fast inference |
| **Mistral** | Large, Codestral | European AI, coding |
| **DeepSeek** | Coder, Chat | Affordable coding |
| **Together AI** | Llama 3.3 | Open source models |
| **OpenRouter** | 100+ models | Gateway to all models |
| **Ollama** | Local models | Privacy, offline |

### 🔄 BMAD Workflows

- **Validation Workflow** - Market validation before code
- **Planning Workflow** - Comprehensive specification generation
- **Development Workflow** - Plan-Then-Execute code generation
- **Delivery Workflow** - Automated deployment & monitoring

### 🛠️ Advanced Tools (50+ Tools)

#### FileSystem Tools
- Read/Write files with diff generation
- Directory listing and search
- File watching and monitoring

#### Terminal Tools
- Safe command execution
- Process management
- Dangerous command detection

#### Browser Tools (Computer Use)
- Puppeteer-based automation
- Screenshot capture
- JavaScript evaluation

#### Git Integration
- Full git operations (status, commit, push, pull)
- Branch management
- Diff generation

#### Testing
- Multi-framework support (Jest, Vitest, Mocha, Playwright, Cypress)
- Coverage reports
- Watch mode

### 🎯 Claude Code Features

- **MCP Server** - Model Context Protocol integration
- **Code Indexer** - Semantic code search
- **Project Manager** - Months-long project persistence
- **Enhanced Workflows** - Plan approval, diff review, cost budgeting

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- At least one AI provider API key

### Install

```bash
# Clone repository
git clone https://github.com/username/mimo-cli-max.git
cd mimo-cli-max

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env
nano .env
```

---

## 🚀 Quick Start

### 1. Add API Keys

Edit `.env` and add at least one provider:

```env
# Choose your provider(s)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk-...
PERPLEXITY_API_KEY=pplx-...
```

### 2. Run Demo

```bash
# See all 7 agents in action
npm run mimo:demo

# Explore 20+ AI models
npm run mimo:models

# View available tools
npm run mimo:tools

# Test BMAD workflows
npm run mimo:workflow
```

### 3. Start Building

```bash
# Interactive REPL
npm run mimo:repl

# Or use programmatically
npm run mimo
```

---

## 🌐 AI Providers

### Setup Instructions

#### OpenAI
```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```
Get key: https://platform.openai.com

#### Anthropic (Claude)
```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```
Get key: https://console.anthropic.com

#### Groq (Ultra-Fast)
```env
GROQ_API_KEY=gsk-...
GROQ_MODEL=llama-3.3-70b-versatile
```
Get key: https://console.groq.com

#### Perplexity (Online Search)
```env
PERPLEXITY_API_KEY=pplx-...
PERPLEXITY_MODEL=llama-3.1-sonar-huge-128k-online
```
Get key: https://www.perplexity.ai/settings/api

#### OpenRouter (100+ Models)
```env
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```
Get key: https://openrouter.ai/keys

#### Ollama (Local, Free)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.2

# No API key needed!
OLLAMA_API_KEY=ollama
```

---

## 💻 Commands

### Professional `mimo:*` Commands

```bash
# Main CLI
npm run mimo

# Demonstrations
npm run mimo:demo          # 7 agents demo
npm run mimo:models        # Model catalog
npm run mimo:tools         # Tools showcase
npm run mimo:workflow      # BMAD workflows

# Interactive
npm run mimo:repl          # REPL mode

# Development
npm run build              # Build project
npm run test               # Run tests
npm run lint               # Lint code
```

---

## 🏗️ Architecture

### Orchestration Patterns

1. **Supervisor** - Centralized control
2. **Adaptive** - Dynamic task allocation
3. **Swarm** - Parallel collaboration
4. **Hybrid** - Best of all worlds ✅

### Consensus Mechanism

- **Supermajority Voting** (67% threshold)
- **Weighted Confidence Scoring**
- **Automatic Conflict Resolution**

---

## 🎯 Advanced Features

### 1. Long-Term Project Management

```typescript
import { ProjectManager } from './core/ProjectManager';

const project = new ProjectManager('./my-app');

// Create project
await project.createProject('E-Commerce App', 'Full-stack platform');

// Work for months
await project.addConversation({ role: 'user', content: 'Add payments' });
await project.createCheckpoint('Payment integration complete');

// Resume anytime
await project.resumeProject();
const context = project.getRecentContext(50);
```

### 2. Code Indexing & Search

```typescript
import { CodeIndexer } from './core/CodeIndexer';

const indexer = new CodeIndexer();
await indexer.indexDirectory('./src');

// Find anything instantly
const userService = indexer.findDefinition('UserService');
const references = indexer.findReferences('authenticate');
const allServices = indexer.searchSymbolPattern(/.*Service$/);
```

### 3. Git Integration

```typescript
import { GitIntegration } from './core/GitIntegration';

const git = new GitIntegration();

const status = await git.getStatus();
await git.stageFiles(['src/auth.ts']);
await git.commit('Add authentication');
await git.push();
```

### 4. Automated Testing

```typescript
import { TestRunner } from './core/TestRunner';

const runner = new TestRunner();

// Auto-detect framework
const framework = await runner.detectFramework();

// Run with coverage
const results = await runner.runWithCoverage('jest');
console.log(`${results.passed} passed, ${results.failed} failed`);
```

### 5. Enhanced Workflows

```typescript
import { EnhancedWorkflows } from './workflows/EnhancedWorkflows';

const workflows = new EnhancedWorkflows();

// Plan approval
const approval = await workflows.requestPlanApproval(plan);

// Diff review
const approved = await workflows.reviewDiff(file, oldContent, newContent);

// Cost budgeting
await workflows.checkBudget(10000, 'claude-3-5-sonnet', 1.0);
```

---

## 📊 Examples

### Example 1: Build Full-Stack App

```bash
npm run mimo:repl
```

```
> Create a full-stack e-commerce app with Next.js, Stripe, and PostgreSQL

[MIMO will:]
1. Market Analyst: Research e-commerce trends
2. Product Manager: Generate PRD
3. Solutions Architect: Design system architecture
4. Product Owner: Create prioritized epics
5. Core Executor: Generate code
6. QA Engineer: Create tests
7. DevOps: Setup CI/CD
```

### Example 2: Multi-Model Comparison

```typescript
const manager = new AIProviderManager();

// Try different models for same task
const claudeResponse = await manager.chatWithClaude(messages);
const gptResponse = await manager.chatWithGPT(messages);
const groqResponse = await manager.chatWithGroq(messages);

// Compare speed, cost, quality
```

---

## 🔐 Security

- ✅ Dangerous command detection
- ✅ User approval for destructive operations
- ✅ Sandboxed execution environment
- ✅ API key encryption (coming soon)

---

## 💰 Cost Tracking

```typescript
import { CostTracker } from './utils/CostTracker';

const tracker = new CostTracker();

// Track usage
tracker.addUsage('claude-3-5-sonnet', 1000, 500);

// Get totals
const total = tracker.getTotalCost();
const byModel = tracker.getCostByModel();
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Anthropic for Claude
- OpenAI for GPT models
- Google for Gemini
- Groq for ultra-fast inference
- All open-source contributors

---

## 📞 Support

- 📧 Email: support@mimo-cli-max.com
- 💬 Discord: [Join our community](https://discord.gg/mimo)
- 🐛 Issues: [GitHub Issues](https://github.com/username/mimo-cli-max/issues)

---

**Made with ❤️ by the MIMO Team**

**⭐ Star us on GitHub if you find this useful!**
