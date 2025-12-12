/**
 * Modern Spinner - Claude Code Style
 * Clean, minimal loading indicators
 */

import * as p from '@clack/prompts';

let currentSpinner: ReturnType<typeof p.spinner> | null = null;

/**
 * Start thinking animation (Claude Code style)
 */
export function startThinking(message: string = 'MIMO is thinking...'): void {
    if (currentSpinner) {
        currentSpinner.stop();
    }
    currentSpinner = p.spinner();
    currentSpinner.start(message);
}

/**
 * Update thinking message
 */
export function updateThinking(message: string): void {
    if (currentSpinner) {
        currentSpinner.message(message);
    }
}

/**
 * Stop thinking with success
 */
export function stopThinking(message: string = 'Analysis complete'): void {
    if (currentSpinner) {
        currentSpinner.stop(message);
        currentSpinner = null;
    }
}

/**
 * Stop thinking with error
 */
export function stopThinkingWithError(message: string = 'Analysis failed'): void {
    if (currentSpinner) {
        currentSpinner.stop(message);
        currentSpinner = null;
    }
}

/**
 * Multi-step progress indicator
 */
export class ProgressTracker {
    private steps: string[];
    private currentStep: number = 0;
    private spinner: ReturnType<typeof p.spinner>;

    constructor(steps: string[]) {
        this.steps = steps;
        this.spinner = p.spinner();
    }

    start(): void {
        this.currentStep = 0;
        this.spinner.start(this.steps[0]);
    }

    next(): void {
        this.currentStep++;
        if (this.currentStep < this.steps.length) {
            this.spinner.message(this.steps[this.currentStep]);
        }
    }

    complete(message?: string): void {
        this.spinner.stop(message || 'All steps completed');
    }

    fail(message?: string): void {
        this.spinner.stop(message || 'Process failed');
    }
}

/**
 * Create a progress tracker for multi-step operations
 */
export function createProgressTracker(steps: string[]): ProgressTracker {
    return new ProgressTracker(steps);
}
