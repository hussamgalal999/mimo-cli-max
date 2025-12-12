/**
 * MIMO Branded Demo - Hybrid Arrow Navigation + Shortcuts
 */

import * as p from '@clack/prompts';
import { MimoAnimator } from './ui/animator.js';
import { theme } from './ui/theme.js';

async function main() {
    await MimoAnimator.introSequence();

    let running = true;

    while (running) {
        console.clear();
        MimoAnimator.showDashboard('Branded Interface');

        console.log('\n' + theme.dim('─'.repeat(80)));
        console.log(theme.dim('  💡 Navigate with arrows or shortcuts: N/A/F/M/T/Q'));
        console.log(theme.dim('─'.repeat(80)) + '\n');

        const action = await p.select({
            message: theme.primary('Select Action:'),
            options: [
                { value: 'new', label: '🚀 New Project', hint: '[N]' },
                { value: 'audit', label: '🛡️  Security Audit', hint: '[A]' },
                { value: 'feature', label: '⚡ Develop Feature', hint: '[F]' },
                { value: 'models', label: '📊 Browse Models', hint: '[M]' },
                { value: 'tools', label: '🛠️  System Tools', hint: '[T]' },
                { value: 'custom', label: '🎨 Custom Command', hint: 'Chat' },
                { value: 'exit', label: '🚪 Exit', hint: '[Q]' },
            ],
        });

        if (p.isCancel(action) || action === 'exit') {
            await MimoAnimator.farewell();
            break;
        }

        if (action === 'new') {
            await MimoAnimator.think('Initializing...', 2000);
            await MimoAnimator.celebrate('Ready!');
            p.note('Project created.', '🚀 Success');
        } else if (action === 'audit') {
            await MimoAnimator.work('Auditing...', 2000);
            p.note('No issues.', '🛡️  Audit');
        } else if (action === 'feature') {
            await MimoAnimator.work('Generating...', 1800);
            p.note('Feature ready.', '⚡ Feature');
        } else if (action === 'models') {
            await MimoAnimator.work('Loading...', 1500);
            p.note('100+ models.', '📊 Models');
        } else if (action === 'tools') {
            await MimoAnimator.work('Loading...', 1200);
            p.note('50+ tools.', '🛠️  Tools');
        } else if (action === 'custom') {
            const cmd = await p.text({ message: 'Custom task:', placeholder: 'e.g., "Create login"' });
            if (!p.isCancel(cmd)) {
                await MimoAnimator.think('Processing...', 1500);
                p.note(`Done: "${cmd}"`, '✅ Complete');
            }
        }

        await new Promise(r => setTimeout(r, 800));
    }

    process.exit(0);
}

main().catch(console.error);
