var express = require('express');
var router = express.Router();

var redisConfig = {"url": process.env.REDIS_URL};
var redisStorage = require('botkit/lib/storage/redis_storage')(redisConfig);
var utils = require('../utils');

if(process.env.LOCAL_REDIS){
  // is this a hack? maybe
  redisStorage = require('botkit/lib/storage/redis_storage')();
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  redisStorage.teams.all(function(err, teams){
    if(!err&&teams != null){
      redisStorage.users.all(function(err, users){
        var today = new Date(Date.now());
        var todayFormatted = utils.formatDate(today);
        res.render('index', {title: "London Tube for Slack", teams: teams, users: users, today: todayFormatted});
      });
    }
    else{
      res.render('error');
    }
  });
});

module.exports = router;
