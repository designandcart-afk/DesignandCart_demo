
"use client";
import { useParams, useRouter } from "next/navigation";
import { demoOrders, demoProducts } from "@/lib/demoData";

export default function OrderDetailPage(){
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const order = demoOrders.find(o=>o.id===id) || demoOrders[0];

  const items = order.items.map(line => {
    const p = demoProducts.find(pp=>pp.id===line.productId);
    return { ...line, product: p };
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={()=>router.back()} className="px-3 py-1 rounded-2xl border hover:bg-black/5">← Back</button>
          <h1 className="text-xl font-semibold text-[#2e2e2e]">Order Details</h1>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-5 bg-[#f2f0ed]">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><span className="text-zinc-500">Order ID:</span> <span className="font-medium text-[#2e2e2e]">{order.id}</span></div>
            <div><span className="text-zinc-500">Invoice #:</span> <span className="font-medium text-[#2e2e2e]">INV-{order.id.slice(-6).toUpperCase()}</span></div>
            <div><span className="text-zinc-500">Status:</span> <span className="font-medium text-[#2e2e2e]">{order.status}</span></div>
            <div><span className="text-zinc-500">Placed:</span> <span className="font-medium text-[#2e2e2e]">{new Date(order.ts).toLocaleString()}</span></div>
          </div>

          <div className="mt-5 rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="p-3">Item</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((line)=> (
                  <tr key={line.id} className="border-t">
                    <td className="p-3">{line.product?.title || line.productId}</td>
                    <td className="p-3">{line.qty}</td>
                    <td className="p-3">₹{(line.product?.price||0).toLocaleString("en-IN")}</td>
                    <td className="p-3">₹{(((line.product?.price||0)*line.qty)).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-zinc-600">Download your invoice</span>
            <button className="px-4 py-2 rounded-2xl bg-[#d96857] text-white">Download Bill</button>
          </div>
        </div>
      </div>
    </main>
  );
}
