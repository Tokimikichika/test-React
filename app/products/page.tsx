'use client';

import { useEffect, useState, useMemo } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const { products, setProducts, toggleLike, deleteProduct } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        setProducts(data.products.map((p: Product) => ({ ...p, isLiked: false })));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [products.length, setProducts]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filter === 'favorites') {
      filtered = filtered.filter(p => p.isLiked);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    return filtered;
  }, [products, filter, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, categoryFilter]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-text">Загрузка продуктов...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Каталог продуктов</h1>
        </div>

        <div className="controls">
          <input
            type="text"
            placeholder="Поиск продуктов..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'favorites')}
          >
            <option value="all">Все продукты</option>
            <option value="favorites">Избранное</option>
          </select>
          <select
            className="select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Все категории' : cat}
              </option>
            ))}
          </select>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-text">
              {filter === 'favorites'
                ? 'Нет избранных продуктов'
                : 'Продукты не найдены'}
            </div>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLike={toggleLike}
                  onDelete={deleteProduct}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Назад
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Вперед →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}


