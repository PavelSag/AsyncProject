const User = require('../models/User');
const Cost = require('../models/Cost');

/**
 * Add a new cost item to the database
 * @route POST /api/add
 * @param {Object} req - Express request object
 * @param {string} req.body.description - Description of the cost
 * @param {string} req.body.category - Category of the cost (food, health, housing, sport, education)
 * @param {number} req.body.userid - ID of the user
 * @param {number} req.body.sum - Cost amount
 * @param {string} [req.body.date] - Date
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with saved cost
 */
exports.addCost = async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        //status 400 is returned if one of the mandatory parameter is missing:
        if (!description || !category || !userid || !sum) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        //creating a new cost item:
        const cost = new Cost({
            description,
            category,
            userid,
            sum,
            date: date || new Date()
        });

        const saved = await cost.save();

        //updating the total cost:
        await User.updateOne(
            { id: userid },
            { $inc: { totalCost: sum } }
        );

        return res.status(200).json(saved);//cost item created successfully
    } catch (err) {
        //status 500 is returned if the server side encountered an error:
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};

/**
 * Get a monthly report of cost items for a specific user, grouped by category
 * @route GET /api/report
 * @param {Object} req - Express request object
 * @param {string} req.query.id - User ID
 * @param {string} req.query.year - Year for the report
 * @param {string} req.query.month - Month for the report
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing grouped cost report
 */
exports.getMonthlyReport = async (req, res) => {
    try {
        const { id, year, month } = req.query;

        if (!id || !year || !month) {
            //status 400 is returned if one of the mandatory parameter is missing:
            return res.status(400).json({ error: 'Missing query parameters' });
        }

        //creates a date object for the first day of the month:
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        //gets the costs of the given user(by id) in the given month:
        const costs = await Cost.find({
            userid: parseInt(id),
            date: { $gte: start, $lte: end }
        });

        //groups all the costs by the categories
        const grouped = {
            food: [],
            health: [],
            housing: [],
            sport: [],
            education: []
        };

        //populates the categories:
        costs.forEach(cost => {
            const entry = {
                sum: cost.sum,
                description: cost.description,
                day: new Date(cost.date).getDate()
            };
            grouped[cost.category].push(entry);
        });

        //returns user's report:
        return res.status(200).json({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: Object.entries(grouped).map(([key, val]) => ({ [key]: val }))
        });
    } catch (err) {
        //status 500 is returned if the server side encountered an error:
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};

/**
 * Get details of a specific user
 * @route GET /api/users/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user details
 */
exports.getUserDetails = async (req, res) => {
    try {
        //parses the given user id:
        const id = parseInt(req.params.id);
        //gets the user from the database:
        const user = await User.findOne({ id });

        if (!user) return res.status(404).json({ error: 'User not found' });

        //returns the user details:
        return res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: user.totalCost
        });
    } catch (err) {
        //status 500 is returned if the server side encountered an error:
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};

/**
 * Get the list of team members
 * @route GET /api/about
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response containing list of team members
 */
exports.getTeamMembers = async (req, res) => {
    try {
        const teamMembers = [
            { first_name: 'Pavel', last_name: 'Sagalov' },
            { first_name: 'Ofir', last_name: 'Cohen' }
        ];
        return res.status(200).json(teamMembers);
    } catch (err) {
        //status 500 is returned if the server side encountered an error:
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
};