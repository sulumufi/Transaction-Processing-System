import {
  fetchRetryMessages,
  enqeueMain,
  removeRetryMessage,
} from '../services/queue';

const processRetryQueues = async (): Promise<void> => {
  try {
    const retryQueueMessages = await fetchRetryMessages();

    if (!retryQueueMessages) {
      console.log('No messages in the queue');
      return;
    }
    console.log('Messages Found in retry Queue', retryQueueMessages);

    if (retryQueueMessages.length > 0) {
      for (const id of retryQueueMessages) {
        await enqeueMain(id);
        await removeRetryMessage(id);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export { processRetryQueues };