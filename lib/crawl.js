'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = crawl;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function crawl(fetcher, crawlers, payload) {
  var parts = (payload.crawler || payload.processor).split('/');
  var crawlerName = parts[0].replace('microcrawler-crawler-', '');
  var processorName = parts[1] || 'index';

  return new Promise(function (resolve, reject) {
    var crawler = crawlers[crawlerName];
    if (!crawler) {
      var msg = 'Unable to find crawler named: \'' + crawlerName + '\'';
      console.log(msg);

      return reject({
        error: msg
      });
    }

    var processor = crawler.processors && crawler.processors[processorName];
    if (!processor) {
      var _msg = 'Unable to find processor named: \'' + processorName + '\'';
      console.log(_msg);

      return reject({
        error: _msg
      });
    }

    return fetcher.initialize().then(function () {
      fetcher.get(payload.url).then(function (result) {
        var text = result.text;
        var doc = _cheerio2.default.load(text);

        var response = {
          request: payload,
          results: processor(doc, payload)
        };

        console.log(JSON.stringify(response, null, 4));

        return resolve(response);
      }, function (err) {
        return reject({
          error: err
        });
      });
    });
  });
}