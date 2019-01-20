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
 * @description Convert Managebac url to Sardonyx API url
 * @param {String} url
 * @returns {String} 
 */
exports.toSardonyxUrl = url => {
  if (!url) return;
  url = url
    .replace(/^https:\/\/managebac\.com/, '') // If full url, cut the domain
    .replace(/\/student\/?/, '') // Cut student 
    .split('/');

  for (let i = 0; i < url.length; i++) { // doing this with an array prototype method will sacrifice simplicity 
    if (i === 0) continue;
    // if current and previous element is not an id (integer), join them together
    if (isNaN(Number(url[i])) && isNaN(Number(url[i - 1]))) {
      url[i] = url[i - 1] + '/' + url[i];
      url[i - 1] = null; // Return null to filter them out later 
    }
  }

  url = url.filter(val => val !== null);
  
  // Process resource type 
  if (url[0] === 'classes') url[0] = 'class';
  if (url[0] === 'groups') url[0] = 'group';
  if (url[0] === 'notifications') url[0] = 'notification';
  if (url[0] === 'ib/activity/cas') url[0] = 'cas';
  if (url[0] === 'ib/events') url[0] = 'event';
  if (!url[0]) url[0] = 'dashboard';

  // Process subresource type 
  if (url[2] === 'discussions') url[2] = 'messages';
  if (!url[2] && url[1] && url[0] !== 'event') url[2] = 'overview'; // Temporary solution 
  
  // Process subitem type 
  if (url[4] === 'replies') url[4] = 'reply';

  // More will be added later as API is developed...

  // Prepend /api
  url.unshift('/api');

  return url.join('/');
};

/**
 * @description End request with 200 OK
 * @param {Object} req 
 * @param {Object} res 
 */
exports.end200 = (req, res) => {
  res.status(200).end();
};