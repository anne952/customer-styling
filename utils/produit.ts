import { apiRequest, ApiError } from './api';

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export interface Color {
  id: number;
  nom: string;
  codeHexa: string;
}

export interface ProductColor {
  couleur: Color;
}

export interface Category {
  id: number;
  nom: string;
}

export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: string;
  taille: 'L' | 'S' | 'M' | 'XL' | 'XXL' | 'XXXL';
  video?: string;
  categorieId: number;
  vendeurId?: number;
  categorie: Category;
  productImages: ProductImage[];
  couleurs: ProductColor[];
}



export async function getProducts(skip = 0, take = 20): Promise<Product[]> {
  try {
    const response = await apiRequest(`/api/products?skip=${skip}&take=${take}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getProductsByVendeur(vendeurId: number): Promise<Product[]> {
  try {
    // Utiliser la nouvelle route publique pour les produits du vendeur
    const response = await apiRequest(`/api/users/vendeur/${vendeurId}/products`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Charger plus de produits et filtrer côté frontend
    const response = await apiRequest('/api/products?skip=0&take=100');
    const allProducts: Product[] = response.data;

    // Filtrer côté frontend
    const filteredProducts = allProducts.filter(product =>
      product.nom.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );

    return filteredProducts;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductsWithVendeurs(): Promise<any[]> {
  try {
    // Utilise l'endpoint public que retourne les infos vendeur pour tous les produits
    const response = await apiRequest('/api/products/vendeur');
    return response.data; // Format: [{ produitId, vendeur }, ...]
  } catch (error) {
    throw error;
  }
}

export async function getProductsByVendeurPublic(vendeurId: number): Promise<Product[]> {
  try {
    // Récupère tous les produits depuis l'endpoint paginé standard
    // Cette approche est plus simple et évite de dépendre de /api/products/vendeur
    const response = await apiRequest('/api/products?skip=0&take=1000'); // Récupère beaucoup de produits
    const allProducts: Product[] = response.data;

    // Filtre les produits qui appartiennent à ce vendeur spécifique
    const vendeurProducts = allProducts.filter(
      (product: Product) => product.vendeurId === vendeurId
    );

    return vendeurProducts;

  } catch (error) {
    throw error;
  }
}
