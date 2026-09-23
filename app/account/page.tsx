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
        <main className="flex-1 bg-[#FDFBF7] py-24">
          <div className="mx-auto max-w-md px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] border border-[#EDE5D8] bg-[#F7F3EB] p-8 shadow-sm"
            >
              <div className="flex items-center justify-center mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6E7D60]/15 text-[#6E7D60]">
                  <User className="h-6 w-6" />
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-[#4A2E1B] text-center">Your Account</h1>
              <p className="mt-2 text-sm text-[#8C7A6B] text-center">Sign in to view orders and saved addresses</p>
              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">Name</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] px-3.5 py-2.5">
                    <User className="h-4 w-4 text-[#8C7A6B]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="flex-1 bg-transparent text-sm text-[#4A2E1B] placeholder:text-[#8C7A6B] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">Email</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] px-3.5 py-2.5">
                    <Mail className="h-4 w-4 text-[#8C7A6B]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-sm text-[#4A2E1B] placeholder:text-[#8C7A6B] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4A2E1B] py-3 text-sm font-semibold text-[#FDFBF7] transition-all hover:bg-[#B85D3B]"
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
      <main className="flex-1 bg-[#FDFBF7] py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-heading text-3xl font-bold text-[#4A2E1B]">Welcome, {name || "Guest"}</h1>
                <p className="mt-1 text-sm text-[#8C7A6B]">{email}</p>
              </div>
              <button
                onClick={() => {
                  document.cookie = "anjanadri_session=; max-age=0; path=/";
                  setLoggedIn(false);
                }}
                className="rounded-full border border-[#EDE5D8] px-5 py-2 text-xs font-semibold text-[#4A2E1B] transition-all hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
              >
                Sign Out
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-[#EDE5D8] bg-[#F7F3EB] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-5 w-5 text-[#B85D3B]" />
                  <h2 className="font-heading text-xl font-bold text-[#4A2E1B]">Order History</h2>
                </div>
                {loading ? (
                  <p className="text-sm text-[#8C7A6B]">Loading...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-10 w-10 mx-auto text-[#EDE5D8] mb-3" />
                    <p className="text-sm text-[#8C7A6B]">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-[#EDE5D8] bg-[#FDFBF7] p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-[#4A2E1B]">{order.id}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            order.status === "fulfilled" ? "bg-[#6E7D60]/15 text-[#6E7D60]" : "bg-[#B85D3B]/15 text-[#B85D3B]"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#6B584C]">${parseFloat(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-[#8C7A6B]">{new Date(order.created_at).toLocaleDateString()}</p>
                        {order.items?.length > 0 && (
                          <p className="mt-1 text-xs text-[#8C7A6B]">{order.items.length} item(s)</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-[#EDE5D8] bg-[#F7F3EB] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-[#6E7D60]" />
                  <h2 className="font-heading text-xl font-bold text-[#4A2E1B]">Saved Addresses</h2>
                </div>
                <div className="text-center py-8">
                  <p className="text-sm text-[#8C7A6B]">Address management coming soon</p>
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
