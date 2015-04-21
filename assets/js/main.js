$(function ($) {
  $.slidebars();

  var steps = [];

  if (images.length > 0) {
    $('.loader').addClass('loading');
    steps = scrollSteps(images.length);

    $.backstretch(images, {
      fade: 1800
    });
    $.backstretch('pause');
  }

  $(document).on("backstretch.before", function (e, instance, index) {
    $('.loader').addClass('loading');
  });

  $(document).on("backstretch.after", function (e, instance, index) {
    $('.loader').removeClass('loading');
  });

  $(document).on('scrollstop', function () {
    if (steps.length > 0) {
      var percentage = scrollPercentage();

      for (var i = 0; i < steps.length; i++) {
        if (percentage < steps[i]) {
          if (i == $("body").data("backstretch").index) {
            break;
          }

          $.backstretch('show', i);
          break;
        }
      }
    }
  });

  // ISOTOPE FILTERING
  var setupFilter = function (filter) {
    if (!!filter) {
      if (!!$('.iso-categories .category:not(".hide") a.' + filter).length) {
        $('.iso-categories .category a').removeClass('selected');
        $('.iso-categories .category a.' + filter).addClass('selected');
        $('.post-list .item').each(function (index, item) {
          if (!$(item).hasClass(filter)) {
            $(item).hide('slow');
          } else {
            $(item).show();
          }
        });
        window.location.hash = (filter);
      } else {
        window.location.hash = '';
      }
    }
  }

  setupFilter(window.location.hash.substr(1));
  var $container = $('.post-list');
  $('.iso-categories .category a').on('click', function (evt) {
    evt.preventDefault();
    $('.iso-categories .category a').removeClass('selected');
    var $_target = $(evt.currentTarget),
      filter = $_target.data('filter');
    $_target.addClass('selected');
    setupFilter(filter);
  });
});
