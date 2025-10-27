import axios from 'axios';
import { Transaction } from '../models/transactions';

const POSTING_SERVICE_URL = 'http://localhost:8080';

const postTransaction = async (transaction: Transaction): Promise<boolean> => {
  try {
    const url = POSTING_SERVICE_URL + '/transactions';

    const response = await axios.post(url, transaction);
    if (response.status == 200 || response.status == 201) {
      return true;
    }
    throw new Error(JSON.stringify(response));
  } catch (error) {
    console.log(JSON.stringify({ error }));
    return false;
  }
};

const getTransaction = async (id: string): Promise<Transaction | null> => {
  try {
    const url = `${POSTING_SERVICE_URL}/transactions/${id}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      return response.data as Transaction;
    }
    return null;
  } catch (error: any) {
    if (error?.response?.status == 404) {
      return null;
    }
    console.log(error);
    return null;
  }
};

const checkTransactionExists = async (id: string): Promise<boolean> => {
  const response = await getTransaction(id);
  if (response == null) {
    return false;
  }
  return true;
};

export { postTransaction, getTransaction, checkTransactionExists };
