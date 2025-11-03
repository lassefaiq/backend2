import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const BASE = import.meta.env.VITE_API_BASE ?? ""; 

export default function AddCategory() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // vi sparar en URL-sträng, inte en fil

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) return alert("Ange ett kategorinamn.");
    if (trimmed.length > 25) return alert("Max 25 tecken för namn.");

    try {
      const res = await fetch(`${BASE}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, image: imageUrl || null }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} ${text}`);
      }

      alert("Kategori tillagd!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Kunde inte lägga till kategori.");
    }
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Produkter</h2>
      </aside>

      <main className="admin-main">
        <h1>Ny kategori</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Namn:
            <input
              type="text"
              name="name"
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Bild-URL (valfritt):
            <input
              type="url"
              name="image"
              placeholder="https://exempel.se/bild.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>

          <button type="submit">Lägg till</button>
        </form>
      </main>
    </div>
  );
}
