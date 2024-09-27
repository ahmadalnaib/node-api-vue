import { Request,Response } from "express";
import { getManager } from "typeorm";
import { Role } from "../entity/role.entity";

export const Roles = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Role);
    const role = await repository.find();
    res.send(role);
    }

    export const CreateRole = async (req: Request, res: Response) => {
      const {name,permissions} = req.body;
      const repository = getManager().getRepository(Role);
      const role=await repository.save(
        {
            name,
            permissions:permissions.map((id:number)=>({id}))

        });
        res.send(role);
    }

    export const GetRole = async (req: Request, res: Response) => {
        const repository = getManager().getRepository(Role);
        const role= await repository.findOne({
            where: { id: parseInt(req.params.id, 10) },
            relations: ['permissions']
        });
        res.send(role);
    }

    export const UpdateRole = async (req: Request, res: Response) => {
        const {name,permissions} = req.body;
        const repository = getManager().getRepository(Role);
        const role = await repository.findOne({
            where: { id: parseInt(req.params.id, 10) },
            relations: ['permissions']
        });
        await repository.save({
            ...role,
            name,
            permissions:permissions.map((id:number)=>({id}))
        });
        res.send(role);
    }


    export const DeleteRole = async (req: Request, res: Response) => {
        const repository = getManager().getRepository(Role);
        const role = await repository.findOne({
            where: { id: parseInt(req.params.id, 10) }
        });
        await repository.remove(role);
        res.send(role);
    }
