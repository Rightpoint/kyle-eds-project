/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: genpact sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Selectors from captured DOM of https://www.genpact.com/about-us
 */

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid DOM position shifts
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Find the first element matching any selector for this section
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before section (except the first section)
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
