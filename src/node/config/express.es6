import ejs from 'ejs-mate';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import pkginfo from 'pkginfo';
import { generateSecret } from 'lib/utils';
import morgan from 'morgan';

const pkg = pkginfo(module);

/**
 * @name expressConfig
 * @desc Configures an express app
 * @param {Object} app - The app to configure
 * @param {Object} express - The express instance used to create app.
 * @returns {undefined} Nothing
 */
export default function expressConfig(app, express) {
  app.use(morgan('dev'));

  app.engine('ejs', ejs);

  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, '../views'));

  app.locals = {
    pkg,
  };

  // Middleware

  app.use(session({
    secret: generateSecret(),
    saveUninitialized: true,
    resave: false,
    // TODO: Setup session store to database (Redis?)
  }));

  app.use(express.static(path.resolve(__dirname, '../public')));
  app.use(express.static(path.resolve(__dirname, '../vendor')));
  app.use(cookieParser(generateSecret()));
}
g