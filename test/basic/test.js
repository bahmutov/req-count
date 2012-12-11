var sure = require('../../node_modules/gt/sure.js');
var req = require('../../req-count');
var check = require('../../node_modules/check-types');

sure.init();

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
	gt.equal(typeof req.outbound, 'function', 'outbound exists');
});

gt.test('foo outbound', function () {
	var out = req.outbound('./foo');
	gt.ok(Array.isArray(out), 'returns an array');
	gt.equal(out.length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
	gt.equal(out[0].length, 1, "should be single element array, not " + JSON.stringify(out));
});

gt.test('bar outbound', function () {
	var out = req.outbound('./bar');
	gt.ok(Array.isArray(out), 'returns an array');
	gt.equal(out.length, 1, 'there should be nothing outbound, not ' + JSON.stringify(out));
	gt.equal(out[0].length, 0, "should be single empty array, not " + JSON.stringify(out));
});

gt.test('zoo outbound', function () {
	var out = req.outbound('./zoo');
	gt.ok(Array.isArray(out), 'returns an array');
	gt.equal(out.length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
});

gt.test('two outbound', function () {
	var out = req.outbound('./two');
	gt.ok(Array.isArray(out), 'returns an array');
	gt.equal(out.length, 1, 'there should be 2 outbound, not ' + JSON.stringify(out));
	gt.equal(out[0].length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('multiples do not count', function () {
	var out = req.outbound('./multiples');
	gt.ok(Array.isArray(out), 'returns an array');
	gt.equal(out.length, 1, 'there should be 1 outbound, not ' + JSON.stringify(out));
	gt.equal(out[0].length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('foo and bar outbound', function () {
	var out = req.outbound(['./foo', './bar']);
	gt.ok(Array.isArray(out), 'returns an array');
	gt.equal(out.length, 2, 'there should be two outbound, not ' + JSON.stringify(out));
	gt.equal(out[0].length, 1, "should be single element array, not " + JSON.stringify(out));
	gt.equal(out[1].length, 0, "should be empty array, not " + JSON.stringify(out));
});

sure.run();