/**
 * Single source of truth for site-wide SEO wiring.
 *
 * vite.config.ts reads this at build time to set every page's canonical,
 * og:url and SoftwareApplication JSON-LD, to generate the "Related converters"
 * block and footer on each landing page, and to write sitemap.xml. The React
 * home page reads CONVERTERS for its "All converters" section. Change a URL or
 * a link here, never in the individual HTML files.
 */

/** The one canonical origin. The bare domain 301s here (see README). */
export const SITE_ORIGIN = 'https://www.getcompressly.com';

export interface Converter {
  slug: string;
  /** Short label, e.g. "PNG to WebP". */
  label: string;
  /** Descriptive anchor text used when linking to this page. */
  anchor: string;
  /** One line under the anchor in "Related converters". */
  blurb: string;
  /** 3–4 genuinely adjacent converters, in display order. */
  related: string[];
}

// The related lists form a deliberate matrix rather than everything-to-
// everything: same-format neighbours first, then one bridge across the
// WebP / AVIF clusters so neither cluster is an island.
export const CONVERTERS: Converter[] = [
  { slug: 'png-to-webp', label: 'PNG to WebP', anchor: 'Convert PNG to WebP', blurb: 'Keep transparency, cut 25–80%', related: ['jpg-to-webp', 'webp-to-png', 'compress-webp', 'png-to-avif'] },
  { slug: 'jpg-to-webp', label: 'JPG to WebP', anchor: 'Convert JPG to WebP', blurb: 'Same quality, 25–35% smaller', related: ['png-to-webp', 'webp-to-jpg', 'compress-webp', 'jpg-to-avif'] },
  { slug: 'webp-to-png', label: 'WebP to PNG', anchor: 'Convert WebP to PNG', blurb: 'A lossless file every editor opens', related: ['webp-to-jpg', 'png-to-webp', 'avif-to-png', 'compress-webp'] },
  { slug: 'webp-to-jpg', label: 'WebP to JPG', anchor: 'Convert WebP to JPG', blurb: 'Maximum compatibility for email and uploads', related: ['webp-to-png', 'jpg-to-webp', 'avif-to-jpg', 'compress-webp'] },
  { slug: 'compress-webp', label: 'Compress WebP', anchor: 'Compress WebP images', blurb: 'Make existing WebP files smaller', related: ['png-to-webp', 'jpg-to-webp', 'webp-to-jpg', 'avif-converter'] },
  { slug: 'png-to-avif', label: 'PNG to AVIF', anchor: 'Convert PNG to AVIF', blurb: 'Cut 50–90%, keep transparency', related: ['jpg-to-avif', 'avif-to-png', 'png-to-webp', 'avif-converter'] },
  { slug: 'jpg-to-avif', label: 'JPG to AVIF', anchor: 'Convert JPG to AVIF', blurb: 'Cut 30–50% more at the same quality', related: ['png-to-avif', 'avif-to-jpg', 'jpg-to-webp', 'avif-converter'] },
  { slug: 'avif-to-jpg', label: 'AVIF to JPG', anchor: 'Convert AVIF to JPG', blurb: 'For software that won\'t open AVIF', related: ['avif-to-png', 'jpg-to-avif', 'webp-to-jpg', 'avif-converter'] },
  { slug: 'avif-to-png', label: 'AVIF to PNG', anchor: 'Convert AVIF to PNG', blurb: 'Lossless, editable, transparency kept', related: ['avif-to-jpg', 'png-to-avif', 'webp-to-png', 'avif-converter'] },
  { slug: 'avif-converter', label: 'AVIF converter', anchor: 'AVIF converter — to and from AVIF', blurb: 'Every AVIF conversion in one place', related: ['png-to-avif', 'jpg-to-avif', 'avif-to-jpg', 'avif-to-png'] },
];

/** Indexable pages that are not converters. */
export const LEGAL_PAGES = ['privacy', 'terms'];

export const converterBySlug = (slug: string) => CONVERTERS.find((c) => c.slug === slug);

/** Canonical URL for a path: home is "/" with a trailing slash, everything else none. */
export function canonicalUrl(path: string): string {
  const clean = path === '/' || path === '' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `${SITE_ORIGIN}${clean}`;
}
