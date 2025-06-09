const mongoose = require('mongoose');

//defining the 'costs' collection:
const CostSchema = new mongoose.Schema({
    description: String,
    category: {
        type: String,
        enum: ['food', 'health', 'housing', 'sport', 'education']//the categories
    },
    userid: Number,
    sum: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cost', CostSchema);