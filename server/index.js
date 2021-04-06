const Express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const writeFile = require('./util/writeFile');
const readFile = require('./util/readFile');
const genRecords = require('./util/generateRecords');

const app = Express();

dotenv.config({ path: 'dotenv.config.env' });

writeFile.writeFile(
  genRecords.genRecords(),
  path.join(__dirname, './data', 'records.json')
);

app.use('/getData', (req, res, next) => {
  let numberOfRecords = req.query.numberOfRecords || 200;
  const additionalTimeout = req.query.additionalTimeout || 0;

  if (numberOfRecords > 200) {
    numberOfRecords = 200;
  }

  setTimeout(() => {
    readFile.readFile(path.join(__dirname, './data', 'records.json'), (cb) => {
      cb = JSON.parse(cb);

      for (const item in cb) {
        if (cb[item].index.toString() === numberOfRecords) {
          cb = cb.slice(0, numberOfRecords);
          break;
        }
      }
      res.send(cb);
    });
  }, additionalTimeout);
});

app.use('/', (req, res, next) => {
  res.redirect('/getData');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`);
});
