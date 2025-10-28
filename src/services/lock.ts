import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

const LOCK_TTL = 60;

const acquireLock = async (id: string): Promise<boolean> => {
  try {
    const key = `lock:txn:${id}`;

    const result = await redisClient.set(key, 'locked', 'EX', LOCK_TTL, 'NX');
    if (result == 'OK') {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    console.log('acquire lock error');
    return false;
  }
};

const releaseLock = async (id: string): Promise<void> => {
  try {
    const key = `lock:txn:${id}`;
    await redisClient.del(key);
  } catch (error) {
    console.log('errro occurred during release lock', error);
  }
};

export { acquireLock, releaseLock };
