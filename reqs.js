var utils = require('./src/utils');

var req = require('./src/req-count');
if (!module.parent) {
	(function () {
		var args = require('./src/arguments').run();
		run(args);
	})();
}

function run(options) {
	options = options || {};
	console.assert(options.input, 'expect input array with source files or patterns');
	req.init(options);

	var fullModules = utils.discoverSourceFiles(options.input);
	console.assert(Array.isArray(fullModules), 'could not discover source files');

	function reportDependencies(fullModules) {
		console.assert(Array.isArray(fullModules), 'expected an array of filenames');
		fullModules = utils.filterNonExistingFiles(fullModules);

		var reqs = req.outbound(fullModules);
		console.assert(reqs, 'could not get outbound reqs');

		var counter = require('./src/count');
		var moduleMetrics = counter.reqMetrics(reqs);
		console.assert(moduleMetrics, 'could not get module metrics');

		if (options.json) {
			writeReqJsonReport(moduleMetrics, options.json);
		}

		utils.writeDetailedReport(moduleMetrics, options);
		utils.displaySummary(moduleMetrics);
	}

	reportDependencies(fullModules);

	function watchAndRecomputeOnChange(fullModules, options) {
		if (options.watch && fullModules.length) {
			console.log('watching', fullModules.length, 'files...');
			var watch = require('nodewatch');
			fullModules.forEach(function (filename) {
				watch.add(filename);
			});
			watch.onChange(function (file, prev, curr, action){
				console.log('file', file, 'changed', action);
				fullModules = discoverSourceFiles(options.input);
				reportDependencies(fullModules);
			});
		}
	}

	watchAndRecomputeOnChange(fullModules, options);	
}

module.exports.run = run;