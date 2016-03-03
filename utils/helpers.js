var hbs = require('hbs');
hbs.registerHelper("ifeq", function(a, b, options) {
    return (a === b)?options.fn(this): options.inverse(this);
});

hbs.registerHelper("slackbtn", function(){
  return '<a href="https://slack.com/oauth/authorize?scope=commands&client_id=19358800983.24163094325"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>';
});

hbs.registerHelper('test', function() {
  console.log('test')
  return
});
module.exports = hbs;
