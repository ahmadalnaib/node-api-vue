import { Request, Response } from 'express';
import { ProductValidation } from '../validation/product.validation';
import { getManager } from 'typeorm';
import { Product } from '../entity/product.entity';
import fetch from 'node-fetch';
import meilisearchClient from '../meilisearch/meiliSearch';



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
    product.rating = { rate: rating_rate, count: rating_count };
   
    

  

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
      // Fetch data from the external API
      const response = await fetch('http://localhost:5001/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products from API');
      }
      const products = await response.json();
  
      // Save the fetched data to the database
      const productRepository = getManager().getRepository(Product);
      const savedProducts = await productRepository.save(products);
  
      // Index the saved products in Meilisearch
      const index = meilisearchClient.index('products');
      await index.addDocuments(savedProducts);
  
      // Return the saved data as a response
      return res.json(savedProducts);
    } catch (error) {
      console.error('Error fetching products from API:', error);
  
      try {
        // Fallback: Fetch data from the database
        const productRepository = getManager().getRepository(Product);
        const productsFromDb = await productRepository.find();
  
        // Return the data from the database as a response
        return res.json(productsFromDb);
      } catch (dbError) {
        console.error('Error fetching products from database:', dbError);
        return res.status(500).json({ message: 'Internal Server Error', error: dbError });
      }
    }
  };

  export const showProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productId = parseInt(id, 10); // Convert id to a number
  
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
  
    try {
      // Try to fetch the product from Meilisearch
      const index = meilisearchClient.index('products');
      const searchResult = await index.getDocument(id);
  
      if (searchResult) {
        return res.json(searchResult);
      }
    } catch (error) {
      console.error('Error fetching product from Meilisearch:', error);
    }
  
    try {
      // Fallback: Fetch the product from the database
      const productRepository = getManager().getRepository(Product);
      const product = await productRepository.findOne({ where: { id: productId } });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  };