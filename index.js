/******************************************************************************
index.js

main entry point for app

******************************************************************************/

var express = require('express'),
    app = express(),
    db = require('./database'),
    pkg = require('./package.json'),
    config = require('./config/config'),
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

app.locals.env = config.env;
app.locals.ver = pkg.version;
app.locals.app = pkg.name;
app.locals.expired = config.expired;

require('./routes')(app);

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
