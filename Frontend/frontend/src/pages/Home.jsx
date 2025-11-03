import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { FaRegHeart } from "react-icons/fa";

import HeroSection from "../components/HeroSection";
import PromoSection from "../components/PromoSection";

const BASE = import.meta.env.VITE_API_BASE ?? "";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/products`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <>
      <HeroSection />
      <PromoSection />

      <div className="home-container">
        <section className="categories">
          <h2>Produkter</h2>

          <div className="category-grid">
            {products.map((product) => (
              <Link
                to={`/products/${product.urlSlug}`}
                key={product.id}
                className="category"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="category-image"
                />
                <p className="product-name">{product.name}</p>
                <p className="product-price">{product.price} SEK</p>
                <div className="heart-icon">
                  <FaRegHeart />
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <p>Inga produkter ännu.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
