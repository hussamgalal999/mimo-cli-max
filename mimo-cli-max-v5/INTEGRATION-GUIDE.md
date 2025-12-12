# MIMO CLI Optimization Integration Guide

This guide shows how to integrate the new optimization modules into your existing MIMO workflows.

## Quick Start Integration Examples

### 1. Enable Response Caching in AIProviderManager

```typescript
import { ResponseCache } from './core/ResponseCache.js';
import { AIProviderManager } from './core/AIProviderManager.js';

export class CachedAIProvider {
    private aiManager: AIProviderManager;
    private cache: ResponseCache;

    constructor() {
        this.aiManager = new AIProviderManager();
        this.cache = new ResponseCache('.mimo-cache', 3600000); // 1 hour TTL
    }

    async chat(messages: any[], taskType: string = 'general') {
        const cached = this.cache.get({ messages, taskType });
        if (cached) {
            console.log('✓ Cache hit - returning immediately');
            return cached;
        }

        console.log('⚡ Cache miss - querying AI providers...');
        const response = await this.aiManager.chat(messages, taskType);
        this.cache.set({ messages, taskType }, response);
        return response;
    }
}
```

### 2. Parallelize BMAD Workflows

```typescript
import { ParallelExecutor } from './core/ParallelExecutor.js';
import { ValidationWorkflow, PlanningWorkflow } from './workflows/BMADWorkflows.js';

export async function parallelBMADWorkflow(projectIdea: string) {
    const executor = new ParallelExecutor(2);

    executor.addTask({
        id: 'market-research',
        name: 'Market Research',
        execute: async () => {
            const validation = new ValidationWorkflow();
            return await validation.execute(projectIdea);
        },
        priority: 10
    });

    executor.addTask({
        id: 'planning',
        name: 'Architecture Planning',
        execute: async () => {
            const planning = new PlanningWorkflow();
            return await planning.execute(projectIdea);
        },
        dependencies: ['market-research'],
        priority: 5
    });

    const results = await executor.execute();
    return results;
}
```

### 3. Smart Provider Selection

```typescript
import { SmartProviderRouter } from './core/SmartProviderRouter.js';
import { AIProviderManager } from './core/AIProviderManager.js';

export class IntelligentAIRouter {
    private router: SmartProviderRouter;
    private aiManager: AIProviderManager;

    constructor() {
        this.router = new SmartProviderRouter();
        this.aiManager = new AIProviderManager();

        // Register available providers
        this.router.registerProvider('anthropic');
        this.router.registerProvider('openai');
        this.router.registerProvider('groq');
        this.router.registerProvider('perplexity');
    }

    async executeTaskWithBestProvider(task: string, taskType: 'coding' | 'planning' | 'research') {
        const availableProviders = ['anthropic', 'openai', 'groq', 'perplexity'];
        const bestProvider = this.router.selectBestProvider(
            availableProviders,
            taskType,
            { speed: true, quality: true }
        );

        console.log(`📍 Selected provider: ${bestProvider}`);

        try {
            const startTime = Date.now();
            const response = await this.callProvider(bestProvider, task, taskType);
            const responseTime = Date.now() - startTime;

            this.router.recordSuccess(bestProvider, responseTime, response.tokensUsed || 0);
            return response;
        } catch (error) {
            this.router.recordFailure(bestProvider);
            throw error;
        }
    }

    private async callProvider(provider: string, task: string, taskType: string) {
        // Call the appropriate provider
        return await this.aiManager.chat(
            [{ role: 'user', content: task }],
            taskType
        );
    }
}
```

### 4. Add Error Recovery to Operations

