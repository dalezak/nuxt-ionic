/**
 * Returns true when there are likely more pages to load.
 * Logic: items were returned AND the count is not an exact multiple of limit
 * (i.e. the last page was partial), meaning we've gone past the first page.
 * Use to decide whether to show a "Load More" button after an `onMore` fetch.
 * Note: grid-cards and list-cards components handle the initial Load More button
 * visibility themselves using `count % limit == 0`; this util is for post-load checks.
 * @param {Array} items - The currently loaded items array.
 * @param {number} limit - The page size used for fetching.
 * @returns {boolean}
 * @example
 * const showLoadMore = hasMore(items, state.limit);
 */
export default function (items, limit) {
  if (process.client) {
    return items && items.length > 0 && (items.length >= limit && items.length % limit > 0);
  }
  return false;
}