/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsSubnavParser from './parsers/cards-subnav.js';
import heroCorporateParser from './parsers/hero-corporate.js';
import videoCorporateParser from './parsers/video-corporate.js';
import columnsWayfinderParser from './parsers/columns-wayfinder.js';
import carouselStatsParser from './parsers/carousel-stats.js';
import carouselTimelineParser from './parsers/carousel-timeline.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/genpact-cleanup.js';
import sectionsTransformer from './transformers/genpact-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-subnav': cardsSubnavParser,
  'hero-corporate': heroCorporateParser,
  'video-corporate': videoCorporateParser,
  'columns-wayfinder': columnsWayfinderParser,
  'carousel-stats': carouselStatsParser,
  'carousel-timeline': carouselTimelineParser,
  'columns-promo': columnsPromoParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'about-page',
  description: 'About us page template with company overview and corporate information',
  urls: [
    'https://www.genpact.com/about-us',
  ],
  blocks: [
    {
      name: 'cards-subnav',
      instances: ['.cmp-subnav .cmp-list.cmp-subnav__list'],
    },
    {
      name: 'hero-corporate',
      instances: ['.cmp-teaser--50-50.cmp-teaser--simple-hero'],
    },
    {
      name: 'video-corporate',
      instances: ['.dynamicmedia.parbase'],
    },
    {
      name: 'columns-wayfinder',
      instances: ['.cmp-basicteaser--wayfinder'],
    },
    {
      name: 'carousel-stats',
      instances: ['.cmp-carousel--slide.cmp-carousel--actions-arrows'],
    },
    {
      name: 'carousel-timeline',
      instances: ['.cmp-carousel--timeline'],
    },
    {
      name: 'columns-promo',
      instances: ['.cmp-teaser--50-50:not(.cmp-teaser--simple-hero)'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: ['.container.mb-section:has(.cmp-teaser--simple-hero)'],
      style: 'dark',
      blocks: ['cards-subnav', 'hero-corporate'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Body Text and Video',
      selector: ['.cmp-container--background-gradient-fade-down:has(.cmp-text--size-l)'],
      style: 'dark',
      blocks: ['video-corporate'],
      defaultContent: ['.cmp-text--size-l'],
    },
    {
      id: 'section-3',
      name: 'Wayfinder Cards',
      selector: ['.container.mb-xl:has(.cmp-basicteaser--wayfinder)'],
      style: 'dark',
      blocks: ['columns-wayfinder'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Stats',
      selector: ['.container.mb-section:has(.cmp-carousel--slide)'],
      style: 'dark',
      blocks: ['carousel-stats'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Timeline',
      selector: ['.container.mb-section:has(.cmp-carousel--timeline)'],
      style: 'dark',
      blocks: ['carousel-timeline'],
      defaultContent: ['.cmp-title--size-l', '.cmp-button--secondary-v2'],
    },
    {
      id: 'section-6',
      name: 'Genpact Intelligence',
      selector: ['.container.mb-section:has(.cmp-teaser--50-50:not(.cmp-teaser--simple-hero))'],
      style: 'dark',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Contact CTA',
      selector: ['.cmp-container--background-gradient.cmp-container--background-gradient-right'],
      style: 'gradient',
      blocks: [],
      defaultContent: ['.cmp-title--bold', '.cmp-button--primary-v2'],
    },
  ],
};

// Section transformer added conditionally based on template sections
const allTransformers = [
  ...transformers,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  allTransformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
