// node visitor taken from http://kalmanspeier.com/blog/2012/05/16/visit-required-files-in-node-dot-js/
var fs = require('fs');
var path = require('path');
var Module = require('module');
var detective = require('detective');

var out = [];
var config = {
  amd: true
};

function init(options) {
  options = options || {};
  config.amd = options.amd;
}

// returns an array of immediate reqs, even for a single argument
function outboundLinks(modules) {
	// console.log('computing outbound links starting with', moduleName);
	console.assert(Array.isArray(modules), modules, 'should be an array');

	out = [];
	modules.forEach(function(item) {
    if (config.amd) {
      var fullName = path.resolve(item);
      global.define = function(deps) {
        if (Array.isArray(deps)) {
          var uniques = deduplicate(deps);
          out.push(uniques);
        }
      };

      // force loading the module, needed if same module is loaded multiple times
      delete require.cache[require.resolve(fullName)];
      require(fullName);
    } else {
		  var reqs = visit(item);
		  console.assert(typeof reqs === 'object', 'return should be an object for', item);
		  out.push(Object.keys(reqs));
    }
	});

  // console.log('returning', out);
	return out;
}

function deduplicate(items) {
  var uniques = {};
  items.forEach(function(item) {
    uniques[item] = item;
  });
  return Object.keys(uniques);
}

// returns object, for each module - array of paths
function outbound(modules) {
  console.assert(modules, 'empty modules list');
  if (!Array.isArray(modules)) {
    modules = [modules];
  }

  modules = deduplicate(modules);
  
  // console.log('getting outbound modules for', modules);
  var reqs = outboundLinks(modules);
  // console.log('found reqs', reqs);

  console.assert(Array.isArray(reqs), 'could not get array for modules', modules);
  console.assert(reqs.length === modules.length, 'returned wrong number of links', reqs, 'for', modules);

  // console.log('forming results');
  var result = {};
  reqs.forEach(function(req, index) {
    var moduleName = modules[index];
    result[moduleName] = req;
  });
  return result;
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
  });

  return reqs;
};

module.exports = {
  init: init,
	outbound: outbound
};