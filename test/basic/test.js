var sure = require('../../node_modules/gt/sure.js');
var req = require('../../req-count');

sure.init();

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
	gt.equal(typeof req.outbound, 'function', 'outbound exists');
});

gt.test('get outbound', function () {
	var out = req.outbound('./foo');
	gt.equal(typeof out, 'object', 'returns an object');
	gt.equal(Object.keys(out).length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
});

sure.run();