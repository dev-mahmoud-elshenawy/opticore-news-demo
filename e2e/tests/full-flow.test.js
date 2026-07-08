/* global device, element, by, waitFor */
const { TIMEOUT, tapTab, waitVisible, waitGone } = require('../support/helpers');

// One continuous user journey through every screen in a single app session.
// Kept as one file on purpose: Detox resets its connection BETWEEN test files,
// so a single file is the only way to genuinely share one running app across
// the whole flow. Blocks run top-to-bottom (maxWorkers:1) and each step leaves
// the app in the state the next step expects.
//
// Two navigation invariants keep the shared session healthy:
//   1. Never tap a tab while on the article-detail screen — it's a stacked
//      route pushed OVER the tab bar, so the tabs aren't on screen there. Leave
//      detail only by tapping the save toggle or by relaunching.
//   2. Settings runs before Search, because Search leaves the keyboard up and it
//      would cover the bottom tab bar for whatever ran next. Search is last.
//
// Live newsapi.org data — assert structure/behaviour, never specific article text.

const COUNTRY_ERROR = 'Use a 2-letter country code (e.g. us, gb)';
const SAVED_EMPTY = 'No saved articles yet.';
const SEARCH_HINT = 'Search for news by keyword.';
const CATEGORY_SCROLL_STEP = 200; // px per swipe when hunting a chip in the filter

// The first article card in whichever list is on screen (headlines/search/saved).
const firstCard = () => element(by.id('article-card')).atIndex(0);
const countryField = () => element(by.id('settings-country'));
const saveToggle = () => element(by.id('article-save-toggle'));

// Scroll a category chip into view within the horizontal filter, then tap it.
// `direction` is 'right' for chips later in the list, 'left' for earlier ones.
async function selectCategory(category, direction) {
  const chip = element(by.id(`category-chip-${category}`));
  await waitFor(chip).toBeVisible().whileElement(by.id('category-scroll')).scroll(CATEGORY_SCROLL_STEP, direction);
  await chip.tap();
}

describe('Full app flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, delete: true }); // clean slate, one cold boot
  });

  describe('Headlines', () => {
    it('loads a list of article cards', async () => {
      await waitVisible(firstCard(), TIMEOUT.cold);
    });

    it('filters by the Technology category', async () => {
      await selectCategory('technology', 'right');
      await waitVisible(firstCard());
    });

    it('resets to the General category', async () => {
      await selectCategory('general', 'left');
      await waitVisible(firstCard());
    });
  });

  describe('Bookmarking', () => {
    it('starts with an empty Saved list', async () => {
      await tapTab('saved');
      await waitVisible(element(by.text(SAVED_EMPTY)));
    });

    it('bookmarks an article from its detail view', async () => {
      await tapTab('headlines');
      await waitVisible(firstCard());
      await firstCard().tap(); // → article detail (over the tabs)
      await waitVisible(saveToggle());
      await saveToggle().tap();
      await waitVisible(element(by.text('★ Saved')));
    });

    it('persists the bookmark across an app restart', async () => {
      await device.launchApp({ newInstance: true }); // fresh process, storage kept → back on tabs
      await tapTab('saved');
      await waitVisible(firstCard());
    });

    it('removes the bookmark and the list is empty again', async () => {
      await firstCard().tap(); // → detail of the saved article
      await waitVisible(saveToggle());
      await saveToggle().tap();
      await waitVisible(element(by.text('☆ Save')));
      await device.launchApp({ newInstance: true }); // back to tabs, removal persisted
      await tapTab('saved');
      await waitVisible(element(by.text(SAVED_EMPTY)));
    });
  });

  describe('Settings', () => {
    beforeAll(async () => {
      await tapTab('settings');
    });

    it('switches theme mode', async () => {
      await waitVisible(element(by.id('theme-mode-dark')));
      await element(by.id('theme-mode-dark')).tap();
      await element(by.id('theme-mode-light')).tap();
      await element(by.id('theme-mode-system')).tap();
      await waitVisible(element(by.id('settings-save')));
    });

    // Note: no "invalid country code" test. The country field is RHF-controlled — React
    // re-asserts the controlled `value` before RHF's async setValue()→watch() update lands,
    // so Detox (typeText and replaceText alike) can't get text to stick and an invalid value
    // can never be entered — there's no reliable way to drive this field's validation via e2e.
    it('saves valid preferences', async () => {
      // replaceText can't change the value (see note above), so this saves the valid default
      // preferences; the call still fires onChangeText → validation → enables the Save button.
      await countryField().replaceText('gb');
      await countryField().tapReturnKey(); // dismiss keyboard so the Save button isn't covered
      await waitGone(element(by.text(COUNTRY_ERROR)));
      // "Saved ✓" reverts to "Save" after a 1.5s timer in the hook. Detox waits
      // for that timer to drain before it considers the app idle — by which time
      // the label is already gone. Disable idle-sync so we can catch the flash.
      await device.disableSynchronization();
      await element(by.id('settings-save')).tap();
      await waitVisible(element(by.text('Saved ✓')));
      await device.enableSynchronization();
    });
  });

  // Last on purpose: Search leaves the keyboard up, which would cover the tab
  // bar for any section that ran after it.
  describe('Search', () => {
    beforeAll(async () => {
      await tapTab('search');
    });

    it('shows the initial hint', async () => {
      await waitVisible(element(by.text(SEARCH_HINT)));
    });

    it('returns results for a query', async () => {
      await element(by.id('search-input')).typeText('bitcoin');
      await waitVisible(firstCard(), TIMEOUT.cold);
    });

    it('clears back to the hint when the query is emptied', async () => {
      await element(by.id('search-input')).clearText();
      await waitVisible(element(by.text(SEARCH_HINT)));
    });
  });
});
