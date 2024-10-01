import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { About } from '../entity/about.entity';

export const getAbout = async (req: Request, res: Response) => {
  try {
    const aboutRepository = getManager().getRepository(About);
    const about = await aboutRepository.findOne({ where: {} });
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  const { text, photo, color } = req.body;
  try {
    const aboutRepository = getManager().getRepository(About);
    let about = await aboutRepository.findOne({ where: {} });
    if (!about) {
      about = new About();
    }
    about.text = text;
    about.photo = photo;
    about.color = color; 
    await aboutRepository.save(about);
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};