/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-corporate. Base: video.
 * Source: https://www.genpact.com/about-us (.dynamicmedia.parbase)
 * Simple block: row 1 = uri (video link), row 2 = placeholder_image (poster)
 * Model fields: uri (aem-content), classes (skip), placeholder_image (reference, placeholder_imageAlt collapsed)
 * Video block: 1 column, row 1 = video URL, row 2 = poster image
 */
export default function parse(element, { document }) {
  // Extract video source URL
  const videoEl = element.querySelector('video source');
  const videoSrc = videoEl ? videoEl.getAttribute('src') : '';
  // Try to find the poster image
  const posterImg = element.querySelector('.s7posterimage img, img.s7posterimage, video[poster]');
  const posterSrc = posterImg ? (posterImg.src || posterImg.getAttribute('poster') || '') : '';

  const cells = [];

  // Row 1: uri (video link)
  const uriCell = document.createDocumentFragment();
  uriCell.appendChild(document.createComment(' field:uri '));
  if (videoSrc) {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.textContent = videoSrc;
    uriCell.appendChild(a);
  } else {
    // Fallback: try to find any video-related URL
    const anyVideo = element.querySelector('video');
    if (anyVideo && anyVideo.src) {
      const a = document.createElement('a');
      a.href = anyVideo.src;
      a.textContent = anyVideo.src;
      uriCell.appendChild(a);
    }
  }
  cells.push([uriCell]);

  // Row 2: placeholder_image (poster image)
  const imgCell = document.createDocumentFragment();
  imgCell.appendChild(document.createComment(' field:placeholder_image '));
  if (posterSrc) {
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.src = posterSrc;
    img.alt = posterImg ? (posterImg.alt || '') : '';
    pic.appendChild(img);
    imgCell.appendChild(pic);
  }
  cells.push([imgCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-corporate', cells });
  element.replaceWith(block);
}
