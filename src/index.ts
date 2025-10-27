import { execSync } from 'child_process';
import express from 'express';
import { router } from '../src/api/routes';
const PORT = 3000;

try {
  const pid = execSync(`lsof -ti:${PORT}`).toString().trim();
  if (pid) {
    console.log(`Killing process ${pid} using port ${PORT}`);
    execSync(`kill -9 ${pid}`);
  }
} catch (err) {
  console.log(`No process found using port ${PORT}`);
}

const app = express();

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log('listening to 3000');
});
