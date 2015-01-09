require('dotenv').load();

/*
 * requires
 */

var request = require('superagent');
var path = require('path');
var env = process.env;
var app = require('express')();

/*
 * middleware
 */

app.use(require('morgan')('dev'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('express').static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// home
app.get('/', function (req, res) {
  res.render('index', { welcome: env.WELCOME_MESSAGE });
});

// post
app.post('/invite', function (req, res) {
  var person = {
    first: req.body.first,
    last:  req.body.last,
    email: req.body.email
  };

  res.locals.person = person;
  res.locals.success = false;

  sendInvite(person, function (err, _) {
    if (err) {
      console.warn(err);
      res.locals.success = false;
      res.locals.error = err;
    } else {
      res.locals.success = true;
    }

    res.render('invite');
  });
});

/*
 * listen
 */

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('✓ http://%s:%s', host, port);
});

/**
 * send an invite
 *
 *     sendInvite({ first: "Rico", last: "SC", email: "r@s" });
 */

function sendInvite (person, fn) {
  function empty (str) {
    return str.toString().trim().length === 0;
  }

  if (empty(person.first) ||
      empty(person.last) ||
      empty(person.email))
    return fn(new Error("Invalid: fill in all fields"));

  if (!person.email.match(/^.+@.+$/))
    return fn(new Error("Invalid: email sucks"));

  var payload = {
    text: "An invite request was received",
    username: env.BOT_NAME,
    channel: env.BOT_CHANNEL,
    icon_emoji: env.BOT_EMOJI,
    attachments: [{
      fallback: [ person.email, person.first, person.last ].join(" / "),
      color: 'good',
      fields: [
        { title: 'First name', value: person.first, short: false },
        { title: 'Last name',  value: person.last, short: false },
        { title: 'Email',      value: person.email, short: false },
      ]
    }]
  };

  request
    .post(env.WEBHOOK_URL)
    .send('payload=' + JSON.stringify(payload))
    .end(fn);
}
