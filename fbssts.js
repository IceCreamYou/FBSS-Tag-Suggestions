// $Id$
Drupal.behaviors.fbssts = function (context) {
  var dest = $('.facebook_status_text:first');
  var fbssts_box = $('.fbssts_floating_suggestions');
  var fbssts_box_orig = fbssts_box.html();
  var t;
  dest.keypress(function(fbss_key) {
    if (t) {
      clearTimeout(t);
    }
    if (fbss_key.which == 35 && Drupal.settings.fbssts.show_on_form == 'on_hash') {
      fbssts_box.html(fbssts_box_orig);
      $('.fbssts_floating_suggestions a').click(function() {
        var tag = $(this).html();
        var textBeforeCursor = dest.textBeforeCursor(2);
        var firstChar = textBeforeCursor.text.substring(0, 1);
        if (tag.match(/\W/)) {
          tag = '[#'+ tag +']';
        }
        else {
          tag = '#'+ tag;
        }
        if (firstChar == '[' || textBeforeCursor.start < 1) {
          textBeforeCursor.replace(tag);
        }
        else {
          textBeforeCursor.replace(firstChar + tag);
        }
        var fbss_remaining = Drupal.settings.facebook_status.maxlength - dest.val().length;
        if (Drupal.settings.facebook_status.ttype == 'textfield' && fbss_remaining < 0) {
          fbss_remaining = 0;
        }
        fbss_print_remaining(fbss_remaining, dest.parent().next());
        fbssts_box.hide();
        dest.focus();
        return false;
      });
    }
    else if (fbss_key.which == 64 && Drupal.settings.fbssts.show_on_form == 'on_hash') {
      fbssts_box.load(Drupal.settings.basePath +'fbssts/load/users', function() {
        $('.fbssts_floating_suggestions a').click(function() {
          var tag = $(this).html();
          var textBeforeCursor = dest.textBeforeCursor(2);
          var firstChar = textBeforeCursor.text.substring(0, 1);
          if (tag.match(/\W/)) {
            tag = '[@'+ tag +']';
          }
          else {
            tag = '@'+ tag;
          }
          if (firstChar == '[' || textBeforeCursor.start < 1) {
            textBeforeCursor.replace(tag);
          }
          else {
            textBeforeCursor.replace(firstChar + tag);
          }
          var fbss_remaining = Drupal.settings.facebook_status.maxlength - dest.val().length;
          if (Drupal.settings.facebook_status.ttype == 'textfield' && fbss_remaining < 0) {
            fbss_remaining = 0;
          }
          fbss_print_remaining(fbss_remaining, dest.parent().next());
          fbssts_box.hide();
          dest.focus();
          return false;
        });
      });
    }
    else if (fbss_key.which != 35) {
      fbssts_box.html('');
      t = setTimeout(function() {
        var textBeforeCursor = dest.textBeforeCursor(100);
        fbssts_box.load(Drupal.settings.basePath +'fbssts/load',
          {'text': textBeforeCursor.text},
          function() {
            var tagStartsAt = textBeforeCursor.text.length - $('.fbssts_part_length').html();
            $('.fbssts_floating_suggestions a').click(function() {
              var tag = $(this).html();
              var op = textBeforeCursor.text.substring(tagStartsAt, tagStartsAt+1);
              if (op == '[') {
                op = textBeforeCursor.text.substring(tagStartsAt+1, tagStartsAt+2);
              }
              if (tag.match(/\W/)) {
                tag = '['+ op + tag +']';
              }
              else {
                tag = op + tag;
              }
              textBeforeCursor.replace(textBeforeCursor.text.substring(0, tagStartsAt) + tag);
              var fbss_remaining = Drupal.settings.facebook_status.maxlength - dest.val().length;
              if (Drupal.settings.facebook_status.ttype == 'textfield' && fbss_remaining < 0) {
                fbss_remaining = 0;
              }
              fbss_print_remaining(fbss_remaining, dest.parent().next());
              fbssts_box.hide();
              dest.focus();
              return false;
            });
          }
        );
      }, 250);
    }
    fbssts_box.show();
    fbssts_box.css('left', dest.offset().left);
    fbssts_box.css('top', dest.offset().top + dest.outerHeight() + 1);
  });
  dest.blur(function() {
    var t2 = setTimeout(function() { fbssts_box.hide(); }, 250);
  });
  if (Drupal.settings.fbssts.show_on_form == 'below_form') {
    $('.fbssts_inline_suggestions a').click(function() {
      var tag = $(this).html();
      if (tag.match(/\W/)) {
        tag = '[#'+ tag +']';
      }
      else {
        tag = '#'+ tag;
      }
      var textBeforeCursor = dest.textBeforeCursor(1);
      if (textBeforeCursor.text.match(/\S/)) {
        textBeforeCursor.replace(textBeforeCursor.text +' '+ tag);
      }
      else {
        textBeforeCursor.replace(textBeforeCursor.text + tag);
      }
      var fbss_remaining = Drupal.settings.facebook_status.maxlength - dest.val().length;
      if (Drupal.settings.facebook_status.ttype == 'textfield' && fbss_remaining < 0) {
        fbss_remaining = 0;
      }
      fbss_print_remaining(fbss_remaining, dest.parent().next());
      dest.focus();
      return false;
    });
  }
}

/**
 * Inspired by http://plugins.jquery.com/project/jCaret
 */
$.fn.textBeforeCursor=function(distanceBefore) {
  var t=this[0];
  if($.browser.msie){
    var range = document.selection.createRange();
    var stored_range = range.duplicate();
    stored_range.moveToElementText(t);
    stored_range.setEndPoint('EndToEnd', range);
    var e = stored_range.text.length - range.text.length;
    var s = e - distanceBefore;
  }
  else {
    var e = t.selectionStart, s = e - distanceBefore;
  }
  if (s < 0) {
    s = 0;
  }
  var te = t.value.substring(s, e);
  return {start: s, end: e, text: te, replace: function(st) {
    t.value = t.value.substring(0, s) + st + t.value.substring(e, t.value.length);
    var newloc = s + st.length;
    if($.browser.msie){
      var selRange = t.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', newloc);
      selRange.moveEnd('character', 0);
      selRange.select();
    }
    else {
      t.selectionStart = newloc;
      t.selectionEnd = newloc;
    }
  }};
};