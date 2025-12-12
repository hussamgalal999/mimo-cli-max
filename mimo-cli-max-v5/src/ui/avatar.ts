/**
 * MIMO Avatar - Robot Expressions
 */

import { icons } from './theme.js';

export const avatar = {
    getExpression: (state: string): string => {
        switch (state) {
            case 'idle': return icons.robot.idle;
            case 'wink': return icons.robot.wink;
            case 'happy': return icons.robot.happy;
            case 'busy': return icons.robot.busy;
            case 'sleep': return icons.robot.sleep;
            case 'love': return icons.robot.love;
            case 'shock': return icons.robot.shock;
            case 'thinking': return icons.robot.thinking;
            default: return icons.robot.idle;
        }
    }
};
