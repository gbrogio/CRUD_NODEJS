/* eslint no-console: ["error", { allow: ["info"] }] */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  getProduct,
  updateProduct,
} from './controllers/productController';
import AppConfiguration from '../config';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.post('/product', addProduct);
app.get('/products', getAllProducts);
app.get('/product/:id', getProduct);
app.put('/product/:id', updateProduct);
app.delete('/product/:id', deleteProduct);

app.listen(AppConfiguration.port, () => console.info(`App is listening on url http://localhost:${AppConfiguration.port}`));
