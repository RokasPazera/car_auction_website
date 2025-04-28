import express from 'express';
import {getUserProfile, updateUserProfile} from "../controllers/userController.js";
import { verifyToken } from '../middleware/validateUser.js';
const router = express.Router();


router.get('/me/:id', verifyToken, getUserProfile);

router.put('/me/:id', verifyToken, updateUserProfile);



export default router;