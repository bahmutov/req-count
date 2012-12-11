// node visitor taken from http://kalmanspeier.com/blog/2012/05/16/visit-required-files-in-node-dot-js/
var fs = require('fs');
var path = require('path');
var Module = require('module');
var detective = require('detective');

var out = {};

function outbound(moduleName) {
	// console.log('computing outbound links starting with', moduleName);

	out = {};
	visit(moduleName);
	return out;
}

// only immediate requires are returned
function visit(request, parent) {
  var fn;
  try {
    fn = require.resolve(request);
  } catch (err) {
    fn = Module._resolveFilename(request, parent);
  }
  if (!fs.existsSync(fn)) {
    return;
  }
  // console.log(fn);
  var src = fs.readFileSync(fn);
  var requires = detective(src);

  requires.forEach(function(item) {
  	out[item] = item;
  	/*
    visit(item, {
      id: request,
      filename: fn
    });
*/
  })
};

module.exports = {
	outbound: outbound
};