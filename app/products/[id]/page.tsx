"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { demoProducts, demoProjects } from "@/lib/demoData";
import { Button, Select } from "@/components/UI";

// Heuristic auth detector to avoid breaking your setup.
// It checks common places: window global, localStorage keys.
// If your login flow already sets one of these, it will just work.
function useAuthEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      if (typeof window === "undefined") return null;
      const w = window as any;
      return (
        w.DC_AUTH?.email ||
        localStorage.getItem("dc:userEmail") ||
        localStorage.getItem("auth:userEmail") ||
        null
      );
    };
    setEmail(read());

    const onAuthChange = () => setEmail(read());
    window.addEventListener("auth:change", onAuthChange);
    return () => window.removeEventListener("auth:change", onAuthChange);
  }, []);

  return email;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useMemo(
    () => demoProducts.find((p) => p.id === id),
    [id]
  );

  const authEmail = useAuthEmail();            // ← demo@designandcart.in will show designer controls
  const isLoggedIn = !!authEmail;

  const [projectId, setProjectId] = useState(demoProjects[0]?.id ?? "");
  const [area, setArea] = useState("Living Room");
  const [note, setNote] = useState("");

  if (!product) {
    return (
      <main className="p-10 text-center text-zinc-600">Product not found.</main>
    );
  }

  // Store “Add to Design” links in localStorage (so we don’t mutate your demoData.ts)
  function addLinkToLocal(projectId: string, productId: string, area: string, note?: string) {
    const key = "dc:projectProducts";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = {
      id: `pp_${Date.now()}`,
      projectId,
      productId,
      area,
      note: note || "",
      createdAt: Date.now(),
    };
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
  }

  function handleAddToDesign() {
    if (!projectId) return alert("Choose a project.");
    addLinkToLocal(projectId, product.id, area, note);
    alert(`Added "${product.title}" to ${projectId} (${area}).`);
    setNote("");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-80 object-cover rounded-2xl border border-zinc-200"
            />
          </div>

          {/* Right: Info + Actions */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#2e2e2e]">
                {product.title}
              </h1>
              <p className="text-sm text-zinc-600">{/* category optional */}</p>
              <div className="text-[#d96857] font-semibold text-lg mt-2">
                ₹{product.price.toLocaleString("en-IN")}
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              {/* Optional description slot */}
              Quality product for modern interiors. Add specs here later.
            </p>

            {/* Public can view everything above; designers get “Add to Design” */}
            {isLoggedIn ? (
              <div className="space-y-3">
                <Select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  {demoProjects.map((pj) => (
                    <option key={pj.id} value={pj.id}>
                      {pj.name}
                    </option>
                  ))}
                </Select>

                <Select value={area} onChange={(e) => setArea(e.target.value)}>
                  <option>Living Room</option>
                  <option>Dining</option>
                  <option>Bedroom</option>
                  <option>Kitchen</option>
                </Select>

                <textarea
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-zinc-300 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d96857]/30"
                />

                <Button
                  onClick={handleAddToDesign}
                  className="w-full bg-[#d96857] text-white rounded-2xl py-2 font-medium hover:opacity-95"
                >
                  Add to Design
                </Button>

                <p className="text-xs text-zinc-500">
                  Logged in as <span className="font-medium">{authEmail}</span>
                </p>
              </div>
            ) : (
              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-zinc-600">
                  Designers can add this product to a project.
                </p>
                <Button
                  onClick={() => {
                    // You can replace this with your real login route
                    alert("Redirect to Login/Signup");
                  }}
                  className="w-full bg-[#d96857] text-white rounded-2xl py-2 font-medium"
                >
                  Login / Signup
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-[#f2f0ed] p-5">
          <h3 className="text-sm font-semibold text-[#2e2e2e] mb-2">Description</h3>
          <p className="text-sm text-zinc-700">{product?.description || 'High-quality product chosen for realistic 3D visualization and sourcing.'}</p>
        </div>
      </div>
    </main>
  );
}
