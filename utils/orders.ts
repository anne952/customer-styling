import { apiRequest, ApiError } from './api';

export interface OrderItem {
  id: number;
  produitId: number;
  quantite: number;
  prixUnitaire: string;
  total: string;
}

export interface Payment {
  id: number;
  montant: string;
  moyenDePayement: 'Tmoney' | 'Flooz';
}

export interface Order {
  id: number;
  usersId: number;
  localisation?: string;
  montant: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  ligneCommande: OrderItem[];
  payement?: Payment;
  users?: { id: number; email: string };
}

export interface CreateOrderData {
  items: {
    produitId: number;
    quantite: number;
    prixUnitaire: string;
  }[];
  localisation?: string;
  payement: {
    montant: string;
    moyenDePayement: 'Tmoney' | 'Flooz';
  };
}

export interface CreateOrderResult {
  status: number;
  order: Order;
}

export async function createOrder(data: CreateOrderData): Promise<CreateOrderResult> {
  try {
    const response = await apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Some backends may return { order }, others the full order
    const order = response.data?.order ?? response.data;
    return { status: response.status, order };
  } catch (error) {
    throw error;
  }
}

export async function getMyOrders(): Promise<Order[]> {
  try {
    const response = await apiRequest('/api/orders/me');
    return response.data;
  } catch (error) {
    throw error;
  }
}
