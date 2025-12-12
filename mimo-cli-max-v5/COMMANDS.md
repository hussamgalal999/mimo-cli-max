# 🎯 MIMO-CLI-MAX - Complete Commands Reference

## 📋 All Available Commands

### 🚀 Basic Commands

```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build

# 3. Clean build
npm run clean
```

---

## 🎮 Interactive Commands

### 1. **Interactive REPL Mode**
```bash
npm run mimo:repl
```
**Description:** Opens interactive interface to chat with all 7 agents

**Example:**
```
> Create a REST API with Express
> Add authentication with JWT
> Generate tests
```

---

### 2. **Direct Execution**
```bash
npm run mimo
```
**Description:** Run MIMO directly

---

## 🎨 Demo Commands

### 1. **Main Demo - All Agents**
```bash
npm run mimo:demo
```
**Description:** Shows all 7 agents in action:
- Market Analyst
- Product Manager
- Solutions Architect
- Product Owner
- Core Executor
- QA Engineer
- DevOps Specialist

---

### 2. **Models Demo - 100+ AI Models**
```bash
npm run mimo:models
```
**Description:** Displays all available AI models:
- 🇺🇸 USA: OpenAI, Anthropic, Google, Perplexity, Groq
- 🇨🇳 China: Alibaba, Baidu, Tencent, ByteDance, Zhipu AI
- 🇪🇺 Europe: Mistral, Aleph Alpha
- 🇯🇵 Japan: Rakuten, Stability AI
- 🇰🇷 Korea: Naver HyperCLOVA

---

### 3. **Tools Demo - 50+ Tools**
```bash
npm run mimo:tools
```
**Description:** Shows all available tools:
- 📁 FileSystem (read/write files)
- 💻 Terminal (execute commands)
- 🌐 Browser (browser automation)
- 🔧 Git (git operations)
- 🧪 Testing (automated tests)

---

### 4. **Workflow Demo (BMAD)**
```bash
npm run mimo:workflow
```
**Description:** Shows complete BMAD workflow:
- Validation
- Planning
- Development
- Delivery

---

### 5. **Perplexity Demo - Hybrid Search** 🆕
```bash
npm run mimo:perplexity
```
**Description:** Shows Perplexity hybrid capabilities:
- 🌐 Online search with citations
- 💻 Pure coding without search
- 🧠 Advanced reasoning
- 🔄 Hybrid: Search → Code

---

## 🧪 Testing & Quality Commands

### 1. **Run Tests**
```bash
npm test
```
**Description:** Run all tests using Jest

---

### 2. **Lint Code**
```bash
npm run lint
```
**Description:** Check code quality

---

### 3. **Format Code**
```bash
npm run format
```
**Description:** Format code using Prettier

---

## 📦 Production Commands

### 1. **Production Start**
```bash
npm start
```
**Description:** Run built version (dist/)

---

### 2. **Prepare for Publishing**
```bash
npm run prepublishOnly
```
**Description:** Build project before publishing

---

## 🎯 Direct CLI Commands

### Use agents directly:

```bash
# Claude - Backend Specialist
npx tsx bin/mimo.ts c "How to implement JWT?"

# Gemini - System Architect
npx tsx bin/mimo.ts g "Design microservices architecture"

# Aider - Frontend Developer
npx tsx bin/mimo.ts a "Create React component"

# Codex - DevOps Engineer
npx tsx bin/mimo.ts x "Setup Docker"

# Perplexity - Researcher
npx tsx bin/mimo.ts p "Latest TypeScript features"
```

---

## 🔧 Project Setup

### 1. **Copy Environment File**
```bash
cp .env.example .env
```

### 2. **Add API Keys**
Open `.env` and add your keys:

```env
# OpenAI
OPENAI_API_KEY=sk-your_key_here

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Google (Gemini)
GOOGLE_API_KEY=your_key_here

# Perplexity
PERPLEXITY_API_KEY=pplx-your_key_here

# Groq (FREE!)
GROQ_API_KEY=gsk-your_key_here
```

---

## 📚 Available Documentation Files

