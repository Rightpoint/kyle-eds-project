/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.genpact.com/about-us (.cmp-teaser--50-50:not(.cmp-teaser--simple-hero))
 * Columns block: No field hints (Columns exception per hinting.md)
 * 2-column layout: text content (heading + description + CTA) | image
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h3.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const ctaLink = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');
  const imgEl = element.querySelector('.cmp-teaser__image img, .cmp-image__image');

  // Column 1: text content
  const textCell = document.createDocumentFragment();
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    textCell.appendChild(h3);
  }
  if (description) {
    const descP = description.querySelector('p');
    if (descP) {
      const p = document.createElement('p');
      p.textContent = descP.textContent.trim();
      textCell.appendChild(p);
    }
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href || '';
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }

  // Column 2: image
  const imageCell = document.createDocumentFragment();
  if (imgEl) {
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.src = imgEl.src || '';
    img.alt = imgEl.alt || '';
    pic.appendChild(img);
    imageCell.appendChild(pic);
  }

  const cells = [[textCell, imageCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