```typescript
import { ErrorRecovery } from './core/ErrorRecovery.js';

export async function safeFileOperation(operation: () => Promise<any>) {
    const recovery = new ErrorRecovery();

    const result = await recovery.executeWithRecovery(
        operation,
        'file_operation'
    );

    if (result.success) {
        console.log(`✓ Operation succeeded after ${result.attempts} attempt(s)`);
        return result.recoveredValue;
    } else {
        console.error(`✗ Operation failed: ${result.finalError?.message}`);
        throw result.finalError;
    }
}

// Usage
const data = await safeFileOperation(() => readLargeFile('data.json'));
```

### 5. Long-Running Workflow with Checkpoints

```typescript
import { CheckpointManager } from './core/CheckpointManager.js';

export async function longRunningProjectWorkflow(projectId: string) {
    const checkpoints = new CheckpointManager();

    // Check if resuming
    let state = {};
    const latestCheckpoint = checkpoints.getLatestCheckpoint(projectId);
    if (latestCheckpoint) {
        console.log(`📌 Resuming from: ${latestCheckpoint.name}`);
        state = latestCheckpoint.state;
    }

    // Phase 1: Validation
    console.log('🔍 Phase 1: Validation');
    const validationResult = await validateProject(state);
    state = { ...state, validation: validationResult };
    checkpoints.createCheckpoint(projectId, state, 'Validation Complete', 'validation', 33);

    // Phase 2: Planning
    console.log('📐 Phase 2: Planning');
    const planningResult = await planProject(state);
    state = { ...state, planning: planningResult };
    checkpoints.createCheckpoint(projectId, state, 'Planning Complete', 'planning', 66);

    // Phase 3: Development
    console.log('⚡ Phase 3: Development');
    const devResult = await developProject(state);
    state = { ...state, development: devResult };
    checkpoints.createCheckpoint(projectId, state, 'Development Complete', 'development', 100);

    // Clean up old checkpoints, keep last 5
    checkpoints.deleteOldCheckpoints(projectId, 5);

    return state;
}
```

### 6. Real-Time Progress Tracking

```typescript
import { ProgressTracker } from './core/ProgressTracker.js';

export async function trackLongOperation() {
    const tracker = new ProgressTracker();

    // Setup progress listeners
    tracker.on('start', (event) => {
        console.log(`🚀 Started: ${event.name}`);
    });

    tracker.on('progress', (event) => {
        const bar = '█'.repeat(Math.floor(event.percentage / 5));
        const empty = '░'.repeat(20 - bar.length);
        console.log(`[${bar}${empty}] ${event.percentage}% - ETA: ${event.eta}ms`);
    });

    tracker.on('complete', (event) => {
        console.log(`✓ Completed in ${event.metrics.duration}ms`);
    });

    // Execute operation with tracking
    tracker.startOperation('op1', 'Analyzing 1000 files', 1000);

    for (let i = 0; i < 1000; i++) {
        await analyzeFile(files[i]);
        tracker.updateProgress('op1', i + 1, `Analyzed ${i + 1}/1000 files`);
    }

    tracker.completeOperation('op1');
}
```

### 7. Batch File Operations

```typescript
import { OptimizedFileIO } from './core/OptimizedFileIO.js';

export async function processManyFiles() {
    const fileIO = new OptimizedFileIO();

    // Batch write files
    const writeOps = [
        { filePath: 'src/component1.ts', content: componentCode1 },
        { filePath: 'src/component2.ts', content: componentCode2 },
        { filePath: 'src/component3.ts', content: componentCode3 },
        // ... many more files
    ];

    const writeResult = await fileIO.batchWriteFiles(writeOps);
    console.log(`✓ Written ${writeResult.success} files, ${writeResult.failed} failed`);

    // Batch read files
    const filePaths = await fileIO.findFilesRecursive('src', /\.(ts|tsx)$/);
    const readResult = await fileIO.batchReadFiles(filePaths);
    console.log(`✓ Read ${readResult.success} files, ${readResult.failed} failed`);
}
```

### 8. Quality Assurance with Consensus

