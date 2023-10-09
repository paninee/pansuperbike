export interface Warehouse {
  id?: string;
  name: string;
  address: string; // Full text address
  location: { latitude: number, longitude: number };
  coordinate?: [number, number];
}


export function mapWarehouse(item: Warehouse): Warehouse{
  return {
    ...item,
    coordinate: [item.location.longitude, item.location.latitude]
  }
}
