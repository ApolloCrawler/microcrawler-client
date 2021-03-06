'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _phantom = require('phantom');

var _phantom2 = _interopRequireDefault(_phantom);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhantomFetcher = function () {
  function PhantomFetcher() {
    _classCallCheck(this, PhantomFetcher);
  }

  _createClass(PhantomFetcher, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      if (this.instance && this.page) {
        return Promise.resolve(this.page);
      }

      _Logger2.default.info('Creating new PhantomJS instance');
      return _phantom2.default.create().then(function (instance) {
        _this.instance = instance;

        return instance.createPage();
      }).then(function (page) {
        _this.page = page;

        // page.on('onResourceRequested', (requestData) => {
        //   console.info('Requesting', requestData.url);
        // });
      });
    }
  }, {
    key: 'get',
    value: function get(url) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.page.property('onError', function (msg) {
          reject(msg);
        });

        _this2.page.open(url).then(function () /* status */{
          // console.log(status);
          return _this2.page.property('content');
        }, function (err) {
          reject(err);
        }).then(function (content) {
          // console.log(content);

          _this2.page.evaluate(function () {
            return document.location;
          }).then(function (location) {
            resolve({
              text: content,
              location: location
            });
          }).catch(function (err) {
            reject(err);
          });
        });
      });
    }
  }]);

  return PhantomFetcher;
}();

exports.default = PhantomFetcher;