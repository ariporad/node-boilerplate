module.exports = function(){
    global.isDevelopment = (process.env.NODE_ENV == 'development');
};