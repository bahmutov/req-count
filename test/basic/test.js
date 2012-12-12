var sure = require('../../node_modules/gt/sure.js');
var req = require('../../req-count');
var check = require('../../node_modules/check-types');

sure.init({
	report: 1
});

gt.module('basic tests');
gt.test('basic', function () {
	gt.equal(typeof req, 'object', 'req-count module exists');
	gt.equal(typeof req.outbound, 'function', 'outbound exists');
});

gt.test('foo outbound', function () {
	var out = req.outbound('./foo');
	gt.ok(out, 'returns an object');
	gt.equal(Object.keys(out).length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
	gt.equal(out['./foo'].length, 1, "should be single element array, not " + JSON.stringify(out));
});

gt.test('bar outbound', function () {
	var out = req.outbound('./bar');
	gt.equal(Object.keys(out).length, 1, 'there should be nothing outbound, not ' + JSON.stringify(out));
	gt.equal(out['./bar'].length, 0, "should be single empty array, not " + JSON.stringify(out));
});

gt.test('zoo outbound', function () {
	var out = req.outbound('./zoo');
	gt.equal(out['./zoo'].length, 1, 'there should be single outbound, not ' + JSON.stringify(out));
});

gt.test('two outbound', function () {
	var out = req.outbound('./two');
	gt.equal(Object.keys(out).length, 1, 'there should be 2 outbound, not ' + JSON.stringify(out));
	gt.equal(out['./two'].length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('multiples do not count', function () {
	var out = req.outbound('./multiples');
	gt.equal(Object.keys(out).length, 1, 'there should be 1 outbound, not ' + JSON.stringify(out));
	gt.equal(out['./multiples'].length, 2, 'there should be 2 outbound, not ' + JSON.stringify(out));
});

gt.test('foo and bar outbound', function () {
	var out = req.outbound(['./foo', './bar']);
	gt.equal(Object.keys(out).length, 2, 'there should be two outbound, not ' + JSON.stringify(out));
	gt.equal(out['./foo'].length, 1, "should be single element array, not " + JSON.stringify(out));
	gt.equal(out['./bar'].length, 0, "should be empty array, not " + JSON.stringify(out));
});

gt.test('uniques', function () {
	var out = req.outbound(['./foo', './foo', './foo']);
	gt.equal(Object.keys(out).length, 1, '3 identical module names collapsed to 1');
})

sure.run();