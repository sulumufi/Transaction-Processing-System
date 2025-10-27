import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

const MAIN_QUEUE = 'queue:main';
const RETRY_QUEUE = 'queue:retry';

const enqeueMain = async (id: string): Promise<void> => {
  try {
    await redisClient.lpush(MAIN_QUEUE, id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deqeueMain = async (): Promise<string | null> => {
  try {
    const data = await redisClient.brpop(MAIN_QUEUE, 0);
    if (!data) {
      throw new Error('no Data found');
    }
    return data ? data[1] : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const enqueueRetry = async (
  id: string,
  delayedSeconds: number
): Promise<void> => {
  try {
    console.log('adding into Retry qeueu');
    const retryTime = Math.floor(Date.now() / 1000) + delayedSeconds;
    await redisClient.zadd(RETRY_QUEUE, retryTime, id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchRetryMessages = async (): Promise<string[]> => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const data = await redisClient.zrangebyscore(RETRY_QUEUE, 0, now);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removeRetryMessage = async (id: string): Promise<void> => {
  try {
    await redisClient.zrem(RETRY_QUEUE, id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  enqeueMain,
  deqeueMain,
  enqueueRetry,
  fetchRetryMessages,
  removeRetryMessage,
};
