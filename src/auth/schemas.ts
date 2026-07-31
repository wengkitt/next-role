import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  })

export function formatValidationErrors(errors: unknown[]) {
  return errors
    .map((error) => {
      if (typeof error === 'string') return error
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        return error.message
      }
      return 'Please correct this field.'
    })
    .join(', ')
}
