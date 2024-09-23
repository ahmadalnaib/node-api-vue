import { Request, Response } from 'express';
import { ProductValidation } from '../validation/product.validation';
import { getManager } from 'typeorm';
import { Product } from '../entity/product.entity';
import fetch from 'node-fetch';



export const Create=async (req:Request,res:Response)=>{
    const { title, description, price, category, rating_rate, rating_count } = req.body;

// Validate the request body
const { error } = ProductValidation.validate(req.body);
if (error) {
  return res.status(400).json({ message: error.details[0].message });
}

  try {
   
    const productRepository = getManager().getRepository(Product);
    const product = new Product();
    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    product.rating_rate = rating_rate;
    product.rating_count = rating_count;
  

    await productRepository.save(product);

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}



export const showAllProducts = async (req: Request, res: Response) => {
    try {
      const repository = getManager().getRepository(Product);
      const products = await repository.find();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  };


  export const getProducts = async (req: Request, res: Response) => {
    try {
      const response = await fetch('http://localhost:5001/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const products = await response.json();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };