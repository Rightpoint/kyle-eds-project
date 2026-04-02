/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: genpact cleanup.
 * Selectors from captured DOM of https://www.genpact.com/about-us
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (found: #onetrust-consent-sdk, #onetrust-banner-sdk, #onetrust-pc-sdk)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Dynamic Media share dialogs and video controls (found: .s7emaildialog, .s7embeddialog, .s7linkdialog)
    WebImporter.DOMUtils.remove(element, [
      '.s7emaildialog',
      '.s7embeddialog',
      '.s7linkdialog',
      '.s7socialshare',
      '.s7controlbar',
      '.s7waiticon',
      '.s7iconeffect',
    ]);
  }

  if (hookName === H.after) {
    // Non-authorable content: header, footer, breadcrumb, subnav navigation buttons
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      '.cmp-experiencefragment--header0',
      '.cmp-experiencefragment--footer',
      '.breadcrumb',
      '.cmp-subnav__navigation',
      'link',
      'noscript',
      'iframe',
      'meta',
    ]);

    // Remove tracking/data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-link-accessibility-enabled');
      el.removeAttribute('data-cmp-link-accessibility-text');
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
