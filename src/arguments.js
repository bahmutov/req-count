var optimist = require("optimist");

function getArguments() {
	var args = optimist.usage("Find first level dependencies from js file.\nUsage: $0")
	.default({
		amd: false,
		help: 0,
		output: '',
		input: [],
		colors: true,
		sort: 1,
		watch: false,
		json: ''
	}).alias('h', 'help').alias('o', 'output').alias('i', 'input')
	.alias('j', 'json').string('json').describe('output json report filename')
	.boolean('amd').describe('amd', 'look for AMD style define calls')
	.string('output').describe('output', 'output json filename')
	.boolean('colors').describe('colors', 'use terminal colors in the output')
	.boolean('watch').describe('watch', 'keep watching the files, report stas on any change')
	.describe('input', 'list of input files / patterns')
	.describe('sort', 'sort results by column, use ! to reverse the order')
	.argv;
	return args;
};

function formArguments() {
	var args = getArguments();
	console.assert(args, 'could not get command line arguments');

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