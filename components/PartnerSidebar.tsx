import type { ReactElement } from "react";
import { rithvikFoodsData } from "@/lib/data/partner-data";

export default function PartnerSidebar(): ReactElement {
  const partner = rithvikFoodsData;

  return (
    <aside
      aria-label={`Featured from ${partner.partnerName}`}
      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
    >
      <h2 className="text-lg font-bold text-gray-900">
        Featured from {partner.partnerName}
      </h2>
      <p className="mt-1 text-sm text-[#2E7D32]">{partner.badge}</p>

      <ul className="mt-4 space-y-3">
        {partner.products.map((product) => (
          <li key={product.id}>
            <a
              href={product.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md p-1 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D32]"
            >
              <div className="shrink-0">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Direct CDN images avoid the image optimizer.
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div aria-hidden="true" className="h-16 w-16 rounded-md bg-gray-200" />
                )}
              </div>
              <span className="min-w-0 text-sm font-semibold text-gray-900">
                {product.name}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block rounded-lg bg-[#2E7D32] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#256428] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D32]"
      >
        Visit {partner.partnerName} Website
      </a>
    </aside>
  );
}
