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

// returns an object of immediate reqs, even for a single argument
function outboundLinks(modules) {
	// console.log('computing outbound links starting with', moduleName);
	console.assert(Array.isArray(modules), modules, 'should be an array');
  // console.log('modules', modules);
  // process.exit(0);

	var out = {};
	modules.forEach(function(moduleName) {
    //var fullName = path.resolve(moduleName);
    // console.log('for', moduleName, 'full name', fullName);

    var fullName = moduleName;
    // console.log('loading dependencies for', fullName);
    console.assert(/\.js$/.test(fullName), 'module name', fullName, 'is not .js');
    var moduleFolder = path.dirname(fullName);
    console.assert(moduleFolder, 'could not get module name from', fullName);
    // console.log('module folder', moduleFolder);

    function toFullJs(name, baseName) {
      var folder = path.dirname(baseName);
      var reqPath = path.resolve(folder, name);
      // console.log('from folder', folder, 'name', name, 'full path', reqPath);

      if (!/\.js$/.test(reqPath)) {
        reqPath += '.js';
      }
      return reqPath;
    }

    out[fullName] = [];
    if (config.amd) {
      global.define = function(deps) {
        // console.log('loading modules', deps, 'from file', fullName);
        if (Array.isArray(deps)) {
          var uniques = deduplicate(deps);
          var fullPaths = uniques.map(function (depName) {
            return toFullJs(depName, fullName);
          });
          // console.log('out =', out);
          out[fullName] = fullPaths;
        }
      };

      // force loading the module, needed if same module is loaded multiple times
      delete require.cache[require.resolve(fullName)];
      require(fullName);
    } else {
		  var reqs = visit(moduleName);
		  console.assert(typeof reqs === 'object', 'return should be an object for', moduleName);
      var fullReqs = reqs.map(function (reqName) {
        return toFullJs(reqName, moduleName);
      });
		  out[fullName] = fullReqs;
    }
	});

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

  modules = modules.map(function (moduleName) {
    if (!/\.js$/.test(moduleName)) {
      moduleName += '.js';
    }
    return moduleName;
  });

  modules = modules.map(function (moduleName) {
    var fullName = path.resolve(moduleName);
    return fullName;
  });
  
  // console.log('getting outbound modules for', modules);
  var reqs = outboundLinks(modules);
  // console.log('found reqs', reqs);

  console.assert(reqs, 'could not get dependencies for modules', modules);
  console.assert(Object.keys(reqs).length === modules.length, 
    'returned wrong number of links', reqs, 'for', modules);

  // console.log('forming results');
  /*
  var result = {};
  reqs.forEach(function(req, index) {
    var moduleName = modules[index];
    result[moduleName] = req;
  });
  // console.log('results object', result);
  return result;
  */
  return reqs;
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
  var src = fs.readFileSync(fn);
  var requires = detective(src);
  return requires;
};

module.exports = {
  init: init,
	outbound: outbound
};