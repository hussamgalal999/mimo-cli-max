import * as fs from 'fs/promises';
import * as path from 'path';
import { createPatch } from 'diff';
import { log } from '../utils/Logger.js';

export interface FileInfo {
    path: string;
    size: number;
    mtime: Date;
    isDirectory: boolean;
    exists: boolean;
}

export interface SearchResult {
    path: string;
    matches: Array<{
        line: number;
        content: string;
    }>;
}

/**
 * File System Tools
 * Provides safe file operations with error handling
 */
export class FileSystemTools {
    /**
     * Read file contents
     */
    public async readFile(filePath: string): Promise<string> {
        try {
            log.debug('Reading file', { path: filePath });
            const content = await fs.readFile(filePath, 'utf-8');
            log.info('File read successfully', { path: filePath, size: content.length });
            return content;
        } catch (error: any) {
            log.error('Error reading file', { path: filePath, error: error.message });
            throw new Error(`Failed to read file ${filePath}: ${error.message}`);
        }
    }

    /**
     * Write content to file (creates parent directories if needed)
     */
    public async writeFile(filePath: string, content: string): Promise<void> {
        try {
            log.debug('Writing file', { path: filePath, size: content.length });

            // Ensure parent directory exists
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });

            await fs.writeFile(filePath, content, 'utf-8');
            log.info('File written successfully', { path: filePath });
        } catch (error: any) {
            log.error('Error writing file', { path: filePath, error: error.message });
            throw new Error(`Failed to write file ${filePath}: ${error.message}`);
        }
    }

    /**
     * List directory contents
     */
    public async listDirectory(dirPath: string): Promise<string[]> {
        try {
            log.debug('Listing directory', { path: dirPath });
            const entries = await fs.readdir(dirPath);
            log.info('Directory listed', { path: dirPath, count: entries.length });
            return entries;
        } catch (error: any) {
            log.error('Error listing directory', { path: dirPath, error: error.message });
            throw new Error(`Failed to list directory ${dirPath}: ${error.message}`);
        }
    }

    /**
     * Get file/directory information
     */
    public async getFileInfo(filePath: string): Promise<FileInfo> {
        try {
            const stats = await fs.stat(filePath);
            return {
                path: filePath,
                size: stats.size,
                mtime: stats.mtime,
                isDirectory: stats.isDirectory(),
                exists: true,
            };
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return {
                    path: filePath,
                    size: 0,
                    mtime: new Date(0),
                    isDirectory: false,
                    exists: false,
                };
            }
            log.error('Error getting file info', { path: filePath, error: error.message });
            throw new Error(`Failed to get file info ${filePath}: ${error.message}`);
        }
    }

    /**
     * Check if file/directory exists
     */
    public async exists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Delete file
     */
    public async deleteFile(filePath: string): Promise<void> {
        try {
            log.debug('Deleting file', { path: filePath });
            await fs.unlink(filePath);
            log.info('File deleted', { path: filePath });
        } catch (error: any) {
            log.error('Error deleting file', { path: filePath, error: error.message });
            throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
        }
    }

    /**
     * Copy file
     */
    public async copyFile(source: string, destination: string): Promise<void> {
        try {
            log.debug('Copying file', { source, destination });

            // Ensure parent directory exists
            const dir = path.dirname(destination);
            await fs.mkdir(dir, { recursive: true });

            await fs.copyFile(source, destination);
            log.info('File copied', { source, destination });
        } catch (error: any) {
            log.error('Error copying file', { source, destination, error: error.message });
            throw new Error(`Failed to copy file ${source} to ${destination}: ${error.message}`);
        }
    }

    /**
     * Search for files matching pattern (glob-style)
     */
    public async searchFiles(
        dirPath: string,
        pattern: string | RegExp,
        maxDepth: number = 5
    ): Promise<string[]> {
        const results: string[] = [];
        const patternRegex = typeof pattern === 'string'
            ? new RegExp(pattern.replace(/\*/g, '.*'))
            : pattern;

        const search = async (currentPath: string, depth: number) => {
            if (depth > maxDepth) return;

            try {
                const entries = await fs.readdir(currentPath, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(currentPath, entry.name);

                    if (entry.isDirectory()) {
                        await search(fullPath, depth + 1);
                    } else if (patternRegex.test(entry.name)) {
                        results.push(fullPath);
                    }
                }
            } catch (error: any) {
                log.warn('Error searching directory', { path: currentPath, error: error.message });
            }
        };

        await search(dirPath, 0);
        log.info('File search completed', { pattern: pattern.toString(), count: results.length });
        return results;
    }

    /**
     * Search file contents for text pattern
     */
    public async searchFileContents(
        filePath: string,
        searchPattern: string | RegExp
    ): Promise<SearchResult> {
        try {
            const content = await this.readFile(filePath);
            const lines = content.split('\n');
            const pattern = typeof searchPattern === 'string'
                ? new RegExp(searchPattern, 'gi')
                : searchPattern;

            const matches: SearchResult['matches'] = [];

            lines.forEach((line, index) => {
                if (pattern.test(line)) {
                    matches.push({
                        line: index + 1,
                        content: line,
                    });
                }
            });

            return {
                path: filePath,
                matches,
            };
        } catch (error: any) {
            log.error('Error searching file contents', { path: filePath, error: error.message });
            throw new Error(`Failed to search file contents ${filePath}: ${error.message}`);
        }
    }

    /**
     * Generate unified diff between two file versions
     */
    public async generateDiff(
        filePath: string,
        oldContent: string,
        newContent: string
    ): Promise<string> {
        try {
            const diff = createPatch(
                filePath,
                oldContent,
                newContent,
                'original',
                'modified'
            );
            log.debug('Generated diff', { path: filePath, diffSize: diff.length });
            return diff;
        } catch (error: any) {
            log.error('Error generating diff', { path: filePath, error: error.message });
            throw new Error(`Failed to generate diff for ${filePath}: ${error.message}`);
        }
    }

    /**
     * Apply diff to file content
     */
    public async applyDiff(filePath: string, diffContent: string): Promise<void> {
        try {
            log.debug('Applying diff', { path: filePath });

            // This is a simplified implementation
            // For production, use a proper diff library like 'patch-package'
            const currentContent = await this.readFile(filePath);

            // Parse diff and apply changes
            // Note: For now, this is a placeholder
            // You would implement proper diff parsing here

            log.warn('applyDiff is not fully implemented - use external diff tool');

        } catch (error: any) {
            log.error('Error applying diff', { path: filePath, error: error.message });
            throw new Error(`Failed to apply diff to ${filePath}: ${error.message}`);
        }
    }

    /**
     * Create directory
     */
    public async createDirectory(dirPath: string): Promise<void> {
        try {
            log.debug('Creating directory', { path: dirPath });
            await fs.mkdir(dirPath, { recursive: true });
            log.info('Directory created', { path: dirPath });
        } catch (error: any) {
            log.error('Error creating directory', { path: dirPath, error: error.message });
            throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
        }
    }
}
