var path = require('path');
var fs = require('fs');

var args = require('./src/arguments').run();

var req = require('./src/req-count');
req.init(args);

function discoverSourceFiles() {
	var glob = require("glob");

	var filenames = [];
	args.input.forEach(function (shortName) {
		var files = glob.sync(shortName);
		filenames = filenames.concat(files);
	});

	filenames = filenames.map(function (shortName) {
		return path.resolve(shortName);
	});
	return filenames;
}

var fullModules = discoverSourceFiles();
console.assert(Array.isArray(fullModules), 'could not discover source files');

function filterNonExistingFiles(filenames) {
	console.assert(Array.isArray(filenames), 'expected an array of filenames');
	var result = filenames.filter(function (filename) {
		return fs.existsSync(filename);
	});
	return result;
}

function reportDependencies(fullModules) {
	console.assert(Array.isArray(fullModules), 'expected an array of filenames');
	fullModules = filterNonExistingFiles(fullModules);
	// console.log(fullModules);
	// process.exit(0);

	var reqs = req.outbound(fullModules);
	console.assert(reqs, 'could not get outbound reqs');
	// console.log(JSON.stringify(reqs, null, 2));

	var counter = require('./src/count');
	// var moduleCounts = counter.reqCount(reqs);
	var moduleMetrics = counter.reqMetrics(reqs);
	console.assert(moduleMetrics, 'could not get module metrics');

	var str = JSON.stringify(moduleMetrics, null, 2);
	if (args.json) {
		fs.writeFileSync(args.json, str, 'utf8');
		console.log('saved json report to', args.json);
	}
	// console.log(str);


	// write detailed report table to a file/console
	var metrics = [];
	Object.keys(moduleMetrics).forEach(function (item) {
		var reqs = moduleMetrics[item];
		metrics.push([
			reqs.path,
			reqs.connections.length,
			reqs.distance
		]);
	});

	var reporter = require('./src/reporter');
	reporter.writeReportTables({
		titles: ['filename', 'depends', 'score'],
		metrics: metrics,
		filename: args.output,
		colors: args.colors
	});

	// compute and display summary
	var totalFiles = 0;
	var totalDeps = 0;
	var totalScore = 0;
	Object.keys(moduleMetrics).forEach(function (item) {
		var reqs = moduleMetrics[item];
		totalFiles += 1;
		totalDeps += reqs.connections.length;
		totalScore += reqs.distance;
	});
	var averageDeps = (totalFiles > 0 ? totalDeps / totalFiles : 0);
	console.log(totalFiles + ' files');
	console.log(averageDeps + ' dependencies per file on average');
	console.log(totalScore + ' total score');
}

reportDependencies(fullModules);
if (args.watch && fullModules.length) {
	console.log('watching these files...');
	var watch = require('nodewatch');
	fullModules.forEach(function (filename) {
		watch.add(filename);
	});
	watch.onChange(function (file, prev, curr, action){
		console.log('file', file, 'changed', action);
		fullModules = discoverSourceFiles();
		reportDependencies(fullModules);
	});
}