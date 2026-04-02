/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-subnav. Base: cards.
 * Source: https://www.genpact.com/about-us (.cmp-subnav .cmp-list.cmp-subnav__list)
 * Container block: each card row = [image, text]
 * Model fields per card: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-subnav__item'));
  const cells = [];

  items.forEach((item) => {
    const imgEl = item.querySelector('.cmp-teaser__image img, .cmp-image__image');
    const title = item.querySelector('h2.cmp-teaser__title, .cmp-teaser__title');
    const description = item.querySelector('.cmp-teaser__description');
    const link = item.querySelector('a.cmp-teaser__link');

    // Column 1: image
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

    // Column 2: text (title + description + link)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (title) {
      const h = document.createElement('p');
      h.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
      textCell.appendChild(h);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href || '';
      a.textContent = title ? title.textContent.trim() : 'Read more';
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-subnav', cells });
  element.replaceWith(block);
}
