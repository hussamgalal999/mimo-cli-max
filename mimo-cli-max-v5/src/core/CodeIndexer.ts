/**
 * MIMO Code Indexer
 * Indexes codebase for semantic search and context retrieval
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { log } from '../utils/Logger.js';

export interface CodeSymbol {
    name: string;
    type: 'class' | 'function' | 'interface' | 'variable' | 'import';
    file: string;
    line: number;
    signature?: string;
    docstring?: string;
}

export interface FileIndex {
    path: string;
    symbols: CodeSymbol[];
    imports: string[];
    exports: string[];
    lastModified: Date;
}

/**
 * Code Indexer - Fast semantic code search
 */
export class CodeIndexer {
    private index: Map<string, FileIndex> = new Map();
    private symbolMap: Map<string, CodeSymbol[]> = new Map();

    /**
     * Index entire directory
     */
    public async indexDirectory(dirPath: string, extensions: string[] = ['.ts', '.js', '.tsx', '.jsx']): Promise<void> {
        log.info('Starting code indexing', { directory: dirPath });
        const startTime = Date.now();

        const files = await this.findFiles(dirPath, extensions);

        for (const file of files) {
            await this.indexFile(file);
        }

        const duration = Date.now() - startTime;
        log.info('Code indexing complete', {
            files: files.length,
            symbols: this.symbolMap.size,
            duration,
        });
    }

    /**
     * Index single file
     */
    public async indexFile(filePath: string): Promise<void> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const stats = await fs.stat(filePath);

            const symbols = this.extractSymbols(content, filePath);
            const imports = this.extractImports(content);
            const exports = this.extractExports(content);

            const fileIndex: FileIndex = {
                path: filePath,
                symbols,
                imports,
                exports,
                lastModified: stats.mtime,
            };

            this.index.set(filePath, fileIndex);

            // Update symbol map
            symbols.forEach(symbol => {
                if (!this.symbolMap.has(symbol.name)) {
                    this.symbolMap.set(symbol.name, []);
                }
                this.symbolMap.get(symbol.name)!.push(symbol);
            });

        } catch (error: any) {
            log.warn('Error indexing file', { file: filePath, error: error.message });
        }
    }

    /**
     * Search for symbol
     */
    public searchSymbol(name: string): CodeSymbol[] {
        return this.symbolMap.get(name) || [];
    }

    /**
     * Search symbols by pattern
     */
    public searchSymbolPattern(pattern: string | RegExp): CodeSymbol[] {
        const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
        const results: CodeSymbol[] = [];

        for (const [name, symbols] of this.symbolMap.entries()) {
            if (regex.test(name)) {
                results.push(...symbols);
            }
        }

        return results;
    }

    /**
     * Get file index
     */
    public getFileIndex(filePath: string): FileIndex | undefined {
        return this.index.get(filePath);
    }

    /**
     * Get all indexed files
     */
    public getIndexedFiles(): string[] {
        return Array.from(this.index.keys());
    }

    /**
     * Find symbol definition
     */
    public findDefinition(symbolName: string): CodeSymbol | undefined {
        const symbols = this.searchSymbol(symbolName);
        return symbols.find(s => s.type !== 'import');
    }

    /**
     * Find symbol references
     */
    public findReferences(symbolName: string): Array<{ file: string; line: number }> {
        const references: Array<{ file: string; line: number }> = [];

        for (const fileIndex of this.index.values()) {
            // Simple reference search - can be enhanced
            if (fileIndex.imports.includes(symbolName)) {
                references.push({ file: fileIndex.path, line: 1 });
            }
        }

        return references;
    }

    /**
     * Extract symbols from code
     */
    private extractSymbols(content: string, filePath: string): CodeSymbol[] {
        const symbols: CodeSymbol[] = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            const lineNum = index + 1;

            // Class declarations
            const classMatch = line.match(/(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/);
            if (classMatch) {
                symbols.push({
                    name: classMatch[1],
                    type: 'class',
                    file: filePath,
                    line: lineNum,
                    signature: line.trim(),
                });
            }

            // Function declarations
            const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
            if (funcMatch) {
                symbols.push({
                    name: funcMatch[1],
                    type: 'function',
                    file: filePath,
                    line: lineNum,
                    signature: line.trim(),
                });
            }

            // Arrow functions
            const arrowMatch = line.match(/(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(/);
            if (arrowMatch) {
                symbols.push({
                    name: arrowMatch[1],
                    type: 'function',
                    file: filePath,
                    line: lineNum,
                    signature: line.trim(),
                });
            }

            // Interface declarations
            const interfaceMatch = line.match(/(?:export\s+)?interface\s+(\w+)/);
            if (interfaceMatch) {
                symbols.push({
                    name: interfaceMatch[1],
                    type: 'interface',
                    file: filePath,
                    line: lineNum,
                    signature: line.trim(),
                });
            }
        });

        return symbols;
    }

    /**
     * Extract imports
     */
    private extractImports(content: string): string[] {
        const imports: string[] = [];
        const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;

        let match;
        while ((match = importRegex.exec(content)) !== null) {
            if (match[1]) {
                // Named imports
                const names = match[1].split(',').map(n => n.trim());
                imports.push(...names);
            } else if (match[2]) {
                // Default import
                imports.push(match[2]);
            }
        }

        return imports;
    }

    /**
     * Extract exports
     */
    private extractExports(content: string): string[] {
        const exports: string[] = [];
        const exportRegex = /export\s+(?:class|function|interface|const|let|var)\s+(\w+)/g;

        let match;
        while ((match = exportRegex.exec(content)) !== null) {
            exports.push(match[1]);
        }

        return exports;
    }

    /**
     * Find files recursively
     */
    private async findFiles(dirPath: string, extensions: string[]): Promise<string[]> {
        const files: string[] = [];

        const scan = async (dir: string, depth: number = 0) => {
            if (depth > 10) return; // Max depth

            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);

                    // Skip node_modules, .git, dist
                    if (['node_modules', '.git', 'dist', '.mimo'].includes(entry.name)) continue;

                    if (entry.isDirectory()) {
                        await scan(fullPath, depth + 1);
                    } else {
                        const ext = path.extname(entry.name);
                        if (extensions.includes(ext)) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (error) {
                // Ignore permission errors
            }
        };

        await scan(dirPath);
        return files;
    }

    /**
     * Clear index
     */
    public clear(): void {
        this.index.clear();
        this.symbolMap.clear();
    }

    /**
     * Get statistics
     */
    public getStats(): {
        files: number;
        symbols: number;
        classes: number;
        functions: number;
        interfaces: number;
    } {
        let classes = 0;
        let functions = 0;
        let interfaces = 0;

        for (const symbols of this.symbolMap.values()) {
            symbols.forEach(s => {
                if (s.type === 'class') classes++;
                if (s.type === 'function') functions++;
                if (s.type === 'interface') interfaces++;
            });
        }

        return {
            files: this.index.size,
            symbols: this.symbolMap.size,
            classes,
            functions,
            interfaces,
        };
    }
}
