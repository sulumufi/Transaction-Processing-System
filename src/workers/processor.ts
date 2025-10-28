import {
  getTransactionState,
  updateRetryCount,
  updateStatus,
} from '../services/stateStore';
import { checkTransactionExists, postTransaction } from '../services/posting';
import { enqueueRetry } from '../services/queue';
import { acquireLock, releaseLock } from '../services/lock';

const MAX_RETRY = 5;

const processTransaction = async (id: string): Promise<void> => {
  const state = await getTransactionState(id);

  if (!state) {
    console.log(`transaction ${id} not found`);
    return;
  }

  if (state?.status == 'completed') {
    console.log('Already processed status is set to Completed');
    return;
  }

  const tryAcquireLock = await acquireLock(id);
  if (!tryAcquireLock) {
    console.log(
      `Transaction ${id}, is locked by anoterh worker process, skipping execution`
    );
    return;
  }

  try {
    await updateStatus(id, 'processing');

    const isTransactionExists = await checkTransactionExists(id);

    if (isTransactionExists) {
      console.log(
        'Transaction already processed and is processed in posting service'
      );
      await updateStatus(id, 'completed');
      return;
    }

    const isTransactionSuccessful = await postTransaction(state.transaction);

    if (isTransactionSuccessful) {
      await updateStatus(id, 'completed');
      console.log(`Transaction Successfull`);
    } else {
      const isTransactionExistsNow = await checkTransactionExists(id);
      if (isTransactionExistsNow) {
        console.log('Transaction Exists, post update failure');
        await updateStatus(id, 'completed');
      } else {
        await handleFailure(id, state.retryCount);
      }
    }
  } finally {
    await releaseLock(id);
  }
};

const handleFailure = async (id: string, retryCount: number): Promise<void> => {
  console.log('Handling Failiure.');
  if (retryCount < MAX_RETRY) {
    await updateRetryCount(id);
    await enqueueRetry(id, Math.pow(retryCount, 2));
  } else {
    await updateStatus(id, 'failed');
    console.log('max retry reached, set to failed');
  }
};

export { processTransaction };
