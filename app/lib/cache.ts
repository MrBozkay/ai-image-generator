import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export function getCachedImage(key: string): string | undefined {
  return cache.get(key);
}

export function setCachedImage(key: string, imageUrl: string): void {
  cache.set(key, imageUrl);
}