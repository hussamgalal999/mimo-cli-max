/**
 * MIMO Perfect Demo - Arrow Navigation + All 15 Features
 */

import * as p from '@clack/prompts';
import { MimoAnimator } from './ui/animator.js';
import { theme, icons } from './ui/theme.js';

async function main() {
    await MimoAnimator.introSequence();

    let running = true;

    while (running) {
        console.clear();
        MimoAnimator.showDashboard('Perfect UX - 15 Features');

        console.log('\n' + theme.dim('─'.repeat(80)));
        console.log(theme.dim('  💡 Arrow keys or shortcuts: N/A/F/M/T/Q'));
        console.log(theme.dim('─'.repeat(80)) + '\n');

        const action = await p.select({
            message: theme.primary('Perfect Interface:'),
            options: [
                { value: 'new', label: '🚀 New Project', hint: '[N] All 15 features' },
                { value: 'audit', label: '🛡️  Security Audit', hint: '[A] Deep scan' },
                { value: 'feature', label: '⚡ Feature', hint: '[F] Full stack' },
                { value: 'models', label: '📊 Models', hint: '[M] 100+' },
                { value: 'tools', label: '🛠️  Tools', hint: '[T] 50+' },
                { value: 'custom', label: '🎨 Custom', hint: 'Any task' },
                { value: 'exit', label: '🚪 Exit', hint: '[Q]' },
            ],
        });

        if (p.isCancel(action) || action === 'exit') {
            await MimoAnimator.farewell();
            break;
        }

        if (action === 'new') {
            await MimoAnimator.think('Perfect planning...', 2500);
            await MimoAnimator.celebrate('Perfect!');
            p.note(`${icons.ui.check} All 15 features applied!`, '🚀 Perfect Project');
        } else if (action === 'audit') {
            await MimoAnimator.work('Perfect analysis...', 2000);
            p.note(`${icons.ui.check} Perfect audit complete!`, '🛡️  Perfect');
        } else if (action === 'custom') {
            const cmd = await p.text({ message: 'Task:', placeholder: 'Describe...' });
            if (!p.isCancel(cmd)) {
                await MimoAnimator.think('Processing...', 1500);
                p.note(`Perfect: "${cmd}"`, '✅ Done');
            }
        }

        await new Promise(r => setTimeout(r, 800));
    }

    process.exit(0);
}

main().catch(console.error);
