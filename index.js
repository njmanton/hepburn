/******************************************************************************
index.js

main entry point for app

******************************************************************************/

var express = require('express'),
    app = express(),
    db = require('./database'),
    config = require('./config/config'),
    player = require('./models/player'),
    pred = require('./models/prediction'),
    bp = require('body-parser'),
    bars = require('express-handlebars'),
    mailer = require('./models/mailer');

app.engine('.hbs', bars({
  defaultLayout: 'layout', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// set static route
app.use(express.static('assets'));
// use body-parser to get post data
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

// get the current datetime
var expired = (new Date() > config.deadline);

// main page
app.get('/', function (req, res) {
  res.render('main', { expired: expired, signups: config.placeholders() });
});

app.get('/about', function(req, res) {
  res.render('about');
})

// handle user signup form
app.post('/signup', function(req, res) {
  player.create(req.body.username, req.body.email, function(check) {
    if (check.code) {
      mailer.send(req.body.username, req.body.email, check.code, function(result) {
        console.log(result);
      })
    }
    res.render('main', { signup: check, signups: config.placeholders() });
  })
})

// get the results
app.get('/results', function(req, res) {
  pred.results(function(data) {
    res.render('results', { table: data, expired: expired });
  })
})

// routing for users
app.get('/player/:code', function (req, res) {
  player.exists(req.params.code, function(check) {
    if (check.id) {
      pred.preds(check.id, function(data) {
        if (data.code) {
          res.render('main', { error: data.code, signups: config.placeholders() })
        } else {
          res.render('players', { user: check, data: data, expired: expired });  
        }
      })
    } else {
      res.render('main', { error: check.err, signups: config.placeholders() })
    } 
  })
})

// handle prediction update
app.post('/prediction', function(req, res) {
  // payload should look something like {user_id (code), category, nominee}
  pred.save(req.body, function(response) {
    res.send(response);
  })
})

// handle setting a category winner
app.post('/setwinner', function(req, res) {
  pred.setwinner(req.body, function(check) {
    res.send(check);
  })
})

// render a view of a category, with predictions
app.get('/category/:cat', function(req, res) {
  pred.getwinner(req.params.cat, function(film) {
    pred.category(req.params.cat, function(cat) {
      res.render('category', {film: film[0], table: cat});
    })
  })
})

// check the uniqueness of a signups name and email
app.post('/player/check', function(req, res) {
  player.unique(req.body.type, req.body.value, function(check) {
    res.send(check);
  })
})

// get list of users predicting nom in cat
app.get('/prediction/userbycat/:cat/:nom', function(req, res) {
  pred.getUsersByBet(req.params.cat, req.params.nom, function(list) {
    res.send(list);
  })
})

app.get('/test/email', function(req, res) {
  mailer.send('Nick', null, 'ARUDMVDQ', function(body) {
    if (body) {
      res.send(body);
    } else {
      res.send('Error');
    }
  });
})

// start the server
db.conn(function(err) {
  if (err) {
    console.log('Can\'t connect to MySQL');
  } else {
    app.listen(3000, function () {
      console.log('Express and MySQL running');
    })
  }
})
