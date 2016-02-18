var settings = require('../config/config');
var mailgun = require('mailgun-js')(settings.mailgun);

exports.send = function(recipient, email, code, done) {

  var msg = 'Hi ' + recipient + ', \n\n';
  msg += 'Thanks for signing up for the Oscar prediction game. Your unique code is ';
  msg += code + '\nYou can start making predictions at http://oscars.mantonbradbury.com/player/' + code;
  msg += '\n\n';
  msg += 'The deadline for making predictions will close at midday GMT on Feb 28\n\n';
  msg += 'Good luck!';

  var data = {
    from    : 'Oscar Preds <admin@lccsl.org>',
    to      : email,
    bcc     : 'njmanton@gmail.com',
    subject : 'Your Oscar Predictions code',
    text    : msg
  };

  mailgun.messages().send(data, function (error, body) {
    
    if (error) {
      done(error);
    } else {
      done(body);
    }

  });

}
