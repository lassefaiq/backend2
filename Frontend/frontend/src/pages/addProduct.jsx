import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Behåll din CSS om du vill
import "./AddProduct.css";

// Bas-URL för API (env via Vite). Lämna tom för att använda Vite-proxy om du satt den.
const BASE = import.meta.env.VITE_API_BASE ?? "";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "", // vi använder en (1) kategori, men backend tar array => omvandlar till [id]
  });

  const [imageUrl, setImageUrl] = useState(""); // URL-sträng istället för fil
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Hämta kategorier från vår backend (JSON)
    fetch(`${BASE}/api/categories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Could not load categories:", err);
        setCategories([]);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((fd) => ({
      ...fd,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const name = formData.name.trim();
    if (!name || name.length > 25) {
      alert("Namn får vara 1–25 tecken.");
      return;
    }

    const priceNumber = Number(formData.price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      alert("Ange ett giltigt pris (≥ 0).");
      return;
    }

    // categoryIds är valfri i vår backend; om användaren valt en kategori skickar vi [id]
    const categoryIds =
      formData.category_id ? [Number(formData.category_id)] : undefined;

    try {
      const res = await fetch(`${BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: formData.description,
          price: priceNumber,
          image: imageUrl || null, // vår modell lagrar sträng
          categoryIds,             // undefined => skickas inte; eller skicka [] om du föredrar
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} ${text}`);
      }

      alert("Produkt tillagd!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Kunde inte lägga till produkten.");
    }
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Produkter</h2>
      </aside>

      <main className="admin-main">
        <h1>Ny produkt</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Namn:
            <input
              type="text"
              name="name"
              value={formData.name}
              maxLength={25}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Beskrivning:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Bild-URL (valfritt):
            <input
              type="url"
              name="imageUrl"
              placeholder="https://exempel.se/bild.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>

          <label>
            Pris:
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          <fieldset className="category-field">
            <legend>Kategori</legend>
            <div className="category-options">
              {categories.map((c) => (
                <label key={c.id} className="category-option">
                  <input
                    type="radio"
                    name="category_id"
                    value={c.id}
                    checked={Number(formData.category_id) === c.id}
                    onChange={handleChange}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
              {categories.length === 0 && (
                <p style={{ opacity: 0.8 }}>
                  Inga kategorier ännu. Skapa en under “Ny kategori”.
                </p>
              )}
            </div>
          </fieldset>

          <button type="submit">Lägg till</button>
        </form>
      </main>
    </div>
  );
}
