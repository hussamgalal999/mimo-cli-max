import { FileSystemTools } from './FileSystemTools.js';
import { TerminalTools } from './TerminalTools.js';
import { BrowserTools } from './BrowserTools.js';
import { log } from '../utils/Logger.js';

export interface Tool {
    name: string;
    category: 'filesystem' | 'terminal' | 'browser' | 'other';
    description: string;
    requiresApproval: boolean;
    execute: (...args: any[]) => Promise<any>;
}

export interface ToolExecutionResult {
    toolName: string;
    success: boolean;
    result?: any;
    error?: string;
    executionTime: number;
}

/**
 * Tool Registry
 * Central management for all agent tools
 */
export class ToolRegistry {
    private tools: Map<string, Tool> = new Map();
    private fileSystemTools: FileSystemTools;
    private terminalTools: TerminalTools;
    private browserTools: BrowserTools;
    private requireApproval: boolean;
    private autoApproveRead: boolean;

    constructor(options?: {
        requireApproval?: boolean;
        autoApproveRead?: boolean;
    }) {
        this.requireApproval = options?.requireApproval ?? true;
        this.autoApproveRead = options?.autoApproveRead ?? true;

        this.fileSystemTools = new FileSystemTools();
        this.terminalTools = new TerminalTools();
        this.browserTools = new BrowserTools();

        this.registerDefaultTools();
    }

    /**
     * Register all default tools
     */
    private registerDefaultTools(): void {
        // File System Tools
        this.registerTool({
            name: 'fs_read_file',
            category: 'filesystem',
            description: 'Read contents of a file',
            requiresApproval: !this.autoApproveRead,
            execute: async (path: string) => this.fileSystemTools.readFile(path),
        });

        this.registerTool({
            name: 'fs_write_file',
            category: 'filesystem',
            description: 'Write content to a file',
            requiresApproval: true,
            execute: async (path: string, content: string) =>
                this.fileSystemTools.writeFile(path, content),
        });

        this.registerTool({
            name: 'fs_list_directory',
            category: 'filesystem',
            description: 'List directory contents',
            requiresApproval: !this.autoApproveRead,
            execute: async (path: string) => this.fileSystemTools.listDirectory(path),
        });

        this.registerTool({
            name: 'fs_search_files',
            category: 'filesystem',
            description: 'Search for files matching pattern',
            requiresApproval: !this.autoApproveRead,
            execute: async (dirPath: string, pattern: string) =>
                this.fileSystemTools.searchFiles(dirPath, pattern),
        });

        this.registerTool({
            name: 'fs_get_file_info',
            category: 'filesystem',
            description: 'Get file/directory information',
            requiresApproval: !this.autoApproveRead,
            execute: async (path: string) => this.fileSystemTools.getFileInfo(path),
        });

        this.registerTool({
            name: 'fs_delete_file',
            category: 'filesystem',
            description: 'Delete a file',
            requiresApproval: true,
            execute: async (path: string) => this.fileSystemTools.deleteFile(path),
        });

        this.registerTool({
            name: 'fs_generate_diff',
            category: 'filesystem',
            description: 'Generate unified diff between file versions',
            requiresApproval: false,
            execute: async (path: string, oldContent: string, newContent: string) =>
                this.fileSystemTools.generateDiff(path, oldContent, newContent),
        });

        // Terminal Tools
        this.registerTool({
            name: 'term_execute_command',
            category: 'terminal',
            description: 'Execute shell command',
            requiresApproval: true,
            execute: async (command: string, cwd?: string) =>
                this.terminalTools.executeCommand(command, cwd),
        });

        this.registerTool({
            name: 'term_execute_npm',
            category: 'terminal',
            description: 'Execute npm command',
            requiresApproval: true,
            execute: async (command: string, cwd?: string) =>
                this.terminalTools.executeNpmCommand(command, cwd),
        });

        this.registerTool({
            name: 'term_execute_git',
            category: 'terminal',
            description: 'Execute git command',
            requiresApproval: true,
            execute: async (command: string, cwd?: string) =>
                this.terminalTools.executeGitCommand(command, cwd),
        });

        this.registerTool({
            name: 'term_get_cwd',
            category: 'terminal',
            description: 'Get current working directory',
            requiresApproval: false,
            execute: async () => this.terminalTools.getCurrentDirectory(),
        });

        // Browser Tools
        this.registerTool({
            name: 'browser_launch',
            category: 'browser',
            description: 'Launch browser and navigate to URL',
            requiresApproval: true,
            execute: async (url?: string, headless: boolean = false) =>
                this.browserTools.launchBrowser(url, headless),
        });

        this.registerTool({
            name: 'browser_navigate',
            category: 'browser',
            description: 'Navigate to URL',
            requiresApproval: false,
            execute: async (url: string) => this.browserTools.navigateTo(url),
        });

        this.registerTool({
            name: 'browser_click',
            category: 'browser',
            description: 'Click element by selector',
            requiresApproval: false,
            execute: async (selector: string) => this.browserTools.click(selector),
        });

        this.registerTool({
            name: 'browser_type',
            category: 'browser',
            description: 'Type text into element',
            requiresApproval: false,
            execute: async (selector: string, text: string) =>
                this.browserTools.type(selector, text),
        });

        this.registerTool({
            name: 'browser_screenshot',
            category: 'browser',
            description: 'Take screenshot',
            requiresApproval: false,
            execute: async (options?: any) => this.browserTools.screenshot(options),
        });

        this.registerTool({
            name: 'browser_close',
            category: 'browser',
            description: 'Close browser',
            requiresApproval: false,
            execute: async () => this.browserTools.closeBrowser(),
        });

        log.info('Default tools registered', { count: this.tools.size });
    }

