const validateFields = (fields, data) => {
    return fields.every(field => field in data && data[field]);
};

export const validateCarFields = (req, res, next) => {
    const requiredFields = ['brand', 'model', 'year', 'price', 'url'];
    if (!validateFields(requiredFields, req.body)) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    next();
};

export const validateBidAmount = (req, res, next) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ msg: 'Invalid bid amount' });
    }
    next();
};
