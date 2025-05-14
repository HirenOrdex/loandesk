import NodeCache from 'node-cache';

const nodeCache = new NodeCache({
  stdTTL: 600,
  checkperiod: 120,
  useClones: false,
});

const connectNodeCache = async (): Promise<void> => {
  try {
    console.log('NodeCache initialized (in-memory)');
  } catch (error) {
    console.error('NodeCache initialization error:', error);
  }
};

export const nodeCacheClient = {
  set: <T>(key: string, value: T, ttl?: number) => {
    if (ttl !== undefined) {
      return nodeCache.set(key, value, ttl); // ✅ ttl is defined
    }
    return nodeCache.set(key, value); // ✅ omit ttl if not defined
  },
  get: <T>(key: string): T | undefined => nodeCache.get(key),
  del: (key: string) => nodeCache.del(key),
  flushAll: () => nodeCache.flushAll(),
};

export const connectCache = connectNodeCache;
export default nodeCacheClient;
