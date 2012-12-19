var path = require('path');

/**
	Sample input
	{
  	"C:\\git\\req-count\\test\\amd\\zoo.js": [
    	"C:\\git\\req-count\\test\\amd\\bar"
  	],
  	"C:\\git\\req-count\\test\\amd\\bar.js": []
	}
*/
function reqCount(reqs) {
	console.assert(reqs, 'missing reqs');
	var result = {};
	Object.keys(reqs).forEach(function (req) {
		var values = reqs[req];
		console.assert(Array.isArray(values), 'cannot get array reqs for', req);
		result[req] = values.length;
	});
	return result;
}

/**
	relative distance count between two full paths.
	same folder - distance 1
	parent folder - distance 2
	grand parent / sibling folder - distance 3
*/
function moduleDistance(a, b) {
	console.assert(a, 'missing first path');
	console.assert(b, 'missing second path');

	var folderA = path.dirname(a);
	var folderB = path.dirname(b);
	console.assert(folderA, 'could not get dirname from', a);
	console.assert(folderB, 'could not get dirname from', b);

	var relative = path.relative(folderA, b);
	if (!relative) {
		return 1;
	}
	var folders = relative.split('\\');
	var distance = folders.length;
	console.log('from', a, 'to', b, 'relative', folders, distance);
	return distance;
}

/**
	computes various connection metrics
*/
function reqMetrics(reqs) {
	console.assert(reqs, 'missing reqs');

	var metrics = {};
	Object.keys(reqs).forEach(function (req) {
		var values = reqs[req];
		console.assert(Array.isArray(values), 'cannot get array reqs for', req);

		var distances = values.map(function (moduleName) {
			console.assert(/\.js$/.test(moduleName), 'module name', moduleName, 'is not js');
			var distance = moduleDistance(req, moduleName);
			console.assert(distance > 0, 'invalid distance between', req, 'and', moduleName);
			return distance;
		});

		metrics[req] = {
			path: req,
			connections: values,
			connectionsCount: values.length,
			distances: distances
		};
	});
	return metrics;
}

module.exports = {
	reqCount: reqCount,
	reqMetrics: reqMetrics
};