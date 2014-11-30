// test/mocha/node-suite.js

// This runs with mocha programmatically rather than from the command line.
// how-to-with-comments taken from https://github.com/itaylor/qunit-mocha-ui

//Load Code Coverage (Blanket)
require('blanket')({
    pattern: function (filename) {
        return (/node_modules/.test(filename)||/test/.test(filename)||/vendor/.test(filename)||/public/.test(filename))? false : true;
    }
});

var fs = require("fs");
var util = require("../../lib/utils.js");

//Load mocha
var Mocha = require("mocha");

//Tell mocha to use the interface.
var mocha = new Mocha({ui:"bdd", reporter:"mocha-multi"});

// Add all test files in `test/` directory (Hack)
var files = fs.readdirSync(__dirname + "/server");
for (var i = files.length; i--; ) {
    mocha.addFile(__dirname + "/server/" + files[i]);
}

// Enable Growl
mocha.growl();

//Run your tests
mocha.run(function(failures){
    if(failures.length > 0){
    	util.fail(failures)
        throw new Error(failures);
    }
    process.exit(0);
});

//TODO: FIXME: Exits zero even on test fail.