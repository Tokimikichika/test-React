import { create } from 'zustand';
import { Product } from '@/types/product';

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleLike: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({
    products: [product, ...state.products]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  })),
  
  toggleLike: (id) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, isLiked: !p.isLiked } : p
    )
  })),
  
  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  }
}));


