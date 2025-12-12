import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { log } from '../utils/Logger.js';

export interface BatchOperation {
    type: 'read' | 'write' | 'delete';
    filePath: string;
    content?: string;
    encoding?: BufferEncoding;
}

export interface BatchResult {
    success: number;
    failed: number;
    results: Array<{
        filePath: string;
        success: boolean;
        error?: Error;
        data?: any;
    }>;
}

export class OptimizedFileIO {
    private batchSize: number = 10;
    private bufferSize: number = 64 * 1024;

    /**
     * Reads a file as a stream and processes it in chunks.
     */
    async readFileStreamed(
        filePath: string,
        onChunk?: (chunk: string | Buffer) => void
    ): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            const stream = createReadStream(filePath, { highWaterMark: this.bufferSize });

            stream.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
                onChunk?.(chunk);
            });

            stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });

            stream.on('error', (error) => {
                log.error('Stream read error', { filePath, error: error.message });
                reject(error);
            });
        });
    }

    /**
     * Writes content to a file using a stream.
     */
    async writeFileStreamed(filePath: string, content: string | Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            const stream = createWriteStream(filePath, { highWaterMark: this.bufferSize });

            stream.on('finish', () => {
                log.debug('File written successfully', { filePath });
                resolve();
            });

            stream.on('error', (error) => {
                log.error('Stream write error', { filePath, error: error.message });
                reject(error);
            });

            stream.write(content);
            stream.end();
        });
    }

    /**
     * Reads files in batches and returns the results of the read operations.
     *
     * The function processes an array of file paths in chunks defined by this.batchSize.
     * For each batch, it invokes the readFileSafe method to read the files concurrently
     * and aggregates the results, counting the number of successful and failed reads.
     *
     * @param filePaths - An array of file paths to be read.
     */
    async batchReadFiles(filePaths: string[]): Promise<BatchResult> {
        const results: BatchResult = {
            success: 0,
            failed: 0,
            results: []
        };

        for (let i = 0; i < filePaths.length; i += this.batchSize) {
            const batch = filePaths.slice(i, i + this.batchSize);
            const promises = batch.map(filePath =>
                this.readFileSafe(filePath)
            );

            const batchResults = await Promise.all(promises);
            results.results.push(...batchResults);

            for (const result of batchResults) {
                if (result.success) {
                    results.success++;
                } else {
                    results.failed++;
                }
            }
        }

        return results;
    }

    async batchWriteFiles(operations: Array<{ filePath: string; content: string }>): Promise<BatchResult> {
        const results: BatchResult = {
            success: 0,
            failed: 0,
            results: []
        };

        for (let i = 0; i < operations.length; i += this.batchSize) {
            const batch = operations.slice(i, i + this.batchSize);
            const promises = batch.map(op =>
                this.writeFileSafe(op.filePath, op.content)
            );

            const batchResults = await Promise.all(promises);
            results.results.push(...batchResults);

            for (const result of batchResults) {
                if (result.success) {
                    results.success++;
                } else {
                    results.failed++;
                }
            }
        }

        return results;
    }

    /**
     * Executes a batch of operations and returns the results.
     *
     * The function processes the provided operations in batches, executing each operation asynchronously.
     * It aggregates the results, counting the number of successful and failed operations, and returns
     * a summary of the execution results. The operations are divided into smaller batches based on
     * the specified batch size, and each operation is executed using the `executeSingleOperation` method.
     *
     * @param operations - An array of BatchOperation objects to be executed.
     */
    async batchExecuteOperations(operations: BatchOperation[]): Promise<BatchResult> {
        const results: BatchResult = {
            success: 0,
            failed: 0,
            results: []
        };

        for (let i = 0; i < operations.length; i += this.batchSize) {
            const batch = operations.slice(i, i + this.batchSize);
            const promises = batch.map(op => this.executeSingleOperation(op));

            const batchResults = await Promise.all(promises);
            results.results.push(...batchResults);

            for (const result of batchResults) {
                if (result.success) {
                    results.success++;
                } else {
                    results.failed++;
                }
            }
        }

        return results;
    }

    /**
     * Safely reads a file and returns its contents or an error.
     *
     * This function attempts to read a file specified by the filePath. If successful, it returns an object containing the filePath, a success flag, and the file data. In case of an error, it logs a warning and returns an object with the filePath, a success flag set to false, and the error encountered.
     *
     * @param {string} filePath - The path to the file to be read.
     */
    private async readFileSafe(filePath: string): Promise<{ filePath: string; success: boolean; error?: Error; data?: Buffer }> {
        try {
            const data = await fs.promises.readFile(filePath);
            return { filePath, success: true, data };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            log.warn(`Failed to read file: ${filePath}`, { error: err.message });
            return { filePath, success: false, error: err };
        }
    }

    /**
     * Safely writes content to a specified file.
     *
     * This function attempts to write the provided content to the file at the given filePath.
     * If the write operation is successful, it returns an object indicating success.
     * In case of an error, it logs a warning and returns an object with the error details.
     *
     * @param {string} filePath - The path to the file where content will be written.
     * @param {string} content - The content to be written to the file.
     */
    private async writeFileSafe(filePath: string, content: string): Promise<{ filePath: string; success: boolean; error?: Error }> {
        try {
            await fs.promises.writeFile(filePath, content, 'utf-8');
            return { filePath, success: true };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            log.warn(`Failed to write file: ${filePath}`, { error: err.message });
            return { filePath, success: false, error: err };
        }
    }

    private async executeSingleOperation(operation: BatchOperation): Promise<{ filePath: string; success: boolean; error?: Error }> {
        try {
            switch (operation.type) {
                case 'read':
                    await this.readFileSafe(operation.filePath);
                    break;
                case 'write':
                    await this.writeFileSafe(operation.filePath, operation.content || '');
                    break;
                case 'delete':
                    await fs.promises.unlink(operation.filePath);
                    break;
            }
            return { filePath: operation.filePath, success: true };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            log.warn(`Operation failed: ${operation.type} on ${operation.filePath}`, { error: err.message });
            return { filePath: operation.filePath, success: false, error: err };
        }
    }

    /**
     * Recursively find files in a directory that match a given pattern.
     *
     * The function traverses the directory structure up to a specified maximum depth, checking each file against the provided regular expression pattern. If a match is found, the full path of the file is added to the results. The traversal is performed asynchronously, and errors during directory reading are logged for debugging purposes.
     *
     * @param dir - The directory path to start the search from.
     * @param pattern - The regular expression pattern to match file names against.
     * @param maxDepth - The maximum depth to traverse in the directory structure (default is 10).
     * @returns A promise that resolves to an array of matching file paths.
     */
    async findFilesRecursive(
        dir: string,
        pattern: RegExp,
        maxDepth: number = 10
    ): Promise<string[]> {
        const results: string[] = [];

        const traverse = async (currentDir: string, depth: number) => {
            if (depth > maxDepth) return;

            try {
                const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(currentDir, entry.name);

                    if (entry.isDirectory()) {
                        await traverse(fullPath, depth + 1);
                    } else if (pattern.test(entry.name)) {
                        results.push(fullPath);
                    }
                }
            } catch (error) {
                log.debug(`Failed to traverse directory: ${currentDir}`, { error });
            }
        };

        await traverse(dir, 0);
        return results;
    }

    async copyFileStreamed(source: string, destination: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const readStream = createReadStream(source, { highWaterMark: this.bufferSize });
            const writeStream = createWriteStream(destination, { highWaterMark: this.bufferSize });

            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', resolve);

            readStream.pipe(writeStream);
        });
    }

    /**
     * Retrieves the size of a file at the specified path.
     *
     * This asynchronous function uses the `fs.promises.stat` method to obtain the file statistics,
     * including its size. If the operation fails, it logs a warning and returns 0.
     * This function is designed to handle potential errors gracefully.
     *
     * @param {string} filePath - The path to the file whose size is to be retrieved.
     */
    async getFileSizeOptimized(filePath: string): Promise<number> {
        try {
            const stats = await fs.promises.stat(filePath);
            return stats.size;
        } catch (error) {
            log.warn(`Failed to get file size: ${filePath}`, { error });
            return 0;
        }
    }
}
