/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-insight. Base: cards.
 * Source: https://www.genpact.com/insight/the-gen-ai-countdown (.cmp-teaser--overlay-card)
 * Container block: each card row = [image, text]
 * Model fields per card: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  // Find all overlay card siblings in the same container
  const parent = element.closest('.cmp-container') || element.parentElement;
  const allCards = parent
    ? Array.from(parent.querySelectorAll('.cmp-teaser--overlay-card'))
    : [element];

  const cells = [];

  allCards.forEach((card) => {
    const imgEl = card.querySelector('.cmp-teaser__image img, .cmp-image__image');
    const title = card.querySelector('h4.cmp-teaser__title, h3.cmp-teaser__title, .cmp-teaser__title');
    const description = card.querySelector('.cmp-teaser__description');
    const readMore = card.querySelector('.cmp-teaser__read-more');
    const link = card.querySelector('a.cmp-teaser__link');
    const overlayTag = card.querySelector('.cmp-image__overlay-tag');
    const overlayText = card.querySelector('.cmp-image__overlay-text');

    // Column 1: image
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (imgEl) {
      const pic = document.createElement('picture');
      const img = document.createElement('img');
      img.src = imgEl.src || '';
      img.alt = imgEl.alt || '';
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }

    // Column 2: text (tag + title + description + link)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Use overlay text or construct from title/description
    const actualTitle = overlayText ? overlayText.textContent.trim().replace(/Read the.*$/i, '').trim()
      : (title ? title.textContent.trim() : '');

    if (overlayTag) {
      const tagP = document.createElement('p');
      tagP.innerHTML = `<em>${overlayTag.textContent.trim()}</em>`;
      textCell.appendChild(tagP);
    }
    if (actualTitle) {
      const h = document.createElement('p');
      h.innerHTML = `<strong>${actualTitle}</strong>`;
      textCell.appendChild(h);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href || '';
      a.textContent = readMore ? readMore.textContent.trim() : 'Read more';
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-insight', cells });
  element.replaceWith(block);

  // Remove remaining card elements (they're now in the block)
  allCards.slice(1).forEach((card) => {
    const wrapper = card.closest('.aem-GridColumn') || card.parentElement;
    if (wrapper && wrapper !== parent) wrapper.remove();
    else card.remove();
  });
}
