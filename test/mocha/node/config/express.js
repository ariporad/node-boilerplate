var rewire = require("rewire");
var path = require("path");
var basepath = path.resolve(__dirname, '../../../../');

require('chai').should();

var express_config;

describe('config/express.js', function() {
    beforeEach(function() {
        express_config = rewire('../../../../config/express');  
    });
    
    it('should export a function', function(){
        express_config.should.be.a('function');
    });
    
    it('should setup mustache templates', function() {
        var mustache = function(){
            return 'mustachetemplates';
        };
        
        var hasSetViewEngine = false;
        var app = {
            set: function(name, thing){
                if (hasSetViewEngine) {
                    return;
                }
                hasSetViewEngine = true;
                name.should.be.equal('view engine');
                thing.should.be.equal('mustache');
            },
            engine: function(name, engine) {
                name.should.equal('mustache');
                engine.should.equal(mustache());
            },
            use: function () {} // Not needed for this test
        };
        
        var server = {}; // Not used
        
        var express_dud = {
            static: function() {
                // do nothing
            } // Not needed for this test.
        };
        
        express_config.__set__({
            mustacheExpress: mustache
        });
        
        express_config(app, express_dud, server);
    });
    
    it('should set the views directory to /views', function() {
        var server_dud = {};
        var express_dud = { static: function(){} };
        
        var app_properties = {};
        var app = {
            set: function(key, value) {
                app_properties[key] = value;
            },
            
            engine: function(){},
            use: function(){}
        };
        
        express_config(app, express_dud, server_dud);
        app_properties.views.should.exist();
        app_properties.views.should.be.equal(path.resolve(basepath, 'views'));
    });
});