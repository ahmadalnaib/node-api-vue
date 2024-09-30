import cron from 'node-cron';
import fetch from 'node-fetch';
import { getManager } from 'typeorm';
import { Product } from '../entity/product.entity';
import meilisearchClient from '../meilisearch/meiliSearch';

const syncProducts = async () => {
  try {
    // Fetch data from the external API
    const response = await fetch('http://localhost:5001/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products from API');
    }
    const products = await response.json();

    // Get the product repository
    const productRepository = getManager().getRepository(Product);

    // Get all existing products from the database
    const existingProducts = await productRepository.find();

    // Create a set of fetched product IDs
    const fetchedProductIds = new Set(products.map(product => product.id));

    // Iterate over the fetched products
    for (const product of products) {
      // Check if the product already exists in the database
      const existingProduct = await productRepository.findOne({ where: { id: product.id } });

      if (existingProduct) {
        // If the product exists, check if it has been updated
        if (JSON.stringify(existingProduct) !== JSON.stringify(product)) {
          // Update the existing product
          await productRepository.save(product);
          console.log(`Product updated: ${product.id}`);
        }
      } else {
        // If the product does not exist, save it as a new product
        await productRepository.save(product);
        console.log(`New product added: ${product.id}`);
      }
    }

    // Identify and delete products that are no longer in the fetched data
    for (const existingProduct of existingProducts) {
      if (!fetchedProductIds.has(existingProduct.id)) {
        // Delete the product from the database
        await productRepository.remove(existingProduct);
        console.log(`Product deleted: ${existingProduct.id}`);

        // Delete the product from Meilisearch
        const index = meilisearchClient.index('products');
        await index.deleteDocument(existingProduct.id);
        console.log(`Product deleted from Meilisearch: ${existingProduct.id}`);
      }
    }

    // Index the saved products in Meilisearch
    const index = meilisearchClient.index('products');
    await index.addDocuments(products);

    console.log('Products synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing products:', error);
  }
};

// Schedule the sync job to run every minute
cron.schedule('* * * * *', syncProducts);

export default syncProducts;