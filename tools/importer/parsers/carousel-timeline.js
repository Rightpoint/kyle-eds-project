/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-timeline. Base: carousel.
 * Source: https://www.genpact.com/about-us (.cmp-carousel--timeline)
 * Container block: each slide row = [image, text]
 * Model fields per slide: media_image (reference, media_imageAlt collapsed), content_text (richtext)
 * Timeline carousel: year + description per slide
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  slides.forEach((slide) => {
    // Column 1: image (empty for timeline - no background image)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));

    // Column 2: text content (year heading + description)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));

    const texts = Array.from(slide.querySelectorAll('.cmp-text'));
    // First text is the year (size-xxl), second is description (size-xl)
    const yearText = texts[0];
    const descText = texts[1];

    if (yearText) {
      const yearP = yearText.querySelector('p');
      if (yearP) {
        const h3 = document.createElement('h3');
        h3.textContent = yearP.textContent.trim();
        textCell.appendChild(h3);
      }
    }
    if (descText) {
      const descP = descText.querySelector('p');
      if (descP) {
        const p = document.createElement('p');
        p.textContent = descP.textContent.trim();
        textCell.appendChild(p);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-timeline', cells });
  element.replaceWith(block);
}
