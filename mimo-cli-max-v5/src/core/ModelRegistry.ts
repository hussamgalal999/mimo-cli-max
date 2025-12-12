/**
 * MIMO Model Registry - COMPLETE GLOBAL EDITION
 * Comprehensive AI Model Encyclopedia with 100+ Models from 30+ Providers
 * Including: Chinese, Japanese, Korean, European, American, and Open Source models
 */

import OpenAI from 'openai';
import { log } from '../utils/Logger.js';

export interface ModelInfo {
    id: string;
    name: string;
    provider: string;
    contextWindow: number;
    maxOutput: number;
    inputPrice: number;   // per 1M tokens
    outputPrice: number;  // per 1M tokens
    capabilities: string[];
    speed: 'fast' | 'medium' | 'slow';
    quality: 'standard' | 'high' | 'premium';
    available: boolean;
    region?: 'global' | 'china' | 'japan' | 'korea' | 'europe' | 'us';
    description?: string; // Optional detailed description
}

export interface ProviderConfig {
    name: string;
    baseURL: string;
    apiKeyEnv: string;
    models: string[];
    region?: string;
    free?: boolean;
}

/**
 * Model Registry - Encyclopedia of 100+ AI Models from 30+ Providers
 */
export class ModelRegistry {
    private static readonly PROVIDERS: Record<string, ProviderConfig> = {
        // ═══════════════════════════════════════════════════════════
        // AMERICAN PROVIDERS
        // ═══════════════════════════════════════════════════════════

        openai: {
            name: 'OpenAI',
            baseURL: 'https://api.openai.com/v1',
            apiKeyEnv: 'OPENAI_API_KEY',
            models: ['gpt-4-turbo', 'gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini'],
            region: 'us',
        },

        anthropic: {
            name: 'Anthropic',
            baseURL: 'https://api.anthropic.com',
            apiKeyEnv: 'ANTHROPIC_API_KEY',
            models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307', 'claude-3-sonnet-20240229'],
            region: 'us',
        },

        google: {
            name: 'Google',
            baseURL: 'https://generativelanguage.googleapis.com',
            apiKeyEnv: 'GOOGLE_API_KEY',
            models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
            region: 'us',
        },

        perplexity: {
            name: 'Perplexity',
            baseURL: 'https://api.perplexity.ai',
            apiKeyEnv: 'PERPLEXITY_API_KEY',
            models: [
                // Online Search Models (with real-time web search)
                'llama-3.1-sonar-huge-128k-online',
                'llama-3.1-sonar-large-128k-online',
                'llama-3.1-sonar-small-128k-online',
                // Chat Models (without search)
                'llama-3.1-sonar-huge-128k-chat',
                'llama-3.1-sonar-large-128k-chat',
                'llama-3.1-sonar-small-128k-chat',
                // Reasoning Models
                'sonar-pro',
                'sonar-reasoning'
            ],
            region: 'us',
        },

        groq: {
            name: 'Groq',
            baseURL: 'https://api.groq.com/openai/v1',
            apiKeyEnv: 'GROQ_API_KEY',
            models: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
            region: 'us',
            free: true,
        },

        together: {
            name: 'Together AI',
            baseURL: 'https://api.together.xyz/v1',
            apiKeyEnv: 'TOGETHER_API_KEY',
            models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Qwen/Qwen2.5-72B-Instruct-Turbo', 'deepseek-ai/DeepSeek-V3'],
            region: 'us',
        },

        openrouter: {
            name: 'OpenRouter',
            baseURL: 'https://openrouter.ai/api/v1',
            apiKeyEnv: 'OPENROUTER_API_KEY',
            models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4-turbo', 'google/gemini-pro-1.5', 'meta-llama/llama-3.3-70b-instruct'],
            region: 'global',
        },

        cohere: {
            name: 'Cohere',
            baseURL: 'https://api.cohere.ai/v1',
            apiKeyEnv: 'COHERE_API_KEY',
            models: ['command-r-plus', 'command-r', 'command', 'command-light'],
            region: 'us',
        },

        // ═══════════════════════════════════════════════════════════
        // CHINESE PROVIDERS (中国AI模型)
        // ═══════════════════════════════════════════════════════════

        // Alibaba Cloud (阿里云)
        alibaba: {
            name: 'Alibaba Cloud (阿里云)',
            baseURL: 'https://dashscope.aliyuncs.com/api/v1',
            apiKeyEnv: 'ALIBABA_API_KEY',
            models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-vl-plus', 'qwen-vl-max', 'qwen2.5-72b-instruct'],
            region: 'china',
        },

        // Baidu (百度)
        baidu: {
            name: 'Baidu ERNIE (百度文心)',
            baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1',
            apiKeyEnv: 'BAIDU_API_KEY',
            models: ['ernie-4.0-turbo', 'ernie-3.5', 'ernie-speed', 'ernie-lite', 'ernie-tiny'],
            region: 'china',
        },

        // Tencent (腾讯)
        tencent: {
            name: 'Tencent Hunyuan (腾讯混元)',
            baseURL: 'https://hunyuan.tencentcloudapi.com',
            apiKeyEnv: 'TENCENT_API_KEY',
            models: ['hunyuan-pro', 'hunyuan-standard', 'hunyuan-lite', 'hunyuan-vision'],
            region: 'china',
        },

        // ByteDance (字节跳动)
        bytedance: {
            name: 'ByteDance Doubao (字节豆包)',
            baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
            apiKeyEnv: 'BYTEDANCE_API_KEY',
            models: ['doubao-pro-32k', 'doubao-lite-32k', 'doubao-pro-4k', 'doubao-lite-4k'],
            region: 'china',
        },

        // Zhipu AI (智谱AI)
        zhipu: {
            name: 'Zhipu AI GLM (智谱清言)',
            baseURL: 'https://open.bigmodel.cn/api/paas/v4',
            apiKeyEnv: 'ZHIPU_API_KEY',
            models: ['glm-4-plus', 'glm-4', 'glm-4-air', 'glm-4-flash', 'glm-4v', 'codegeex-4'],
            region: 'china',
        },

        // Moonshot AI (月之暗面)
        moonshot: {
            name: 'Moonshot AI Kimi (月之暗面)',
            baseURL: 'https://api.moonshot.cn/v1',
            apiKeyEnv: 'MOONSHOT_API_KEY',
            models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
            region: 'china',
        },

        // MiniMax (稀宇科技)
        minimax: {
            name: 'MiniMax (稀宇科技)',
            baseURL: 'https://api.minimax.chat/v1',
            apiKeyEnv: 'MINIMAX_API_KEY',
            models: ['abab6.5-chat', 'abab6-chat', 'abab5.5-chat'],
            region: 'china',
        },

        // SenseTime (商汤)
        sensetime: {
            name: 'SenseTime SenseNova (商汤日日新)',
            baseURL: 'https://api.sensenova.cn/v1',
            apiKeyEnv: 'SENSETIME_API_KEY',
            models: ['nova-ptc-xl-v1', 'nova-ptc-s-v2', 'nova-ptc-xs-v1'],
            region: 'china',
        },

        // 01.AI (零一万物)
        zeroone: {
            name: '01.AI Yi (零一万物)',
            baseURL: 'https://api.01.ai/v1',
            apiKeyEnv: 'ZEROONE_API_KEY',
            models: ['yi-large', 'yi-medium', 'yi-vision', 'yi-large-turbo'],
            region: 'china',
        },

        // DeepSeek (深度求索)
        deepseek: {
            name: 'DeepSeek (深度求索)',
            baseURL: 'https://api.deepseek.com/v1',
            apiKeyEnv: 'DEEPSEEK_API_KEY',
            models: ['deepseek-chat', 'deepseek-coder', 'deepseek-v3'],
            region: 'china',
        },

        // Stepfun (阶跃星辰)
        stepfun: {
            name: 'Stepfun Step (阶跃星辰)',
            baseURL: 'https://api.stepfun.com/v1',
            apiKeyEnv: 'STEPFUN_API_KEY',
            models: ['step-1-8k', 'step-1-32k', 'step-1-128k', 'step-1-256k'],
            region: 'china',
        },

        // iFlytek (科大讯飞)
        iflytek: {
            name: 'iFlytek Spark (科大讯飞星火)',
            baseURL: 'https://spark-api.xf-yun.com/v1',
            apiKeyEnv: 'IFLYTEK_API_KEY',
            models: ['spark-max', 'spark-pro', 'spark-lite'],
            region: 'china',
        },

        // ═══════════════════════════════════════════════════════════
        // EUROPEAN PROVIDERS
        // ═══════════════════════════════════════════════════════════

        mistral: {
            name: 'Mistral AI',
            baseURL: 'https://api.mistral.ai/v1',
            apiKeyEnv: 'MISTRAL_API_KEY',
            models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest', 'pixtral-12b'],
            region: 'europe',
        },

        // Aleph Alpha (German)
        alephalpha: {
            name: 'Aleph Alpha',
            baseURL: 'https://api.aleph-alpha.com',
            apiKeyEnv: 'ALEPH_ALPHA_API_KEY',
            models: ['luminous-supreme', 'luminous-extended', 'luminous-base'],
            region: 'europe',
        },

        // ═══════════════════════════════════════════════════════════
        // JAPANESE PROVIDERS (日本のAIモデル)
        // ═══════════════════════════════════════════════════════════

        // Rakuten (楽天)
        rakuten: {
            name: 'Rakuten RakutenAI',
            baseURL: 'https://api.rakuten.co.jp/ai/v1',
            apiKeyEnv: 'RAKUTEN_API_KEY',
            models: ['rakuten-gpt-4', 'rakuten-gpt-3.5'],
            region: 'japan',
        },

        // Stability AI Japan
        stabilityai: {
            name: 'Stability AI',
            baseURL: 'https://api.stability.ai/v1',
            apiKeyEnv: 'STABILITY_API_KEY',
            models: ['japanese-stablelm-instruct-beta', 'japanese-stablelm-base'],
            region: 'japan',
        },

        // ═══════════════════════════════════════════════════════════
        // KOREAN PROVIDERS (한국 AI 모델)
        // ═══════════════════════════════════════════════════════════

        // Naver (네이버)
        naver: {
            name: 'Naver HyperCLOVA X',
            baseURL: 'https://clovastudio.apigw.ntruss.com/testapp/v1',
            apiKeyEnv: 'NAVER_API_KEY',
            models: ['hyperclova-x', 'hyperclova-x-mini'],
            region: 'korea',
        },

        // ═══════════════════════════════════════════════════════════
        // OPEN SOURCE / LOCAL
        // ═══════════════════════════════════════════════════════════

        ollama: {
            name: 'Ollama (Local)',
            baseURL: 'http://localhost:11434/v1',
            apiKeyEnv: 'OLLAMA_API_KEY',
            models: ['llama3.2', 'llama3.1', 'codellama', 'mistral', 'qwen2.5-coder', 'deepseek-coder-v2', 'yi-coder'],
            region: 'global',
            free: true,
        },

        // LM Studio
        lmstudio: {
            name: 'LM Studio (Local)',
            baseURL: 'http://localhost:1234/v1',
            apiKeyEnv: 'LMSTUDIO_API_KEY',
            models: ['local-model'],
            region: 'global',
            free: true,
        },

        // Hugging Face
        huggingface: {
            name: 'Hugging Face',
            baseURL: 'https://api-inference.huggingface.co/models',
            apiKeyEnv: 'HUGGINGFACE_API_KEY',
            models: ['meta-llama/Llama-3.3-70B-Instruct', 'Qwen/Qwen2.5-72B-Instruct', 'mistralai/Mixtral-8x22B-Instruct-v0.1'],
            region: 'global',
        },

        // Replicate
        replicate: {
            name: 'Replicate',
            baseURL: 'https://api.replicate.com/v1',
            apiKeyEnv: 'REPLICATE_API_KEY',
            models: ['meta/llama-3.3-70b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1'],
            region: 'global',
        },

        // AI21 Labs
        ai21: {
            name: 'AI21 Labs',
            baseURL: 'https://api.ai21.com/studio/v1',
            apiKeyEnv: 'AI21_API_KEY',
            models: ['jamba-1.5-large', 'jamba-1.5-mini', 'j2-ultra', 'j2-mid'],
            region: 'global',
        },

        // Writer
        writer: {
            name: 'Writer',
            baseURL: 'https://api.writer.com/v1',
            apiKeyEnv: 'WRITER_API_KEY',
            models: ['palmyra-x-004', 'palmyra-x-003'],
            region: 'us',
        },
    };

