import express from 'express';

import * as userController from '../controllers/user.controller';

const router = express.Router();

router.route('/').get(userController.getUsers).post(userController.createUser);
router.route('/:userId').get().patch().delete();

export default router;
