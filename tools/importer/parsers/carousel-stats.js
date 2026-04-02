/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-stats. Base: carousel.
 * Source: https://www.genpact.com/about-us (.cmp-carousel--slide.cmp-carousel--actions-arrows)
 * Container block: each slide row = [image, text]
 * Model fields per slide: media_image (reference, media_imageAlt collapsed), content_text (richtext)
 * Stats carousel: large number + label per slide
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  slides.forEach((slide) => {
    // Column 1: image (empty for stats - no background image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));

    // Column 2: text content (stat number + label)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));

    const statNumber = slide.querySelector('.cmp-title__text, h3');
    const statLabel = slide.querySelector('.cmp-text p');

    if (statNumber) {
      const h3 = document.createElement('h3');
      h3.textContent = statNumber.textContent.trim();
      textCell.appendChild(h3);
    }
    if (statLabel) {
      const p = document.createElement('p');
      p.textContent = statLabel.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-stats', cells });
  element.replaceWith(block);
}
