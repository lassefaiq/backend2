import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";

const BASE = import.meta.env.VITE_API_BASE ?? "";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        // 1) Hämta produkt via slug (list-API)
        const pr = await fetch(`${BASE}/api/products?slug=${encodeURIComponent(slug)}`);
        if (!pr.ok) throw new Error(`Fetch product by slug failed: ${pr.status}`);
        const list = await pr.json();
        const item = Array.isArray(list) && list.length > 0 ? list[0] : null;

        // 2) Hämta alla produkter för "liknande"
        const allRes = await fetch(`${BASE}/api/products`);
        if (!allRes.ok) throw new Error(`Fetch products failed: ${allRes.status}`);
        const all = await allRes.json();

        if (!alive) return;
        setProduct(item);
        // enkel “liknande”: alla utom den aktuella, slumpa och ta 3
        const filtered = Array.isArray(all) ? all.filter(p => p.urlSlug !== slug) : [];
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setSimilarProducts(shuffled.slice(0, 3));
      } catch (e) {
        console.error("Error loading product/details:", e);
        if (!alive) return;
        setProduct(null);
        setSimilarProducts([]);
      }
    }

    load();
    return () => { alive = false; };
  }, [slug]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div>
      <div className="product-details">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <p className="price">{product.price} SEK</p>
          <button className="add-to-cart">Lägg i varukorg</button>
        </div>
      </div>

      <div className="similar-products">
        <h2>Liknande produkter</h2>
        <div className="similar-grid">
          {similarProducts.map(sp => (
            <Link
              to={`/products/${sp.urlSlug}`}
              className="product-card"
              key={sp.id}
            >
              <img src={sp.image} alt={sp.name} />
              <p>{sp.name}</p>
              <p>{sp.price} SEK</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
