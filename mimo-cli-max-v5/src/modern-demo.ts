/**
 * MIMO Modern Demo - Arrow Navigation + Claude Style
 */

import * as p from '@clack/prompts';
import { MimoAnimator } from './ui/animator.js';
import { theme } from './ui/theme.js';

async function main() {
    await MimoAnimator.introSequence();

    let running = true;

    while (running) {
        console.clear();
        MimoAnimator.showDashboard('Modern Claude Style');

        console.log('\n' + theme.dim('─'.repeat(80)));
        console.log(theme.dim('  💡 Modern arrow navigation + shortcuts'));
        console.log(theme.dim('─'.repeat(80)) + '\n');

        const action = await p.select({
            message: theme.primary('Modern Action:'),
            options: [
                { value: 'new', label: '🚀 New Project', hint: '[N] Modern' },
                { value: 'audit', label: '🛡️  Audit', hint: '[A] Modern' },
                { value: 'feature', label: '⚡ Feature', hint: '[F] Modern' },
                { value: 'custom', label: '🎨 Custom', hint: 'Chat' },
                { value: 'exit', label: '🚪 Exit', hint: '[Q]' },
            ],
        });

        if (p.isCancel(action) || action === 'exit') {
            await MimoAnimator.farewell();
            break;
        }

        if (action === 'new') {
            await MimoAnimator.think('Modern setup...', 1800);
            p.note('Modern ready!', '🚀 Modern');
        } else if (action === 'custom') {
            const cmd = await p.text({ message: 'Task:', placeholder: 'Modern command' });
            if (!p.isCancel(cmd)) {
                await MimoAnimator.think('Processing...', 1200);
                p.note(`Modern: "${cmd}"`, '✅ Done');
            }
        }

        await new Promise(r => setTimeout(r, 800));
    }

    process.exit(0);
}

main().catch(console.error);
