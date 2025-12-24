/**
 * VALIDATION UTILITIES
 *
 * Custom validation rules cho input data
 * Dùng express-validator
 *
 * Ví dụ dùng:
 * import { validateEmail, validatePassword } from '../utils/validators.js'
 *
 * router.post('/register', [
 *   body('email').custom(validateEmail),
 *   body('password').custom(validatePassword)
 * ], registerController)
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  return true;
};

/**
 * Validate password strength
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least 1 uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least 1 number");
  }
  return true;
};

/**
 * Validate phone number (Vietnam format)
 * Accept: 0xxxxxxxxxx or +84xxxxxxxxx
 */
export const validatePhoneVN = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid Vietnam phone number");
  }
  return true;
};
