export const SITE_URL = 'https://anjanadri.com';

/**
 * Resolves relative asset/page paths against the canonical HTTPS origin.
 * Absolute HTTP(S) CDN URLs remain unchanged; non-HTTP URL schemes are rejected.
 */
export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Expected an HTTP image or page URL.');
  }
  return url.href;
}

/**
 * Serializes structured data for an HTML script element, escaping `<` so CMS text
 * containing `</script>` cannot close the element and inject executable markup.
 * @throws When the input cannot be represented as JSON (including cyclic objects).
 */
export function serializeJsonLd(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) throw new Error('Structured data must be JSON serializable.');
  return json.replace(/</g, '\\u003c');
}
