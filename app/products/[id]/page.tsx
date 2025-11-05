'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export async function generateStaticParams() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    return data.products.map((product: any) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching products for static generation:', error);
    return [];
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { getProductById, toggleLike } = useProductStore();
  const product = getProductById(id);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">😞</div>
            <div className="empty-state-text">Продукт не найден</div>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Вернуться к списку
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-header">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              className="product-detail-image"
            />
            <div className="product-detail-info">
              <h1 className="product-detail-title">{product.title}</h1>
              <div className="product-detail-price">${product.price}</div>
              <div className="product-detail-meta">
                <div>
                  <strong>Бренд:</strong> {product.brand || 'N/A'}
                </div>
                <div>
                  <strong>Категория:</strong> {product.category}
                </div>
                <div>
                  <strong>Рейтинг:</strong> ⭐ {product.rating}
                </div>
              </div>
              <div className="product-detail-description">
                {product.description}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => toggleLike(product.id)}
                >
                  {product.isLiked ? '❤️ Убрать из избранного' : '🤍 В избранное'}
                </button>
                <Link
                  href={`/products/${product.id}/edit`}
                  className="btn btn-secondary"
                >
                  ✏️ Редактировать
                </Link>
              </div>
            </div>
          </div>

          {product.images && product.images.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Дополнительные изображения</h2>
              <div className="product-images">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    className="product-thumbnail"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <Link href="/products" className="btn btn-secondary">
              ← Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}


