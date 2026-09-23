"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Package, CheckCircle2, Clock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "anjanadri2024") {
      setAuthed(true);
    }
  }

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {}
    setLoading(false);
  }

  async function markFulfilled(orderId: string) {
    setUpdating(orderId);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "fulfilled" }),
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "fulfilled" } : o)));
    } catch {}
    setUpdating(null);
  }

  if (!authed) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-[#FDFBF7] py-24">
          <div className="mx-auto max-w-sm px-6">
            <form onSubmit={handleLogin} className="rounded-[2rem] border border-[#EDE5D8] bg-[#F7F3EB] p-8 text-center">
              <ShieldCheck className="h-10 w-10 mx-auto text-[#4A2E1B] mb-4" />
              <h1 className="font-heading text-xl font-bold text-[#4A2E1B]">Admin Access</h1>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-4 w-full rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] px-4 py-2.5 text-sm text-[#4A2E1B] focus:outline-none focus:border-[#4A2E1B]"
              />
              <button type="submit" className="mt-4 w-full rounded-full bg-[#4A2E1B] py-2.5 text-sm font-semibold text-[#FDFBF7] hover:bg-[#B85D3B] transition-colors">
                Enter
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FDFBF7] py-12">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-heading text-3xl font-bold text-[#4A2E1B]">Order Management</h1>
              <p className="mt-1 text-sm text-[#8C7A6B]">{orders.length} total orders</p>
            </div>
            <button onClick={fetchOrders} className="rounded-full border border-[#EDE5D8] px-5 py-2 text-xs font-semibold text-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7] transition-all">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#B85D3B]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-12 w-12 mx-auto text-[#EDE5D8] mb-4" />
              <p className="text-[#8C7A6B]">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between rounded-[1.5rem] border border-[#EDE5D8] bg-[#F7F3EB] p-5"
                >
                  <div className="flex items-center gap-5">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      order.status === "fulfilled" ? "bg-[#6E7D60]/15 text-[#6E7D60]" : "bg-[#B85D3B]/15 text-[#B85D3B]"
                    }`}>
                      {order.status === "fulfilled" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#4A2E1B]">{order.id}</p>
                      <p className="text-xs text-[#8C7A6B]">{order.user_email} &middot; ${parseFloat(order.total_amount).toFixed(2)}</p>
                      <p className="text-xs text-[#8C7A6B]">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      order.status === "fulfilled" ? "bg-[#6E7D60]/15 text-[#6E7D60]" : "bg-[#B85D3B]/15 text-[#B85D3B]"
                    }`}>
                      {order.status}
                    </span>
                    {order.status !== "fulfilled" && (
                      <button
                        onClick={() => markFulfilled(order.id)}
                        disabled={updating === order.id}
                        className="rounded-full bg-[#4A2E1B] px-4 py-2 text-xs font-semibold text-[#FDFBF7] transition-all hover:bg-[#6E7D60] disabled:opacity-50"
                      >
                        {updating === order.id ? "Updating..." : "Mark Fulfilled"}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
