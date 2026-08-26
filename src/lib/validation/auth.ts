import { z } from 'zod';

const nigerianPhone = /^(\+?234|0)[789][01]\d{8}$/;

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    phone: z.string().trim().regex(nigerianPhone, 'Enter a valid Nigerian phone number'),
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Enter your phone number or email'),
  password: z.string().min(1, 'Enter your password'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function isValidOtp(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}