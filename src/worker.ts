import { deqeueMain } from './services/queue';
import { processTransaction } from './workers/processor';
import { processRetryQueues } from './workers/retryworker';

const startWorker = async (): Promise<void> => {
  try {
    console.log('worker Started, Waiting for transaction');

    while (true) {
      await processRetryQueues();

      const id = await deqeueMain();

      if (id) {
        console.log('processing transaction');
        await processTransaction(id);
      }
    }
  } catch (error) {}
};

startWorker();
