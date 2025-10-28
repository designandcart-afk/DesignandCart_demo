'use client';
import { useMemo, useState } from "react";
import CenterModal from "./CenterModal";
import { Badge } from "@/components/UI";

type RenderT = { id: string; imageUrl: string; status?: "pending" | "approved" | "changes" };
type ProductT = { id: string; title: string; imageUrl: string; price: number };
type ShotT = { id: string; imageUrl: string };

export default function AreaModal({
  open,
  onClose,
  area,
  renders,
  screenshots,
  products,
  projectAddress,
}: {
  open: boolean;
  onClose: () => void;
  area: string;
  renders: RenderT[];
  screenshots: ShotT[];
  products: ProductT[];
  projectAddress: string;
}) {
  const [tab, setTab] = useState<"renders" | "screens" | "products">("renders");
  const [localRenders, setLocalRenders] = useState<RenderT[]>(
    (renders || []).map((r) => ({ ...r, status: r.status || "pending" }))
  );
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [lightbox, setLightbox] = useState<string | null>(null);

  const tabs = useMemo(
    () =>
      [
        { key: "renders", label: "Renders" },
        { key: "screens", label: "Screenshots" },
        { key: "products", label: "Products" },
      ] as const,
    []
  );

  const pillBtn =
    "px-3.5 py-1.5 rounded-full border border-black/10 bg-white text-[#2e2e2e] text-sm hover:border-[#d96857]/50";
  const thumbWrap = "mx-auto w-full max-w-[600px]";
  const thumbBox = "w-full aspect-[16/9] overflow-hidden rounded-xl border border-black/5 bg-[#f7f7f6]";
  const thumbImg = "w-full h-full object-cover cursor-zoom-in";

  function setStatus(id: string, s: RenderT["status"]) {
    setLocalRenders((prev) => prev.map((r) => (r.id === id ? { ...r, status: s } : r)));
  }

  function toggle(renderId: string, productId: string) {
    setSelected((prev) => {
      const cur = new Set(prev[renderId] ?? []);
      cur.has(productId) ? cur.delete(productId) : cur.add(productId);
      return { ...prev, [renderId]: cur };
    });
  }

  const totalSelected = Object.values(selected).reduce((acc, s) => acc + (s?.size ?? 0), 0);
  function addAllSelected() {
    const ids = Object.values(selected).flatMap((s) => Array.from(s ?? []));
    if (!ids.length) return;
    try {
      window.dispatchEvent(new CustomEvent("cart:add-many", { detail: { productIds: ids } }));
    } catch {}
    alert(`Added ${ids.length} item(s) to cart`);
    setSelected({});
  }

  return (
    <CenterModal open={open} onClose={onClose} hideClose>
      {/* Header inside content */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur rounded-t-3xl px-5 pt-5 pb-3 border-b border-black/10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-[#2e2e2e]">{area}</h3>
            <p className="text-sm text-[#2e2e2e]/60">{projectAddress}</p>
          </div>
          <button onClick={onClose} className="underline text-[#2e2e2e]">
            Close
          </button>
        </div>

        <div className="mt-3 flex gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full border text-sm ${
                tab === t.key
                  ? "border-[#d96857] bg-[#d96857]/10 text-[#d96857]"
                  : "border-black/10 bg-white text-[#2e2e2e]/80 hover:border-[#d96857]/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll region */}
      <div className="px-5 py-5 max-h-[70vh] overflow-y-auto">
        {tab === "renders" && (
          <div className="space-y-6">
            {localRenders.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-black/10 p-4 shadow-sm">
                <div className={thumbWrap}>
                  <div className={thumbBox}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.imageUrl}
                      alt="Render"
                      className={thumbImg}
                      onClick={() => setLightbox(r.imageUrl)}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Badge
                    className={
                      r.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : r.status === "changes"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {r.status}
                  </Badge>

                  <button className={pillBtn} onClick={() => setStatus(r.id, "approved")}>
                    {r.status === "approved" ? "Approved" : "Approve"}
                  </button>
                  <button className={pillBtn} onClick={() => setStatus(r.id, "changes")}>
                    {r.status === "changes" ? "Requested Change" : "Request Change"}
                  </button>
                </div>

                <h4 className="mt-4 mb-2 text-sm font-medium">Products in this render</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products.map((p) => {
                    const checked = (selected[r.id] ?? new Set()).has(p.id);
                    return (
                      <label
                        key={`${r.id}_${p.id}`}
                        className="border border-black/10 rounded-2xl p-2 bg-white hover:border-[#d96857]/30 cursor-pointer"
                      >
                        <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onClick={(e) => {
                              e.preventDefault();
                              setLightbox(p.imageUrl);
                            }}
                          />
                        </div>
                        <div className="mt-2 flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(r.id, p.id)}
                            className="mt-1"
                          />
                          <p className="text-xs font-medium line-clamp-2">{p.title}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "screens" && (
          <div className="space-y-6">
            {screenshots.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-black/10 p-4 shadow-sm">
                <div className={thumbWrap}>
                  <div className={thumbBox}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.imageUrl}
                      alt="Screenshot"
                      className={thumbImg}
                      onClick={() => setLightbox(s.imageUrl)}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button className={pillBtn} onClick={() => alert("Approved (demo)")}>
                    Approve
                  </button>
                  <button className={pillBtn} onClick={() => alert("Change requested (demo)")}>
                    Request Change
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-black/10 rounded-2xl p-3 shadow-sm">
                <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-black/5 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setLightbox(p.imageUrl)}
                  />
                </div>
                <p className="text-sm font-medium line-clamp-2">{p.title}</p>
                <button
                  className="mt-3 w-full bg-[#d96857] hover:bg-[#d96857]/90 text-white rounded-2xl py-2 text-sm"
                  onClick={() => alert("Added to cart")}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky footer */}
      {tab === "renders" && totalSelected > 0 && (
        <div className="sticky bottom-0 z-10 px-5 py-3 bg-white/95 backdrop-blur border-t border-black/10 rounded-b-3xl flex items-center justify-between">
          <span className="text-sm text-[#2e2e2e]/80">
            {totalSelected} product{totalSelected !== 1 ? "s" : ""} selected
          </span>
          <button
            className="px-4 py-2 rounded-xl bg-[#d96857] text-white text-sm hover:bg-[#d96857]/90"
            onClick={addAllSelected}
          >
            Add Selected to Cart
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Preview"
            className="max-w-[90vw] max-h-[86vh] object-contain rounded-2xl shadow-2xl"
          />
          <button
            className="absolute top-4 right-4 text-white/90 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/20"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
        </div>
      )}
    </CenterModal>
  );
}
