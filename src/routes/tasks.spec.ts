import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { taskRouter } from './tasks';

const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Task Router', () => {
  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          color: 'blue',
          completed: false
        }
      });

      const response = await request(app).get('/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(task.title);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        color: 'red',
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.color).toBe(taskData.color);
      expect(response.body.completed).toBe(false);
    });

    it('should validate request body', async () => {
      const invalidTask = {
        title: '',
        color: 'invalid'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          color: 'blue',
          completed: false
        }
      });

      const updateData = {
        title: 'Updated Task',
        completed: true
      };

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.completed).toBe(updateData.completed);
    });

    it('should return 500 for non-existent task', async () => {
      const response = await request(app)
        .put('/tasks/999')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Test Task',
          color: 'blue',
          completed: false
        }
      });

      const response = await request(app)
        .delete(`/tasks/${task.id}`);

      expect(response.status).toBe(204);

      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id }
      });
      expect(deletedTask).toBeNull();
    });
  });
});