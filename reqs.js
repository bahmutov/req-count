var path = require('path');

// grab command line arguments
(function() {
	var optimist = require("optimist");
	args = optimist.usage("Find first level dependencies from js file.\nUsage: $0")
			.default({
				amd: false,
				help: 0
			}).alias('h', 'help')
			.boolean("amd")
			.describe('amd', 'look for AMD style define calls')
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
console.log(JSON.stringify(reqs, null, 2));