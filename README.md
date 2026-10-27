This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Cloudflare Pages caching

Deploy the static `out` directory. `public/_headers` is copied into it and sets `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400` for public static responses. This export has no API routes or Edge functions; future Pages Functions must set their own headers, and personalized responses must never use public caching.

All storefront Sanity queries use the validated catalog accessors in `lib/sanity-products.ts`, backed by `lib/sanity-fetch.ts`. Pages, metadata, static slugs, and the sitemap reuse one catalog query against the Sanity origin rather than mixing CDN and origin snapshots. Public reads use `force-cache` with a one-hour Next.js data-cache lifetime, a five-second deadline, no automatic retries, and shared in-flight requests. On failure, a bounded process-local cache can serve the last successful result for up to 24 hours after it becomes stale, with a five-second refresh backoff. `{ cache: 'no-store' }` bypasses both Next.js and process-local caching and queries the Sanity origin instead of its CDN. The generic utility requires a runtime `parse` function and caches only validated results.

The fallback cache is not durable or shared across workers/build processes. A cold-cache failure raises a friendly error rather than publishing an empty catalog or false product 404s. Static generation then fails, leaving the existing deployment available; `app/error.tsx` provides retry UI for runtime rendering errors. Static content changes still require a new deployment: CDN and fetch cache lifetimes do not enable ISR for `output: 'export'`.

## Architecture review

- There are no deployed API handlers, Supabase clients, or request-time database queries in this checkout. The Neon dependency and `scripts/check_db.js` are legacy CLI tooling, not deployed application code.
- `middleware.ts.example` is deliberately inactive. It does not protect production, its counters are isolate-local, and even rejected requests would consume invocations if deployed as a Function. Put quota protection upstream; KV read/modify/write counters are not atomic.
- Public `_headers` rules cover only static responses. Future authenticated APIs need private/no-store headers; do not copy the site's public cache policy onto them.
- Cache bounds are entry/in-flight counts, not byte limits. The full-catalog query is appropriate for the current small storefront but needs pagination or indexed detail reads as inventory grows. Product pages now pass only two bundle candidates to the client rather than the full catalog.
- Prices and availability in a static export are deployment-time snapshots, not authoritative checkout data. A future payment flow must validate both server-side.
- `lib/seo.ts` centralizes the canonical origin and escapes JSON-LD script content. CMS catalog validation rejects malformed required fields and normalizes optional nulls before caching.
- The malformed dependency version in `package.json` is repaired without changing dependency versions. Validation passed for the production build, linting of changed application files, cache/validation behavior, and exported headers, sitemap routes, robots, and product JSON-LD.

## Next optimizations

1. **Responsive CDN image pipeline:** use a shared Sanity image loader with responsive width variants, modern format negotiation, and an LCP-specific preload. Measure real-user LCP, INP, and CLS before/after; static export does not require a Next.js image server for this.
2. **Webhook-driven versioned catalog snapshots:** debounce Sanity publish events into Pages Deploy Hooks; retain a validated last-known-good build artifact for cold-build recovery. If adding live catalog APIs, a Worker can read versioned public snapshots from KV rather than query Sanity per request. Never use eventually consistent KV for authoritative stock or atomic rate-limit counters.
3. **Selective streaming on Workers:** only if genuinely dynamic features are required, evaluate a supported Next.js-on-Workers adapter, Suspense streaming, and durable cache invalidation while keeping storefront assets static. This requires a deployment change; it cannot run inside the current Pages static export and is not inherently faster than cached HTML.

These are optimization candidates, not a claim of top-1% performance. Establish field-data baselines and evaluate latency percentiles, cache-hit rates, asset bytes, and function invocation budgets before changing infrastructure.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
