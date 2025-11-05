'use client';

import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onLike, onDelete }: ProductCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('.btn-icon') ||
      (e.target as HTMLElement).closest('.product-actions')
    ) {
      return;
    }
    router.push(`/products/${product.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(product.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      onDelete(product.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}/edit`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <img
        src={product.thumbnail}
        alt={product.title}
        className="product-image"
      />
      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price}</div>
        <div className="product-actions">
          <button
            className={`btn-icon btn-like ${product.isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title={product.isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            {product.isLiked ? '❤️' : '🤍'}
          </button>
          <button
            className="btn-icon btn-edit"
            onClick={handleEdit}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={handleDelete}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}


