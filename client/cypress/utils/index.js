/**
 * Create selector for data-test attribute value
 * @param {String} selectorValue - Value of selector
 * @return {String} String containing selector and value
 */
export function createSelector(selectorValue) {
  return `[data-test=${selectorValue}]`;
}
