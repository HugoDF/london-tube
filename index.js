require('dotenv').config();

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');
var redisConfig =
{
    "url": process.env.REDIS_URL,
    "namespace": process.env.REDIS_NAMESPACE
};
var redisStorage = require('botkit/lib/storage/redis_storage')(redisConfig);
var utils = require('./utils');
var path = require('path');
var hbs = require('./utils/helpers.js');
var express = require('express');
var tfl = require('tfl');

if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET || !process.env.BOTKIT_PORT) {
  console.log('Error: Specify SLACK_CLIENT_ID SLACK_CLIENT_SECRET and BOTKIT_PORT in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
  storage: redisStorage
}).configureSlackApp(
  {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    scopes: ['commands'],
  }
);


controller.setupWebserver((process.env.PORT || process.env.BOTKIT_PORT),function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.render('success', {title: 'Success!'});
    }
  });
  webserver.use(express.static(__dirname + '/public'));
  webserver.set('views', path.join(__dirname, 'views'));
  webserver.set('view engine', 'hbs');
  webserver.use('/', require('./server'));
});

// just a simple way to make sure we don't
// connect to the RTM twice for the same team
var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('slash_command',function(bot,message) {
    const query = message.text;
    const isStation = utils.isStation(query);
    const isLine = utils.isLine(query);

    if(isStation){
        tfl.tube.stations.status({
            'stations': [utils.mapStationName(query)]
        })
        .then(function(status){
            var reply = status
                        .map(function(obj){
                            return obj.name + ": " + obj.status + ((obj.incident)? ', `' + obj.statusDescription + '`':'')
                        })
                        .join("\n");
            bot.replyPublic(message, reply);
        });
    }
    if(!isStation && isLine){
        tfl.tube.status()
        .then(function(status){
            var reply = status
                        .filter(function(obj){
                            return obj.name === utils.mapLineName(query)
                        })
                        .map(function(obj){
                            return obj.name + ": " + obj.status + ((obj.incident)? ', `' + obj.statusDescription + '`':'')
                        })
                        .join("\n");
            bot.replyPublic(message, reply);
        });
    }
    if(!isStation && !isLine){
        tfl.tube.status()
        .then(function(status){
            var reply = status
                        .map(function(obj){
                            return obj.name + ": " + obj.status + ((obj.incident)? ', `' + obj.statusDescription + '`':'')
                        })
                        .join("\n");
            bot.replyPublic(message, reply);
        });
    }
});

controller.storage.teams.all(function(err,teams) {

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    console.log("Team ", t);
    if (teams[t].bot) {
      var bot = controller.spawn(teams[t]).startRTM(function(err) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
        } else {
          trackBot(bot);
        }
      });
    }
  }
});
