import ejs from 'ejs-mate';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import pkginfo from 'pkginfo';
import { generateSecret } from 'lib/utils';

const pkg = pkginfo(module);

export default function expressConfig(app, express) {
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
