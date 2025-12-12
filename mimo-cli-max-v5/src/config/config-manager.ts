/**
 * MIMO Configuration Manager
 * Handles persistent settings like theme, first-run status, etc.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const CONFIG_DIR = path.join(os.homedir(), '.mimo-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface MimoConfig {
    theme: string;
    firstRun: boolean;
    animations: boolean;
}

const DEFAULT_CONFIG: MimoConfig = {
    theme: 'dark',
    firstRun: true,
    animations: true,
};

export class ConfigManager {
    static async load(): Promise<MimoConfig> {
        try {
            await fs.mkdir(CONFIG_DIR, { recursive: true });
            const data = await fs.readFile(CONFIG_FILE, 'utf-8');
            return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
        } catch {
            return DEFAULT_CONFIG;
        }
    }

    static async save(config: Partial<MimoConfig>): Promise<void> {
        try {
            const current = await this.load();
            const newConfig = { ...current, ...config };
            await fs.mkdir(CONFIG_DIR, { recursive: true });
            await fs.writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
        } catch (error) {
            // Ignore write errors to avoid crashing
        }
    }
}
