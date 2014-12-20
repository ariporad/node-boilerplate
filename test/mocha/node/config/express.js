var rewire = require("rewire");
var path = require("path");
var basepath = path.resolve(__dirname, '../../../../');

require('chai').should();

var express_config, app_dud, server_dud, express_dud;

/**
 * @desc Constructor for an express dud.
 */
function makeExpressDud(){
    this.static = function(directory){
        this.__data__.staticDirs.push(directory);
        return this.__returns__.static;
    };
    
    this.__data__ = {  // The data passed in while running the module for access afterword.
        staticDirs: []
    };
    
    this.__returns__ = { // The values returned by the duds
        static: 'staticFile.dud'
    };
}

/**
 * @desc Constructor for an App Dud.
 */
function makeAppDud() {
    this.set = function(key, value){
        this.__data__.data[key] = value;
        return this.__returns__.set;
    };
    
    this.get = function(key) {
        return this.__data__.data[key];
    };
    
    this.use = function(middleware){
        this.__data__.middleware.push(middleware);
        return this.__returns__.use;
    };
    
    this.engine = function(name, engine) {
        this.__data__.engines[name] = engine;
        return this.__returns__.engine;
    };
    
    this.__data__ = { // The data passed in while running the module for access afterword.
        data: {},
        middleware: []
    };
    
    this.__returns__ = { // The values returned by the duds
        set: 'SetAValue',
        use: 'UseUsetoUseThings',
        engine: 'V2, V4, V6, V8, V10, V12 or AC Induction?'
    };
}

/**
 * @desc Constructor function for a server dud
 */
function makeServerDud() {
    // The server is not yet used, so this does nothing.
    
    this.__data__ = { // Data put here while module is running, allowing you to access it later.
        
    };
    
    this.__returns__ = { // The Dud values that the methods return.
        
    };
}

/**
 * @desc resets everything, new duds, it reloads and resets the module, clears any data.
 */
function reset(){
    express_config = rewire('../../../../config/express');
    app_dud = makeAppDud();
    server_dud = makeServerDud();
    express_dud = makeExpressDud()
}

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
    
    describe('Middleware', function() {
        describe('Session', function() {
            it('should app.use(express-session(args))', function() {
                var server_dud = {};
                var express_dud = { static: function(){} };
                
                var session = {};
                
                var session_dud = function(args){
                    session = args;
                    
                    return 'session';
                };
                
                var middlewares = [];
                var app = {
                    set: function(key, value) {
                        
                    },
                    
                    engine: function(){},
                    use: function(middleware){
                        middlewares.push(middleware);
                    }
                };
                
                express_config.__set__({
                    'session': session_dud
                });
                express_config(app, express_dud, server_dud);
                middlewares.should.contain('session');
            }); 
            
            it('should generate a unique secret every time', function() {
                var server_dud = {};
                var express_dud = { static: function(){} };
                
                var session = {};
                
                var session_dud = function(args){
                    session = args;
                    
                    return 'session';
                };
                var app = {
                    set: function(key, value) {},
                    engine: function(){},
                    use: function(middleware){}
                };
                
                express_config.__set__({
                    'session': session_dud
                });
                express_config(app, express_dud, server_dud);
                var old_secret = session.secret;
                express_config(app, express_dud, server_dud);
                old_secret.should.not.equal(session.secret);
            }); 
        });
        describe('Cookie Parser',  function() {
            it('should app.use(express-cookieparser(uniqueSecret))', function() {
                var server_dud = {};
                var express_dud = { static: function(){} };
                
                var cookieparser_dud = function(secret){
                    return 'cookiejar';
                };
                
                var middlewares = [];
                var app = {
                    set: function(key, value) {
                        
                    },
                    
                engine: function(){},
                    use: function(middleware){
                        middlewares.push(middleware);
                    }
                };
                
                express_config.__set__({
                    'cookieParser': cookieparser_dud
                });
                express_config(app, express_dud, server_dud);
                middlewares.should.contain('cookiejar');
            }); 
            
            it('should uniqueSecret should always be unique', function() {
                var server_dud = {};
                var express_dud = { static: function(){} };
                
                var secret = '';
                
                var cookieparser_dud = function(secret){
                    secret = secret;
                    return 'cookiejar';
                };
                
                var middlewares = [];
                var app = {
                    set: function(key, value) {
                        
                    },
                    
                    engine: function(){},
                    use: function(middleware){
                        middlewares.push(middleware);
                    }
                };
                
                express_config.__set__({
                    'cookieParser': cookieparser_dud
                });
                express_config(app, express_dud, server_dud);
                var old_secret = secret;
                express_config(app, express_dud, server_dud);
            }); 
        });
        describe('Static Files', function() {
            describe('express.static', function() {
                it('Should be called for views/', function() {
                    
                });
            });
        });
    });
    
    
});