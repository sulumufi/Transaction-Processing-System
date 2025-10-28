const validateTransactionRequest = (body: any): Record<string, any> => {
  // Validate transaction ID (UUID format)
  if (!body.transactionId || typeof body.transactionId !== 'string') {
    return {
      isValid: false,
      description: 'Invalid or missing transaction ID',
    };
  }

  if (!body.amount || typeof body.amount != 'number' || body.amount <= 0) {
    return {
      isValid: false,
      description: 'Invalid data in amount field',
    };
  }

  const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];
  if (
    !body.currency ||
    typeof body.currency != 'string' ||
    !validCurrencies.includes(body.currency)
  ) {
    return {
      isValid: false,
      description: 'Invalid data in currencies field',
    };
  }

  if (!body.description || typeof body.description != 'string') {
    return {
      isValid: false,
      description: 'Invalid data in description',
    };
  }

  return {
    isValid: true,
    description: 'Valid',
  };
};

export { validateTransactionRequest };
