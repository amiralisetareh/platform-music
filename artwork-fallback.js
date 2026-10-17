/* STARMUSICS offline artwork fallback. It replaces failed artwork locally without fetching a replacement. */
(function installArtworkFallback(root) {
  'use strict';

  const palettes = [
    ['#f2f4f8', '#dbe1ec', '#c0cadb', '#48546b'],
    ['#f5f3f8', '#e4deef', '#cfc4e0', '#514963'],
    ['#f3f5f4', '#dbe5e1', '#b9ccc5', '#465c56'],
    ['#f6f3ef', '#e7dfd5', '#cfc0af', '#625448'],
    ['#f1f4f7', '#dae5ec', '#b8ccd9', '#405766'],
    ['#f5f3f3', '#e6dfe2', '#cebcc5', '#604b56']
  ];
  const backgroundChecks = new WeakMap();
  const artworkTargets = '.card-cover,.artist-avatar,.saved-pick-art,.entity-related-art,#entity-art,.entity-hero-art,.np-artwork,.promo-bg';

  function safeLabel(value) {
    return String(value || 'STARMUSICS').replace(/\s+/g, ' ').trim().slice(0, 120) || 'STARMUSICS';
  }
  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
  }
  function paletteIndex(label) {
    let hash = 0;
    for (const char of label) hash = ((hash * 31) + char.codePointAt(0)) >>> 0;
    return hash % palettes.length;
  }
  function toSvg(value) {
    const label = safeLabel(value);
    const initial = escapeXml(Array.from(label)[0] || 'S');
    const [light, mid, dark, ink] = palettes[paletteIndex(label)];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="STARMUSICS artwork placeholder"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient><radialGradient id="glow"><stop stop-color="#fff" stop-opacity=".88"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="600" height="600" rx="36" fill="url(#g)"/><circle cx="146" cy="118" r="210" fill="url(#glow)"/><circle cx="482" cy="466" r="220" fill="#fff" opacity=".13"/><path d="M-35 408 C95 288 174 498 296 365 S488 286 650 390" fill="none" stroke="#fff" stroke-opacity=".58" stroke-width="3"/><path d="M-20 445 C112 325 181 529 309 397 S495 318 640 422" fill="none" stroke="${ink}" stroke-opacity=".17" stroke-width="2"/><g fill="${ink}" fill-opacity=".78"><text x="300" y="332" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="205" font-weight="650" letter-spacing="-12">${initial}</text><text x="300" y="530" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="650" letter-spacing="7">STARMUSICS</text></g><circle cx="492" cy="104" r="4" fill="#fff"/><circle cx="510" cy="124" r="2.5" fill="#fff"/><circle cx="88" cy="492" r="3" fill="#fff"/></svg>`;
  }
  function toDataUri(label) { return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(toSvg(label))}`; }
  function imageLabel(node) {
    const row = node.closest?.('[data-title],[data-artist],[data-open-artist],[data-open-album],[data-open-curated-playlist],.card,.artist,.trending-list li,.entity-track');
    return row?.getAttribute('data-title') || row?.getAttribute('data-artist') || row?.getAttribute('data-open-artist') || row?.getAttribute('data-open-album') || row?.getAttribute('data-open-curated-playlist') || row?.querySelector('strong,h2,h3')?.textContent || node.getAttribute?.('alt') || 'STARMUSICS';
  }
  function applyImageFallback(img) {
    if (!img || img.dataset.artworkFallbackApplied === 'true') return;
    img.dataset.artworkFallbackApplied = 'true';
    img.classList.add('artwork-fallback');
    img.src = toDataUri(imageLabel(img));
  }
  function checkImage(img) {
    if (!img || img.tagName !== 'IMG') return;
    const current = img.getAttribute('src') || '';
    if (img.dataset.artworkFallbackApplied === 'true') {
      if (!current.startsWith('data:image/svg+xml')) img.dataset.artworkFallbackApplied = '';
      else return;
    }
    if (!current.trim() || (img.complete && img.naturalWidth === 0)) applyImageFallback(img);
  }
  function backgroundUrl(value) {
    const text = String(value || '');
    const matches = text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi);
    for (const match of matches) {
      const url = String(match[1] ?? match[2] ?? match[3] ?? '').trim();
      if (/^https?:\/\//i.test(url)) return url;
    }
    return '';
  }
  function applyBackgroundFallback(node, source, originalBackground = '') {
    if (!node || node.dataset.artworkFallbackApplied === 'true') return;
    node.dataset.artworkFallbackApplied = 'true';
    node.classList.add('artwork-fallback');
    const fallback = toDataUri(imageLabel(node));
    // Replace only the failed URL so layered CSS artwork (for example, a dark
    // gradient over the Home promo photograph) keeps its original overlays.
    const background = originalBackground || node.style.backgroundImage || '';
    const replaced = source ? background.replace(source, fallback) : '';
    node.style.backgroundImage = replaced && replaced !== background ? replaced : `url("${fallback}")`;
    node.style.backgroundColor = '#e8edf3';
    node.setAttribute('data-artwork-fallback', 'true');
    if (source) node.setAttribute('data-artwork-fallback-source', source.slice(0, 240));
  }
  function checkBackground(node) {
    if (!node || (!node.matches?.(artworkTargets) && !node.hasAttribute?.('style'))) return;
    const inlineBackground = node.style?.backgroundImage || '';
    const computedBackground = inlineBackground || root.getComputedStyle?.(node)?.backgroundImage || '';
    const source = backgroundUrl(computedBackground);
    if (node.dataset.artworkFallbackApplied === 'true') {
      const failedSource = node.getAttribute('data-artwork-fallback-source') || '';
      if (!source || (failedSource && source === failedSource)) return;
      node.dataset.artworkFallbackApplied = '';
      node.removeAttribute('data-artwork-fallback');
      node.removeAttribute('data-artwork-fallback-source');
    }
    if (!source) {
      // Preserve self-contained data artwork and legitimate CSS layers. Empty
      // URL declarations and an unfilled entity hero may still use the fallback.
      if (/url\(\s*[\"']?data:/i.test(computedBackground)) return;
      const emptyUrl = /url\(\s*[\"']?\s*[\"']?\s*\)/i.test(computedBackground);
      const emptyArtTarget = node.matches?.('#entity-art,.entity-hero-art') && inlineBackground === 'none';
      if (emptyUrl || emptyArtTarget) applyBackgroundFallback(node, '');
      return;
    }
    if (backgroundChecks.get(node)?.source === source) return;
    const record = { source, status: 'pending' };
    backgroundChecks.set(node, record);
    if (typeof root.Image !== 'function') return;
    const probe = new root.Image();
    probe.onload = () => { if (backgroundChecks.get(node) === record) record.status = 'loaded'; };
    probe.onerror = () => {
      if (backgroundChecks.get(node) !== record) return;
      record.status = 'failed';
      const currentBackground = node.style.backgroundImage || root.getComputedStyle?.(node)?.backgroundImage || '';
      if (backgroundUrl(currentBackground) === source) applyBackgroundFallback(node, source, currentBackground);
    };
    probe.src = source;
  }
  function scan(node) {
    if (!node) return;
    const candidates = [];
    if (node.nodeType === 1) candidates.push(node);
    node.querySelectorAll?.('img,' + artworkTargets).forEach(el => candidates.push(el));
    for (const candidate of candidates) {
      if (candidate.tagName === 'IMG') checkImage(candidate);
      else checkBackground(candidate);
    }
  }
  function install(doc = root.document) {
    if (!doc?.documentElement || doc.documentElement.dataset.artworkFallbackInstalled === 'true') return;
    doc.documentElement.dataset.artworkFallbackInstalled = 'true';
    doc.addEventListener('error', event => {
      const failed = event.target;
      if (failed?.tagName === 'IMG') applyImageFallback(failed);
    }, true);
    if (typeof root.MutationObserver === 'function') {
      const observer = new root.MutationObserver(records => {
        for (const record of records) {
          if (record.type === 'attributes') {
            const target = record.target;
            if (target.tagName === 'IMG') {
              checkImage(target);
            } else {
              // Check fresh inline artwork URLs; checkBackground ignores our own data-URI fallback.
              checkBackground(target);
            }
          }
          record.addedNodes?.forEach(scan);
        }
      });
      observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] });
    }
    scan(doc.documentElement);
  }
  root.STARMUSICS_ArtworkFallback = { toSvg, toDataUri, backgroundUrl, install };
  if (root.document) install(root.document);
})(typeof window !== 'undefined' ? window : globalThis);
