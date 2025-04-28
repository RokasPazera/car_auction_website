import cars from '../data/cars.js';
import bids from '../data/bids.js';

export const getAllCars = (req, res) => {
    res.status(200).json(cars);
};

export const findCarById = (req, res) => {
    const carId = parseInt(req.params.id, 10);
    const car = cars.find(car => car.id === carId);

    if (!car) {
        return res.status(404).json({msg: "Car not found."});
    }

    res.status(200).json(car);
};


export const createNewCar = (req, res) => {
    const {brand, model, year, price, url, time} = req.body;

    const now = new Date();
    const carTime = now.toISOString().split('.')[0];

    let date;

    if (time) {
        date = new Date(time).toISOString();
    } else {
        date = now.toISOString();
    }


    const newCar = {
        id: cars.length + 1, description: 'Newly created car.', brand, model, year, price, url, time,
    };

    cars.push(newCar);

    const initialBid = {
        id: bids.length + 1, carId: newCar.id, amount: price, bidder: 'Initial bid', date,
    };

    bids.push(initialBid);

    res.status(200).json({
        car: newCar, initialBid, date,
    });
};

export const updateCar = (req, res) => {
    const user = req.user;
    const carId = parseInt(req.params.id, 10);
    const carIndex = cars.findIndex(car => car.id === carId);
    cars[carIndex] = {...cars[carIndex], ...req.body};

    if (!user) {
        return res.status(404).json({msg: "User not found."});
    }

    if (!user.isAdmin) {
        return res.status(404).json({msg: "user is not admin."});
    }


    res.status(200).json({msg: "Car updated successfully"});
};

export const deleteCar = (req, res) => {
    const user = req.user;
    const carId = parseInt(req.params.id, 10);
    const carIndex = cars.findIndex(car => car.id === carId);

    if (!user) {
        return res.status(404).json({msg: "User not found."});
    }

    if (!user.isAdmin) {
        return res.status(404).json({msg: "user is not admin."});
    }

    if (!carId) {
        return res.status(404).json({msg: "Car not found."});
    }

    console.log("deleteCar called")


    cars.splice(carIndex, 1);
    res.status(200).json({msg: "Car deleted successfully"});
};

export const getBidsForCar = (req, res) => {
    const carId = parseInt(req.params.id, 10);
    const carBids = bids.filter(bid => bid.carId === carId);

    res.status(200).json({bids: carBids});
};

export const getWinningBid = (req, res) => {
    const carId = parseInt(req.params.id, 10);
    const carBids = bids.filter(bid => bid.carId === carId);

    if (carBids.length === 0) {
        return res.status(404).json({msg: "No bids found for this car."});
    }

    const winningBid = carBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), carBids[0]);
    res.status(200).json(winningBid);
};

export const placeBid = (req, res) => {
    const carId = parseInt(req.params.id, 10);
    const bidAmount = req.body.amount;

    const newBid = {
        id: bids.length + 1, carId, amount: bidAmount, bidder: req.body.bidder, date: req.body.date
    };
    bids.push(newBid);

    res.status(201).json({msg: "Bid placed successfully", bid: newBid});
};
