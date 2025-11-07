// Fix: Create type definitions for ServiceOrder, Status, and StockItem.
export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceOrder {
  id: string;
  clientName: string;
  device: string;
  issueDescription: string;
  status: Status;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  images?: string[]; // Array of Base64 encoded images
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}