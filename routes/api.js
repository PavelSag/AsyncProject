const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiController');

//the endpoints:
router.post('/add', controller.addCost);//add a single cost
router.get('/report', controller.getMonthlyReport);//get the monthly report of a specific user
router.get('/users/:id', controller.getUserDetails);//get the total costs and details of a specific user
router.get('/about', controller.getTeamMembers);//get the names of the developers

module.exports = router;