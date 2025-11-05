'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import Navbar from '@/components/Navbar';

const productSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  price: z.number().min(0.01, 'Цена должна быть больше 0'),
  brand: z.string().min(2, 'Бренд должен содержать минимум 2 символа'),
  category: z.string().min(2, 'Категория должна содержать минимум 2 символа'),
  thumbnail: z.string().url('Введите корректный URL изображения'),
  rating: z.number().min(0).max(5, 'Рейтинг должен быть от 0 до 5').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { getProductById, updateProduct } = useProductStore();
  const product = getProductById(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        thumbnail: product.thumbnail,
        rating: product.rating,
      });
    }
  }, [product, reset]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-text">Продукт не найден</div>
          </div>
        </div>
      </>
    );
  }

  const onSubmit = (data: ProductFormData) => {
    updateProduct(id, {
      title: data.title,
      description: data.description,
      price: data.price,
      brand: data.brand,
      category: data.category,
      thumbnail: data.thumbnail,
      rating: data.rating || 0,
      images: [data.thumbnail],
    });
    router.push(`/products/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Редактировать продукт</h1>
        </div>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Название *</label>
            <input
              type="text"
              className="form-input"
              {...register('title')}
            />
            {errors.title && (
              <div className="form-error">{errors.title.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Описание *</label>
            <textarea
              className="form-textarea"
              {...register('description')}
            />
            {errors.description && (
              <div className="form-error">{errors.description.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Цена *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <div className="form-error">{errors.price.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Бренд *</label>
            <input
              type="text"
              className="form-input"
              {...register('brand')}
            />
            {errors.brand && (
              <div className="form-error">{errors.brand.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Категория *</label>
            <input
              type="text"
              className="form-input"
              {...register('category')}
            />
            {errors.category && (
              <div className="form-error">{errors.category.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">URL изображения *</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              {...register('thumbnail')}
            />
            {errors.thumbnail && (
              <div className="form-error">{errors.thumbnail.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Рейтинг (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="form-input"
              {...register('rating', { valueAsNumber: true })}
            />
            {errors.rating && (
              <div className="form-error">{errors.rating.message}</div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.back()}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


