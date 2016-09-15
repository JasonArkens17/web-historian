var fs = require('fs');

module.exports = function (basePath) {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  if (!fs.existsSync(basePath + '/sites.txt')) {
    var file = fs.openSync(basePath + '/sites.txt', 'w');
    fs.closeSync(file);
  }

  if (!fs.existsSync(basePath + '/sites')) {
    fs.mkdirSync(basePath + '/sites');
  }
};