    /**
     * Register a custom tool
     */
    public registerTool(tool: Tool): void {
        if (this.tools.has(tool.name)) {
            log.warn('Tool already registered, overwriting', { name: tool.name });
        }
        this.tools.set(tool.name, tool);
        log.debug('Tool registered', { name: tool.name, category: tool.category });
    }

    /**
     * Get tool by name
     */
    public getTool(name: string): Tool | undefined {
        return this.tools.get(name);
    }

    /**
     * Get all tools in category
     */
    public getToolsByCategory(category: Tool['category']): Tool[] {
        return Array.from(this.tools.values()).filter((tool) => tool.category === category);
    }

    /**
     * Get all registered tools
     */
    public getAllTools(): Tool[] {
        return Array.from(this.tools.values());
    }

    /**
     * Execute tool by name
     */
    public async executeTool(
        toolName: string,
        args: any[],
        skipApproval: boolean = false
    ): Promise<ToolExecutionResult> {
        const startTime = Date.now();
        const tool = this.tools.get(toolName);

        if (!tool) {
            return {
                toolName,
                success: false,
                error: `Tool '${toolName}' not found`,
                executionTime: Date.now() - startTime,
            };
        }

        // Check if approval is required
        if (tool.requiresApproval && this.requireApproval && !skipApproval) {
            log.warn('Tool execution requires approval', { toolName });
            return {
                toolName,
                success: false,
                error: 'Tool execution requires user approval',
                executionTime: Date.now() - startTime,
            };
        }

        try {
            log.info('Executing tool', { toolName, argsCount: args.length });
            const result = await tool.execute(...args);

            log.info('Tool executed successfully', {
                toolName,
                executionTime: Date.now() - startTime,
            });

            return {
                toolName,
                success: true,
                result,
                executionTime: Date.now() - startTime,
            };
        } catch (error: any) {
            log.error('Tool execution failed', {
                toolName,
                error: error.message,
            });

            return {
                toolName,
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime,
            };
        }
    }

    /**
     * Get tool definitions for AI (function calling format)
     */
    public getToolDefinitions(): Array<{
        type: 'function';
        function: {
            name: string;
            description: string;
            parameters: Record<string, any>;
        };
    }> {
        return Array.from(this.tools.values()).map((tool) => ({
            type: 'function' as const,
            function: {
                name: tool.name,
                description: tool.description,
                parameters: {
                    type: 'object',
                    properties: {}, // TODO: Add proper parameter schemas
                },
            },
        }));
    }

    /**
     * Enable/disable approval requirement
     */
    public setRequireApproval(require: boolean): void {
        this.requireApproval = require;
        log.info('Approval requirement updated', { requireApproval: require });
    }

    /**
     * Enable/disable auto-approval for read operations
     */
    public setAutoApproveRead(autoApprove: boolean): void {
        this.autoApproveRead = autoApprove;
        log.info('Auto-approve read updated', { autoApproveRead: autoApprove });
    }

    /**
     * Get tool statistics
     */
    public getStats(): {
        total: number;
        byCategory: Record<string, number>;
        requireApproval: number;
    } {
        const tools = Array.from(this.tools.values());
        const byCategory: Record<string, number> = {};

        tools.forEach((tool) => {
            byCategory[tool.category] = (byCategory[tool.category] || 0) + 1;
        });

        return {
            total: tools.length,
            byCategory,
            requireApproval: tools.filter((t) => t.requiresApproval).length,
        };
    }
}
