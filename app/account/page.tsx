"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, LogIn, Mail, User, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("anjanadri_session="));
      if (cookie) {
        const session = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        setEmail(session.email || "");
        setName(session.name || "");
        setLoggedIn(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (loggedIn && email) fetchOrders();
  }, [loggedIn, email]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {}
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) setLoggedIn(true);
    } catch {}
  }

  if (!loggedIn) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-white py-24">
          <div className="mx-auto max-w-md px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] border border-[#F0E2C4] bg-[#FFF3D6] p-8 shadow-sm"
            >
              <div className="flex items-center justify-center mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2E7D32]/15 text-[#2E7D32]">
                  <User className="h-6 w-6" />
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-[#3E2723] text-center">Your Account</h1>
              <p className="mt-2 text-sm text-[#3E2723]/55 text-center">Sign in to view orders and saved addresses</p>
              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3E2723]/55">Name</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#F0E2C4] bg-white px-3.5 py-2.5">
                    <User className="h-4 w-4 text-[#3E2723]/55" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="flex-1 bg-transparent text-sm text-[#3E2723] placeholder:text-[#3E2723]/55 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#3E2723]/55">Email</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#F0E2C4] bg-white px-3.5 py-2.5">
                    <Mail className="h-4 w-4 text-[#3E2723]/55" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-sm text-[#3E2723] placeholder:text-[#3E2723]/55 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3E2723] py-3 text-sm font-semibold text-[#FFF8E7] transition-all hover:bg-[#F57C00]"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </button>
              </form>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-heading text-3xl font-bold text-[#3E2723]">Welcome, {name || "Guest"}</h1>
                <p className="mt-1 text-sm text-[#3E2723]/55">{email}</p>
              </div>
              <button
                onClick={() => {
                  document.cookie = "anjanadri_session=; max-age=0; path=/";
                  setLoggedIn(false);
                }}
                className="rounded-full border border-[#F0E2C4] px-5 py-2 text-xs font-semibold text-[#3E2723] transition-all hover:bg-[#3E2723] hover:text-[#FFF8E7]"
              >
                Sign Out
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-[#F0E2C4] bg-[#FFF3D6] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-5 w-5 text-[#C2410C]" />
                  <h2 className="font-heading text-xl font-bold text-[#3E2723]">Order History</h2>
                </div>
                {loading ? (
                  <p className="text-sm text-[#3E2723]/55">Loading...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-10 w-10 mx-auto text-[#F0E2C4] mb-3" />
                    <p className="text-sm text-[#3E2723]/55">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-[#F0E2C4] bg-white p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-[#3E2723]">{order.id}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            order.status === "fulfilled" ? "bg-[#2E7D32]/15 text-[#2E7D32]" : "bg-[#F57C00]/15 text-[#C2410C]"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#3E2723]/70">${parseFloat(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-[#3E2723]/55">{new Date(order.created_at).toLocaleDateString()}</p>
                        {order.items?.length > 0 && (
                          <p className="mt-1 text-xs text-[#3E2723]/55">{order.items.length} item(s)</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-[#F0E2C4] bg-[#FFF3D6] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-[#2E7D32]" />
                  <h2 className="font-heading text-xl font-bold text-[#3E2723]">Saved Addresses</h2>
                </div>
                <div className="text-center py-8">
                  <p className="text-sm text-[#3E2723]/55">Address management coming soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