### 1. **README.md**
```bash
# View file
cat README.md
```
**Contents:**
- MIMO overview
- All features
- 10 AI providers
- 20+ models
- Installation guide

---

### 2. **USER_GUIDE.md**
```bash
# View file
cat USER_GUIDE.md
```
**Contents:**
- Complete user guide
- Practical examples
- Troubleshooting
- Best practices
- 500+ lines of documentation

---

### 3. **QUICKSTART.md**
```bash
# View file
cat QUICKSTART.md
```
**Contents:**
- Quick start guide
- Basic commands
- Quick examples

---

## 🌟 Additional Useful Commands

### Show all available commands:
```bash
npm run
```

### Show project info:
```bash
npm info
```

### Update dependencies:
```bash
npm update
```

### Check security vulnerabilities:
```bash
npm audit
```

---

## 🎯 Common Usage Scenarios

### 1. **Quick Start (Beginners)**
```bash
# 1. Install
npm install

# 2. Copy environment
cp .env.example .env

# 3. Add Groq key (FREE!)
# Open .env and add: GROQ_API_KEY=gsk-...

# 4. Run demo
npm run mimo:demo
```

---

### 2. **Explore Models**
```bash
# Show all models
npm run mimo:models

# Show Perplexity
npm run mimo:perplexity

# Show tools
npm run mimo:tools
```

---

### 3. **Interactive Development**
```bash
# Open REPL
npm run mimo:repl

# Then type:
> Create a blog with Next.js
> Add authentication
> Generate tests
```

---

### 4. **Search & Code (Perplexity)**
```bash
npm run mimo:perplexity
```
**Shows:**
- Online search with citations
- Pure coding
- Advanced reasoning
- Hybrid workflow

---

## 📊 Commands Summary

| Command | Description | Usage |
|---------|-------------|-------|
| `npm install` | Install dependencies | Once |
| `npm run mimo:demo` | Show all agents | Try |
| `npm run mimo:models` | Show 100+ models | Explore |
| `npm run mimo:tools` | Show 50+ tools | Explore |
| `npm run mimo:perplexity` | Show Perplexity | Search + Code |
| `npm run mimo:workflow` | Show BMAD | Workflow |
| `npm run mimo:repl` | Interactive mode | Develop |
| `npm run mimo` | Direct run | Production |
| `npm test` | Tests | Quality |
| `npm run build` | Build | Deploy |

---

## 🚀 Start Now!

### Step 1: Install
```bash
npm install
```

### Step 2: Setup
```bash
cp .env.example .env
# Add at least one API key
```

### Step 3: Try
```bash
# Try demo
npm run mimo:demo

# Or try Perplexity
npm run mimo:perplexity

# Or open REPL
npm run mimo:repl
```

---

## 💡 Important Tips

### 1. **For Beginners:**
Start with Groq (free and fast):
```env
GROQ_API_KEY=gsk-your_key_here
```
Get key: https://console.groq.com

---

### 2. **For Best Coding Quality:**
Use Claude:
```env
ANTHROPIC_API_KEY=sk-ant-your_key_here
```
Get key: https://console.anthropic.com

---

### 3. **For Research & Documentation:**
Use Perplexity:
```env
PERPLEXITY_API_KEY=pplx-your_key_here
```
Get key: https://www.perplexity.ai/settings/api

---

### 4. **For Privacy (Local & Free):**
Use Ollama:
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.2

# No API key needed!
```

---

## 📞 Get Help

### Show help:
```bash
npx tsx bin/mimo.ts help
```

### Read documentation:
- [README.md](file:///d:/MIMO-MAX-V2/mimo-cli-max-v5/README.md) - Overview
- [USER_GUIDE.md](file:///d:/MIMO-MAX-V2/mimo-cli-max-v5/USER_GUIDE.md) - User Guide
- [QUICKSTART.md](file:///d:/MIMO-MAX-V2/mimo-cli-max-v5/QUICKSTART.md) - Quick Start

---

## 🎉 Ready to Use!

All commands are documented and ready. Start now:

```bash
npm run mimo:demo
```

**Happy coding with MIMO! 🚀**
