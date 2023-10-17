import express from 'express';
import AppError from '../utils/appError';

const router = express.Router();

router.route('/').get((req, res) => res.status(200).send('<h1>hello</h1>'));

router.route('*').all((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default router;
