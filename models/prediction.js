var db = require('../database');

// find all nominees and predictions for selected player
exports.preds = function(uid, done) {

  // horrible convoluted query and subquery to get predictions :-(
  var sql = 'SELECT N.image, N.film, N.id AS nid, N.name AS nominee, C.weight, C.id AS cid, C.name AS category, (I.nominee_id > 0) AS pred FROM nominees N JOIN categories C ON N.category_id = C.id LEFT JOIN (SELECT category_id, nominee_id FROM predictions P WHERE user_id = ?) I ON (I.category_id = C.id AND I.nominee_id = N.id) ORDER BY cid, nid';
  db.use().query(sql, uid, function(err, rows) {

    if (err) {
      console.log(err);
      done(err);
    } else {
      var data = [];
      var pcid = 0;
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row.cid != pcid) {
          data[row.cid - 1] = {
            id: row.cid,
            category: row.category,
            weight: row.weight,
            noms: []
          }
        }
        data[row.cid - 1].noms.push({
          id: row.nid,
          name: row.nominee,
          film: row.film,
          image: row.image,
          pred: row.pred
        })
        pcid = row.cid;
      }
      done(data);
    }
  })
}

// save a prediction to db
exports.save = function(body, done) {

  if (body.cat && body.user && body.nom) {
    // first see if there's an existing row
    var sql = 'SELECT id FROM predictions WHERE user_id = ? AND category_id = ?';
    db.use().query(sql, [body.user, body.cat], function(err, rows) {
      if (rows && rows.length) { // row exists so update
        db.use().query('UPDATE predictions SET ? WHERE id = ?', [{ user_id: body.user, category_id: body.cat, nominee_id: body.nom }, rows[0].id], function(err, rows) {
          done(rows.affectedRows.toString());
        })
      } else { // row doesn't exist so insert
        db.use().query('INSERT INTO predictions SET ?', { user_id: body.user, category_id: body.cat, nominee_id: body.nom }, function(err, rows) {
          done(rows.affectedRows.toString());
        })
      }
    })
  } else {
    // parameters not properly sent
    done(false);
  }
  
}

// gets all predictions by nominee for a given category
exports.category = function(cat, done) {

  var sql = 'SELECT N.id, N.name, COUNT(P.id) AS cnt, (C.winner_id = N.id) AS winner FROM predictions P JOIN nominees N ON N.id = P.nominee_id JOIN categories C ON C.id = P.category_id WHERE P.category_id = ? GROUP BY N.id ORDER BY cnt DESC';
  db.use().query(sql, cat, function(err, rows) {
    if (err) {
      done(err);
    } else {
      done(rows);
    }
  })
}

// gets the winner of a category
exports.getwinner = function(cat, done) {

  db.use().query('SELECT C.name AS category, N.id, N.name AS winner, N.film, N.image FROM categories C LEFT JOIN nominees N ON C.winner_id = N.id WHERE C.id = ?', cat, function(err, rows) {
    if (err) {
      console.log('getwinner1', err);
      done(err);
    } else {
      console.log('getwinner2', rows);
      done(rows);
    }
  })

}

exports.setwinner = function(data, done) {
  var result = { err: null, update: false };
  var sql = 'SELECT admin FROM users WHERE code = ? LIMIT 1';
  db.use().query(sql, data.code, function(err, rows) {
    if (err) {
      result.err = err.code;
    } else {
      if (rows.length && rows[0].admin) {
        db.use().query('UPDATE categories SET winner_id = ? WHERE id = ?', [data.winner, data.cat], function(err, rows) {
          if (err) {
            result.err = err.code;
          } else {
            result.update = rows;
          }
        })
      } else {
        result.err = 'Not an admin';
      }
    }
    done(result);
  })
}

exports.results = function(done) {

  var sql = 'SELECT username AS player, SUM((winner_id = nominee_id) * weight) AS score FROM predictions P INNER JOIN categories C ON C.id = P.category_id INNER JOIN users U ON U.id = P.user_id GROUP BY username ORDER BY 2 DESC';
  db.use().query(sql, function(err, rows) {
    var result = { error: null, data: null };
    if (err) {
      result.error = err;
    } else {
      result.data = rows;
    }
    done(result);
  })
}