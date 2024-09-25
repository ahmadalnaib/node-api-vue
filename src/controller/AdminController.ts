import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Admin } from '../entity/admin.entity';
import bcrypt from 'bcryptjs';

export const LoginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Request body:', req.body); // Log the request body

  try {
    // Get admin repository
    const adminRepository = getRepository(Admin);

    // Find admin by email
    const admin = await adminRepository.findOne({ where: { email } });

    if (!admin) {
      console.log('Admin not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Admin found:', admin); // Log the admin object

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Authentication successful
    console.log('Login successful');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during admin login:', error); // Log the error for debugging
    return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
};