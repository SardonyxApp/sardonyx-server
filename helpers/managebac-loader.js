/**
 * @fileoverview Upload user's relevant Manangebac assignments to tasklist database 
 * @author SardonyxApp
 * @license MIT 
 */

const cheerio = require('cheerio');
const request = require('request');

const parser = require('./parsers');
const tasks = require('../models/tasks');
const { subjects, categories } = require('../models/labels');
const { toManagebacUrl } = require('./helpers');

/**
 * @param tokens Managebac credentials 
 * @param tokens.cfduid 
 * @param tokens.mangebacSession
 * @param tokens.tasklist 
 * @param document Dashboard page HTML document 
 */
module.exports = async (tokens, document) => {
  // Set cookies 
  const j = request.jar();  
  j.setCookie(request.cookie(tokens.cfduid), 'https://kokusaiib.managebac.com');
  j.setCookie(request.cookie(tokens.managebacSession), 'https://kokusaiib.managebac.com');

  // Load destinations 
  const deadlines = parser.parseDeadlines(document);

  Promise.all([
    // Load database info 
    tasks.selectAllFuture(),
    subjects.selectAll(),
    categories.selectAll()
  ]).then(results => {
    const assignments = results[0];
    const subjects = results[1];
    const categories = results[2];

    deadlines.forEach(assignment => {
      assignment.link = 'https://kokusaiib.managebac.com' + toManagebacUrl(assignment.link);
      // Check if a new task should be created 
      if (!assignments.map(a => a.managebac).includes(assignment.link)) {
        // Load details 
        request({
          url: assignment.link,
          followAllRedirects: true,
          jar: j
        }, (err, response) => {
          if (err) return console.error(err);
          
          const $ = cheerio.load(response.body);

          // Parse the description 
          let description = $('label:contains("Details")').next().html(); // For now, since text() omits line breaks
          description = description ? description.replace(/<(?:.|\n)*?>/gm, '\n') : '';
          description += '\nThis task was automatically created by Sardonyx based on Managebac. \nSee on Managebac: ' + assignment.link;

          // Determine the subject label 
          let subject = subjects.find(s => assignment.link.match(/^https:\/\/kokusaiib\.managebac\.com\/student\/(classes\/\d{1,}|groups\/\d{1,}|ib\/events)/)[0] === s.managebac);
          subject = subject ? subject.id : null;

          // Determine category label 
          let category = assignment.labels[assignment.labels.length - 1]; // Select the last label
          category = category === 'Summative' || category === 'Formative' ? null : categories.find(c => c.name === category);
          category = category ? category.id || null : null;

          // Create the database entry 
          tasks.create({
            name: decodeURIComponent(assignment.title),
            description,
            due: assignment.due,
            tasklist_id: tokens.tasklist,
            subject_id: subject,
            category_id: category,
            managebac: assignment.link
          });
        });
      }
    });
  });
}