import React, { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import "./Home.css";

const BASE = import.meta.env.VITE_API_BASE ?? "";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetch(`${BASE}/api/products`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const terms = (searchQuery.toLowerCase().match(/\w+/g) || []);
  const filteredProducts =
    terms.length === 0
      ? products
      : products.filter((product) => {
          const text = (product.name || "").toLowerCase();
          return terms.some((t) => text.includes(t));
        });

  return (
    <div className="product-list">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Hittade {filteredProducts.length} produkter
      </h2>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <Link
            to={`/products/${product.urlSlug}`}
            key={product.id}
            className="product-card"
            style={{ textDecoration: "none", color: "black" }}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price} SEK</p>
            <div className="heart-icon">
              <FaRegHeart />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
