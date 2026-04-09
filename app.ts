import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from './src/auth/passport';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import attachUserFromJWT from './middleware/authentication';
import { requireRole } from './middleware/authorization';
import adminPostsRouter from './routes/admin/posts';

const app = express();

app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(attachUserFromJWT);

// Make user available in all views via res.locals
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/admin/posts', requireRole('admin'), adminPostsRouter);

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: createError.HttpError, req: Request, res: Response, _next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (req.originalUrl.startsWith('/api/')) {
    res.status(err.status || 500).json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
    return;
  }

  res.status(err.status || 500);
  res.render('error');
});

export default app;
