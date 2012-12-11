var sure = require('../../node_modules/gt/sure.js');
var req = require('../../req-count');

sure.init();

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
});

sure.run();