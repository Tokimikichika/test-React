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

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

