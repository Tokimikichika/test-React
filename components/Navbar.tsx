'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-title">
          Product Store
        </Link>
        <div className="navbar-links">
          <Link
            href="/products"
            className={`navbar-link ${pathname === '/products' ? 'active' : ''}`}
          >
            Продукты
          </Link>
          <Link
            href="/create-product"
            className={`navbar-link ${pathname === '/create-product' ? 'active' : ''}`}
          >
            Создать продукт
          </Link>
        </div>
      </div>
    </nav>
  );
}


