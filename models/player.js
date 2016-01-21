var db = require('../database');

// lookup user from code
exports.exists = function(code, done) {

  if (!code || code.length != 8) {
    done(false);
  } else {
    var sql = 'SELECT id, username FROM users WHERE code = ? LIMIT 1';
    var user = {};
    db.use().query(sql, code, function(err, rows) {
      var result = { err: null, id: null, name: null };
      if (err) {
        result.err = err.code;
      } else {
        result.id = rows[0].id;
        result.name = rows[0].username;
      }
      done(result);
    });
  }
}

// check if username or email is unique
exports.unique = function(type, val, done) {

  var fld = (type == 1) ? 'username' : 'email';
  if (type == 1) {
    var sql = 'SELECT id FROM users WHERE username = ?';
  } else if (type == 2) {
    var sql = 'SELECT id FROM users WHERE email = ?';
  }
  
  db.use().query(sql, val, function(err, rows) {
    if (err) {
      done(null);
    } else {
      done(rows.length == 0);
    }
  })

}

// create a new user record from signup data
exports.create = function(username, email, done) {

  var len = 8,
      code = '', 
      letters = '2346789ABCDEFGHJKLMNPQRTUVWXYZ'; // don't use easily confused chars, e.g. I and 1
  
  // generate a random code
  for (var i = 0; i < len; i++) {
    var idx = Math.floor(Math.random() * (letters.length - 1));
    code += letters[idx];
  }

  var user = {
    username: username, 
    email: email, 
    code: code 
  };
  var sql = 'INSERT INTO users SET ?';
  db.use().query(sql, user, function(err, rows) {
    var result = {
      error: null,
      code: null
    };
    if (err) {
      result.error = err.code;
    } else {
      result.code = code;
    }
    done(result);
  })

}