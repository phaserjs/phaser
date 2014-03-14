(function($) {
$.fn.toc = function(options) {
  var self = this;
  var opts = $.extend({}, jQuery.fn.toc.defaults, options);

  var container = $(opts.container);
  var headings = $(opts.selectors, container);
  var headingOffsets = [];
  var activeClassName = opts.prefix+'-active';

  var scrollTo = function(e) {
    if (opts.smoothScrolling) {
      e.preventDefault();
      var elScrollTo = $(e.target).attr('href');
      var $el = $(elScrollTo);

      $('body,html').animate({ scrollTop: $el.offset().top }, 400, 'swing', function() {
        location.hash = elScrollTo;
      });
    }
    $('li', self).removeClass(activeClassName);
    $(e.target).parent().addClass(activeClassName);
  };

  //highlight on scroll
  var timeout;
  var highlightOnScroll = function(e) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      var top = $(window).scrollTop(),
        highlighted;
      for (var i = 0, c = headingOffsets.length; i < c; i++) {
        if (headingOffsets[i] >= top) {
          $('li', self).removeClass(activeClassName);
          highlighted = $('li:eq('+(i-1)+')', self).addClass(activeClassName);
          opts.onHighlight(highlighted);
          break;
        }
      }
    }, 50);
  };
  if (opts.highlightOnScroll) {
    $(window).bind('scroll', highlightOnScroll);
    highlightOnScroll();
  }

  //Perform search and hide unmatched elements
  var tocList;
  var treeObject = {};

  //Create the tree
  var createTree = function(ul) {
    var prevLevel = {level: -1, index: -1, parent: -1, val: ''};
    var levelParent = {0: -1};
    tocList = ul.children("li");
    tocList.each(function(i) {
      var me = $(this).removeClass("toc-active");
      var currentLevel = parseInt(me.attr('class').trim().slice(-1));
      if (currentLevel > prevLevel.level) {
        currentParent = prevLevel.index;
      } else if (currentLevel == prevLevel.level) {
        currentParent = prevLevel.parent;
      } else if (currentLevel < prevLevel.level) {
        currentParent = levelParent[currentLevel] || prevLevel.parent;
      }
      levelParent[currentLevel] = currentParent;
      var currentVal = $('a', this).text().trim().toLowerCase();
      treeObject[i] = {
        val: currentVal,
        level: currentLevel,
        parent: currentParent
      }
      prevLevel = {index: i, val: currentVal, level: currentLevel, parent: currentParent};
    });
  }

  //Show the parents recursively
  var showParents = function(key) {
    var me = treeObject[key];
    if (me.parent > -1) {
      $(tocList[me.parent]).show();
      showParents(me.parent);
    }
  };

  //Perform the search
  var search = function(searchVal) {
    searchVal = searchVal.trim().toLowerCase();
    for (var key in treeObject) {
      var me = treeObject[key];
      if (me.val.indexOf(searchVal) !== -1 || searchVal.length == 0) {
        $(tocList[key]).show();
        if ($(tocList[me.parent]).is(":hidden")) {
         showParents(key);
        }
      } else {
        $(tocList[key]).hide();
      }
    }
  }

  return this.each(function() {
    //build TOC
    var el = $(this);
    var searchVal = '';
    var searchForm = $("<form/>", {class: "form-search quick-search"})
      .append($("<input/>", {type: "text", class: "input-medium search-query", placeholder: "Quick Search"}))
      .append($("<i/>", {class: "icon icon-search search-icon"}));
    searchForm.css({'position': 'fixed', 'top': '45px', 'padding-right': '20px'});
    $(".search-icon", searchForm).css({'marginLeft': '-20px', 'marginTop': '3px'});

    var ul = $('<ul/>');
    headings.each(function(i, heading) {
      var $h = $(heading);
      headingOffsets.push($h.offset().top - opts.highlightOffset);

      //add anchor
      var anchor = $('<span/>').attr('id', opts.anchorName(i, heading, opts.prefix)).insertBefore($h);

      //build TOC item
      var a = $('<a/>')
        .text(opts.headerText(i, heading, $h))
        .attr('href', '#' + opts.anchorName(i, heading, opts.prefix))
        .bind('click', function(e) { 
          scrollTo(e);
          el.trigger('selected', $(this).attr('href'));
        });

      var li = $('<li/>')
        .addClass(opts.itemClass(i, heading, $h, opts.prefix))
        .append(a);

      ul.append(li);
    });
    el.html(ul);
    el.parent().prepend(searchForm);
    el.css({'top': '80px'});

    //create the tree
    createTree(ul)
    //set intent timer
    var intentTimer;
    var accumulatedTime = 0;
    //bind quick search
    el.siblings('.quick-search').children('.search-query').bind('keyup', function(e) {
      if (accumulatedTime < 1000) {
        window.clearTimeout(intentTimer);
      }
      var me = $(this);

      if (me.val().length > 0) {
        $(".search-icon").removeClass("icon-search").addClass("icon-remove-circle").css('cursor', 'pointer');
      } else {
        $(".search-icon").removeClass("icon-remove-circle").addClass("icon-search").css('cursor', 'auto');
      }

      var intentTime = 500 - (me.val().length * 10);
      accumulatedTime += intentTime;
      intentTimer = window.setTimeout(function() {
        if (searchVal == me.val()) {
          return false;
        }
        searchVal = me.val();
        search(me.val());
        accumulatedTime = 0;
      }, intentTime);
    });

    // Make text clear icon work
    $(".search-icon").click(function(e) {
      if($(this).hasClass('icon-remove-circle')) {
        $('.search-query').val('').trigger('keyup');
      } else {
        $('.search-query').focus();
      }
    });

    //set positions of search box and TOC
    var navHeight = $(".navbar").height();
    var searchHeight = $(".quick-search").height();
    $(".quick-search").css({'top': navHeight + 10 + 'px', 'position': 'fixed'});
    el.css('top', navHeight + searchHeight + 15 + 'px');
  });
};


jQuery.fn.toc.defaults = {
  container: 'body',
  selectors: 'h1,h2,h3',
  smoothScrolling: true,
  prefix: 'toc',
  onHighlight: function() {},
  highlightOnScroll: true,
  highlightOffset: 100,
  anchorName: function(i, heading, prefix) {
    return prefix+i;
  },
  headerText: function(i, heading, $heading) {
    return $heading.text();
  },
  itemClass: function(i, heading, $heading, prefix) {
    return prefix + '-' + $heading[0].tagName.toLowerCase();
  }

};

})(jQuery);
