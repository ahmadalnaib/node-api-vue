import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcyptjs from 'bcryptjs';

export const Users = async (req: Request, res: Response) => {
    const userRepository = getManager().getRepository(User);

    const users = await userRepository.find();
    res.send(users.map(user => {
        const { password, ...data } = user;
        return data;
    }
    ));
    }

    export const CreateUser = async (req: Request, res: Response) => {
       const {role_id,...body}=req.body;
       const hashPassword=await bcyptjs.hash('123456789',10);
       const hashConfirm_password=await bcyptjs.hash('123456789',10);

       const repository=getManager().getRepository(User);
       const {password,confirm_password,...user}=await repository.save({
              ...body,
              password:hashPassword,
            confirm_password:hashConfirm_password
             
         });
            res.send(user);
    }

    export const GetUser = async (req: Request, res: Response) => {
        const userRepository = getManager().getRepository(User);
        const {password,confirm_password,...user} = await userRepository.findOne({where: {id: parseInt(req.params.id, 10)}})
        res.send(user);
    }

    export const UpdateUser = async (req: Request, res: Response) => {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne({where: {id: parseInt(req.params.id, 10)}});
        userRepository.merge(user, req.body);
        const updatedUser = await userRepository.save(user);
        res.send(updatedUser);
    }

    export const DeleteUser = async (req: Request, res: Response) => {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOne({where: {id: parseInt(req.params.id, 10)}});
        const deletedUser = await userRepository.remove(user);
        res.send(deletedUser);

    }
