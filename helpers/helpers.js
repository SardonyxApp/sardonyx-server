/**
 * @fileoverview Miscellaneous helper functions
 * @author SardonyxApp
 * @license MIT
 */

/**
 * @description returns month from abbreviation
 * @param {String} abbr
 * @return {Number}
 */
exports.getMonth = abbr => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(abbr);

/**
 * @description guesses year 
 * @param {Number} monthIndex 
 * @return {Number}
 */
exports.guessYear = monthIndex => monthIndex < new Date().getMonth() ? new Date().getFullYear() + 1 : new Date().getFullYear();
// Not going to be correct for dates that are two or more years ahead.