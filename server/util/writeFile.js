const fs = require('fs');

module.exports.writeFile = (data, path) => {
  fs.writeFile(path, JSON.stringify(data), (e) => {
    if (e) {
      console.log(e);
      throw e;
    }
    console.log('Files Written Successfully...');
  });
};
