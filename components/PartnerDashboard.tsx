'use client';

import type { ReactElement } from "react";
import { rithvikFoodsData } from "@/lib/data/partner-data";

export default function PartnerDashboard(): ReactElement {
  const partner = rithvikFoodsData;

  return (
    <aside
      aria-label={`Featured from ${partner.partnerName}`}
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden p-1"
    >
      <div className="p-4 md:p-5">
        <header className="p-4 pb-2">
          <span className="inline-flex rounded-full bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 text-xs font-semibold">
            {partner.badge}
          </span>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">
            {partner.partnerName}
          </h2>
        </header>

        <ul className="mt-4 space-y-2">
          {partner.products.map((product) => (
            <li key={product.id}>
              <a
                href={product.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Standard images are required for this static widget. */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                />
                <span className="min-w-0 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {product.name}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 ml-auto text-gray-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-200"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <footer className="border-t border-gray-100 mt-2">
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Visit {partner.partnerName} Website
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
            >
              <path d="M15 3h6v6m0-6L10 14" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </a>
        </footer>
      </div>
    </aside>
  );
}
