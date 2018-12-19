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
exports.getMonthFromAbbr = abbr => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(abbr);

/**
 * @description Return month 
 * @param {String} str 
 * @return {Number}
 */
exports.getMonth = str => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(str);

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

/**
 * @description Create date based on date string
 * @param {String} dateString 
 * @return {Date}
 * @example createDate('Jan 1, 2018 at 12:00 AM');
 */
exports.createDate = dateString => {
  const minute = Number(dateString.match(/\d{2}(?= [AP]M)/));
  const hour = dateString.match(/[APM]{2}/) === 'AM' ? Number(dateString.match(/\d{1,2}(?=:\d{2})/)) : Number(dateString.match(/\d{1,2}(?=:\d{2})/)) + 12;
  const day = Number(dateString.match(/\d{1,2}(?=, \d{4})/));
  const month = exports.getMonthFromAbbr(dateString.match(/\w{3}(?= {1,2}\d)/)[0]);
  const year = Number(dateString.match(/\d{4}(?= at )/));
  return new Date(year, month, day, hour, minute);
};