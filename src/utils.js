var glob = require('glob');
var path = require('path');
var fs = require('fs');
var reporter = require('./reporter');

function discoverSourceFiles(filePatterns) {
	console.assert(Array.isArray(filePatterns), 'expect list of names or patterns');

	var filenames = [];
	filePatterns.forEach(function (shortName) {
		var files = glob.sync(shortName);
		filenames = filenames.concat(files);
	});

	filenames = filenames.map(function (shortName) {
		return path.resolve(shortName);
	});
	return filenames;
}

function filterNonExistingFiles(filenames) {
	console.assert(Array.isArray(filenames), 'expected an array of filenames');
	var result = filenames.filter(function (filename) {
		return fs.existsSync(filename);
	});
	return result;
}

function writeReqJsonReport(moduleMetrics, filename) {
	console.assert(moduleMetrics, 'expected module metrics');
	console.assert(filename, 'expected output filename');

	var str = JSON.stringify(moduleMetrics, null, 2);
	fs.writeFileSync(filename, str, 'utf8');
	console.log('saved json report to', filename);
}

function writeDetailedReport(moduleMetrics, options) {
	var metrics = [];
	Object.keys(moduleMetrics).forEach(function (item) {
		var reqs = moduleMetrics[item];
		metrics.push([
			reqs.path,
			reqs.connections.length,
			reqs.distance
			]);
	});

	reporter.writeReportTables({
		titles: ['filename', 'depends', 'score'],
		metrics: metrics,
		filename: options.output,
		colors: options.colors,
		sort: options.sort,
		minimal: options.minimal
	});
}

function displaySummary(moduleMetrics, minimal) {
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
	if (minimal) {
		console.log(totalFiles + ' file(s), ' + averageDeps.toFixed(1) + ' average deps, ' +
			totalScore + ' total score');
	} else {
		console.log(totalFiles + ' file(s)');
		console.log(averageDeps.toFixed(1) + ' dependencies per file on average');
		console.log(totalScore + ' total score');
	}
}

module.exports = {
	discoverSourceFiles: discoverSourceFiles,
	filterNonExistingFiles: filterNonExistingFiles,
	writeReqJsonReport: writeReqJsonReport,
	writeDetailedReport: writeDetailedReport,
	displaySummary: displaySummary
};