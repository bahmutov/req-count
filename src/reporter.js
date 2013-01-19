var fs = require("fs");
var path = require("path");
var check = require('check-types');
var colors = require('colors');

var json = /\.json$/i;

var Table = require('cli-table');
function makeTable(titles, rows, colorful, complexityLimit) {
	console.assert(Array.isArray(titles), "column titles should be an array, not", titles);
	console.assert(Array.isArray(rows), "rows should be an array, not", rows);
	complexityLimit = complexityLimit || 1000;
	console.assert(complexityLimit > 0, 'invalid complexity limit', complexityLimit);

	var table;
	if (colorful) {
		table = new Table({
			head: titles
		});
	} else {
		table = new Table({
			head: titles,
			style: {
				compact: true, 
				'padding-left': 1, 
				'padding-right': 1
			},
			chars: {
          'top': '-'
        , 'top-mid': '+'
        , 'top-left': '+'
        , 'top-right': '+'
        , 'bottom': '-'
        , 'bottom-mid': '+'
        , 'bottom-left': '+' 
        , 'bottom-right': '+'
        , 'left': '|'
        , 'left-mid': '+'
        , 'mid': '-'
        , 'mid-mid': '+'
        , 'right': '|'
        , 'right-mid': '+'
      }
		});
	}

	var complexityColumn = 2;
	if (colorful) {
		rows.forEach(function(row, index) {
			var complexity = row[complexityColumn];
			if (complexity > complexityLimit) {
				var redRow = row.map(function(cell) {
					return String(cell).bold.red;
				});
				rows[index] = redRow;
			}
		});
	}

	rows.forEach(function(row) {
		table.push(row);
	});

	return table;
}

function writeReportTables(options) {
	options = options || {};
	console.assert(options.titles, 'null column titles');
	console.assert(Array.isArray(options.metrics), "metrics should be an array, not", options.metrics);
	console.assert(options.metrics.length >= 0, "invalid complexity length", options.metrics.length);
	if (options.filename) {
		check.verifyString(options.filename, "output filename " + options.filename + " should be a string");
		console.log('output filename', options.filename);
	}

	if (!options.metrics.length) {
		console.warn('nothing to report, empty complexity array');
		return;
	}

	(function () {
		var sortingColumn = options.sort;
		if (typeof sortingColumn === 'number') {
			var reverseSort = false;
			var comparison = function(a, b) {
				var first = a[sortingColumn];
				var second = b[sortingColumn];
				if (first < second) {
					return -1;
				} else if (first > second) {
					return 1;
				} else {
					return 0;
				}
			};
			if (/^!/.test(sortingColumn)) {
				sortingColumn = Number(sortingColumn.substr(1));
				reverseSort = true;
			}
			check.verifyNumber(sortingColumn, 'invalid sorting column ' + sortingColumn);
			var maxColumn = options.titles.length;
			console.assert(sortingColumn >= 0 && sortingColumn < maxColumn, 'invalid sorting column', sortingColumn);
			console.log('sorting metrics by column', sortingColumn);
			options.metrics.sort(comparison);
			if (reverseSort) {
				options.metrics.reverse();
			}
		}
	}());

	function getInfo() {
		var info = 'depends - number of dependencies found from each file\n' +
			'score - total number of "hops" for all dependencies.\n' +
			'\tfile in the same folder - 1 hop. file in parent folder - 2 hops, etc.\n';
		return info;
	}

	var info = getInfo();
	check.verifyString(info, 'info should be a string, not ' + info);

	var titles = options.titles;
	var rows = options.metrics;

	if (options.filename) {
		(function () {
			var table = makeTable(titles, rows, false);
			console.assert(table, 'could not make plain table');
			var reportFilename = options.filename.replace(json, ".txt");
			check.verifyString(reportFilename, 'could not create filename from', options.filename);

			var text = table.toString() + '\n' + info;
			fs.writeFileSync(reportFilename, text, "utf-8");
			console.log("Saved report text", reportFilename);
		}());
	}

	(function () {
		console.log('making table, colors?', options.colors, 'complexity limit', options.limit);
		var table = makeTable(titles, rows, options.colors, options.limit);
		console.assert(table, 'could not make table, colors?', options.colors);
		var text = table.toString() + '\n' + info;
		console.log(text);
	}());
}

module.exports = {
	writeReportTables: writeReportTables
};