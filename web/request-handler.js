var path = require('path');
var archive = require('../helpers/archive-helpers');

var url = require('url');
var helpers = require('./http-helpers');

var actions = {
  'GET': function(request, response) {
    var urlPath = url.parse(request.url).pathname;

    if (urlPath === '/') { urlPath = '/index.html'; }

    helpers.serveAssets(response, urlPath, function() {
      if (urlPath[0] === '/') { urlPath = urlPath.slice(1); }

      archive.isUrlInList(urlPath, function(found) {
        if (found) {
          helpers.sendRedirect(response, '/loading.html');
        } else {
          helpers.send404(response);
        }
      });
    });
  },
  'POST': function(request, response) {
    helpers.collectData(request, function(data) {
      var url = data.split('=')[1].replace('http://', '');
      archive.isUrlInList(url, function(found) {
        if (found) { // found site
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              helpers.sendRedirect(response, '/' + url);
            } else {
              helpers.sendRedirect(response, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            helpers.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var handler = actions[req.method];
  if (handler) {
    handler(req, res);
  } else {
    helpers.send404(response);
  }
};
