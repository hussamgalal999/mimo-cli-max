export class MimoError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public metadata?: Record<string, any>
    ) {
        super(message);
        this.name = 'MimoError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AIProviderError extends MimoError {
    constructor(message: string, provider: string, metadata?: Record<string, any>) {
        super(message, 'AI_PROVIDER_ERROR', 503, { provider, ...metadata });
        this.name = 'AIProviderError';
    }
}

export class ValidationError extends MimoError {
    constructor(message: string, field?: string) {
        super(message, 'VALIDATION_ERROR', 400, { field });
        this.name = 'ValidationError';
    }
}

export class ConfigurationError extends MimoError {
    constructor(message: string) {
        super(message, 'CONFIGURATION_ERROR', 500);
        this.name = 'ConfigurationError';
    }
}

export class WorkflowError extends MimoError {
    constructor(message: string, workflow: string, step?: string) {
        super(message, 'WORKFLOW_ERROR', 500, { workflow, step });
        this.name = 'WorkflowError';
    }
}
