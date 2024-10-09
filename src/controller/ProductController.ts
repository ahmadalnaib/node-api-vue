import { Request, Response } from 'express';
import { ProductValidation } from '../validation/product.validation';
import { getManager } from 'typeorm';
import { Product } from '../entity/product.entity';
import fetch from 'node-fetch';
import meilisearchClient from '../meilisearch/meiliSearch';

export const Create = async (req: Request, res: Response) => {
  const { title, description, price, category, rating_rate, rating_count, can_buy } = req.body;

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
    product.can_buy = can_buy;

    await productRepository.save(product);
    return res.status(201).json(product);
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

    // Save the fetched data to the database if not already present
    const productRepository = getManager().getRepository(Product);
    for (const product of products) {
      const existingProduct = await productRepository.findOne({ where: { title: product.title, category: product.category } });
      if (!existingProduct) {
        const newProduct = new Product();
        newProduct.title = product.title;
        newProduct.description = product.description;
        newProduct.price = product.price;
        newProduct.category = product.category;
        newProduct.image = product.image;
        newProduct.rating = product.rating;
        newProduct.url = product.url;
        newProduct.can_buy = true; // Set can_buy to true for new products
        await productRepository.save(newProduct);
      }
    }

    // Index the saved products in Meilisearch
    const index = meilisearchClient.index('products');
    await index.addDocuments(products);

    // Return the saved data as a response
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products from API:', error);
    try {
      // Fallback: Fetch data from the database
      const productRepository = getManager().getRepository(Product);
      let productsFromDb = await productRepository.find();
      // Set can_buy to false for products fetched from the database
      productsFromDb = productsFromDb.map(product => {
        product.can_buy = false;
        return product;
      });
      // Save the products with can_buy set to false
      await productRepository.save(productsFromDb);
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