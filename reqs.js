var path = require('path');

// grab command line arguments
(function() {
	var optimist = require("optimist");
	args = optimist.usage("Find first level dependencies from js file.\nUsage: $0")
			.default({
				amd: false,
				help: 0,
				output: ''
			}).alias('h', 'help').alias('o', 'output')
			.boolean("amd")
			.string('output')
			.describe('amd', 'look for AMD style define calls')
			.describe('output', 'output json filename')
			.argv;

	if (!module.parent) {
		if (args.h || args.help || !args._.length) {
			optimist.showHelp();
			console.log('current arguments\n', args);
			process.exit(0);
		}
	}
}());

var req = require('./req-count');
req.init(args);

var fullModules = args._.map(function (shortName) {
	return path.resolve(shortName);
});

var reqs = req.outbound(fullModules);
console.assert(reqs, 'could not get outbound reqs');
// console.log(JSON.stringify(reqs, null, 2));

var counter = require('./src/count');
var moduleCounts = counter.reqCount(reqs);
console.assert(moduleCounts, 'could not get module counts');

var str = JSON.stringify(moduleCounts, null, 2);
console.log(str);
if (args.output) {
	var fs = require('fs');
	fs.writeFileSync(args.output, str, 'utf8');
	console.log('saved requirements to', args.output);
}
