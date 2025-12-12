/**
 * Text Streamer - Claude Code Style
 * Smooth, character-by-character text streaming
 */

import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import color from 'picocolors';

// Configure marked for terminal rendering
marked.setOptions({
    renderer: new TerminalRenderer({
        code: color.cyan,
        blockquote: color.gray,
        html: color.yellow,
        heading: color.green,
        firstHeading: color.magenta,
        hr: color.reset,
        listitem: color.reset,
        list: color.reset,
        table: color.reset,
        paragraph: color.reset,
        strong: color.bold,
        em: color.italic,
        codespan: color.cyan,
        del: color.dim,
        link: color.blue,
        href: color.blue,
    }),
});

/**
 * Stream text character by character (typewriter effect)
 */
export async function streamText(text: string, speed: number = 2): Promise<void> {
    for (const char of text) {
        process.stdout.write(char);
        await new Promise((resolve) => setTimeout(resolve, speed));
    }
    process.stdout.write('\n');
}

/**
 * Stream markdown-formatted response with syntax highlighting
 */
export async function streamResponse(fullText: string, speed: number = 2): Promise<void> {
    // Convert markdown to terminal-formatted text
    const formattedText = marked(fullText) as string;

    // Stream the formatted text
    for (const char of formattedText) {
        process.stdout.write(char);
        await new Promise((resolve) => setTimeout(resolve, speed));
    }
    process.stdout.write('\n');
}

/**
 * Stream response in chunks (more realistic AI streaming)
 */
export async function streamResponseChunked(fullText: string, chunkSize: number = 3): Promise<void> {
    const formattedText = marked(fullText) as string;
    const chunks: string[] = [];

    // Split into chunks
    for (let i = 0; i < formattedText.length; i += chunkSize) {
        chunks.push(formattedText.slice(i, i + chunkSize));
    }

    // Stream chunks with slight delay
    for (const chunk of chunks) {
        process.stdout.write(chunk);
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    process.stdout.write('\n');
}

/**
 * Stream code block with syntax highlighting
 */
export async function streamCodeBlock(code: string, language: string = 'typescript'): Promise<void> {
    const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``;
    await streamResponse(codeBlock, 1);
}

/**
 * Display formatted markdown (instant, no streaming)
 */
export function displayMarkdown(text: string): void {
    const formatted = marked(text) as string;
    console.log(formatted);
}

/**
 * Display code block (instant)
 */
export function displayCodeBlock(code: string, language: string = 'typescript'): void {
    const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``;
    displayMarkdown(codeBlock);
}

/**
 * Stream with typing indicator (shows cursor)
 */
export async function streamWithCursor(text: string, speed: number = 2): Promise<void> {
    const cursor = '▋';

    for (let i = 0; i <= text.length; i++) {
        // Clear line
        process.stdout.write('\r\x1b[K');

        // Write text up to current position + cursor
        process.stdout.write(text.slice(0, i) + color.dim(cursor));

        await new Promise((resolve) => setTimeout(resolve, speed));
    }

    // Clear cursor and move to next line
    process.stdout.write('\r\x1b[K');
    process.stdout.write(text + '\n');
}

/**
 * Stream JSON with pretty formatting
 */
export async function streamJSON(obj: any, speed: number = 1): Promise<void> {
    const jsonText = JSON.stringify(obj, null, 2);
    await streamCodeBlock(jsonText, 'json');
}

/**
 * Simulate AI thinking then stream response
 */
export async function thinkAndStream(
    thinkingMessage: string,
    response: string,
    thinkingTime: number = 1000
): Promise<void> {
    // Show thinking
    process.stdout.write(color.dim(thinkingMessage + '...'));
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));

    // Clear thinking message
    process.stdout.write('\r\x1b[K');

    // Stream response
    await streamResponse(response);
}
