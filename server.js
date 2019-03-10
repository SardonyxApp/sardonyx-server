const app = require('./app');
const db = require('./db');

db.connect(err => {
  if (err) {
    console.error('Unable to connect to MySQL. ' + err);
    process.exit(1);
  }
  
  const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});