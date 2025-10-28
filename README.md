# Transaction Processing System

A distributed transaction processing system built with Node.js, Express, and Redis. Handles transaction queuing, processing with retry logic, and provides a REST API for submitting transactions.

## Setup

Install dependencies:
```bash
npm install
```

Make sure Redis is running on your local machine before starting the application.

## Usage

Start the API server:
```bash
npm run api
```

Start the worker process:
```bash
npm run worker
```

Run the demo client:
```bash
npm run demo
```

## API Endpoints

- `POST /transactions` - Submit a new transaction
- `GET /health` - Check system health status

## Architecture

The system consists of three main components:

1. **API Server** - Express server listening on port 3000 that receives transaction requests
2. **Worker Process** - Background worker that processes transactions from the queue
3. **Redis Queue** - Message queue for handling transactions asynchronously

## Transaction Format

```json
{
  "transactionId": "uuid-v4",
  "amount": 100.50,
  "currency": "USD",
  "description": "Transaction description"
}
```

## How It Works

### Transaction Submission
1. Client sends a POST request to `/transactions` with transaction details
2. API server validates the incoming transaction data
3. Transaction is stored in Redis state store with status "pending"
4. Transaction ID is added to the main processing queue
5. API responds immediately to the client (async processing)

### Transaction Processing
6. Worker continuously polls the main queue for new transactions
7. When a transaction is found, worker acquires a distributed lock using Redis
8. Lock prevents multiple workers from processing the same transaction
9. Worker retrieves transaction details from state store
10. Transaction is processed (validated, posted, etc.)
11. Status is updated in state store based on processing result

### Retry Mechanism
12. Failed transactions are moved to retry queues based on attempt count
13. Worker checks retry queues before processing main queue
14. Transactions are retried with exponential backoff
15. After max retries, transactions are marked as failed permanently

### State Management
- All transaction states are stored in Redis
- States include: pending, processing, completed, failed
- Distributed locks ensure atomic operations across multiple workers
- Transaction metadata and processing history are preserved
