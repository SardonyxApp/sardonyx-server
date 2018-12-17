/**
 * @fileoverview Miscellaneous helper functions
 * @author SardonyxApp
 * @license MIT
 */

/**
 * @description Return month from abbreviation
 * @param {String} abbr
 * @return {Number}
 */
exports.getMonth = abbr => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(abbr);

/**
 * @description Guess a future year based on the month
 * @param {Number} monthIndex 
 * @return {Number}
 */
exports.guessFutureYear = monthIndex => monthIndex < new Date().getMonth() ? new Date().getFullYear() + 1 : new Date().getFullYear();
// Not going to be correct for dates that are two or more years ahead.

/**
 * @description Guess a past year based on the month
 * @param {Number} monthIndex 
 * @return {Number}
 */
exports.guessPastYear = monthIndex => monthIndex <= new Date().getMonth() ? new Date().getFullYear() : new Date().getFullYear() + 1;
// Not going to be correct for dates two or more years ago