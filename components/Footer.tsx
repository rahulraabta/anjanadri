import { Phone, MapPin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#2E7D32] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Logo size="sm" light={true} showTagline={true} />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
              100% Natural • No Preservatives • Sun-Dried & Healthy
            </p>
          </div>
          <a
            href="#shop"
            className="inline-flex min-h-[48px] items-center rounded-full bg-[#F57C00] px-7 font-bold text-white shadow-md transition-all hover:bg-[#E65100]"
          >
            Shop Best Sellers
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/20 pt-6 text-sm">
          <p className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC107]" />
            <span>Contact: 9880106885</span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC107]" />
            <span>No. 4034, 8th Cross, 2nd Main, Gandhi Nagara, Mysore - 570007</span>
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/20 pt-6 text-xs text-white/70 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Anjanadri Dehydrated Fruits &amp; Vegetables. All rights reserved.</p>
          <p>100% Natural • Sun-Dried in Mysore</p>
        </div>
      </div>
    </footer>
  );
}
