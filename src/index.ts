import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { taskRouter } from './routes/tasks';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});