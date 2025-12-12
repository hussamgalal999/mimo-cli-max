/**
 * MIMO-MAX Brain - Sentient State Machine
 * Central intelligence for context analysis and emotional state management
 */

import { AvatarStateName, renderBlockAvatar, renderBattleState } from '../ui/block-avatars.js';
import { theme } from '../ui/theme.js';

// Emotion triggers mapped to keywords
const TRIGGER_MAP: Record<string, AvatarStateName> = {
    // Gratitude -> LOVE
    'thanks': 'love',
    'thank you': 'love',
    'شكرا': 'love',
    'awesome': 'love',
    'great': 'love',

    // Boredom -> UFO (Easter Egg)
    'bored': 'ufo',
    'play': 'ufo',
    'game': 'ufo',
    'زهقان': 'ufo',

    // Error keywords -> ERROR
    'error': 'error',
    'bug': 'error',
    'crash': 'error',
    'failed': 'error',

    // Help -> THINKING
    'help': 'thinking',
    'explain': 'thinking',
    'how': 'thinking',

    // Greetings -> IDLE (Ready)
    'hi': 'idle',
    'hello': 'idle',
    'مرحبا': 'idle',
};

// Action-to-State mapping
const ACTION_STATE_MAP: Record<string, AvatarStateName> = {
    'new': 'work',
    'audit': 'scan',
    'feature': 'work',
    'models': 'thinking',
    'tools': 'scan',
    'about': 'cool',
    'theme': 'love',
    'exit': 'sleep',
};

export class MimoBrain {
    private currentState: AvatarStateName = 'idle';
    private isBattleMode: boolean = false;

    /**
     * Analyze input and determine emotional state
     */
    analyzeContext(input: string): AvatarStateName {
        const lowerInput = input.toLowerCase().trim();

        // Check for boredom trigger first (special case)
        if (lowerInput.includes('bored') || lowerInput.includes('زهقان')) {
            this.isBattleMode = true;
            return 'ufo';
        }

        // Check trigger keywords
        for (const [keyword, state] of Object.entries(TRIGGER_MAP)) {
            if (lowerInput.includes(keyword)) {
                this.currentState = state;
                return state;
            }
        }

        // Default to thinking for complex input
        if (lowerInput.length > 20) {
            this.currentState = 'thinking';
            return 'thinking';
        }

        return this.currentState;
    }

    /**
     * Get state for a specific action (menu selection)
     */
    getStateForAction(action: string): AvatarStateName {
        return ACTION_STATE_MAP[action] || 'work';
    }

    /**
     * Set state directly
     */
    setState(state: AvatarStateName): void {
        this.currentState = state;
        this.isBattleMode = false;
    }

    /**
     * Get current state
     */
    getState(): AvatarStateName {
        return this.currentState;
    }

    /**
     * Render current avatar
     */
    render(): string {
        if (this.isBattleMode) {
            return renderBattleState();
        }
        return renderBlockAvatar(this.currentState);
    }

    /**
     * Generate cybernetic response prefix
     */
    getResponsePrefix(): string {
        const prefixes: Record<AvatarStateName, string> = {
            idle: 'Uplink established.',
            work: 'Executing protocol...',
            thinking: 'Compiling neural pathways...',
            scan: 'Initiating data sweep...',
            success: 'Operation complete.',
            error: 'System breach detected!',
            sad: 'Data void encountered...',
            shock: 'Unexpected input detected!',
            love: 'Affection subroutine activated.',
            cool: 'Optimal confidence achieved.',
            sleep: 'Entering low-power mode...',
            cough: 'Recovering from glitch...',
            ufo: 'Breaking dimensional bounds!',
        };

        return theme.dim(`"${prefixes[this.currentState]}"`);
    }

    /**
     * Transition to a new state with optional intermediate frames
     */
    async transitionTo(newState: AvatarStateName, renderFn: (content: string) => void): Promise<void> {
        // Simple transition: show intermediate "glitch" frame
        if (this.currentState !== newState) {
            this.setState('cough');
            renderFn(this.render());
            await new Promise(r => setTimeout(r, 150));
        }

        this.setState(newState);
        renderFn(this.render());
    }
}

// Singleton instance
export const mimoBrain = new MimoBrain();
