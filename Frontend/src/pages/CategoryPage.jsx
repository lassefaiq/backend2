import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { FaRegHeart } from "react-icons/fa";
import "./Home.css";

const BASE = import.meta.env.VITE_API_BASE ?? ""; // lämna tom för Vite-proxy

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);   // { id, name, image, slug, productIds[] }
  const [products, setProducts] = useState([]);     // alla produkter
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    async function load() {
      try {
        // 1) Hämta kategori via slug (list-API som kan vara tom)
        const catRes = await fetch(`${BASE}/api/categories?slug=${encodeURIComponent(slug)}`);
        if (!catRes.ok) throw new Error(`Fetch categories failed: ${catRes.status}`);
        const cats = await catRes.json();
        const cat = Array.isArray(cats) && cats.length > 0 ? cats[0] : null;

        // 2) Hämta alla produkter
        const prodRes = await fetch(`${BASE}/api/products`);
        if (!prodRes.ok) throw new Error(`Fetch products failed: ${prodRes.status}`);
        const all = await prodRes.json();

        if (!alive) return;
        setCategory(cat);
        setProducts(Array.isArray(all) ? all : []);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setErr("Kunde inte hämta kategori/produkter.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    window.scrollTo(0, 0);
    return () => { alive = false; };
  }, [slug]);

  // Filtrera produkter på klienten via category.id
  const visibleProducts = useMemo(() => {
    if (!category) return [];
    const id = category.id;
    return products.filter(p => (p.categoryIds || []).includes(id));
  }, [products, category]);

  if (loading) return <div className="home-container"><p>Laddar…</p></div>;
  if (err) return <div className="home-container"><p style={{color:"crimson"}}>{err}</p></div>;
  if (!category) return <div className="home-container"><h2>Kategori saknas</h2><p>Ingen kategori hittades för slug “{slug}”.</p></div>;

  return (
    <div className="home-container">
      <section className="categories">
        <h2>{category.name}</h2>
        <h3 style={{ marginTop: 6 }}>Hittade {visibleProducts.length} produkter</h3>

        <div className="category-grid">
          {visibleProducts.map(product => (
            <Link
              to={`/products/${product.urlSlug}`}     // OBS: urlSlug i nya backend
              key={product.id}
              className="category"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="category-image"
              />
              <p className="product-name">{product.name}</p>
              <p className="product-price">
                {Number(product.price).toLocaleString("sv-SE")} SEK
              </p>
              <div className="heart-icon">
                <FaRegHeart />
              </div>
            </Link>
          ))}
          {visibleProducts.length === 0 && (
            <p style={{ opacity: 0.7 }}>Inga produkter i denna kategori ännu.</p>
          )}
        </div>
      </section>
    </div>
  );
}
