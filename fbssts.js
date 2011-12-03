Drupal.behaviors.fbssts = function (context) {
  var dest = $('.facebook-status-text:first', context);
  var fbssts_box = $('.fbssts-suggestions');
  var t;
  var maxlen = Drupal.settings.facebook_status.maxlength;
  fbssts_box.css('left', dest.offset().left);
  fbssts_box.css('top', dest.offset().top + dest.outerHeight() + 1);
  dest.keypress(function(fbss_key) {
    if (t) {
      clearTimeout(t);
    }
    if (fbss_key.which != 35 && fbss_key.which != 64) {
      fbssts_box.empty();
      t = setTimeout(function() {
        // Get the last 100 characters before the cursor.
        var textBeforeCursor = dest.textBeforeCursor(100);
        // Check if these characters could contain a tag.
        if (textBeforeCursor.text.indexOf('#') < 0 && textBeforeCursor.text.indexOf('@') < 0) {
          return;
        }
        // We might have a tag, so load in our suggestions.
        fbssts_box.load(Drupal.settings.basePath +'index.php?q=fbssts/load',
          {'text': textBeforeCursor.text},
          function(response) {
            if (!response) {
              return;
            }
            fbssts_box.css('display', 'inline-block');
            var tagStartsAt = textBeforeCursor.text.length - $('.fbssts-part-length').html();
            $('.fbssts-suggestions li').click(function() {
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
              if (maxlen > 0) {
                fbss_print_remaining(maxlen - dest.val().length, dest.parents('.facebook-status-update').find('.facebook-status-chars'));
              }
              fbssts_box.hide();
              dest.focus();
              return false;
            });
          }
        );
      }, 333);
    }
  });
  dest.blur(function() {
    var t2 = setTimeout(function() { fbssts_box.hide(); }, 250);
  });
}

/**
 * Inspired by http://plugins.jquery.com/project/jCaret
 */
$.fn.textBeforeCursor = function(distanceBefore) {
  var t = this[0];
  if($.browser.msie) {
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
