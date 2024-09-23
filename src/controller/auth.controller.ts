import { Request, Response } from 'express';
import { RegosterValidation } from '../validation/register.validation';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Register=async (req:Request,res:Response)=>{
  const body=req.body;

  const {error}=RegosterValidation.validate(body);

  if(error){
    return res.status(400).send(error.details)
  }

  if(body.password !== body.confirm_password){
    return res.status(400).send('Password and confirm password do not match');
  }

  const respository=getManager().getRepository(User);

  const {password,confirm_password, ...user}= await respository.save({
    first_name:body.first_name,
    last_name:body.last_name,
    email:body.email,
    password:await bcrypt.hash(body.password,10),
    confirm_password:await bcrypt.hash(body.confirm_password,10)

  });

    res.send(user);
}

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    return res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};