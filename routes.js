module.exports = function(app) {

  var player = require('./models/player'),
      pred = require('./models/prediction'),
      config = require('./config/config'),
      mailer = require('./models/mailer');

    // main page
  app.get('/', function (req, res) {
    res.render('main', { signups: config.placeholders() });
  });

  app.get('/about', function(req, res) {
    res.render('about');
  })

  // handle user signup form
  app.post('/signup', function(req, res) {
    player.create(req.body.username, req.body.email, function(check) {
      if (check.code) {
        mailer.send(req.body.username, req.body.email, check.code, function(result) {
          //console.log(result);
        })
      }
      res.render('main', { signup: check, signups: config.placeholders() });
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
            res.render('main', { error: data.code, signups: config.placeholders() })
          } else {
            res.render('players', { user: check, data: data });  
          }
        })
      } else {
        res.render('main', { error: check.err, signups: config.placeholders() })
      } 
    })
  })

  // handle prediction update
  app.post('/prediction', function(req, res) {
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
    if (req.params.cat > 0 && req.params.cat < 25) {
      pred.getwinner(req.params.cat, function(film) {
        pred.category(req.params.cat, function(cat) {
          res.render('category', {film: film[0], table: cat});
        })
      }) 
    } else {
      res.send('Invalid category');
    }

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

}