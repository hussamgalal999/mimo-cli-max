/**
 * MIMO Professional Launch Screen
 * NOW WITH: Heavy Block Art Design from minmo2.txt Specification
 * Unicode Block Elements (█, ▄, ▀, ▌, ▐, ░, ▒, ▓)
 */

import { theme } from './theme.js';
import { ConfigManager } from '../config/config-manager.js';

// 🎨 NEW BLOCK ART ROBOT (From minmo2.txt Specification)
// Heavy, Industrial, Sentient Design
const getBlockArtRobot = (state: 'idle' | 'thinking' | 'success' = 'idle') => {
    // Eye variations based on state
    const eyes = {
        idle: ['██', '██'],      // Standard eyes
        thinking: ['▀▀', '▀▀'],  // Looking up
        success: ['▀▀', '▀▀'],   // Happy squint
    };

    const [leftEye, rightEye] = eyes[state];

    // Mouth variations
    const mouth = {
        idle: '▄▄',
        thinking: '▄▄',
        success: '▀▀▀▀',  // Smile
    };

    return `
${theme.primary('      ▄▄████████████▄▄      ')}
${theme.primary('    ▄██▀▀          ▀▀██▄    ')}
${theme.primary('   ▐██    ')}${theme.white(leftEye)}${theme.primary('    ')}${theme.white(rightEye)}${theme.primary('    ██▌   ')}
${theme.primary('   ▐██       ')}${theme.dim(mouth[state])}${theme.primary('       ██▌   ')}
${theme.primary('    ▀██▄▄          ▄▄██▀    ')}
${theme.primary('      ▀▀████████████▀▀      ')}
${theme.dim('          ░░░░░░░░          ')}
`;
};

// Themes for selection
const THEMES = [
    { value: 'ocean', label: 'Ocean mode', hint: '' },
    { value: 'sunset', label: 'Sunset mode', hint: '' },
    { value: 'cyberpunk', label: 'Cyberpunk mode', hint: '' },
    { value: 'forest', label: 'Forest mode', hint: '' },
    { value: 'dark', label: 'Dark mode', hint: '✔ Recommended' },
];

export class LaunchScreen {
    static async show(): Promise<void> {
        let selectedIndex = 0;
        let frameIndex = 0;
        let running = true;

        // Setup Input
        if (process.stdin.isTTY) process.stdin.setRawMode(true);
        process.stdin.resume();

        const render = () => {
            console.clear();

            // 1. Draw NEW Block Art Robot
            console.log(getBlockArtRobot('idle'));

            // 2. Status Bar
            console.log(theme.dim('[ ⚡ MIMO-MAX: SYSTEM STANDBY ]'));

            // 3. Title & Info
            console.log('\n ' + theme.logoGradient('MIMO-CLI-MAX v5.0') + theme.dim(' | Hybrid AI OS'));
            console.log(' ' + theme.white('Live Preview: ') + theme.primary(theme.getCurrent().toUpperCase()));
            console.log('\n ' + theme.dim('Select a theme to apply it persistently.'));

            // 4. Options with animated arrow
            THEMES.forEach((t, i) => {
                const isSelected = i === selectedIndex;
                const arrow = ['❯', '›', '❯', '»'][frameIndex % 4];
                const prefix = isSelected ? theme.primary(` ${arrow} `) : '   ';
                const label = isSelected ? theme.primary(t.label) : theme.dim(t.label);
                console.log(prefix + label);
            });

            console.log('\n' + theme.dim('↑↓ to navigate • Enter to select'));
        };

        const interval = setInterval(() => {
            frameIndex++;
            render();
        }, 200);

        render();

        // Input Logic
        const keyHandler = (str: string, key: { name: string; ctrl?: boolean }) => {
            if (!running) return;

            if (key.name === 'up') {
                selectedIndex = Math.max(0, selectedIndex - 1);
                theme.setTheme(THEMES[selectedIndex]!.value);
                render();
            } else if (key.name === 'down') {
                selectedIndex = Math.min(THEMES.length - 1, selectedIndex + 1);
                theme.setTheme(THEMES[selectedIndex]!.value);
                render();
            } else if (key.name === 'return') {
                running = false;
                clearInterval(interval);
                process.stdin.removeListener('keypress', keyHandler);
                if (process.stdin.isTTY) process.stdin.setRawMode(false);

                // Save
                ConfigManager.save({ theme: THEMES[selectedIndex]!.value, firstRun: false });

                console.clear();
            } else if (key.ctrl && key.name === 'c') {
                running = false;
                clearInterval(interval);
                process.exit(0);
            }
        };

        const readline = await import('readline');
        readline.emitKeypressEvents(process.stdin);
        process.stdin.on('keypress', keyHandler);

        // Wait
        await new Promise<void>(resolve => {
            const check = setInterval(() => {
                if (!running) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }
}
