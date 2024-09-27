import { Request, Response } from 'express';
import { getManager } from 'typeorm';

export const Permission=async (req: Request, res: Response) => {
    const respository = getManager().getRepository('Permission');
    const permissions = await respository.find();
    res.send(permissions);
  

}
