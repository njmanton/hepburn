/* main.js */

$(document).ready(function() {

  // category.hbs
  var cat = $('h3').data('cat');
  $('#category .bar').each(function(i) {
    var _this = $(this);
    var len = _this.data('len');
    var col = (_this.data('win')) ? 'win' : '';
    if (!i) {
      width = 100;
      max_count = len;
    } else {
      width = len/max_count * 100; 
    }
    _this
      .addClass(col)
      .animate({
        width: width + '%'
      }, 900);
  }).on('mouseover touchhold', function(e) {
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
      width = (len) ? 100 : 0;
      max_count = len;
      _this.addClass('win');
    } else {
      width = len / max_count * 100;
    }
    _this.animate({
        width: width + '%'
      }, 900);
  })

  // main.hbs
  $('#signup-submit').attr('disabled', 'disabled');
  $('#signup #username').on('keyup', function() {
    
    var uname = $(this).val();
    if (uname.length > 2) {
      $.ajax({
        type: 'POST',
        url: '/player/check',
        data: { type: 1, value: uname},
        beforeSend: function() {
          $('#username-not-valid').show().html('<img src="/img/ajax-loader.gif" alt="..." />');
        }
      }).done(function(res) {
        if (res === true) { // name is ok
          $('#username-not-valid')
            .removeClass('err')
            .addClass('success')
            .html('&#10003;')
            .show();
        } else {
          $('#username-not-valid')
            .addClass('err')
            .removeClass('success')
            .text('taken')
            .show();
        }
        checkForm();
      });
    } else {
      $('#username-not-valid').hide();
    }
    checkForm();
      
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
          $('#email-not-valid')
            .removeClass('err')
            .addClass('success')
            .html('&#10003;')
            .show();
        } else {
          $('#email-not-valid')
            .addClass('err')
            .removeClass('success')
            .text('taken')
            .show();
        }   
        checkForm();       
      });
    } else {
      env.show().removeClass('success').addClass('err').html('!');
    }
    checkForm();
  })

  function checkForm() {
    var submit = $('#signup-submit');
    var state = ($('#email-not-valid').hasClass('success') && ($('#username').val().length > 2) && $('#username-not-valid').hasClass('success'));
    if (state) {
      submit.removeAttr('disabled');
    } else {
      submit.attr('disabled', 'disabled');
    }
  }

  // players.hbs

  $('.rev-nom').on('click', function() {
    var _this = $(this),
        img   = _this.find('img'),
        imgs  = _this.parent().find('img');
    imgs.removeClass('picked');
    img.addClass('picked');

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
        var target = _this.parent().parent().find('.poster > img'),
            head = _this.parent().parent().find('.cat-head');
        target.replaceWith(_this.children('img').clone());
        target.removeClass('picked');
        head.addClass('picked');
      }
    }).fail(function(e) {
      console.log('update prediction failed', e);
    })
  })

  $('#category_list').on('change', function() {
    var idx = $('#category_list :selected').val() * 1;
    window.location.href = '/category/' + idx;
  })

})