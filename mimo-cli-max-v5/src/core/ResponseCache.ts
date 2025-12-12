import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { log } from '../utils/Logger.js';

export interface CacheEntry {
    key: string;
    value: any;
    timestamp: number;
    ttl: number;
    hits: number;
}

export class ResponseCache {
    private memory: Map<string, CacheEntry> = new Map();
    private cacheDir: string;
    private maxMemorySize: number = 100 * 1024 * 1024;
    private currentMemorySize: number = 0;

    constructor(cacheDir: string = '.mimo-cache') {
        this.cacheDir = path.resolve(process.cwd(), cacheDir);
        this.initializeCacheDir();
    }

    private initializeCacheDir(): void {
        try {
            if (!fs.existsSync(this.cacheDir)) {
                fs.mkdirSync(this.cacheDir, { recursive: true });
            }
        } catch (error) {
            log.warn('Failed to initialize cache directory', { error });
        }
    }

    private generateKey(data: any): string {
        const hash = crypto.createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
        return hash;
    }

    set(data: any, value: any, ttl: number = 3600000): string {
        const key = this.generateKey(data);
        const entry: CacheEntry = {
            key,
            value,
            timestamp: Date.now(),
            ttl,
            hits: 0
        };

        this.memory.set(key, entry);
        this.currentMemorySize += JSON.stringify(value).length;

        if (this.currentMemorySize > this.maxMemorySize) {
            this.evictOldest();
        }

        log.debug('Cached response', { key, ttl });
        return key;
    }

    get(data: any): any | null {
        const key = this.generateKey(data);
        const entry = this.memory.get(key);

        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        if (isExpired) {
            this.memory.delete(key);
            return null;
        }

        entry.hits++;
        log.debug('Cache hit', { key, hits: entry.hits });
        return entry.value;
    }

    private evictOldest(): void {
        let oldest: [string, CacheEntry] | null = null;

        for (const [key, entry] of this.memory) {
            if (!oldest || entry.timestamp < oldest[1].timestamp) {
                oldest = [key, entry];
            }
        }

        if (oldest) {
            this.currentMemorySize -= JSON.stringify(oldest[1].value).length;
            this.memory.delete(oldest[0]);
            log.debug('Evicted cache entry', { key: oldest[0] });
        }
    }

    clear(): void {
        this.memory.clear();
        this.currentMemorySize = 0;
    }

    getStats(): { entries: number; size: number; hits: number } {
        let totalHits = 0;
        for (const entry of this.memory.values()) {
            totalHits += entry.hits;
        }
        return {
            entries: this.memory.size,
            size: this.currentMemorySize,
            hits: totalHits
        };
    }
}
