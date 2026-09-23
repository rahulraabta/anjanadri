import { Globe, Mail, Share2, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";

const footerLinks = {
  Shop: ["All Products", "Fruit Chips", "Vegetable Crisps", "Dried Fruit", "Gift Boxes"],
  Company: ["Our Story", "How It's Made", "Farm Partners", "Sustainability"],
  Support: ["FAQ", "Shipping & Returns", "Track Order", "Contact Us"],
};

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#3D2314] bg-[#352013] text-[#EDE5D8]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <Logo size="md" light={true} showTagline={true} />
            </div>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#C4B5A5]">
              Handcrafted in small batches from Indian orchards. Slow-dried at low temperatures
              over 48 hours to preserve nature&apos;s full spectrum of vitamins, color, and crunch.
              No sugar. No sulfites. No compromise.
            </p>

            <div className="mt-8 flex gap-3">
              {[
                { icon: Globe, label: "Website" },
                { icon: Share2, label: "Social Media" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4A2E1B] bg-[#2C1A10] text-[#EDE5D8] transition-all duration-300 hover:border-[#B85D3B] hover:bg-[#B85D3B] hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.16em] text-[#FDFBF7]">
                {heading}
              </h4>
              <ul className="mt-6 space-y-3.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm text-[#C4B5A5] transition-colors duration-200 hover:text-[#FDFBF7]"
                    >
                      {link}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#4A2E1B] pt-8 md:flex-row">
          <p className="text-xs text-[#9E8E80]">
            &copy; {new Date().getFullYear()} Anjanadri Dehydrated Fruits &amp; Vegetables. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-[#9E8E80] transition-colors hover:text-[#FDFBF7]"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
