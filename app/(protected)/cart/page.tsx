"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { demoProducts, demoProjects, demoCart } from "@/lib/demoData";
import { Button } from "@/components/UI";

type CartLine = {
  id: string;
  productId: string;
  qty: number;
  projectId?: string;
  area?: string;
};

const CART_KEY = "dc:cart";
const ORDERS_KEY = "dc:orders";

export default function CartPage() {
  function toggleSelect(id: string){ setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]); }
  const [lines, setLines] = useState<CartLine[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load demo data or localStorage
  useEffect(() => {
    const existing = localStorage.getItem(CART_KEY);
    if (!existing || existing === "[]") {
      // preload demo cart only if empty
      localStorage.setItem(CART_KEY, JSON.stringify(demoCart));
    }
    setLines(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
    setLoading(false);
  }, []);

  // helpers
  function save(next: CartLine[]) {
    setLines(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  function remove(lineId: string) {
    save(lines.filter((l) => l.id !== lineId));
  }

  function changeQty(lineId: string, delta: number) {
    save(
      lines.map((l) =>
        l.id === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l
      )
    );
  }

  function clearCart() {
    save([]);
  }

  const view = useMemo(() => {
    return lines.map((l) => {
      const product = demoProducts.find((p) => p.id === l.productId);
      const project = l.projectId
        ? demoProjects.find((p) => p.id === l.projectId)
        : undefined;
      return { line: l, product, project };
    });
  }, [lines]);

  const subtotal = useMemo(() => {
    return view.reduce((sum, row) => {
      if (!row.product) return sum;
      return sum + row.product.price * row.line.qty;
    }, 0);
  }, [view]);

  // ✅ Place Order
  function placeOrder() {
    if (lines.length === 0) return;
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    const order = {
      id: `ord_${Date.now()}`,
      items: lines,
      total: subtotal,
      status: "Placed",
      ts: Date.now(),
    };
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
    clearCart();
    alert("Order placed (demo). You can review it on the Orders page.");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-1.5 rounded-full bg-[#d96857]" />
          <h1 className="text-2xl font-semibold text-[#2e2e2e]">Cart</h1>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-200 p-8 text-zinc-500">
            Loading…
          </div>
        ) : view.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products list */}
            <section className="lg:col-span-2 space-y-3">
              {view.map(({ line, product, project }) => (
                <div
                  key={line.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex gap-3"><input type="checkbox" className="mt-2" checked={selectedIds.includes(line.id)} onChange={()=>toggleSelect(line.id)} />
                    <img
                      src={product?.imageUrl}
                      alt={product?.title}
                      className="w-24 h-24 object-cover rounded-xl border border-zinc-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-[#2e2e2e]">
                            {product?.title}
                          </div>
                          <div className="mt-1 text-xs text-zinc-600">
                            ₹{product?.price.toLocaleString("en-IN")} per item
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#2e2e2e]">
                            {project && (
                              <span className="bg-[#f2f0ed] border border-zinc-200 rounded-2xl px-2 py-1">
                                Project: {project.name}
                              </span>
                            )}
                            {line.area && (
                              <span className="bg-[#f2f0ed] border border-zinc-200 rounded-2xl px-2 py-1">
                                Area: {line.area}
                              </span>
                            )}
                            {project?.address && (
                              <span className="bg-white border border-zinc-200 rounded-2xl px-2 py-1">
                                {project.address}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-[#2e2e2e]">
                          ₹{(product?.price || 0 * line.qty).toLocaleString("en-IN")}
                        </div>
                      </div>

                      {/* Quantity / Remove */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => changeQty(line.id, -1)}
                            className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-sm"
                          >
                            −
                          </button>
                          <div className="w-8 text-center text-sm">{line.qty}</div>
                          <button
                            onClick={() => changeQty(line.id, +1)}
                            className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-sm"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => remove(line.id)}
                          className="text-xs text-zinc-600 hover:text-[#d96857]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Link
                  href="/products"
                  className="text-sm text-[#2e2e2e] underline underline-offset-4"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm text-zinc-600 hover:text-[#d96857]"
                >
                  Clear Cart
                </button>
              </div>
            </section>

            {/* Summary */}
            <aside className="lg:sticky lg:top-20 h-fit">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-[#2e2e2e] mb-3">
                  Order Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <Row label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
                  <Row label="Shipping" value="—" />
                  <Row label="Tax" value="—" />
                  <div className="h-px bg-zinc-200 my-2" />
                  <Row
                    label="Total"
                    value={`₹${subtotal.toLocaleString("en-IN")}`}
                    strong
                  />
                </div>

                <Button
                  onClick={placeOrder} disabled={selectedIds.length===0}
                  className="mt-4 w-full bg-[#d96857] text-white rounded-2xl py-2 font-medium hover:opacity-95"
                >
                  Place Order
                </Button>

                <p className="mt-2 text-[11px] text-zinc-500 text-center">
                  This is a demo checkout. Orders will appear in the Orders page.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-zinc-600 ${strong ? "font-semibold text-[#2e2e2e]" : ""}`}>
        {label}
      </span>
      <span className={`text-[#2e2e2e] ${strong ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center bg-white">
      <div className="mx-auto w-28 h-28 rounded-full bg-[#f2f0ed] mb-4" />
      <h2 className="text-lg font-semibold text-[#2e2e2e]">Your cart is empty</h2>
      <p className="text-sm text-zinc-600 mt-1">
        Browse products and add them to your project.
      </p>
      <Link
        href="/products"
        className="inline-flex mt-4 rounded-2xl bg-[#d96857] text-white text-sm font-medium px-4 py-2 hover:opacity-95"
      >
        Go to Products
      </Link>
    </div>
  );
}
