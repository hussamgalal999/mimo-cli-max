/**
 * Enhanced UI Features for MIMO-CLI-MAX
 * - Dynamic colors based on time of day
 * - Animated robot avatar
 * - System statistics display
 */

import chalk from 'chalk';
import ora from 'ora';

/**
 * Get dynamic color scheme based on time of day
 */
export function getTimeBasedColors() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        // Morning: Warm sunrise colors
        return {
            primary: chalk.hex('#FF6B35'),
            secondary: chalk.hex('#F7931E'),
            accent: chalk.hex('#FDC830'),
            name: 'Morning Sunrise'
        };
    } else if (hour >= 12 && hour < 17) {
        // Afternoon: Bright sky colors
        return {
            primary: chalk.hex('#00B4D8'),
            secondary: chalk.hex('#0096C7'),
            accent: chalk.hex('#48CAE4'),
            name: 'Afternoon Sky'
        };
    } else if (hour >= 17 && hour < 21) {
        // Evening: Sunset colors
        return {
            primary: chalk.hex('#E63946'),
            secondary: chalk.hex('#F77F00'),
            accent: chalk.hex('#FCBF49'),
            name: 'Evening Sunset'
        };
    } else {
        // Night: Cool dark colors
        return {
            primary: chalk.hex('#7209B7'),
            secondary: chalk.hex('#560BAD'),
            accent: chalk.hex('#B5179E'),
            name: 'Night Mode'
        };
    }
}

/**
 * Get greeting based on time of day
 */
export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return '☀️ Good Morning';
    if (hour >= 12 && hour < 17) return '🌤️ Good Afternoon';
    if (hour >= 17 && hour < 21) return '🌅 Good Evening';
    return '🌙 Good Night';
}

/**
 * Animated Robot Avatar States
 */
export class RobotAvatar {
    private static frames = {
        idle: [
            `      ▄▄████████████▄▄
    ▄██▀▀          ▀▀██▄
   ▐██    ██    ██    ██▌
   ▐██       ▄▄       ██▌
    ▀██▄▄          ▄▄██▀
      ▀▀████████████▀▀
          ░░░░░░░░`,
            `      ▄▄████████████▄▄
    ▄██▀▀          ▀▀██▄
   ▐██    ▀▀    ▀▀    ██▌
   ▐██       ▄▄       ██▌
    ▀██▄▄          ▄▄██▀
      ▀▀████████████▀▀
          ░░░░░░░░`
        ],
        thinking: [
            `      ▄▄████████████▄▄
    ▄██▀▀          ▀▀██▄
   ▐██    ▀▀    ▀▀    ██▌
   ▐██       ▄▄       ██▌  💭
    ▀██▄▄          ▄▄██▀
      ▀▀████████████▀▀
          ░░░░░░░░`,
            `      ▄▄████████████▄▄
    ▄██▀▀          ▀▀██▄
   ▐██    ██    ██    ██▌
   ▐██       ▄▄       ██▌     💭
    ▀██▄▄          ▄▄██▀
      ▀▀████████████▀▀
          ░░░░░░░░`
        ],
        success: [
            `      ▄▄████████████▄▄
    ▄██▀▀          ▀▀██▄
   ▐██    ▀▀    ▀▀    ██▌
   ▐██      ▀▀▀▀      ██▌  ✨
    ▀██▄▄          ▄▄██▀
      ▀▀████████████▀▀
          ░░░░░░░░`
        ]
    };

    static getFrame(state: 'idle' | 'thinking' | 'success', frameIndex: number = 0): string {
        const frames = this.frames[state];
        const colors = getTimeBasedColors();
        return colors.primary(frames[frameIndex % frames.length] || frames[0] || '');
    }

    static async animate(state: 'idle' | 'thinking' | 'success', duration: number = 1000): Promise<void> {
        const frames = this.frames[state];
        const frameDelay = duration / frames.length;

        for (let i = 0; i < frames.length; i++) {
            console.clear();
            console.log(this.getFrame(state, i));
            await new Promise(r => setTimeout(r, frameDelay));
        }
    }
}

/**
 * System Statistics
 */
export class SystemStats {
    static async getStats() {
        const os = await import('os');
        const process = await import('process');

        return {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            memory: {
                total: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 10) / 10,
                free: Math.round(os.freemem() / 1024 / 1024 / 1024 * 10) / 10,
                used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024 * 10) / 10
            },
            cpus: os.cpus().length,
            uptime: Math.round(os.uptime() / 60)
        };
    }

    static async display(): Promise<void> {
        const stats = await this.getStats();
        const colors = getTimeBasedColors();

        console.log(colors.secondary('\n📊 System Statistics:'));
        console.log(chalk.dim('  ├─ Platform:'), chalk.white(`${stats.platform} (${stats.arch})`));
        console.log(chalk.dim('  ├─ Node.js:'), chalk.white(stats.nodeVersion));
        console.log(chalk.dim('  ├─ CPUs:'), chalk.white(`${stats.cpus} cores`));
        console.log(chalk.dim('  ├─ Memory:'), chalk.white(`${stats.memory.used}GB / ${stats.memory.total}GB`));
        console.log(chalk.dim('  └─ Uptime:'), chalk.white(`${stats.uptime} minutes\n`));
    }
}

/**
 * Enhanced Splash Screen with all features
 */
export async function showEnhancedSplash(): Promise<void> {
    console.clear();

    const colors = getTimeBasedColors();
    const greeting = getTimeBasedGreeting();
    const W = 80;

    // Animated robot entrance
    await RobotAvatar.animate('idle', 600);

    console.clear();

    // Robot avatar
    console.log(RobotAvatar.getFrame('idle', 0));
    console.log('');

    // Header with dynamic colors
    console.log(colors.primary('╭' + '─'.repeat(W - 2) + '╮'));

    // Title - simplified layout
    const titleText = 'MIMO-CLI-MAX v5.0';
    const statusText = '● Online';
    const titlePadding = Math.max(0, W - titleText.length - statusText.length - 4);
    console.log(colors.primary('│ ') + colors.accent(titleText) +
        ' '.repeat(titlePadding) +
        chalk.green(statusText) + colors.primary(' │'));

    // Separator
    console.log(colors.primary('│') + chalk.dim('  ' + '─'.repeat(W - 4)) + '  ' + colors.primary('│'));

    // Info line with greeting - simplified
    const infoText = `${greeting}  │  ⚡ AI Engine  │  👨‍💻 Hossam Galal  │  🌍 Egypt`;
    const infoPadding = Math.max(0, W - infoText.length - 4);
    console.log(colors.primary('│  ') + chalk.white(infoText) +
        ' '.repeat(infoPadding) + colors.primary('  │'));

    // Theme indicator
    const themeText = `🎨 ${colors.name}`;
    const themePadding = Math.max(0, W - themeText.length - 4);
    console.log(colors.primary('│  ') + chalk.dim(themeText) +
        ' '.repeat(themePadding) + colors.primary('  │'));

    // Bottom border
    console.log(colors.primary('╰' + '─'.repeat(W - 2) + '╯'));

    // Loading animation
    const spinner = ora({
        text: colors.secondary('Initializing AI System...'),
        color: 'cyan',
        spinner: 'dots'
    }).start();

    await new Promise(r => setTimeout(r, 800));
    spinner.succeed(chalk.green('System Ready - All Agents Online'));

    // System stats
    await SystemStats.display();

    console.log(colors.accent('[>>] Ready for Advanced Task Processing\n'));
}
