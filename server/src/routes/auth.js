import express from 'express';
import {registerUser, loginUser} from '../controllers/userController.js';

const router = express.Router();


router.post('/newUser', registerUser);

router.post('/user', loginUser);

export default router;
