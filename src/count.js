/**
	Sample input
	{
  	"C:\\git\\req-count\\test\\amd\\zoo.js": [
    	"C:\\git\\req-count\\test\\amd\\bar"
  	],
  	"C:\\git\\req-count\\test\\amd\\bar.js": []
	}

	@return
	{
  	"C:\\git\\req-count\\test\\amd\\zoo.js": {
			weight: 1
  	},
  	"C:\\git\\req-count\\test\\amd\\bar.js": {
			weight: 0
  	}
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

module.exports = {
	reqCount: reqCount
};