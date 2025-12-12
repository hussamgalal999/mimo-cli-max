/**
 * MIMO Professional Demo - Arrow Navigation + 5 Features
 */

import * as p from '@clack/prompts';
import { MimoAnimator } from './ui/animator.js';
import { theme } from './ui/theme.js';

async function main() {
    await MimoAnimator.introSequence();

    let running = true;

    while (running) {
        console.clear();
        MimoAnimator.showDashboard('Professional Mode');

        console.log('\n' + theme.dim('─'.repeat(80)));
        console.log(theme.dim('  💡 Navigate professionally with arrows or shortcuts'));
        console.log(theme.dim('─'.repeat(80)) + '\n');

        const action = await p.select({
            message: theme.primary('Professional Action:'),
            options: [
                { value: 'new', label: '🚀 New Project', hint: '[N] Pro' },
                { value: 'audit', label: '🛡️  Audit', hint: '[A] Pro' },
                { value: 'feature', label: '⚡ Feature', hint: '[F] Pro' },
                { value: 'custom', label: '🎨 Custom', hint: 'Pro chat' },
                { value: 'exit', label: '🚪 Exit', hint: '[Q]' },
            ],
        });

        if (p.isCancel(action) || action === 'exit') {
            await MimoAnimator.farewell();
            break;
        }

        if (action === 'new') {
            await MimoAnimator.think('Pro setup...', 2000);
            p.note('Professional!', '🚀 Pro');
        } else if (action === 'custom') {
            const cmd = await p.text({ message: 'Task:', placeholder: 'Pro command' });
            if (!p.isCancel(cmd)) {
                await MimoAnimator.think('Processing...', 1500);
                p.note(`Pro: "${cmd}"`, '✅ Done');
            }
        }

        await new Promise(r => setTimeout(r, 800));
    }

    process.exit(0);
}

main().catch(console.error);
