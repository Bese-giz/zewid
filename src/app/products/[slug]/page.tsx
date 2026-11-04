import { getProductBySlug, productCategories, products } from "@/data/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import OrderInformation from "@/components/OrderInformation";
import ProductDetailSection from "@/components/ProductDetailSection";
import { getProductDisplayName } from "@/lib/product-display";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  return pageMetadata({
    title: getProductDisplayName(product),
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const category = productCategories.find(category => category.id === product.category);

  return (
    <div className="product-detail-page">
      <div className="market-container">
        <nav aria-label="Breadcrumb" className="product-detail-breadcrumb">
          <Link href="/products">All products</Link>
          {category && <><span aria-hidden="true">/</span><Link href={`/products?category=${category.id}`}>{category.name}</Link></>}
        </nav>

        <div className="product-detail-layout">
          <ProductPurchasePanel key={product.slug} product={product} />

          <section className="product-detail-information" aria-label="More product information">
            <ProductDetailSection title="About this product">
              <p className="font-medium text-slate-700">{product.shortDescription}</p>
              <p className="mt-3">{product.description}</p>
              {product.features.length > 0 && <><h2 className="mb-3 mt-5 text-sm font-semibold text-slate-800">Key features</h2><ul className="list-disc space-y-2 pl-5">{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
            </ProductDetailSection>

            {product.specifications && product.specifications.length > 0 && <ProductDetailSection title="Specifications">
              <dl className="divide-y divide-[#e3e7de]">
                {product.specifications.map(specification => <div key={specification.label} className="product-detail-specification"><dt>{specification.label}</dt><dd>{specification.value}</dd></div>)}
              </dl>
            </ProductDetailSection>}

            <ProductDetailSection title="Delivery & payment">
              {product.availability === "on-request" ? <p>Contact us on WhatsApp to place this order.</p> : <>
                <OrderInformation />
                <p className="mt-4">Pay through the website checkout from your cart, or contact us on WhatsApp to arrange your order and payment.</p>
              </>}
            </ProductDetailSection>
          </section>
        </div>
      </div>
    </div>
  );
}
