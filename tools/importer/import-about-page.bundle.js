var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-about-page.js
  var import_about_page_exports = {};
  __export(import_about_page_exports, {
    default: () => import_about_page_default
  });

  // tools/importer/parsers/cards-subnav.js
  function parse(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-subnav__item"));
    const cells = [];
    items.forEach((item) => {
      const imgEl = item.querySelector(".cmp-teaser__image img, .cmp-image__image");
      const title = item.querySelector("h2.cmp-teaser__title, .cmp-teaser__title");
      const description = item.querySelector(".cmp-teaser__description");
      const link = item.querySelector("a.cmp-teaser__link");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (imgEl) {
        const pic = document.createElement("picture");
        const img = document.createElement("img");
        img.src = imgEl.src || "";
        img.alt = imgEl.alt || imgEl.title || "";
        pic.appendChild(img);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (title) {
        const h = document.createElement("p");
        h.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
        textCell.appendChild(h);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href || "";
        a.textContent = title ? title.textContent.trim() : "Read more";
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-subnav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-corporate.js
  function parse2(element, { document }) {
    const imgEl = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const eyebrow = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector("h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title");
    const description = element.querySelector(".cmp-teaser__description");
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a"));
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (imgEl) {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.src = imgEl.src || "";
      img.alt = imgEl.alt || "";
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (eyebrow) textCell.appendChild(eyebrow);
    if (heading) textCell.appendChild(heading);
    if (description) {
      const descChildren = Array.from(description.children);
      descChildren.forEach((child) => textCell.appendChild(child));
    }
    ctaLinks.forEach((cta) => textCell.appendChild(cta));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-corporate", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-corporate.js
  function parse3(element, { document }) {
    const videoEl = element.querySelector("video source");
    const videoSrc = videoEl ? videoEl.getAttribute("src") : "";
    const posterImg = element.querySelector(".s7posterimage img, img.s7posterimage, video[poster]");
    const posterSrc = posterImg ? posterImg.src || posterImg.getAttribute("poster") || "" : "";
    const cells = [];
    const uriCell = document.createDocumentFragment();
    uriCell.appendChild(document.createComment(" field:uri "));
    if (videoSrc) {
      const a = document.createElement("a");
      a.href = videoSrc;
      a.textContent = videoSrc;
      uriCell.appendChild(a);
    } else {
      const anyVideo = element.querySelector("video");
      if (anyVideo && anyVideo.src) {
        const a = document.createElement("a");
        a.href = anyVideo.src;
        a.textContent = anyVideo.src;
        uriCell.appendChild(a);
      }
    }
    cells.push([uriCell]);
    const imgCell = document.createDocumentFragment();
    imgCell.appendChild(document.createComment(" field:placeholder_image "));
    if (posterSrc) {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.src = posterSrc;
      img.alt = posterImg ? posterImg.alt || "" : "";
      pic.appendChild(img);
      imgCell.appendChild(pic);
    }
    cells.push([imgCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "video-corporate", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-wayfinder.js
  function parse4(element, { document }) {
    if (element.dataset.columnsWayfinderProcessed) return;
    const gridParent = element.closest(".aem-Grid") || element.closest(".cmp-container") || element.parentElement;
    const allItems = gridParent ? Array.from(gridParent.querySelectorAll(".cmp-basicteaser--wayfinder")) : [element];
    allItems.forEach((item) => {
      item.dataset.columnsWayfinderProcessed = "true";
    });
    const row = [];
    allItems.forEach((item) => {
      const title = item.querySelector(".cmp-basicteaser__text, p.cmp-basicteaser__text");
      const description = item.querySelector(".cmp-basicteaser__description p, .cmp-basicteaser__description");
      const cell = document.createDocumentFragment();
      if (title) {
        const h = document.createElement("h3");
        h.textContent = title.textContent.trim();
        cell.appendChild(h);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        cell.appendChild(p);
      }
      row.push(cell);
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-wayfinder", cells });
    element.replaceWith(block);
    allItems.slice(1).forEach((item) => {
      const wrapper = item.closest(".aem-GridColumn") || item.parentElement;
      if (wrapper && wrapper !== gridParent) wrapper.remove();
    });
  }

  // tools/importer/parsers/carousel-stats.js
  function parse5(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    slides.forEach((slide) => {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      const statNumber = slide.querySelector(".cmp-title__text, h3");
      const statLabel = slide.querySelector(".cmp-text p");
      if (statNumber) {
        const h3 = document.createElement("h3");
        h3.textContent = statNumber.textContent.trim();
        textCell.appendChild(h3);
      }
      if (statLabel) {
        const p = document.createElement("p");
        p.textContent = statLabel.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-timeline.js
  function parse6(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    slides.forEach((slide) => {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      const texts = Array.from(slide.querySelectorAll(".cmp-text"));
      const yearText = texts[0];
      const descText = texts[1];
      if (yearText) {
        const yearP = yearText.querySelector("p");
        if (yearP) {
          const h3 = document.createElement("h3");
          h3.textContent = yearP.textContent.trim();
          textCell.appendChild(h3);
        }
      }
      if (descText) {
        const descP = descText.querySelector("p");
        if (descP) {
          const p = document.createElement("p");
          p.textContent = descP.textContent.trim();
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-timeline", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse7(element, { document }) {
    const heading = element.querySelector("h3.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title");
    const description = element.querySelector(".cmp-teaser__description");
    const ctaLink = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const imgEl = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const textCell = document.createDocumentFragment();
    if (heading) {
      const h3 = document.createElement("h3");
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }
    if (description) {
      const descP = description.querySelector("p");
      if (descP) {
        const p = document.createElement("p");
        p.textContent = descP.textContent.trim();
        textCell.appendChild(p);
      }
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href || "";
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }
    const imageCell = document.createDocumentFragment();
    if (imgEl) {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.src = imgEl.src || "";
      img.alt = imgEl.alt || "";
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }
    const cells = [[textCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/genpact-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".s7emaildialog",
        ".s7embeddialog",
        ".s7linkdialog",
        ".s7socialshare",
        ".s7controlbar",
        ".s7waiticon",
        ".s7iconeffect"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        ".cmp-experiencefragment--header0",
        ".cmp-experiencefragment--footer",
        ".breadcrumb",
        ".cmp-subnav__navigation",
        "link",
        "noscript",
        "iframe",
        "meta"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-link-accessibility-enabled");
        el.removeAttribute("data-cmp-link-accessibility-text");
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/genpact-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-about-page.js
  var parsers = {
    "cards-subnav": parse,
    "hero-corporate": parse2,
    "video-corporate": parse3,
    "columns-wayfinder": parse4,
    "carousel-stats": parse5,
    "carousel-timeline": parse6,
    "columns-promo": parse7
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "about-page",
    description: "About us page template with company overview and corporate information",
    urls: [
      "https://www.genpact.com/about-us"
    ],
    blocks: [
      {
        name: "cards-subnav",
        instances: [".cmp-subnav .cmp-list.cmp-subnav__list"]
      },
      {
        name: "hero-corporate",
        instances: [".cmp-teaser--50-50.cmp-teaser--simple-hero"]
      },
      {
        name: "video-corporate",
        instances: [".dynamicmedia.parbase"]
      },
      {
        name: "columns-wayfinder",
        instances: [".cmp-basicteaser--wayfinder"]
      },
      {
        name: "carousel-stats",
        instances: [".cmp-carousel--slide.cmp-carousel--actions-arrows"]
      },
      {
        name: "carousel-timeline",
        instances: [".cmp-carousel--timeline"]
      },
      {
        name: "columns-promo",
        instances: [".cmp-teaser--50-50:not(.cmp-teaser--simple-hero)"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: [".container.mb-section:has(.cmp-teaser--simple-hero)"],
        style: "dark",
        blocks: ["cards-subnav", "hero-corporate"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Body Text and Video",
        selector: [".cmp-container--background-gradient-fade-down:has(.cmp-text--size-l)"],
        style: "dark",
        blocks: ["video-corporate"],
        defaultContent: [".cmp-text--size-l"]
      },
      {
        id: "section-3",
        name: "Wayfinder Cards",
        selector: [".container.mb-xl:has(.cmp-basicteaser--wayfinder)"],
        style: "dark",
        blocks: ["columns-wayfinder"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Stats",
        selector: [".container.mb-section:has(.cmp-carousel--slide)"],
        style: "dark",
        blocks: ["carousel-stats"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Timeline",
        selector: [".container.mb-section:has(.cmp-carousel--timeline)"],
        style: "dark",
        blocks: ["carousel-timeline"],
        defaultContent: [".cmp-title--size-l", ".cmp-button--secondary-v2"]
      },
      {
        id: "section-6",
        name: "Genpact Intelligence",
        selector: [".container.mb-section:has(.cmp-teaser--50-50:not(.cmp-teaser--simple-hero))"],
        style: "dark",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Contact CTA",
        selector: [".cmp-container--background-gradient.cmp-container--background-gradient-right"],
        style: "gradient",
        blocks: [],
        defaultContent: [".cmp-title--bold", ".cmp-button--primary-v2"]
      }
    ]
  };
  var allTransformers = [
    ...transformers,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_about_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_about_page_exports);
})();
