import { EventEmitter } from 'events';
import { log } from '../utils/Logger.js';

export interface StreamToken {
    text: string;
    timestamp: number;
    index: number;
}

export interface StreamOptions {
    onToken?: (token: StreamToken) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: Error) => void;
    chunkSize?: number;
}

export class StreamingHandler extends EventEmitter {
    private buffer: string = '';
    private tokenIndex: number = 0;
    private isStreaming: boolean = false;

    async streamResponse(
        content: string,
        options: StreamOptions
    ): Promise<string> {
        this.isStreaming = true;
        this.buffer = '';
        this.tokenIndex = 0;

        try {
            const chunkSize = options.chunkSize || 1;
            let accumulated = '';

            for (let i = 0; i < content.length; i += chunkSize) {
                if (!this.isStreaming) break;

                const chunk = content.substring(i, i + chunkSize);
                accumulated += chunk;
                this.tokenIndex++;

                const token: StreamToken = {
                    text: chunk,
                    timestamp: Date.now(),
                    index: this.tokenIndex
                };

                options.onToken?.(token);
                this.emit('token', token);

                await this.sleep(1);
            }

            this.buffer = accumulated;
            options.onComplete?.(accumulated);
            this.emit('complete', accumulated);

            return accumulated;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            options.onError?.(err);
            this.emit('error', err);
            throw err;
        } finally {
            this.isStreaming = false;
        }
    }

    async streamWithProgress(
        content: string,
        onProgress: (current: number, total: number) => void
    ): Promise<string> {
        const total = content.length;
        let accumulated = '';

        for (let i = 0; i < content.length; i++) {
            accumulated += content[i];
            onProgress(i + 1, total);
            await this.sleep(0.5);
        }

        return accumulated;
    }

    stop(): void {
        this.isStreaming = false;
    }

    getBuffer(): string {
        return this.buffer;
    }

    reset(): void {
        this.buffer = '';
        this.tokenIndex = 0;
        this.isStreaming = false;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
