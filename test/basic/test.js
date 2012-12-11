var gt = require('./sure');
var req = require('req-count');

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
});
