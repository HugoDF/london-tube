var express = require('express');
var router = express.Router();
const tfl = require('tfl');
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
        tfl.tube.status()
            .then(function(tubeStatus){
                res.render('index', {teams: teams, users: [], title: '', tubeStatus: tubeStatus});
            })
            .catch(function(err){
                res.render('index', {teams: teams, users: [], title: '', tubeStatus: []});
            });
    }
    else{
        tfl.tube.status()
            .then(function(tubeStatus){
                res.render('index', { teams: [], users: [], tubeStatus: tubeStatus});
            })
            .catch(function(err){
                res.render('index', {teams: [], users: [], title: '', tubeStatus: []});
            });
    }
  });
});
router.get('/privacy', function(req, res, next){
    res.render('privacy-policy', {title: 'Privacy Policy'});
});
router.get('/support', function(req, res, next){
    res.render('support', {title: 'Support'});
});

module.exports = router;
