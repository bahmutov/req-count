var sure = require('../node_modules/gt/sure.js');
var req = require('../src/req-count');
var check = require('../node_modules/check-types');

sure.init({
	report: 1
});

req.init({
	amd: false
});

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
	gt.equal(typeof req.outbound, 'function', 'outbound exists');
});

gt.test('foo outbound', function () {
	var out = req.outbound('basic/foo');
	gt.ok(out, 'returns an object');
	gt.equal(Object.keys(out).length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./foo'].length, 1, "should be single element array, not " + JSON.stringify(out));
});

gt.test('bar outbound', function () {
	var out = req.outbound('basic/bar');
	gt.equal(Object.keys(out).length, 1, 'there should be nothing outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./bar'].length, 0, "should be single empty array, not " + JSON.stringify(out));
});

gt.test('zoo outbound', function () {
	var out = req.outbound('basic/zoo');
	gt.ok(out, 'could not get result');
	// gt.equal(out['./zoo'].length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
});

gt.test('two outbound', function () {
	var out = req.outbound('basic/two');
	gt.equal(Object.keys(out).length, 1, 'there should be 2 outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./two'].length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('multiples do not count', function () {
	var out = req.outbound('basic/multiples');
	gt.equal(Object.keys(out).length, 1, 'there should be 1 outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./multiples'].length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('foo and bar outbound', function () {
	var out = req.outbound(['basic/foo', 'basic/bar']);
	gt.equal(Object.keys(out).length, 2, 'there should be two outbound, not ' + JSON.stringify(out));
	// gt.equal(out['./foo'].length, 1, "should be single element array, not " + JSON.stringify(out));
	// gt.equal(out['./bar'].length, 0, "should be empty array, not " + JSON.stringify(out));
});

gt.test('uniques', function () {
	var out = req.outbound(['basic/foo', 'basic/foo', 'basic/foo']);
	gt.equal(Object.keys(out).length, 1, '3 identical module names collapsed to 1');
})

sure.run();