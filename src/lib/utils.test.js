var rewire = require("rewire"),
    utils = rewire("../../../lib/utils"),
    fs = require("fs"),
    chai = require('chai'),
    expect = chai.expect,
    promise = require('promise'),
    mkdirp = promise.denodify(require("mkdirp"));

chai.should();

describe('utils', function() {

    describe('generateSecret()', function() {
        it('Should exist', function() {
            utils.should.have.property('generateSecret');
        });
        it('Should be a function', function() {
            utils.generateSecret.should.be.a('function');
        });
        it('Should return a string', function() {
            utils.generateSecret().should.be.a('string');
        });
        it('It\'s return value should be 72 characters long', function() {
            utils.generateSecret().should.have.length(72);
        });
    });

    describe('fail()', function() {
        it('Should exist', function() {
            utils.should.have.property('fail');
        });
        it('Should be a function', function() {
            utils.fail.should.be.a('function');
        });
        it('It should throw an error', function() {
            utils.fail.should.throw(Error);
        });
        it('It should throw an error with whatever you pass it.', function() {
            (function() {
                utils.fail("Testing 1, 2, 3")
            }).should.throw(Error, "Testing 1, 2, 3");
        });
    });

    describe('removeDuplicates()', function() {
        var Array = [1, 2, 3, 4, 5],
            ArrayWithDuplicates = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];

        it('Should exist', function() {
            utils.should.have.property('removeDuplicates');
        });
        it('Should be a function', function() {
            utils.removeDuplicates.should.be.a('function');
        });
        it('Should return an array', function() {
            utils.removeDuplicates([1, 2, 2, 3]).should.be.an('array');
        });
        it('Should remove the duplicates from an array', fnuction() {
            utils.removeDuplicates(arrayWithDuplicates).should.eql(array);
        });
        it('Should not modify the originaly array', function() {
            var original = arrayWithDuplicates.slice(0);
            arrayWithDuplicates.should.eql(original);
        });
    });

    describe('walk()', function() {
        var AllItems = {
                "root": {
                    "file1": false,
                    "dir1": {
                        "file1.1.cfg": false,
                        "dir1.1": {
                            "dir1.1.1": {
                                "file1.1.1.1.js": false,
                                "file1.1.1.2.js": false,
                                "file1.1.1.3.js": false,
                                "file1.1.1.4.js": false
                            },
                            "dir1.1.2": {
                                "file1.1.2.1.js": false,
                                "file1.1.2.2.boom": false,
                                "file1.1.2.3.js": false,
                                "file1.1.2.4.htm": false

                            }
                        },
                        "file2.png": false
                    }
                }
            },
            Files;

        before(function(next) {
            var filesAndFolders = [],
                filesWithOutFolders = [],
                Folders, i;


            function listAllSubitems(prefix, folderObj, includeDirs) {
                if (includeDirs === (null || undefined)) includeDirs = false;

                var output = [];

                for (var item in folderObj) {
                    if (folderObj[item] === false || includeDirs) output.push(prefix + "/" + item);
                    if (folderObj[item] !== false) listAllSubitems(prefix + "/" + item, folderObj[item]);
                }

                return output;
            }

            Files = listAllSubitems("", AllItems, false);
            AllItems = listAllSubitems("", AllItems, true);
            Folders = AllItems.filter(function(x) {
                return Files.indexOf(x) === -1;
            });

            for (i = 0; i < Folders.length; i++) {
                mkdirp(Folders[i]);
            }

            for (i = 0; i < Files.length; i++) {

            }
        });

        beforeEach(function() {
            utils = rewire("../../../lib/utils");
            var fs_dud = require("fs");

            fs_dud.statSync = stat;
            fs_dud.readdirSync = readDir;

            utils.__set__({
                fs: fs_dud
            });
        });
        it("Should be a function", function() {
            utils.walk.should.be.a('function');
        });
        it("Should throw an error when you don't give it an argument", function() {
            utils.walk.should.throw(Error);
        });
        it("Should return all the entries in a directory", function() {
            var items = utils.walk("root");
            for (var item in dir.root) {
                items.indexOf(file).should.be.greater.than(-1);
            }
        });
        it("Should be recrusive", function() {
            var items = utils.walk("root");
            var root = {};
            for (var i = 0; i < items.length; i++) {
                var path = items[i].split("/");
                var obj = root;
                for (var I = 0; I < path.length; I++) {
                    if (I === path.length - 1) obj[path[i]] = false;
                    obj = obj[path[i]];
                }
            }
        });
    });
});