import { apiRequest, ApiError } from './api';

export interface Review {
  id: number;
  userId: number;
  vendeurId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    nom: string;
    email: string;
  };
}

export async function getReviewsByVendeur(vendeurId: number): Promise<Review[]> {
  try {
    const response = await apiRequest(`/api/reviews/vendor/${vendeurId}`);
    return response.data.reviews || [];
  } catch (error) {
    throw error;
  }
}

export async function getReviewsByProduct(vendeurId: number): Promise<Review[]> {
  try {
    const response = await apiRequest(`/api/reviews/product/${vendeurId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
