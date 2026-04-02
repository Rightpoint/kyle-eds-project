/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-wayfinder. Base: columns.
 * Source: https://www.genpact.com/about-us (.cmp-basicteaser--wayfinder)
 * Columns block: No field hints (Columns exception per hinting.md)
 * 3 columns side-by-side, each with heading + description
 * Note: selector matches each wayfinder item individually, so first match
 * collects all siblings and subsequent matches are skipped.
 */
export default function parse(element, { document }) {
  // Skip if already processed by a sibling
  if (element.dataset.columnsWayfinderProcessed) return;

  // Find all wayfinder siblings in the same grid container
  const gridParent = element.closest('.aem-Grid') || element.closest('.cmp-container') || element.parentElement;
  const allItems = gridParent
    ? Array.from(gridParent.querySelectorAll('.cmp-basicteaser--wayfinder'))
    : [element];

  // Mark all as processed
  allItems.forEach((item) => { item.dataset.columnsWayfinderProcessed = 'true'; });

  const row = [];
  allItems.forEach((item) => {
    const title = item.querySelector('.cmp-basicteaser__text, p.cmp-basicteaser__text');
    const description = item.querySelector('.cmp-basicteaser__description p, .cmp-basicteaser__description');

    const cell = document.createDocumentFragment();
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      cell.appendChild(h);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      cell.appendChild(p);
    }
    row.push(cell);
  });

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-wayfinder', cells });
  element.replaceWith(block);

  // Remove remaining wayfinder items (they are now in the block)
  allItems.slice(1).forEach((item) => {
    const wrapper = item.closest('.aem-GridColumn') || item.parentElement;
    if (wrapper && wrapper !== gridParent) wrapper.remove();
  });
}
