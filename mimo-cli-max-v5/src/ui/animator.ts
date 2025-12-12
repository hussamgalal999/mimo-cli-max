/**
 * MIMO Ultimate Animator - Live OS Interface
 * Breathing borders, cinematic transitions, Egyptian aesthetics
 * NOW WITH: Enhanced Sentient Drone Avatars (Face + Limbs)
 */

import logUpdate from 'log-update';
import { setTimeout } from 'timers/promises';
import { theme, icons, layout, AvatarState } from './theme.js';
import { BlockAvatars, renderBlockAvatar, renderBattleState, AvatarStateName } from './block-avatars.js';


/**
 * Strip ANSI codes for accurate length calculation
 */
function visibleLength(str: string): number {
    return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '').length;
}

/**
 * Render Complete Dashboard Frame - NOW WITH BLOCK ART
 */
function renderDashboardFrame(
    state: AvatarStateName,
    statusText: string,
    statusColor: (text: string) => string,
): string {
    const avatar = BlockAvatars[state]();
    const W = layout.dashboardWidth;

    const borderTop = theme.dim(`╭${'─'.repeat(W)}╮`);
    const borderBot = theme.dim(`╰${'─'.repeat(W)}╯`);

    // Status Bar below avatar
    const statusBar = `[ ${avatar.statusPrefix} MIMO-MAX: ${statusColor(statusText)} ]`;

    return `
${avatar.lines.join('\n')}

${theme.dim(statusBar)}
${borderTop}
${theme.dim('│')}  ${theme.logoGradient('MIMO-CLI-MAX')} ${theme.dim('v5.0')}${' '.repeat(W - 40)}${theme.success('√ Online')}  ${theme.dim('│')}
${borderBot}
`;
}

/**
 * Legacy compatibility wrapper
 */
function renderLegacyDashboard(
    avatar: string | AvatarState,
    statusText: string,
    statusColor: (text: string) => string,
    borderStyle: (text: string) => string = theme.dim
): string {
    // For legacy code using old face strings, just render idle Block Art
    return renderDashboardFrame('idle', statusText, statusColor);
}

export class MimoAnimator {
    /**
     * CINEMATIC INTRO SEQUENCE - Now with Block Art
     */
    static async introSequence(): Promise<void> {
        console.clear();

        const bootSteps: { text: string; state: AvatarStateName }[] = [
            { text: 'System Integrity Check...', state: 'sleep' },
            { text: 'Loading Neuro-Symbolic Agents...', state: 'thinking' },
            { text: 'Connecting to Swarm Network...', state: 'scan' },
            { text: 'MIMO-MAX Verified.', state: 'idle' },
        ];

        for (const step of bootSteps) {
            logUpdate(renderDashboardFrame(step.state, step.text, theme.dim));
            await setTimeout(300);
        }

        logUpdate(renderDashboardFrame('shock', 'WAKING UP...', theme.warning));
        await setTimeout(400);

        logUpdate(renderDashboardFrame('success', 'SYSTEM ONLINE', theme.success));
        await setTimeout(400);

        logUpdate.done();
    }

    /**
     * BREATHING EFFECT - Thinking animation
     */
    static async think(task: string, duration: number = 2000): Promise<void> {
        const startTime = Date.now();
        let frameIndex = 0;
        const frames: AvatarStateName[] = ['thinking', 'idle'];

        while (Date.now() - startTime < duration) {
            const currentState = frames[frameIndex % frames.length]!;
            logUpdate(renderDashboardFrame(currentState, task, theme.warning));
            frameIndex++;
            await setTimeout(layout.pulseSpeed);
        }

        logUpdate.done();
    }

    /**
     * WORKING ANIMATION
     */
    static async work(task: string, duration: number = 1500): Promise<void> {
        const startTime = Date.now();
        let frameIndex = 0;
        const frames: AvatarStateName[] = ['work', 'idle'];

        while (Date.now() - startTime < duration) {
            const currentState = frames[frameIndex % frames.length]!;
            logUpdate(renderDashboardFrame(currentState, task, theme.primary));
            frameIndex++;
            await setTimeout(layout.animationSpeed);
        }

        logUpdate.done();
    }

    /**
     * CELEBRATION ANIMATION
     */
    static async celebrate(message: string): Promise<void> {
        const frames: AvatarStateName[] = ['success', 'idle', 'love'];

        for (let i = 0; i < 6; i++) {
            const currentState = frames[i % frames.length]!;
            logUpdate(renderDashboardFrame(currentState, message, theme.success));
            await setTimeout(180);
        }

        logUpdate.done();
    }

    /**
     * FAREWELL ANIMATION - Block Art version
     */
    static async farewell(): Promise<void> {
        console.clear();
        console.log(renderBlockAvatar('love'));
        await setTimeout(600);
        console.clear();
        console.log(renderBlockAvatar('sleep'));
        await setTimeout(800);
        console.clear();
    }

    /**
     * STATIC DASHBOARD - Block Art version
     */
    static showDashboard(message: string = 'Awaiting Command...'): void {
        console.log(renderDashboardFrame('idle', message, theme.dim));
    }

