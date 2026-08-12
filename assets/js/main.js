/* University of Chenab — Homepage interactions */
(function () {
  "use strict";

  // Footer year
  var y = document.getElementById("ucYear");
  if (y) y.textContent = new Date().getFullYear();

  // Search drawer

  // Search drawer
  var searchDrawer = document.getElementById("ucSearch");
  var searchForm = searchDrawer ? searchDrawer.querySelector("form") : null;
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = searchForm.querySelector("input").value;
      if (input.trim() !== "") {
        // Calculate relative path to root based on current location
        var rootPath = document.querySelector('a.navbar-brand') ? document.querySelector('a.navbar-brand').getAttribute('href').replace('index.html', '').replace('./', '') : '';
        if (rootPath === '') {
          var depth = window.location.pathname.split('/').length - 2;
          if (depth > 0) rootPath = '../'.repeat(depth);
          else rootPath = './';
        }
        window.location.href = rootPath + "search.html?q=" + encodeURIComponent(input);
      }
    });
  }

  document.querySelectorAll("[data-uc-search]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!searchDrawer) return;
      searchDrawer.hidden = false;
      var input = searchDrawer.querySelector("input");
      if (input) input.focus();
    });
  });
  document.querySelectorAll("[data-uc-search-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { if (searchDrawer) searchDrawer.hidden = true; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchDrawer && !searchDrawer.hidden) searchDrawer.hidden = true;
  });

  // Program-finder tabs
  var tabs = document.querySelectorAll(".uc-tab");
  var panels = document.querySelectorAll("[data-panel]");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      panels.forEach(function (p) { p.hidden = p.id !== target; });
    });
  });

  // Header shadow on scroll
  var header = document.querySelector(".uc-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Dynamic Active Navigation State
  var currentUrl = window.location.href.split('#')[0].split('?')[0];
  var currentDir = currentUrl.substring(0, currentUrl.lastIndexOf('/'));

  var mainNavLinks = document.querySelectorAll('.uc-nav .nav-link');
  mainNavLinks.forEach(function (link) {
    link.classList.remove('active');
    var linkUrl = link.href.split('#')[0].split('?')[0];
    var linkDir = linkUrl.substring(0, linkUrl.lastIndexOf('/'));

    // Check direct link (if it's not a void link)
    if (!linkUrl.includes('javascript:void')) {
      if (currentUrl === linkUrl) {
        link.classList.add('active');
      } else if (currentDir === linkDir && currentDir !== '') {
        if (link.textContent.trim().toLowerCase() !== 'home') {
          link.classList.add('active');
        }
      }
    }

    // Check nested dropdown items
    var parentLi = link.closest('.v3-has-dropdown');
    if (parentLi) {
      var dropdownItems = parentLi.querySelectorAll('.v3-dropdown-item');
      dropdownItems.forEach(function(dropItem) {
        var dropUrl = dropItem.href.split('#')[0].split('?')[0];
        var dropDir = dropUrl.substring(0, dropUrl.lastIndexOf('/'));
        
        if (currentUrl === dropUrl) {
           link.classList.add('active');
        } else if (currentDir === dropDir && currentDir !== '') {
           // We ensure that we don't accidentally match root directory
           var urlObj = new URL(currentUrl);
           if (currentDir !== urlObj.origin) {
              link.classList.add('active');
           }
        }
      });
    }
  });

  var subNavLinks = document.querySelectorAll('.uc-subnav__links a');
  subNavLinks.forEach(function (link) {
    link.classList.remove('active');
    var linkUrl = link.href.split('#')[0].split('?')[0];
    if (currentUrl === linkUrl) {
      link.classList.add('active');
    }
  });

  // Subnav horizontal scroll click
  var subnavHints = document.querySelectorAll('.uc-subnav__hint');
  subnavHints.forEach(function (hint) {
    var subnavLinks = hint.parentElement.querySelector('.uc-subnav__links');
    if (subnavLinks) {
      hint.style.cursor = 'pointer';
      hint.style.transition = 'opacity 0.3s ease';

      hint.addEventListener('click', function () {
        subnavLinks.scrollBy({ left: 300, behavior: 'smooth' });
      });

      var checkScroll = function () {
        if (subnavLinks.scrollWidth <= subnavLinks.clientWidth) {
          hint.style.display = 'none';
        } else {
          hint.style.display = '';
          if (subnavLinks.scrollLeft + subnavLinks.clientWidth >= subnavLinks.scrollWidth - 5) {
            hint.style.opacity = '0';
            hint.style.pointerEvents = 'none';
          } else {
            hint.style.opacity = '1';
            hint.style.pointerEvents = 'auto';
          }
        }
      };

      subnavLinks.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      setTimeout(checkScroll, 100);
    }
  });

  // Mobile Dropdown Toggle (V3 Navigation)
  var v3Dropdowns = document.querySelectorAll('.v3-has-dropdown > .nav-link');
  v3Dropdowns.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 1199.98) {
        var parent = this.parentElement;
        var isOpen = parent.classList.contains('is-open');

        // Prevent default only if it has a dropdown to open
        if (parent.querySelector('.v3-dropdown-simple, .v3-dropdown-mega')) {
          e.preventDefault();
        }

        // Close others
        document.querySelectorAll('.v3-has-dropdown').forEach(function (el) {
          el.classList.remove('is-open');
        });

        if (!isOpen) {
          parent.classList.add('is-open');
        }
      }
    });
  });

})();
