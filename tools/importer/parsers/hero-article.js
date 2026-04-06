/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-article. Base: hero.
 * Source: https://www.genpact.com/insight/the-gen-ai-countdown
 * Model fields: image (reference, imageAlt collapsed), text (richtext)
 * Hero block: row 1 = image, row 2 = text (heading + description + CTAs)
 */
export default function parse(element, { document }) {
  // Extract image
  const imgEl = element.querySelector('.cmp-teaser__image img, .cmp-image__image');

  // Extract text content
  const heading = element.querySelector('h1.cmp-teaser__title, .cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));

  const cells = [];

  // Row 1: image
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (imgEl) {
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.src = imgEl.src || '';
    img.alt = imgEl.alt || imgEl.title || '';
    pic.appendChild(img);
    imageCell.appendChild(pic);
  }
  cells.push([imageCell]);

  // Row 2: text (heading + description + CTAs)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (description) {
    const descChildren = Array.from(description.children);
    descChildren.forEach((child) => textCell.appendChild(child));
  }
  ctaLinks.forEach((cta) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || '';
    a.textContent = cta.textContent.trim().replace(/opens in a new tab/i, '').trim();
    p.appendChild(a);
    textCell.appendChild(p);
  });
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
