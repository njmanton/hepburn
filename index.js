/******************************************************************************
index.js

main entry point for app

******************************************************************************/

var express = require('express'),
    app = express(),
    db = require('./database'),
    deadline = require('./config/config').deadline,
    player = require('./models/player'),
    pred = require('./models/prediction'),
    bp = require('body-parser'),
    bars = require('express-handlebars');

app.engine('.hbs', bars({
  defaultLayout: 'layout', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// set static route
app.use(express.static('assets'));
// use body-parser to get post data
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

// main page
app.get('/', function (req, res) {
  var now = new Date();
  res.render('main', {expired: (now > deadline) });
});

// handle user signup form
app.post('/signup', function(req, res) {
  player.create(req.body.username, req.body.email, function(check) {
    res.render('main', {signup: check});
  })
})

// get the results
app.get('/results', function(req, res) {
  pred.results(function(data) {
    res.render('results', { table: data });
  })
})

// routing for users
app.get('/player/:code', function (req, res) {
  player.exists(req.params.code, function(check) {
    if (check.id) {
      pred.preds(check.id, function(data) {
        if (data.code) {
          res.render('main', { error: data.code })
        } else {
          res.render('players', { user: check, data: data });  
        }
      })
    } else if (check.err) {
      res.render('main', { error: check.err })
    } else {
      res.render('main', { error: 'Code not Found' });
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
app.post('/category/winner', function(req, res) {
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