/**
 * MIMO Custom Animated Select Menu
 * Features: Animated arrow cursor, dynamic robot eye with selection number
 */

import readline from 'readline';
import { theme } from './theme.js';

interface SelectOption {
    value: string;
    label: string;
    hint?: string;
}

// 🎭 Robot with dynamic eye showing number
function getRobotWithNumber(num: number): string {
    const eyeNum = num.toString();
    return `( ${eyeNum}_◠ )`;
}

// 🎬 Animated arrow frames
const ARROW_FRAMES = ['❯', '›', '❯', '»'];

export class AnimatedSelect {
    private options: SelectOption[];
    private selectedIndex: number = 0;
    private animationFrame: number = 0;
    private intervalId: NodeJS.Timeout | null = null;
    private message: string;
    private rl: readline.Interface;
    private resolve: ((value: string) => void) | null = null;
    private onHighlight?: (value: string) => void;

    constructor(message: string, options: SelectOption[], onHighlight?: (value: string) => void) {
        this.message = message;
        this.options = options;
        this.onHighlight = onHighlight;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    private render(): void {
        // Clear previous render - Simplified for stability
        process.stdout.write('\x1B[2J\x1B[0;0H');

        // Robot with selection number in eye
        const robot = getRobotWithNumber(this.selectedIndex + 1);
        console.log('\n' + theme.primary(robot) + '  ' + theme.logoGradient('MIMO-CLI-MAX'));
        console.log('\n' + theme.white(this.message) + '\n');

        // Render options with animated arrow
        const arrow = theme.primary(ARROW_FRAMES[this.animationFrame % ARROW_FRAMES.length]);

        this.options.forEach((opt, index) => {
            const isSelected = index === this.selectedIndex;
            const prefix = isSelected ? `  ${arrow} ` : '    ';
            const label = isSelected ? theme.white(opt.label) : theme.dim(opt.label);
            const hint = opt.hint ? theme.dim(` ${opt.hint}`) : '';

            console.log(prefix + label + hint);
        });

        console.log('\n' + theme.dim('↑↓ to navigate • Enter to select'));
    }

    private startAnimation(): void {
        this.intervalId = setInterval(() => {
            this.animationFrame++;
            this.render();
        }, 150); // Faster arrow
    }

    private stopAnimation(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    async show(): Promise<string> {
        return new Promise((resolve) => {
            this.resolve = resolve;

            // Enable raw mode for keypress detection
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(true);
            }
            process.stdin.resume();

            this.render();
            this.startAnimation();

            // Trigger initial highlight
            if (this.onHighlight) {
                this.onHighlight(this.options[0].value);
            }

            process.stdin.on('keypress', (str, key) => {
                if (key.name === 'up') {
                    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
                    if (this.onHighlight) this.onHighlight(this.options[this.selectedIndex].value);
                    this.render();
                } else if (key.name === 'down') {
                    this.selectedIndex = Math.min(this.options.length - 1, this.selectedIndex + 1);
                    if (this.onHighlight) this.onHighlight(this.options[this.selectedIndex].value);
                    this.render();
                } else if (key.name === 'return') {
                    this.stopAnimation();
                    if (process.stdin.isTTY) {
                        process.stdin.setRawMode(false);
                    }
                    this.rl.close();
                    resolve(this.options[this.selectedIndex].value);
                } else if (key.ctrl && key.name === 'c') {
                    this.stopAnimation();
                    process.exit(0);
                }
            });

            // Enable keypress events
            readline.emitKeypressEvents(process.stdin);
        });
    }
}