    private static readonly MODELS: Record<string, ModelInfo> = {
        // ═══════════════════════════════════════════════════════════
        // OPENAI MODELS
        // ═══════════════════════════════════════════════════════════
        'gpt-4-turbo': {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            provider: 'openai',
            contextWindow: 128000,
            maxOutput: 4096,
            inputPrice: 10.0,
            outputPrice: 30.0,
            capabilities: ['chat', 'code', 'vision', 'function-calling'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
        },
        'gpt-4o': {
            id: 'gpt-4o',
            name: 'GPT-4o',
            provider: 'openai',
            contextWindow: 128000,
            maxOutput: 16384,
            inputPrice: 2.5,
            outputPrice: 10.0,
            capabilities: ['chat', 'code', 'vision', 'audio', 'function-calling'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'us',
        },
        'gpt-4o-mini': {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini',
            provider: 'openai',
            contextWindow: 128000,
            maxOutput: 16384,
            inputPrice: 0.15,
            outputPrice: 0.6,
            capabilities: ['chat', 'code', 'vision', 'function-calling'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'us',
        },
        'o1-preview': {
            id: 'o1-preview',
            name: 'O1 Preview (Reasoning)',
            provider: 'openai',
            contextWindow: 128000,
            maxOutput: 32768,
            inputPrice: 15.0,
            outputPrice: 60.0,
            capabilities: ['reasoning', 'code', 'math'],
            speed: 'slow',
            quality: 'premium',
            available: true,
            region: 'us',
        },

        // ═══════════════════════════════════════════════════════════
        // ANTHROPIC MODELS
        // ═══════════════════════════════════════════════════════════
        'claude-3-5-sonnet-20241022': {
            id: 'claude-3-5-sonnet-20241022',
            name: 'Claude 3.5 Sonnet',
            provider: 'anthropic',
            contextWindow: 200000,
            maxOutput: 8192,
            inputPrice: 3.0,
            outputPrice: 15.0,
            capabilities: ['chat', 'code', 'vision', 'analysis'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'us',
        },
        'claude-3-opus-20240229': {
            id: 'claude-3-opus-20240229',
            name: 'Claude 3 Opus',
            provider: 'anthropic',
            contextWindow: 200000,
            maxOutput: 4096,
            inputPrice: 15.0,
            outputPrice: 75.0,
            capabilities: ['chat', 'code', 'vision', 'analysis', 'reasoning'],
            speed: 'slow',
            quality: 'premium',
            available: true,
            region: 'us',
        },

        // ═══════════════════════════════════════════════════════════
        // GOOGLE MODELS
        // ═══════════════════════════════════════════════════════════
        'gemini-1.5-pro': {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            provider: 'google',
            contextWindow: 2000000,
            maxOutput: 8192,
            inputPrice: 1.25,
            outputPrice: 5.0,
            capabilities: ['chat', 'code', 'vision', 'audio', 'video'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
        },
        'gemini-1.5-flash': {
            id: 'gemini-1.5-flash',
            name: 'Gemini 1.5 Flash',
            provider: 'google',
            contextWindow: 1000000,
            maxOutput: 8192,
            inputPrice: 0.075,
            outputPrice: 0.3,
            capabilities: ['chat', 'code', 'vision'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'us',
        },
        'gemini-2.0-flash-exp': {
            id: 'gemini-2.0-flash-exp',
            name: 'Gemini 2.0 Flash (Experimental)',
            provider: 'google',
            contextWindow: 1000000,
            maxOutput: 8192,
            inputPrice: 0.0,
            outputPrice: 0.0,
            capabilities: ['chat', 'code', 'vision', 'multimodal'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'us',
        },

        // ═══════════════════════════════════════════════════════════
        // PERPLEXITY MODELS - HYBRID SEARCH + CODING + REASONING
        // ═══════════════════════════════════════════════════════════

        // Online Search Models (Real-time web search + AI reasoning)
        'llama-3.1-sonar-huge-128k-online': {
            id: 'llama-3.1-sonar-huge-128k-online',
            name: 'Sonar Huge 128K Online',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 5.0,
            outputPrice: 5.0,
            capabilities: ['chat', 'code', 'search', 'research', 'analysis', 'reasoning'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
            description: 'Premium model with real-time web search, excellent for research, coding with latest docs, and complex analysis',
        },
        'llama-3.1-sonar-large-128k-online': {
            id: 'llama-3.1-sonar-large-128k-online',
            name: 'Sonar Large 128K Online',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 1.0,
            outputPrice: 1.0,
            capabilities: ['chat', 'code', 'search', 'research', 'analysis'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'us',
            description: 'Balanced model with web search, great for coding tasks requiring current information',
        },
        'llama-3.1-sonar-small-128k-online': {
            id: 'llama-3.1-sonar-small-128k-online',
            name: 'Sonar Small 128K Online',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 0.2,
            outputPrice: 0.2,
            capabilities: ['chat', 'code', 'search'],
            speed: 'fast',
            quality: 'standard',
            available: true,
            region: 'us',
            description: 'Fast and affordable model with web search, ideal for quick lookups and simple coding tasks',
        },

        // Chat Models (Pure AI reasoning without search - better for coding)
        'llama-3.1-sonar-huge-128k-chat': {
            id: 'llama-3.1-sonar-huge-128k-chat',
            name: 'Sonar Huge 128K Chat',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 5.0,
            outputPrice: 5.0,
            capabilities: ['chat', 'code', 'analysis', 'reasoning'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
            description: 'Premium chat model without search, excellent for pure coding and logical reasoning tasks',
        },
        'llama-3.1-sonar-large-128k-chat': {
            id: 'llama-3.1-sonar-large-128k-chat',
            name: 'Sonar Large 128K Chat',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 1.0,
            outputPrice: 1.0,
            capabilities: ['chat', 'code', 'analysis'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'us',
            description: 'Balanced chat model, great for coding without external search interference',
        },
        'llama-3.1-sonar-small-128k-chat': {
            id: 'llama-3.1-sonar-small-128k-chat',
            name: 'Sonar Small 128K Chat',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 0.2,
            outputPrice: 0.2,
            capabilities: ['chat', 'code'],
            speed: 'fast',
            quality: 'standard',
            available: true,
            region: 'us',
            description: 'Fast and affordable chat model for straightforward coding tasks',
        },

        // Advanced Reasoning Models
        'sonar-pro': {
            id: 'sonar-pro',
            name: 'Sonar Pro',
            provider: 'perplexity',
            contextWindow: 200000,
            maxOutput: 8192,
            inputPrice: 3.0,
            outputPrice: 15.0,
            capabilities: ['chat', 'code', 'search', 'reasoning', 'analysis', 'research'],
            speed: 'slow',
            quality: 'premium',
            available: true,
            region: 'us',
            description: 'Advanced reasoning model with search, rivals Claude Sonnet for complex coding and analysis',
        },
        'sonar-reasoning': {
            id: 'sonar-reasoning',
            name: 'Sonar Reasoning',
            provider: 'perplexity',
            contextWindow: 127072,
            maxOutput: 4096,
            inputPrice: 1.0,
            outputPrice: 5.0,
            capabilities: ['chat', 'code', 'reasoning', 'analysis'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
            description: 'Deep reasoning model for complex problem-solving and advanced coding tasks',
        },

        // ═══════════════════════════════════════════════════════════
        // CHINESE MODELS (中国AI模型)
        // ═══════════════════════════════════════════════════════════

        // Alibaba Qwen (阿里通义千问)
        'qwen-max': {
            id: 'qwen-max',
            name: 'Qwen Max (通义千问Max)',
            provider: 'alibaba',
            contextWindow: 32000,
            maxOutput: 8192,
            inputPrice: 0.12,
            outputPrice: 0.12,
            capabilities: ['chat', 'code', 'analysis'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'china',
        },
        'qwen-plus': {
            id: 'qwen-plus',
            name: 'Qwen Plus (通义千问Plus)',
            provider: 'alibaba',
            contextWindow: 32000,
            maxOutput: 8192,
            inputPrice: 0.008,
            outputPrice: 0.008,
            capabilities: ['chat', 'code'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },
        'qwen2.5-72b-instruct': {
            id: 'qwen2.5-72b-instruct',
            name: 'Qwen 2.5 72B',
            provider: 'alibaba',
            contextWindow: 128000,
            maxOutput: 8192,
            inputPrice: 0.004,
            outputPrice: 0.004,
            capabilities: ['chat', 'code', 'multilingual'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // Baidu ERNIE (百度文心)
        'ernie-4.0-turbo': {
            id: 'ernie-4.0-turbo',
            name: 'ERNIE 4.0 Turbo (文心4.0)',
            provider: 'baidu',
            contextWindow: 8192,
            maxOutput: 2048,
            inputPrice: 0.12,
            outputPrice: 0.12,
            capabilities: ['chat', 'code', 'chinese'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'china',
        },
        'ernie-3.5': {
            id: 'ernie-3.5',
            name: 'ERNIE 3.5 (文心3.5)',
            provider: 'baidu',
            contextWindow: 8192,
            maxOutput: 2048,
            inputPrice: 0.012,
            outputPrice: 0.012,
            capabilities: ['chat', 'chinese'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // Tencent Hunyuan (腾讯混元)
        'hunyuan-pro': {
            id: 'hunyuan-pro',
            name: 'Hunyuan Pro (混元Pro)',
            provider: 'tencent',
            contextWindow: 32000,
            maxOutput: 4096,
            inputPrice: 0.03,
            outputPrice: 0.1,
            capabilities: ['chat', 'code', 'chinese'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'china',
        },

        // ByteDance Doubao (字节豆包)
        'doubao-pro-32k': {
            id: 'doubao-pro-32k',
            name: 'Doubao Pro 32K (豆包Pro)',
            provider: 'bytedance',
            contextWindow: 32000,
            maxOutput: 4096,
            inputPrice: 0.008,
            outputPrice: 0.008,
            capabilities: ['chat', 'code', 'chinese'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // Zhipu GLM (智谱清言)
        'glm-4-plus': {
            id: 'glm-4-plus',
            name: 'GLM-4 Plus (智谱GLM-4)',
            provider: 'zhipu',
            contextWindow: 128000,
            maxOutput: 4096,
            inputPrice: 0.05,
            outputPrice: 0.05,
            capabilities: ['chat', 'code', 'chinese', 'function-calling'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'china',
        },
        'glm-4v': {
            id: 'glm-4v',
            name: 'GLM-4V (Vision)',
            provider: 'zhipu',
            contextWindow: 8192,
            maxOutput: 4096,
            inputPrice: 0.05,
            outputPrice: 0.05,
            capabilities: ['chat', 'vision', 'chinese'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'china',
        },
        'codegeex-4': {
            id: 'codegeex-4',
            name: 'CodeGeeX-4 (代码生成)',
            provider: 'zhipu',
            contextWindow: 128000,
            maxOutput: 4096,
            inputPrice: 0.0,
            outputPrice: 0.0,
            capabilities: ['code', 'completion', 'chinese'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // Moonshot Kimi (月之暗面)
        'moonshot-v1-128k': {
            id: 'moonshot-v1-128k',
            name: 'Kimi 128K (月之暗面)',
            provider: 'moonshot',
            contextWindow: 128000,
            maxOutput: 4096,
            inputPrice: 0.012,
            outputPrice: 0.012,
            capabilities: ['chat', 'long-context', 'chinese'],
            speed: 'medium',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // 01.AI Yi (零一万物)
        'yi-large': {
            id: 'yi-large',
            name: 'Yi Large (零一万物)',
            provider: 'zeroone',
            contextWindow: 32000,
            maxOutput: 4096,
            inputPrice: 0.02,
            outputPrice: 0.02,
            capabilities: ['chat', 'code', 'multilingual'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'china',
        },

        // DeepSeek (深度求索)
        'deepseek-chat': {
            id: 'deepseek-chat',
            name: 'DeepSeek Chat',
            provider: 'deepseek',
            contextWindow: 64000,
            maxOutput: 8192,
            inputPrice: 0.14,
            outputPrice: 0.28,
            capabilities: ['chat', 'code', 'analysis'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },
        'deepseek-coder': {
            id: 'deepseek-coder',
            name: 'DeepSeek Coder',
            provider: 'deepseek',
            contextWindow: 128000,
            maxOutput: 8192,
            inputPrice: 0.14,
            outputPrice: 0.28,
            capabilities: ['code', 'completion', 'debugging'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },
        'deepseek-v3': {
            id: 'deepseek-v3',
            name: 'DeepSeek V3 (Latest)',
            provider: 'deepseek',
            contextWindow: 64000,
            maxOutput: 8192,
            inputPrice: 0.27,
            outputPrice: 1.1,
            capabilities: ['chat', 'code', 'reasoning'],
            speed: 'fast',
            quality: 'premium',
            available: true,
            region: 'china',
        },

        // Stepfun (阶跃星辰)
        'step-1-256k': {
            id: 'step-1-256k',
            name: 'Step-1 256K (阶跃星辰)',
            provider: 'stepfun',
            contextWindow: 256000,
            maxOutput: 4096,
            inputPrice: 0.02,
            outputPrice: 0.02,
            capabilities: ['chat', 'long-context', 'chinese'],
            speed: 'medium',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // MiniMax (稀宇科技)
        'abab6.5-chat': {
            id: 'abab6.5-chat',
            name: 'MiniMax ABAB 6.5',
            provider: 'minimax',
            contextWindow: 245760,
            maxOutput: 8192,
            inputPrice: 0.1,
            outputPrice: 0.1,
            capabilities: ['chat', 'long-context', 'chinese'],
            speed: 'medium',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // iFlytek Spark (科大讯飞)
        'spark-max': {
            id: 'spark-max',
            name: 'Spark Max (星火Max)',
            provider: 'iflytek',
            contextWindow: 8192,
            maxOutput: 2048,
            inputPrice: 0.05,
            outputPrice: 0.05,
            capabilities: ['chat', 'chinese'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'china',
        },

        // ═══════════════════════════════════════════════════════════
        // GROQ MODELS (Ultra Fast)
        // ═══════════════════════════════════════════════════════════
        'llama-3.3-70b-versatile': {
            id: 'llama-3.3-70b-versatile',
            name: 'Llama 3.3 70B (Groq)',
            provider: 'groq',
            contextWindow: 128000,
            maxOutput: 32768,
            inputPrice: 0.59,
            outputPrice: 0.79,
            capabilities: ['chat', 'code', 'analysis'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'us',
        },

        // ═══════════════════════════════════════════════════════════
        // MISTRAL MODELS (European)
        // ═══════════════════════════════════════════════════════════
        'mistral-large-latest': {
            id: 'mistral-large-latest',
            name: 'Mistral Large',
            provider: 'mistral',
            contextWindow: 128000,
            maxOutput: 8192,
            inputPrice: 2.0,
            outputPrice: 6.0,
            capabilities: ['chat', 'code', 'function-calling'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'europe',
        },
        'codestral-latest': {
            id: 'codestral-latest',
            name: 'Codestral (Code Specialist)',
            provider: 'mistral',
            contextWindow: 32000,
            maxOutput: 8192,
            inputPrice: 0.2,
            outputPrice: 0.6,
            capabilities: ['code', 'completion', 'refactoring'],
            speed: 'fast',
            quality: 'high',
            available: true,
            region: 'europe',
        },

        // ═══════════════════════════════════════════════════════════
        // PERPLEXITY MODELS
        // ═══════════════════════════════════════════════════════════
        'llama-3.1-sonar-huge-128k-online': {
            id: 'llama-3.1-sonar-huge-128k-online',
            name: 'Sonar Huge (Online Search)',
            provider: 'perplexity',
            contextWindow: 128000,
            maxOutput: 4096,
            inputPrice: 5.0,
            outputPrice: 5.0,
            capabilities: ['chat', 'search', 'research', 'citations'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
        },

        // ═══════════════════════════════════════════════════════════
        // COHERE MODELS
        // ═══════════════════════════════════════════════════════════
        'command-r-plus': {
            id: 'command-r-plus',
            name: 'Command R+',
            provider: 'cohere',
            contextWindow: 128000,
            maxOutput: 4096,
            inputPrice: 2.5,
            outputPrice: 10.0,
            capabilities: ['chat', 'rag', 'search', 'function-calling'],
            speed: 'medium',
            quality: 'premium',
            available: true,
            region: 'us',
        },
    };

    /**
     * Get all available providers
     */
    public static getProviders(): ProviderConfig[] {
        return Object.values(this.PROVIDERS);
    }

    /**
     * Get providers by region
     */
    public static getProvidersByRegion(region: string): ProviderConfig[] {
        return Object.values(this.PROVIDERS).filter(p => p.region === region);
    }

    /**
     * Get Chinese providers
     */
    public static getChineseProviders(): ProviderConfig[] {
        return this.getProvidersByRegion('china');
    }

    /**
     * Get free providers
     */
    public static getFreeProviders(): ProviderConfig[] {
        return Object.values(this.PROVIDERS).filter(p => p.free === true);
    }

    /**
     * Get provider by ID
     */
    public static getProvider(providerId: string): ProviderConfig | undefined {
        return this.PROVIDERS[providerId];
    }

    /**
     * Get all models
     */
    public static getAllModels(): ModelInfo[] {
        return Object.values(this.MODELS);
    }

    /**
     * Get model by ID
     */
    public static getModel(modelId: string): ModelInfo | undefined {
        return this.MODELS[modelId];
    }

    /**
     * Get models by provider
     */
    public static getModelsByProvider(providerId: string): ModelInfo[] {
        return Object.values(this.MODELS).filter(m => m.provider === providerId);
    }

    /**
     * Get models by region
     */
    public static getModelsByRegion(region: string): ModelInfo[] {
        return Object.values(this.MODELS).filter(m => m.region === region);
    }

    /**
     * Get Chinese models
     */
    public static getChineseModels(): ModelInfo[] {
        return this.getModelsByRegion('china');
    }

    /**
     * Get models by capability
     */
    public static getModelsByCapability(capability: string): ModelInfo[] {
        return Object.values(this.MODELS).filter(m => m.capabilities.includes(capability));
    }

    /**
     * Get fastest models
     */
    public static getFastModels(): ModelInfo[] {
        return Object.values(this.MODELS).filter(m => m.speed === 'fast');
    }

    /**
     * Get cheapest models
     */
    public static getCheapestModels(limit: number = 10): ModelInfo[] {
        return Object.values(this.MODELS)
            .sort((a, b) => (a.inputPrice + a.outputPrice) - (b.inputPrice + b.outputPrice))
            .slice(0, limit);
    }

    /**
     * Get best models for task type
     */
    public static getBestForTask(task: 'code' | 'chat' | 'research' | 'vision' | 'reasoning' | 'chinese'): ModelInfo[] {
        const recommendations: Record<string, string[]> = {
            code: ['claude-3-5-sonnet-20241022', 'deepseek-coder', 'codestral-latest', 'codegeex-4', 'gpt-4o'],
            chat: ['gpt-4o-mini', 'llama-3.3-70b-versatile', 'gemini-1.5-flash', 'qwen-plus'],
            research: ['llama-3.1-sonar-huge-128k-online', 'command-r-plus'],
            vision: ['gpt-4o', 'claude-3-5-sonnet-20241022', 'gemini-1.5-pro', 'glm-4v'],
            reasoning: ['o1-preview', 'claude-3-opus-20240229', 'deepseek-v3'],
            chinese: ['qwen-max', 'ernie-4.0-turbo', 'glm-4-plus', 'hunyuan-pro', 'yi-large'],
        };

        const modelIds = recommendations[task] || [];
        return modelIds.map(id => this.MODELS[id]).filter(Boolean) as ModelInfo[];
    }

    /**
     * Create OpenAI-compatible client for any provider
     */
    public static createClient(providerId: string, apiKey: string): OpenAI {
        const provider = this.PROVIDERS[providerId];
        if (!provider) {
            throw new Error(`Unknown provider: ${providerId}`);
        }

        return new OpenAI({
            apiKey,
            baseURL: provider.baseURL,
        });
    }

    /**
     * Get model count
     */
    public static getModelCount(): number {
        return Object.keys(this.MODELS).length;
    }

    /**
     * Get provider count
     */
    public static getProviderCount(): number {
        return Object.keys(this.PROVIDERS).length;
    }

    /**
     * Display model catalog
     */
    public static displayCatalog(): void {
        console.log('\n🤖 MIMO Model Encyclopedia - GLOBAL EDITION\n');
        console.log(`📊 ${this.getProviderCount()} Providers | ${this.getModelCount()} Models\n`);
        console.log(`🌍 Regions: US, China, Europe, Japan, Korea\n`);

        // Group by region
        const regions = ['us', 'china', 'europe', 'japan', 'korea', 'global'];

        for (const region of regions) {
            const providers = this.getProvidersByRegion(region);
            if (providers.length === 0) continue;

            console.log(`\n━━━ ${region.toUpperCase()} ━━━\n`);

            for (const provider of providers) {
                const models = this.getModelsByProvider(provider.name.toLowerCase().replace(/\s+/g, ''));
                console.log(`📦 ${provider.name} (${models.length || provider.models.length} models) ${provider.free ? '🆓' : ''}`);
                console.log(`   API Key: ${provider.apiKeyEnv}`);

                if (models.length > 0) {
                    models.slice(0, 3).forEach(model => {
                        const price = model.inputPrice === 0 ? 'FREE' : `$${model.inputPrice}/$${model.outputPrice}`;
                        console.log(`   - ${model.name} [${model.speed}] ${price}/1M tokens`);
                    });
                    if (models.length > 3) {
                        console.log(`   ... and ${models.length - 3} more`);
                    }
                }
                console.log('');
            }
        }
    }
}
