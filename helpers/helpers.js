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
 * @param {Boolean} fullMonth
 * @return {Date}
 * @example createDate('Jan 1, 2018 at 12:00 AM');
 * @example createDate('December 14, 2018 2:40 PM', true);
 */
exports.createDate = (dateString, fullMonth = false) => {
  const minute = dateString.match(/\d{2}(?= [AP]M)/);
  const hour = dateString.match(/[AP]M/) === 'AM' ? dateString.match(/\d{1,2}(?=:\d{2})/) : Number(dateString.match(/\d{1,2}(?=:\d{2})/)) + 12;
  const day = dateString.match(/\d{1,2}(?=, \d{4})/);
  const month = fullMonth ? exports.getMonth(dateString.match(/\w+(?= \d)/)[0]) : exports.getMonthFromAbbr(dateString.match(/\w{3}(?= {1,2}\d)/)[0]);
  const year = dateString.match(/\d{4}/);
  return new Date(year, month, day, hour, minute);
};

/**
 * @description End request with 200 OK
 * @param {Object} req 
 * @param {Object} res 
 */
exports.end200 = (req, res) => {
  res.status(200).end();
};