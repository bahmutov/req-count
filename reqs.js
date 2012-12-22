var path = require('path');

// grab command line arguments
(function() {
	var optimist = require("optimist");
	args = optimist.usage("Find first level dependencies from js file.\nUsage: $0")
			.default({
				amd: false,
				help: 0,
				output: '',
				input: [],
				color: true,
				sort: 2
			}).alias('h', 'help').alias('o', 'output').alias('i', 'input')
			.boolean("amd")
			.string('output')
			.boolean('color')
			.describe('amd', 'look for AMD style define calls')
			.describe('output', 'output json filename')
			.describe('input', 'list of input files / patterns')
			.describe('color', 'use terminal colors in the output')
			.describe('sort', 'sort results by column, use ! to reverse the order')
			.argv;

	if (!module.parent) {
		if (args.h || args.help) {
			optimist.showHelp();
			console.log('current arguments\n', args);
			process.exit(0);
		}
	}

	if (args.input && !Array.isArray(args.input)) {
		args.input = [args.input];
	}

	
	if (!args.input || !Array.isArray(args.input) || !args.input.length) {
		optimist.showHelp();
		console.log('missing input files');
		console.log('current arguments\n', args);
		process.exit(0);
	}
}());

var req = require('./req-count');
req.init(args);

var fullModules = [];

var glob = require("glob");
args.input.forEach(function (shortName) {
	// console.log('looking for matches for', shortName);
	var files = glob.sync(shortName);
	// console.log('for', shortName, 'found matching', files);
	fullModules = fullModules.concat(files);
});

fullModules = fullModules.map(function (shortName) {
	return path.resolve(shortName);
});

//console.log(fullModules);
// process.exit(0);

var reqs = req.outbound(fullModules);
console.assert(reqs, 'could not get outbound reqs');
// console.log(JSON.stringify(reqs, null, 2));

var counter = require('./src/count');
// var moduleCounts = counter.reqCount(reqs);
var moduleMetrics = counter.reqMetrics(reqs);
console.assert(moduleMetrics, 'could not get module metrics');

var str = JSON.stringify(moduleMetrics, null, 2);
console.log(str);

var metrics = [];
Object.keys(moduleMetrics).forEach(function (item) {
	var reqs = moduleMetrics[item];
	metrics.push([
		reqs.path,
		reqs.connections.length,
		reqs.distance
	]);
});

var reporter = require('./reporter');
reporter.writeReportTables({
	titles: ['filename', 'depends', 'score'],
	metrics: metrics,
	filename: args.output,
	colors: args.colors
});

/*
if (args.output) {
	var fs = require('fs');
	fs.writeFileSync(args.output, str, 'utf8');
	console.log('saved requirements to', args.output);
}
*/