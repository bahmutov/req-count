var sure = require('../node_modules/gt/sure.js');
var req = require('../src/req-count');
var check = require('../node_modules/check-types');

sure.init({
	report: 1
});

req.init({
	amd: true
});

gt.module('watch');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
	gt.equal(typeof req.outbound, 'function', 'outbound exists');
});

gt.test('foo outbound', function () {
	var out = req.outbound('watch/foo');
	gt.ok(out, 'returns an object');
	gt.equal(Object.keys(out).length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./foo'].length, 1, "should be single element array, not " + JSON.stringify(out));
});

gt.test('bar outbound', function () {
	var out = req.outbound('watch/bar');
	gt.equal(Object.keys(out).length, 1, 'there should be nothing outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./bar'].length, 0, "should be single empty array, not " + JSON.stringify(out));
});

sure.run();