/**
 * MIMO MCP Server Implementation
 * Model Context Protocol for advanced tool interaction
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FileSystemTools } from '../tools/FileSystemTools.js';
import { TerminalTools } from '../tools/TerminalTools.js';
import { BrowserTools } from '../tools/BrowserTools.js';
import { log } from '../utils/Logger.js';

/**
 * MCP Server for MIMO
 * Exposes tools via Model Context Protocol
 */
export class MCPServer {
    private server: Server;
    private fileSystemTools: FileSystemTools;
    private terminalTools: TerminalTools;
    private browserTools: BrowserTools;

    constructor() {
        this.server = new Server(
            {
                name: 'mimo-mcp-server',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.fileSystemTools = new FileSystemTools();
        this.terminalTools = new TerminalTools();
        this.browserTools = new BrowserTools();

        this.setupHandlers();
    }

    private setupHandlers(): void {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    // File System Tools
                    {
                        name: 'read_file',
                        description: 'Read contents of a file',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'File path' },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'write_file',
                        description: 'Write content to a file',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'File path' },
                                content: { type: 'string', description: 'File content' },
                            },
                            required: ['path', 'content'],
                        },
                    },
                    {
                        name: 'list_directory',
                        description: 'List directory contents',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: { type: 'string', description: 'Directory path' },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'search_files',
                        description: 'Search for files matching pattern',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                directory: { type: 'string', description: 'Directory to search' },
                                pattern: { type: 'string', description: 'Search pattern' },
                            },
                            required: ['directory', 'pattern'],
                        },
                    },
                    // Terminal Tools
                    {
                        name: 'execute_command',
                        description: 'Execute shell command',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                command: { type: 'string', description: 'Command to execute' },
                                cwd: { type: 'string', description: 'Working directory' },
                            },
                            required: ['command'],
                        },
                    },
                    // Browser Tools
                    {
                        name: 'browser_navigate',
                        description: 'Navigate browser to URL',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', description: 'URL to navigate to' },
                            },
                            required: ['url'],
                        },
                    },
                    {
                        name: 'browser_screenshot',
                        description: 'Take browser screenshot',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                fullPage: { type: 'boolean', description: 'Capture full page' },
                            },
                        },
                    },
                ],
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                let result: any;

                switch (name) {
                    case 'read_file':
                        result = await this.fileSystemTools.readFile(args.path as string);
                        break;
                    case 'write_file':
                        await this.fileSystemTools.writeFile(args.path as string, args.content as string);
                        result = { success: true };
                        break;
                    case 'list_directory':
                        result = await this.fileSystemTools.listDirectory(args.path as string);
                        break;
                    case 'search_files':
                        result = await this.fileSystemTools.searchFiles(
                            args.directory as string,
                            args.pattern as string
                        );
                        break;
                    case 'execute_command':
                        result = await this.terminalTools.executeCommand(
                            args.command as string,
                            args.cwd as string
                        );
                        break;
                    case 'browser_navigate':
                        if (!this.browserTools.isSessionActive()) {
                            await this.browserTools.launchBrowser(args.url as string);
                        } else {
                            await this.browserTools.navigateTo(args.url as string);
                        }
                        result = { success: true };
                        break;
                    case 'browser_screenshot':
                        const screenshot = await this.browserTools.screenshot({
                            fullPage: args.fullPage as boolean,
                        });
                        result = { screenshot: screenshot.toString('base64') };
                        break;
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                log.error('MCP tool execution error', { tool: name, error: error.message });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }

    /**
     * Start MCP server
     */
    public async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        log.info('MCP Server started');
    }

    /**
     * Stop MCP server
     */
    public async stop(): Promise<void> {
        await this.server.close();
        log.info('MCP Server stopped');
    }
}
