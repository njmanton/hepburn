var mysql = require('mysql');
var credentials = require('./config/config');

var state = { pool: null, mode: null };

exports.conn = function(done) {
  state.pool = mysql.createPool(credentials.conn);
  done();
}

exports.use = function() {
  return state.pool;
}
