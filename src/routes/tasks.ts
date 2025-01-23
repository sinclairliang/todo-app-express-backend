import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const TaskSchema = z.object({
  title: z.string().min(1),
  color: z.enum(['red', 'blue', 'green']),
  completed: z.boolean().optional(),
});

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validatedData = TaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        completed: false,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const validatedData = TaskSchema.partial().parse(req.body);
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: validatedData,
    });
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export { router as taskRouter };