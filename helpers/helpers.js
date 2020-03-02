/**
 * @fileoverview Miscellaneous helper modules
 * @author SardonyxApp
 * @license MIT
 */

const bcrypt = require('bcrypt');

/**
 * @description Create date based on date string
 * @param {String} dateString 
 * @param {Boolean} fullMonth
 * @returns {Date}
 * @example createDate('Jan 1, 2018 at 12:00 AM');
 * @example createDate('December 14, 2018 2:40 PM', true);
 */
exports.createDate = (dateString, fullMonth = false) => {
  // If hour is 12 AM or PM, convert to 0 AM or 0 PM for accurate processing
  let h = dateString.match(/\d{1,2}(?=:\d{2})/)[0];
  h = h % 12 === 0 ? 0 : h;

  const minute = dateString.match(/\d{2}(?= [AP]M)/)[0];
  const hour = dateString.match(/[AP]M/)[0] === 'PM' ? Number(h) + 12 : Number(h);
  const day = dateString.match(/\d{1,2}(?=, \d{4})/)[0];
  const month = fullMonth ? exports.getMonth(dateString.match(/\w+(?= \d)/)[0]) : exports.getMonthFromAbbr(dateString.match(/\w{3}(?= {1,2}\d)/)[0]);
  const year = dateString.match(/\d{4}/)[0];
  return new Date(Date.UTC(year, month, day, hour, minute) - 32400000);
};

/**
 * @description Create a plain text version for display from html 
 * @param {String} html 
 * @returns {String}
 */
exports.toPlainText = html => (
  html
    .replace(/<(?:div|p|h[1-6]|li|br ?\/?)*?>/gm, '\n')
    .replace(/<(?:.*?)*?>/gm, '')
    .replace('\n', '') // Eliminate first \n if it exists 
);

/**
 * @description Return the matched numbers at the end of a string 
 * @param {String} str 
 * @returns {Number} 
 */
exports.matchNumbers = str => {
  if (!str) return null;
  const matchObj = str.match(/\d+$/);
  if (matchObj === null) return null;
  return Number(matchObj[0]);
}

/**
 * @description Generate a hash for password using bcrypt
 * @param password
 * Output for console 
 */
exports.hashPassword = password => {
  bcrypt.hash(password, 12, (err, res) => console.log(res));
};