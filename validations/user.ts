import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100, { message: 'Name must be at most 100 characters' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const userIdParamSchema = z.object({
  user_id: z.string().regex(/^\d+$/, { message: 'User ID must be a number' }).transform(Number),
});

export { registerSchema, loginSchema, userIdParamSchema };
