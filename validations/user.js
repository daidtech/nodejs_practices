const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const userIdParamSchema = z.object({
  user_id: z.string().regex(/^\d+$/, 'User ID must be a number').transform(Number),
});

module.exports = { registerSchema, loginSchema, userIdParamSchema };
