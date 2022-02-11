import type { request, response } from 'express';
import ShortUniqueId from 'short-unique-id';

import {
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  updateDoc,
} from '../db';

interface acceptedItems {
  promotion: boolean,
  name: string,
  description: string,
  price: number,
  promotionCodes: Array<string> | null,
}
interface completedArrProducts extends acceptedItems {
  id: string
}

const messages = [
  'Something is wrong, please verify all inputs and try again.', // 00
  'Something is wrong, please verify the url and try again.', // 01
  'Something is wrong, please verify the inputs and try again.\n\nInputs model:\npromotion as a boolean;\nname as a string;\ndescription as a string;\nprice as a number;\npromotionCodes as a array[string] or null;', // 02
  'Product created success full! Item id => ', // 03
  'Product updated success full! Item id => ', // 04
  'Product deleted success full! Item id => ', // 05
  'Please verify the url and try again.', // 06
];

const addProduct = async (req: typeof request, res: typeof response) => {
  try {
    const {
      promotion,
      name,
      description,
      price,
      promotionCodes,
    } = req.body as acceptedItems;
    const instanceId = new ShortUniqueId({ length: 10 });
    const id = instanceId();

    if (
      typeof promotion === 'boolean'
      && typeof name === 'string'
      && typeof description === 'string'
      && typeof price === 'number'
      && (promotionCodes === null
        || Array.isArray(promotionCodes))
    ) {
      await setDoc(doc(db, 'products', id), {
        id,
        promotion,
        name,
        description,
        price,
        promotionCodes,
      });
      res.status(200).send(messages[3] + id);
    } else {
      res.status(400).send(messages[2]);
    }
  } catch {
    res.status(400).send(messages[1]);
  }
};
const getAllProducts = async (req: typeof request, res: typeof response) => {
  try {
    const collectionRef = collection(db, 'products');
    const docs = await getDocs(collectionRef);
    const arrProducts = [] as Array<completedArrProducts>;

    docs.forEach((docItem) => {
      arrProducts.push((docItem.data() as completedArrProducts));
    });

    res.status(200).send(arrProducts);
  } catch {
    res.status(400).send(messages[1]);
  }
};
const getProduct = async (req: typeof request, res: typeof response) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json(docSnap.data());
    } else {
      res.status(400).send(`This Product dont exist in database. ${messages[6]}`);
    }
  } catch {
    res.status(400).send((messages[1]));
  }
};
const updateProduct = async (req: typeof request, res: typeof response) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'products', id);
    const data = req.body as acceptedItems;

    if (
      (data.promotion && typeof data.promotion === 'boolean')
      || (data.name && typeof data.name === 'string')
      || (data.description && typeof data.description === 'string')
      || (data.price && typeof data.price === 'number')
      || (data.promotionCodes && (data.promotionCodes === null
        || Array.isArray(data.promotionCodes)))
    ) {
      await updateDoc(docRef, { ...data });
      res.status(200).send(messages[4] + id);
    } else {
      res.status(400).send(messages[2]);
    }
  } catch {
    res.status(400).send(`This product don't exists in database. ${messages[6]}`);
  }
};
const deleteProduct = async (req: typeof request, res: typeof response) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);

      res.status(200).send(messages[5] + id);
    } else {
      res.status(400).send(`This product don't exists in database. ${messages[6]}`);
    }
  } catch {
    res.status(400).send(messages[0]);
  }
};

export {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
