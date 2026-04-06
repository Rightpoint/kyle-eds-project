/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroArticleParser from './parsers/hero-article.js';
import cardsInsightParser from './parsers/cards-insight.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/genpact-cleanup.js';
import sectionsTransformer from './transformers/genpact-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-article': heroArticleParser,
  'cards-insight': cardsInsightParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'insight-article',
  description: 'Insight article page template for thought leadership content, reports, and industry analysis',
  urls: [
    'https://www.genpact.com/insight/the-gen-ai-countdown',
  ],
  blocks: [
    {
      name: 'hero-article',
      instances: ['.cmp-teaser--50-50.cmp-teaser--simple-hero'],
    },
    {
      name: 'cards-insight',
      instances: ['.cmp-teaser--overlay-card'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Hero',
      selector: ['.container.mb-m:has(.cmp-teaser--simple-hero)'],
      style: 'dark',
      blocks: ['hero-article'],
      defaultContent: ['.cmp-hero-details'],
    },
    {
      id: 'section-2',
      name: 'Article Body',
      selector: ['.container.mb-section:has(.cmp-title--size-m)'],
      style: 'dark',
      blocks: [],
      defaultContent: ['.cmp-title--size-m', '.cmp-text--size-l', '.cmp-download--block'],
    },
    {
      id: 'section-3',
      name: 'Related Insights',
      selector: ['.container.mt-xl.mb-section:has(.cmp-teaser--overlay-card)'],
      style: 'dark',
      blocks: ['cards-insight'],
      defaultContent: ['.cmp-title--faded-border'],
    },
    {
      id: 'section-4',
      name: 'Contact CTA',
      selector: ['.container.cmp-container--vertical-bottom.mt-xl.mb-section'],
      style: 'dark',
      blocks: [],
      defaultContent: ['.cmp-title--bold', '.cmp-button--primary-v2'],
    },
  ],
};

// Section transformer added conditionally
const allTransformers = [
  ...transformers,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
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

    // 4. Execute afterTransform transformers
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
