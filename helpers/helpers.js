/**
 * @fileoverview Miscellaneous helper modules
 * @author SardonyxApp
 * @license MIT
 */

/**
 * @description Return month index from abbreviation
 * @param {String} abbr
 * @returns {Number}
 */
exports.getMonthFromAbbr = abbr => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(abbr);

/**
 * @description Return month index from full month name
 * @param {String} str 
 * @returns {Number}
 */
exports.getMonth = str => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(str);

/**
 * @description Guess a future year based on the month
 * @param {Number} monthIndex 
 * @returns {Number}
 */
exports.guessFutureYear = monthIndex => monthIndex < new Date().getMonth() ? new Date().getFullYear() + 1 : new Date().getFullYear();
// Not going to be correct for dates that are two or more years ahead.

/**
 * @description Guess a past year based on the month
 * @param {Number} monthIndex 
 * @returns {Number}
 */
exports.guessPastYear = monthIndex => monthIndex <= new Date().getMonth() ? new Date().getFullYear() : new Date().getFullYear() - 1;
// Not going to be correct for dates two or more years ago

/**
 * @description Create date based on date string
 * @param {String} dateString 
 * @param {Boolean} fullMonth
 * @returns {Date}
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
 * @description Reformat Sardonyx url to Managebac url 
 * @param {String} url 
 * @returns {String }
 */
exports.toManagebacUrl = url => {
  if (!url) return;
  url = url
    .split('/')
    .slice(2); // remove the first two elements of: ['', 'api', 'class', ...]
  
  if (url[4] === 'reply') url[4] = 'replies';

  if (url[2] === 'messages') url[2] = 'discussions';
  if (url[2] === 'overview') url.splice(2, 1);
  
  if (url[0] === 'class') url[0] = 'classes';
  if (url[0] === 'group') url[0] = 'groups';
  if (url[0] === 'notification') url[0] = 'notifications';
  if (url[0] === 'cas') url[0] = 'ib/activity/cas';
  if (url[0] === 'event') url[0] = 'ib/events';
  if (url[0] === 'dashboard') url = [];

  return '/student' + (url.length ? '/' : '') + url.join('/'); // Only include second / if the path is not empty 
}

/**
 * @description End request with 200 OK
 * @param {Object} req 
 * @param {Object} res 
 */
exports.end200 = (req, res) => {
  res.status(200).end();
};

/**
 * @description Hash a password with sha512 
 * @param {String} password 
 * @param {String} salt (optional)
 * @returns {Object} containing hashed password sand salt 
 */
exports.hashPassword = (password, salt) => {
  const crypto = require('crypto');

  // Generate a random bit sequence to use as salt if salt is not provided
  if (!salt) salt = crypto.randomBytes(64).toString('hex');

  // Create a hash based on salt
  const hmac = crypto.createHmac('sha512', salt);
  hmac.update(password);
  const password_digest = hmac.digest('hex');

  return { password_digest, salt };
};