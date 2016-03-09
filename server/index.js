var express = require('express');
var router = express.Router();

var redisConfig =
{
    "url": process.env.REDIS_URL,
    "namespace": process.env.REDIS_NAMESPACE
};
var redisStorage = require('botkit/lib/storage/redis_storage')(redisConfig);
var utils = require('../utils');

router.get('/', function(req, res, next) {
  /* GET teams listing just for the number */
  redisStorage.teams.all(function(err, teams){
    if(!err&&teams != null){
      res.render('index', {teams: teams, users: [], title: ''});
    }
    else{
      res.render('index', { teams: [], users: []});
    }
  });
});
router.get('/privacy', function(req, res, next){
    res.render('privacy-policy', {title: 'Privacy Policy'})
});

module.exports = router;