```typescript
import { ConsensusLayer } from './core/ConsensusLayer.js';

export async function validateCodeWithConsensus(generatedCode: string) {
    const consensus = new ConsensusLayer();

    const agents = ['CoreExecutor', 'QAEngineer', 'SolutionsArchitect'];
    const result = await consensus.vote('code-generation', agents, generatedCode);

    console.log(`
🗳️  Consensus Vote Results:
${result.votes.map(v => `  ${v.agent}: ${v.vote} (${(v.confidence * 100).toFixed(0)}%)`).join('\n')}

Decision: ${result.decision.toUpperCase()}
Confidence: ${(result.confidence * 100).toFixed(1)}%
Supermajority: ${result.supermajorityReached ? '✓ YES' : '✗ NO'}
    `);

    return result.supermajorityReached;
}
```

## Integration Checklist

- [ ] Add `ResponseCache` to `AIProviderManager` wrapper
- [ ] Replace sequential workflows with `ParallelExecutor`
- [ ] Integrate `SmartProviderRouter` into provider selection logic
- [ ] Wrap critical operations with `ErrorRecovery`
- [ ] Add `CheckpointManager` to long-running workflows
- [ ] Integrate `ProgressTracker` into CLI operations
- [ ] Use `OptimizedFileIO` for file operations
- [ ] Add `ConsensusLayer` voting to quality gates
- [ ] Create `CircuitBreaker` for API calls
- [ ] Setup monitoring and metrics collection

## Performance Verification

After integration, verify improvements:

```bash
# Check TypeScript compilation
npm run build

# Run existing tests to ensure compatibility
npm run test

# Profile memory usage
node --prof app.js

# Monitor cache hit rate
npm run monitor:cache

# Track provider performance
npm run monitor:providers
```

## Common Integration Patterns

### Pattern 1: Cache + Streaming
```typescript
const cache = new ResponseCache();
const streaming = new StreamingHandler();

const cached = cache.get(query);
if (cached) {
    await streaming.streamResponse(cached.content, { /* ... */ });
} else {
    const response = await aiManager.chat(messages);
    cache.set(query, response);
    await streaming.streamResponse(response.content, { /* ... */ });
}
```

### Pattern 2: Parallel + Recovery
```typescript
const executor = new ParallelExecutor(4);
const recovery = new ErrorRecovery();

executor.addTask({
    id: 'task1',
    execute: () => recovery.executeWithRecovery(() => operation1(), 'api_call')
});
```

### Pattern 3: Progress + Checkpoint
```typescript
tracker.startOperation('workflow', 'Full BMAD', 3);

// Phase 1
await phase1();
tracker.updateProgress('workflow', 1);
checkpoints.createCheckpoint(id, state, 'P1', 'phase1', 33);

// Phase 2
await phase2();
tracker.updateProgress('workflow', 2);
checkpoints.createCheckpoint(id, state, 'P2', 'phase2', 66);

// Phase 3
await phase3();
tracker.updateProgress('workflow', 3);
tracker.completeOperation('workflow');
```

## Troubleshooting

### Cache Not Working
```typescript
const stats = cache.getStats();
if (stats.hits === 0) {
    console.log('Cache enabled but no hits - check key generation');
}
```

### Parallelization Slower
```typescript
// Reduce concurrency for I/O-bound tasks
const executor = new ParallelExecutor(2);

// Increase for CPU-bound tasks
const executor = new ParallelExecutor(8);
```

### Progress Not Updating
```typescript
// Ensure event listeners are registered BEFORE starting
tracker.on('progress', (event) => { /* ... */ });
tracker.startOperation('op', 'task', total);
```

## Next Steps

1. **Measure baseline performance** before integration
2. **Integrate modules one at a time** to isolate improvements
3. **Monitor production** for actual performance gains
4. **Adjust configuration** based on usage patterns
5. **Share metrics** with team for optimization feedback

---

For more details, see `OPTIMIZATION-IMPROVEMENTS.md`
