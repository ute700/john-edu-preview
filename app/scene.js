// Approved V7 motion layers, integrated without changing lesson coordinates.
const base = new URL('./assets/mountain-motion-base-v8.png', import.meta.url).href;
export function renderLandscape() {
 return `<div class="world-scene" aria-hidden="true"><div class="motion-scene"><img class="motion-base" src="${base}" width="1024" height="1536" alt="" draggable="false" decoding="async" fetchpriority="high"/><div class="motion-details" aria-hidden="true"><div class="motion-leaves"></div><div class="motion-waterfall"></div><div class="motion-lake"></div><div class="motion-cloud motion-cloud-left"></div><div class="motion-cloud motion-cloud-right"></div><div class="motion-eagle"><span></span></div><div class="motion-phoenix"><span></span></div></div></div></div>`;
}

export function renderHiker() {
 const source = new URL('./assets/hiker-v3.png', import.meta.url).href;
 return `<img class="world-hiker" src="${source}" width="1024" height="1536" alt="" aria-hidden="true" draggable="false" decoding="async"/>`;
}
