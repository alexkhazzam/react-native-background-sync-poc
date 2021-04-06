const fs = require('fs');

module.exports.readFile = (path, cb) => {
  fs.readFile(path, 'utf-8', (e, data) => {
    if (data) {
      cb(data);
    } else {
      console.log(e);
      throw e;
    }
  });
};
