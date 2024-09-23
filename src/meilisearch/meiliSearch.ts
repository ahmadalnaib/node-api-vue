import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700', // Replace with your Meilisearch host
  apiKey: 'masterKey', // Replace with your Meilisearch API key if you have one
});

export default client;