    /**
     * SHOW MENU REFERENCE
     */
    static showMenu(): void {
        const title = theme.dim('─'.repeat(30) + ' [ QUICK ACTIONS ] ' + '─'.repeat(30));

        const shortcuts = [
            `${theme.primary('[N]')} New Project`,
            `${theme.primary('[A]')} Audit`,
            `${theme.primary('[F]')} Feature`,
            `${theme.primary('[M]')} Models`,
            `${theme.primary('[T]')} Tools`,
            `${theme.primary('[Q]')} Exit`,
        ];

        const row1 = `   ${shortcuts[0] ?? ''} ${shortcuts[1] ?? ''} ${shortcuts[2] ?? ''}`;
        const row2 = `   ${shortcuts[3] ?? ''} ${shortcuts[4] ?? ''} ${shortcuts[5] ?? ''}`;

        console.log(`
${title}
${row1}
${row2}
${theme.dim('─'.repeat(80))}
`);
    }

    /**
     * CREDITS SCROLL - Star Wars style scrolling credits
     */
    static async creditsScroll(): Promise<void> {
        const credits = [
            '', '', '', '', '',
            theme.logoGradient('╔═══════════════════════════════════════════════════════════════════╗'),
            theme.logoGradient('║') + theme.white('                    M I M O - C L I - M A X                      ') + theme.logoGradient('║'),
            theme.logoGradient('║') + theme.dim('                         Version 5.0                             ') + theme.logoGradient('║'),
            theme.logoGradient('╚═══════════════════════════════════════════════════════════════════╝'),
            '', '',
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            theme.white('                     ABOUT THIS TOOL'),
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            '',
            theme.primary('  Advanced Multi-Agent System with Hybrid Architecture'),
            theme.dim('  Hierarchical-Swarm Intelligence Engine'),
            '',
            theme.dim('  MIMO-CLI-MAX combines the power of multiple AI agents'),
            theme.dim('  working in harmony to deliver exceptional development'),
            theme.dim('  experiences.'),
            '', '',
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            theme.white('                     KEY FEATURES'),
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            '',
            theme.success('  ✓') + theme.white(' Multi-Agent Architecture'),
            theme.success('  ✓') + theme.white(' 100+ AI Models Integration'),
            theme.success('  ✓') + theme.white(' 50+ Development Tools'),
            theme.success('  ✓') + theme.white(' Security Auditing'),
            theme.success('  ✓') + theme.white(' Feature Generation'),
            theme.success('  ✓') + theme.white(' Natural Language Interface'),
            '', '',
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            theme.white('                     POWERED BY'),
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            '',
            theme.warning('  ★★') + theme.white(' Next-Generation AI Intelligence ') + theme.warning('★★'),
            theme.blue('  🇪🇬  Made in Egypt'),
            theme.secondary('      Powered by QudSystem.Ltd'),
            theme.secondary('      Product of QudMind Intelligence'),
            '', '',
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            theme.white('                  PROFESSIONAL SIGNATURE'),
            theme.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'),
            '',
            theme.dim('  ╔═══════════════════════════════════════════════════════════╗'),
            theme.dim('  ║') + theme.warning('                    Eng. Hossam Galal                     ') + theme.dim('║'),
            theme.dim('  ║') + theme.primary('              Senior AI/ML Software Engineer               ') + theme.dim('║'),
            theme.dim('  ║') + theme.primary('                  Full-Stack Architect                     ') + theme.dim('║'),
            theme.dim('  ║') + theme.dim('               (c) 2025 | All Rights Reserved              ') + theme.dim('║'),
            theme.dim('  ╚═══════════════════════════════════════════════════════════╝'),
            '', '',
            theme.logoGradient('        ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★'),
            '',
            theme.success('                    System Ready - All Agents Online'),
            '', '', '', '', '',
        ];

        console.clear();

        for (let offset = 0; offset <= credits.length; offset++) {
            console.clear();
            const start = Math.max(0, offset - 18);
            const end = offset;
            const visible = credits.slice(start, end);

            for (let i = 0; i < 18 - visible.length; i++) console.log('');
            for (const line of visible) console.log('    ' + line);

            await setTimeout(100);
        }

        await setTimeout(1500);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // NEW: BLOCK ART METHODS (Enhanced Sentient Identity)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Show Block Art Avatar
     */
    static showBlockAvatar(state: AvatarStateName): void {
        console.log(renderBlockAvatar(state));
    }

    /**
     * Show Battle State (Easter Egg)
     */
    static showBattle(): void {
        console.log(renderBattleState());
    }

    /**
     * Enhanced Intro with Block Art
     */
    static async blockIntroSequence(): Promise<void> {
        console.clear();

        const bootSteps: { state: AvatarStateName; delay: number }[] = [
            { state: 'sleep', delay: 300 },
            { state: 'cough', delay: 200 },
            { state: 'thinking', delay: 400 },
            { state: 'scan', delay: 300 },
            { state: 'idle', delay: 200 },
        ];

        for (const step of bootSteps) {
            logUpdate(renderBlockAvatar(step.state));
            await setTimeout(step.delay);
        }

        logUpdate(renderBlockAvatar('success'));
        await setTimeout(500);

        logUpdate.done();
    }

    /**
     * Block Art Farewell
     */
    static async blockFarewell(): Promise<void> {
        console.clear();
        console.log(renderBlockAvatar('love'));
        await setTimeout(800);
        console.clear();
        console.log(renderBlockAvatar('sleep'));
        await setTimeout(600);
        console.clear();
    }
}

