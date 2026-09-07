export default function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
        <div>
          <div className="font-bold text-zinc-100">Compressly</div>
          <p className="mt-2 text-zinc-500">Browser-based image compression. Built on jSquash and the Squoosh codec family.</p>
        </div>
        <div>
          <div className="text-zinc-300 font-semibold mb-2">Convert</div>
          <ul className="text-zinc-500">
            <li><a href="/png-to-webp" className="inline-block py-1.5 hover:text-zinc-200">PNG to WebP</a></li>
            <li><a href="/jpg-to-webp" className="inline-block py-1.5 hover:text-zinc-200">JPG to WebP</a></li>
            <li><a href="/webp-to-png" className="inline-block py-1.5 hover:text-zinc-200">WebP to PNG</a></li>
            <li><a href="/webp-to-jpg" className="inline-block py-1.5 hover:text-zinc-200">WebP to JPG</a></li>
            <li><a href="/compress-webp" className="inline-block py-1.5 hover:text-zinc-200">Compress WebP</a></li>
          </ul>
        </div>
        <div>
          <div className="text-zinc-300 font-semibold mb-2">AVIF</div>
          <ul className="text-zinc-500">
            <li><a href="/png-to-avif" className="inline-block py-1.5 hover:text-zinc-200">PNG to AVIF</a></li>
            <li><a href="/jpg-to-avif" className="inline-block py-1.5 hover:text-zinc-200">JPG to AVIF</a></li>
            <li><a href="/avif-to-jpg" className="inline-block py-1.5 hover:text-zinc-200">AVIF to JPG</a></li>
            <li><a href="/avif-to-png" className="inline-block py-1.5 hover:text-zinc-200">AVIF to PNG</a></li>
            <li><a href="/avif-converter" className="inline-block py-1.5 hover:text-zinc-200">AVIF converter</a></li>
          </ul>
        </div>
        <div>
          <div className="text-zinc-300 font-semibold mb-2">Product</div>
          <ul className="text-zinc-500">
            <li><a href="#tool" className="inline-block py-1.5 hover:text-zinc-200">Tool</a></li>
            <li><a href="#features" className="inline-block py-1.5 hover:text-zinc-200">Features</a></li>
            <li><a href="#pricing" className="inline-block py-1.5 hover:text-zinc-200">Pricing</a></li>
            <li><a href="#faq" className="inline-block py-1.5 hover:text-zinc-200">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-zinc-300 font-semibold mb-2">Legal</div>
          <ul className="text-zinc-500">
            <li><a href="/privacy" className="inline-block py-1.5 hover:text-zinc-200">Privacy</a></li>
            <li><a href="/terms" className="inline-block py-1.5 hover:text-zinc-200">Terms</a></li>
            <li><a href="mailto:hello@getcompressly.com" className="inline-block py-1.5 hover:text-zinc-200">hello@getcompressly.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700 px-4 sm:px-6 py-4 text-xs text-zinc-600 text-center">
        © {new Date().getFullYear()} Compressly. Compresses images — not your privacy.
      </div>
    </footer>
  );
}
