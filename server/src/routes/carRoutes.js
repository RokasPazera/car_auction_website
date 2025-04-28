import express from 'express';
const router = express.Router();
import {
    findCarById,
    getAllCars,
    createNewCar,
    updateCar,
    deleteCar,
    getBidsForCar,
    getWinningBid,
    placeBid
} from '../controllers/carController.js';
import { validateBidAmount, validateCarFields } from "../middleware/validateCarFields.js";
import { verifyIfAdmin } from "../middleware/verifyAdmin.js";
import {verifyToken} from "../middleware/verifyToken.js";

router.get('/', getAllCars);

router.get('/:id', findCarById);

router.get('/:id/bids', getBidsForCar);

router.get('/:id/winning-bid', getWinningBid);

router.put('/:id', verifyToken, verifyIfAdmin, updateCar);

router.delete('/:id', verifyToken, verifyIfAdmin, deleteCar);

router.post('/', verifyToken, verifyIfAdmin, validateCarFields, createNewCar);

router.post('/:id/bids', validateBidAmount, placeBid);

export default router;
