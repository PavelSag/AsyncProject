const mongoose = require('mongoose');

//defining the 'users' collection:
const UserSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    first_name: String,
    last_name: String,
    birthday: Date,
    marital_status: String,
    totalCost: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', UserSchema);
