import * as ejs from 'ejs-mate';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as path from 'path';
import * as pkginfo from 'pkginfo';

let pkg = pkginfo(module);

module.exports = function(app, express) {
	app.engine('ejs', ejs);

	app.set('view engine', 'ejs');
	app.set('views', path.resolve(__dirname, '../views'));

	app.locals = {
		pkg: pkg
	};

	// Middleware

	app.use(session({
		secret: utils.generateSecret(),
		saveUninitialized: true,
		resave: false
			// TODO: Setup session store to database (Redis?)
	}));

	app.use(express.static(path.resolve(__dirname, '../public')));
	app.use(express.static(path.resolve(__dirname, '../vendor')));
	app.use(cookieParser(utils.generateSecret()));
};