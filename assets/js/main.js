/* main.js */

$(document).ready(function() {

  // category.hbs
  var cat = $('h3').data('cat');
  $('#category .bar').each(function(i) {
    var _this = $(this);
    var len = _this.data('len');
    var col = (_this.data('win')) ? 'green' : 'red';
    if (!i) {
      width = 100;
      max_count = len;
    } else {
      width = len/max_count * 100; 
    }
    _this
      .css('background-color', col)
      .animate({
        width: width + '%'
      }, 900);
  }).on('mouseover', function(e) {
    var _this = $(this);
    $.ajax({
      type: 'GET',
      url: '/prediction/userbycat/' + cat + '/' + _this.data('nid')
    }).done(function(res) {
      var label = '';
      for (var i = 0; i < res.length; i++) {
        label = label + res[i].username + '\n';
      }
      _this.attr('title', label);
    })
  })

  // results.hbs
  $('#results .bar').each(function(i) {
    var _this = $(this),
        len = _this.data('len'),
        col = '';

    if (!i) {
      width = 100;
      max_count = len;
      col = 'green';
    } else {
      width = len / max_count * 100;
      col = 'red';
    }
    _this
      .css('background-color', col)
      .animate({
        width: width + '%'
      }, 900);
  })

  // main.hbs
  $('#signup-submit').attr('disabled', 'disabled');
  $('#signup #username').on('keyup', function() {
    
    var uname = $(this).val();
    if (uname.length > 2) {
      $('#signup-submit').removeAttr('disabled');
      $.ajax({
        type: 'POST',
        url: '/player/check',
        data: { type: 1, value: uname},
        beforeSend: function() {
          $('#username-not-valid').show().html('<img src="/img/ajax-loader.gif" alt="..." />');
        }
      }).done(function(res) {
        if (res === true) { // name is ok
          $('#signup-submit').removeAttr('disabled');
          $('#username-not-valid').removeClass('err').show().html('&#10003;');
        } else {
          $('#signup-submit').attr('disabled', 'disabled');
          $('#username-not-valid').addClass('err').show().text('taken');
        }
      });
    } else {
      $('#username-not-valid').hide();
      $('#signup-submit').attr('disabled', 'disabled');
    }
      
  })

  $('#signup #email').on('keyup', function() {
    var email = $('#email').val(),
        env = $('#email-not-valid'),
        re = /\S+@\S+\.\S+/;

    if (email.match(re)) {
      $.ajax({
        type: 'POST',
        url: '/player/check',
        data: { type: 2, value: email }
      }).done(function(res) {
        if (res === true) {
          $('#signup-submit').removeAttr('disabled');
          $('#email-not-valid').removeClass('err').show().html('&#10003;');
        } else {
          $('#signup-submit').attr('disabled', 'disabled');
          $('#email-not-valid').addClass('err').show().text('taken');
        }          
      });
    } else {
      env.show().removeClass('success').addClass('err').html('!');
      $('#signup-submit').attr('disabled', 'disabled');        
    }
  })

  // players.hbs
  $('.cat-head').on('click', function() {
    //$(this).siblings('.noms').toggle();
  })

  // set ticks on all category titles that have a selection
  $('.small-nom').on('click', function() {
    var _this = $(this);
    _this.removeClass('imgfade').addClass('picked').siblings().removeClass('picked').addClass('imgfade');
    $.ajax({
      type: 'POST',
      url: '/prediction',
      data: {
        cat: _this.parent().data('cat'),
        user: $('#head').data('uid'),
        nom: _this.data('nom')
      }
    }).done(function(e) {
      if (e) {
        // the prediction has been saved so change the outer poster image to match the pick
        // and either highlight the pick in the modal, or auto-close the modal
        var target = _this.parent().parent().find('.pick-img');
        target.attr('src', _this.children('img').attr('src'));
        target.attr('alt', _this.children('img').attr('alt'));
        target.attr('title', _this.children('img').attr('title'));
      }
    }).fail(function(e) {
      console.log('update prediction failed', e);
    })
  })

})