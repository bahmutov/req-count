
function getArguments() {
	var optimist = require("optimist");
	var args = optimist.usage("Find first level dependencies from js file.\nUsage: $0")
			.default({
				amd: false,
				help: 0,
				output: '',
				input: [],
				color: true,
				sort: 2,
				watch: false,
				json: ''
			}).alias('h', 'help').alias('o', 'output').alias('i', 'input')
			.alias('j', 'json').string('json').describe('output json report filename')
			.boolean('amd')
			.string('output')
			.boolean('color')
			.boolean('watch')
			.describe('amd', 'look for AMD style define calls')
			.describe('output', 'output json filename')
			.describe('input', 'list of input files / patterns')
			.describe('color', 'use terminal colors in the output')
			.describe('sort', 'sort results by column, use ! to reverse the order')
			.describe('watch', 'keep watching the files, report stas on any change')
			.argv;
};

function formArguments() {
	var args = getArguments();

	if (!module.parent) {
		if (args.h || args.help) {
			optimist.showHelp();
			console.log('current arguments\n', args);
			process.exit(0);
		}
	}

	if (args.input && !Array.isArray(args.input)) {
		console.log('single input element');
		args.input = [args.input];
	}

	if (!args.input || !Array.isArray(args.input) || !args.input.length) {
		if (args._.length > 0) {
			console.log('using default command line input');
			args.input = args._;
		} else {
			optimist.showHelp();
			console.log('missing input files');
			console.log('current arguments\n', args);
			process.exit(0);
		}
	}

	return args;
}

exports.run = formArguments;