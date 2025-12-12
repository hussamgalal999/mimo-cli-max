# 🚀 MIMO-CLI-MAX v5.0 - Quick Start Guide

## Installation

```bash
cd d:\MIMO-MAX-V2\mimo-cli-max-v5
npm install
```

## Usage

### 1. Interactive REPL Mode (Recommended)
```bash
npm run repl
# or
npm run dev
```

### 2. Command-Line Mode

#### Ask Claude (Backend Specialist)
```bash
npx ts-node bin/mimo.ts c "How to implement JWT authentication?"
```

#### Ask Gemini (System Architect)
```bash
npx ts-node bin/mimo.ts g "Design a microservices architecture"
```

#### Ask Aider (Frontend Developer)
```bash
npx ts-node bin/mimo.ts a "Create a React component with TypeScript"
```

#### Ask Codex (DevOps Engineer)
```bash
npx ts-node bin/mimo.ts x "Setup Docker multi-stage build"
```

#### Ask Perplexity (Researcher)
```bash
npx ts-node bin/mimo.ts p "Latest TypeScript best practices 2025"
```

### 3. Run Demos
```bash
# Agent Demo
npm run demo

# BMAD Workflow Demo
npm run workflow-demo
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your API keys:
```env
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
```

## Features

- ✅ 7 Specialized AI Agents
- ✅ BMAD Workflow Automation
- ✅ Professional Claude Code-style UI
- ✅ Real AI Integration (Anthropic, OpenAI, Gemini)
- ✅ Production-grade Error Handling & Logging
- ✅ Command-line & Interactive modes

## Commands

| Command | Description |
|---------|-------------|
| `mimo repl` | Launch interactive mode |
| `mimo c "prompt"` | Claude - Backend |
| `mimo g "prompt"` | Gemini - Architect |
| `mimo a "prompt"` | Aider - Frontend |
| `mimo x "prompt"` | Codex - DevOps |
| `mimo p "prompt"` | Perplexity - Research |
| `mimo demo` | Run demo |
| `mimo help` | Show help |

**Ready to revolutionize your workflow!** 🎯
