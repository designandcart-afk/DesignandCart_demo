"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { demoProducts } from "@/lib/demoData";

type Product = {
  id: string;
  title?: string;
  imageUrl?: string;
  category?: string;
  price?: number | string;
};

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [colors, setColors] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [inStock, setInStock] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const products = Array.isArray(demoProducts) ? demoProducts : [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchCategory = category === "All" || p.category === category;
      const matchQuery =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [products, category, deferredQuery]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-[#2e2e2e] mb-4">
          Products
        </h1>

        {/* Search + category filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category"
            className="flex-1 border border-zinc-300 bg-[#f2f0ed] rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d96857]/30"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-zinc-300 rounded-2xl px-3 py-2 text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="block rounded-2xl bg-[#f2f0ed] border border-zinc-200/60 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-3">
                <div className="text-sm font-medium text-[#2e2e2e] truncate">
                  {p.title}
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2e2e2e]">
                  ₹
                  {typeof p.price === "number"
                    ? p.price.toLocaleString("en-IN")
                    : p.price}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">No products found.</p>
        )}
      </div>
    </main>
  );
}
