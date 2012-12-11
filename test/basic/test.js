var sure = require('../../node_modules/gt/sure.js');
var req = require('../../req-count');

sure.init();

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
	gt.equal(typeof req.outbound, 'function', 'outbound exists');
});

gt.test('foo outbound', function () {
	var out = req.outbound('./foo');
	gt.equal(typeof out, 'object', 'returns an object');
	gt.equal(Object.keys(out).length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
});

gt.test('bar outbound', function () {
	var out = req.outbound('./bar');
	gt.equal(typeof out, 'object', 'returns an object');
	gt.equal(Object.keys(out).length, 0, 'there should be nothing outbound, not ' + JSON.stringify(out));
});

gt.test('zoo outbound', function () {
	var out = req.outbound('./zoo');
	gt.equal(typeof out, 'object', 'returns an object');
	gt.equal(Object.keys(out).length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
});

gt.test('two outbound', function () {
	var out = req.outbound('./two');
	gt.equal(typeof out, 'object', 'returns an object');
	gt.equal(Object.keys(out).length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('multiples do not count', function () {
	var out = req.outbound('./multiples');
	gt.equal(typeof out, 'object', 'returns an object');
	gt.equal(Object.keys(out).length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

sure.run();