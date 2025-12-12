/**
 * MIMO Ultimate Demo - Arrow Navigation + 10 Features
 */

import * as p from '@clack/prompts';
import { MimoAnimator } from './ui/animator.js';
import { theme } from './ui/theme.js';

async function main() {
    await MimoAnimator.introSequence();

    let running = true;

    while (running) {
        console.clear();
        MimoAnimator.showDashboard('Ultimate Mode - 10 Features');

        console.log('\n' + theme.dim('─'.repeat(80)));
        console.log(theme.dim('  💡 Arrow navigation or shortcuts available'));
        console.log(theme.dim('─'.repeat(80)) + '\n');

        const action = await p.select({
            message: theme.primary('Ultimate Action:'),
            options: [
                { value: 'new', label: '🚀 New Project', hint: '[N]' },
                { value: 'audit', label: '🛡️  Audit', hint: '[A]' },
                { value: 'feature', label: '⚡ Feature', hint: '[F]' },
                { value: 'models', label: '📊 Models', hint: '[M]' },
                { value: 'tools', label: '🛠️  Tools', hint: '[T]' },
                { value: 'custom', label: '🎨 Custom', hint: 'Chat' },
                { value: 'exit', label: '🚪 Exit', hint: '[Q]' },
            ],
        });

        if (p.isCancel(action) || action === 'exit') {
            await MimoAnimator.farewell();
            break;
        }

        if (action === 'new') {
            await MimoAnimator.think('Ultimate setup...', 2000);
            p.note('10 features active!', '🚀 Ultimate');
        } else if (action === 'custom') {
            const cmd = await p.text({ message: 'Command:', placeholder: 'Any task' });
            if (!p.isCancel(cmd)) {
                await MimoAnimator.think('Processing...', 1500);
                p.note(`Done: "${cmd}"`, '✅ Ultimate');
            }
        }

        await new Promise(r => setTimeout(r, 800));
    }

    process.exit(0);
}

main().catch(console.error);
