import {DocumentReference, getDoc} from '@angular/fire/firestore';
import {Warehouse} from '../warehouses/warehouse';

enum Brand {
  TREK = 'TREK',
  Cannondale = 'Cannondale',
  Giant = 'Giant Bicycles',
}

export interface Item {
  id?: string;
  brand: Brand;
  model: string;
  description: string;
  color: string; // HEX color code
  img: string; // Full URL to the image. Our app uploads the image to Firebase storage, but it could be hosted anywhere else too.
  price: number; // Price in USD
  count: number; // number of in-stock items. If this number is 0, it's counted as an out-of-stock item in the stats.
  arriving: number; // number of the items that are arriving soon
  backOrder: number; // number of back oder items. Could take a while to be delivered.
  warehouse: Warehouse;
}

export function mapItem(item: Item): Item {
  return {
    ...item,
    ...getWarehouse(item)
  }
}

export async function getWarehouse(item: Item) {
  if (item.warehouse && item.warehouse instanceof DocumentReference) {
    const docData = (await getDoc(item.warehouse));
    item.warehouse = {...docData.data(), id: docData.id} as Warehouse;
    return item
  } else {
    return item;
  }
}

// List of available bike colors
export const Colors: string[] = [
  '#000000',
  '#555555',
  '#2b59a2',
  '#8d74b1',
  '#54c242',
  '#e20f00',
  '#f28500',
  '#ffd60a',
  '#ffffff'
];

// Available brands selection
export const Types: string[] = [
  'trek',
  'cannondale',
  'giant'
];
