import { Request, Response } from 'express';
import { RegosterValidation } from '../validation/register.validation';

export const Register=(req:Request,res:Response)=>{
  const body=req.body;

  const {error}=RegosterValidation.validate(body);

  if(error){
    return res.status(400).send(error.details)
  }

  if(body.password !== body.confirm_password){
    return res.status(400).send('Password and confirm password do not match');
  }
    res.send(body);
}