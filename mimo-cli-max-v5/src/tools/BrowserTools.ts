import puppeteer, { Browser, Page } from 'puppeteer-core';
import { log } from '../utils/Logger.js';

export interface ScreenshotOptions {
    fullPage?: boolean;
    selector?: string;
    path?: string;
}

export interface ClickOptions {
    delay?: number;
    button?: 'left' | 'right' | 'middle';
    clickCount?: number;
}

export interface BrowserSession {
    browser: Browser;
    page: Page;
    url: string;
    startTime: Date;
}

/**
 * Browser Tools
 * Provides browser automation capabilities (Computer Use feature)
 */
export class BrowserTools {
    private session?: BrowserSession;
    private executablePath: string;

    constructor(executablePath?: string) {
        // Auto-detect Chrome/Chromium path
        this.executablePath = executablePath || this.detectChromePath();
    }

    /**
     * Launch browser instance
     */
    public async launchBrowser(url?: string, headless: boolean = false): Promise<void> {
        try {
            log.debug('Launching browser', { url, headless });

            const browser = await puppeteer.launch({
                executablePath: this.executablePath,
                headless: headless ? 'new' : false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                ],
            });

            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });

            if (url) {
                await page.goto(url, { waitUntil: 'networkidle2' });
            }

            this.session = {
                browser,
                page,
                url: url || 'about:blank',
                startTime: new Date(),
            };

            log.info('Browser launched', { url });
        } catch (error: any) {
            log.error('Error launching browser', { error: error.message });
            throw new Error(`Failed to launch browser: ${error.message}`);
        }
    }

    /**
     * Navigate to URL
     */
    public async navigateTo(url: string): Promise<void> {
        this.ensureSession();

        try {
            log.debug('Navigating to URL', { url });
            await this.session!.page.goto(url, { waitUntil: 'networkidle2' });
            this.session!.url = url;
            log.info('Navigation complete', { url });
        } catch (error: any) {
            log.error('Error navigating', { url, error: error.message });
            throw new Error(`Failed to navigate to ${url}: ${error.message}`);
        }
    }

    /**
     * Click element by selector
     */
    public async click(selector: string, options?: ClickOptions): Promise<void> {
        this.ensureSession();

        try {
            log.debug('Clicking element', { selector });

            await this.session!.page.waitForSelector(selector, { timeout: 5000 });
            await this.session!.page.click(selector, {
                delay: options?.delay,
                button: options?.button,
                clickCount: options?.clickCount,
            });

            log.info('Element clicked', { selector });
        } catch (error: any) {
            log.error('Error clicking element', { selector, error: error.message });
            throw new Error(`Failed to click ${selector}: ${error.message}`);
        }
    }

    /**
     * Type text into element
     */
    public async type(selector: string, text: string, delay?: number): Promise<void> {
        this.ensureSession();

        try {
            log.debug('Typing text', { selector, textLength: text.length });

            await this.session!.page.waitForSelector(selector, { timeout: 5000 });
            await this.session!.page.type(selector, text, { delay: delay || 50 });

            log.info('Text typed', { selector });
        } catch (error: any) {
            log.error('Error typing text', { selector, error: error.message });
            throw new Error(`Failed to type into ${selector}: ${error.message}`);
        }
    }

    /**
     * Take screenshot
     */
    public async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
        this.ensureSession();

        try {
            log.debug('Taking screenshot', options);

            let screenshotBuffer: Buffer;

            if (options?.selector) {
                const element = await this.session!.page.$(options.selector);
                if (!element) {
                    throw new Error(`Element ${options.selector} not found`);
                }
                screenshotBuffer = (await element.screenshot({
                    path: options.path,
                })) as Buffer;
            } else {
                screenshotBuffer = (await this.session!.page.screenshot({
                    fullPage: options?.fullPage,
                    path: options?.path,
                })) as Buffer;
            }

            log.info('Screenshot captured', { size: screenshotBuffer.length });
            return screenshotBuffer;
        } catch (error: any) {
            log.error('Error taking screenshot', { error: error.message });
            throw new Error(`Failed to capture screenshot: ${error.message}`);
        }
    }

    /**
     * Scroll page
     */
    public async scrollTo(x: number, y: number): Promise<void> {
        this.ensureSession();

        try {
            log.debug('Scrolling page', { x, y });
            await this.session!.page.evaluate((scrollX, scrollY) => {
                window.scrollTo(scrollX, scrollY);
            }, x, y);
            log.info('Page scrolled', { x, y });
        } catch (error: any) {
            log.error('Error scrolling', { error: error.message });
            throw new Error(`Failed to scroll: ${error.message}`);
        }
    }

    /**
     * Get console logs
     */
    public async getConsoleLogs(): Promise<string[]> {
        this.ensureSession();

        const logs: string[] = [];

        this.session!.page.on('console', (msg) => {
            logs.push(`[${msg.type()}] ${msg.text()}`);
        });

        return logs;
    }

    /**
     * Evaluate JavaScript in page context
     */
    public async evaluate<T>(script: string): Promise<T> {
        this.ensureSession();

        try {
            log.debug('Evaluating script', { scriptLength: script.length });
            const result = await this.session!.page.evaluate(script);
            log.info('Script evaluated');
            return result as T;
        } catch (error: any) {
            log.error('Error evaluating script', { error: error.message });
            throw new Error(`Failed to evaluate script: ${error.message}`);
        }
    }

    /**
     * Wait for selector
     */
    public async waitForSelector(selector: string, timeout: number = 5000): Promise<void> {
        this.ensureSession();

        try {
            log.debug('Waiting for selector', { selector, timeout });
            await this.session!.page.waitForSelector(selector, { timeout });
            log.info('Selector found', { selector });
        } catch (error: any) {
            log.error('Timeout waiting for selector', { selector, error: error.message });
            throw new Error(`Selector ${selector} not found within ${timeout}ms`);
        }
    }

    /**
     * Get page title
     */
    public async getPageTitle(): Promise<string> {
        this.ensureSession();
        return await this.session!.page.title();
    }

    /**
     * Get page URL
     */
    public getCurrentUrl(): string {
        this.ensureSession();
        return this.session!.url;
    }

    /**
     * Close browser
     */
    public async closeBrowser(): Promise<void> {
        if (this.session) {
            try {
                log.debug('Closing browser');
                await this.session.browser.close();
                this.session = undefined;
                log.info('Browser closed');
            } catch (error: any) {
                log.error('Error closing browser', { error: error.message });
            }
        }
    }

    /**
     * Check if browser session is active
     */
    public isSessionActive(): boolean {
        return !!this.session;
    }

    /**
     * Ensure browser session exists
     */
    private ensureSession(): void {
        if (!this.session) {
            throw new Error('No active browser session. Call launchBrowser() first.');
        }
    }

    /**
     * Auto-detect Chrome/Chromium executable path
     */
    private detectChromePath(): string {
        const paths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            '/usr/bin/chromium-browser',
            '/usr/bin/google-chrome',
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        ];

        // Return first available or empty (puppeteer will auto-detect)
        return paths.find(Boolean) || '';
    }
}
