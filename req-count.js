// node visitor taken from http://kalmanspeier.com/blog/2012/05/16/visit-required-files-in-node-dot-js/
var fs = require('fs');
var path = require('path');
var Module = require('module');
var detective = require('detective');

var out = [];

// returns an array of immediate reqs, even for a single argument
function outbound(moduleName) {
	// console.log('computing outbound links starting with', moduleName);
	if (!Array.isArray(moduleName)) {
		moduleName = [moduleName];
	}

	console.assert(Array.isArray(moduleName), moduleName, 'should be an array');
	out = [];
	moduleName.forEach(function(item) {
		var reqs = visit(item);
		console.assert(typeof reqs === 'object', 'return should be an object for', item);
		out.push(Object.keys(reqs));
	})
	return out;
}

// only immediate requires are returned
function visit(request, parent) {
	var reqs = {};

  var fn;
  try {
    fn = require.resolve(request);
  } catch (err) {
    fn = Module._resolveFilename(request, parent);
  }
  if (!fs.existsSync(fn)) {
    return {};
  }
  // console.log(fn);
  var src = fs.readFileSync(fn);
  var requires = detective(src);

  requires.forEach(function(item) {
  	reqs[item] = item;
  	/*
    visit(item, {
      id: request,
      filename: fn
    });
*/
  });

  return reqs;
};

module.exports = {
	outbound: outbound
};