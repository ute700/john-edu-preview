const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Text-only building blocks: callers cannot inject markup or attach learning actions.
export function learningSection(title, paragraphs, kind = 'explanation') {
  const variant = ['explanation', 'conditions', 'key', 'reflection'].includes(kind) ? kind : 'explanation';
  return `<section class="learning-block learning-block--${variant}"><h3>${escapeText(title)}</h3>${paragraphs.map(text => `<p>${escapeText(text)}</p>`).join('')}</section>`;
}

export function comparisonTable(caption, columns, rows) {
  return `<table class="learning-comparison" role="table"><caption>${escapeText(caption)}</caption><thead role="rowgroup"><tr role="row">${columns.map(text => `<th scope="col" role="columnheader">${escapeText(text)}</th>`).join('')}</tr></thead><tbody role="rowgroup">${rows.map(row => `<tr role="row">${row.map((text, index) => index === 0 ? `<th scope="row" role="rowheader">${escapeText(text)}</th>` : `<td role="cell"><span class="learning-comparison-label" aria-hidden="true">${escapeText(columns[index])}</span><span>${escapeText(text)}</span></td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

export function learningFlow(steps) {
  return `<ol class="learning-decision-flow" aria-label="갑자기 돈이 필요할 때 생각할 순서">${steps.map(text => `<li>${escapeText(text)}</li>`).join('')}</ol>`;
}
