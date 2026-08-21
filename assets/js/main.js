/* University of ChenabHomepage interactions */
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

  // Dynamic Active Navigation State Ã¢â‚¬â€ "winner takes all" approach
  // Collects all candidates with scores, then activates only the best match.
  var currentUrl = window.location.href.split('#')[0].split('?')[0];
  var currentPath = window.location.pathname; // e.g. /research/oric.html
  var currentSegment = currentPath.split('/').filter(Boolean)[0] || ''; // e.g. "research"

  var mainNavLinks = document.querySelectorAll('.uc-nav .nav-link');
  var bestMatch = null;
  var bestScore = -1;

  mainNavLinks.forEach(function (link) {
    link.classList.remove('active');
    var score = -1;

    var parentLi = link.closest('.uc-has-dropdown');
    if (parentLi) {
      var dropdownItems = parentLi.querySelectorAll('.uc-dropdown-item');
      dropdownItems.forEach(function(dropItem) {
        var dropUrl = dropItem.href.split('#')[0].split('?')[0];
        if (currentUrl === dropUrl) {
          // Exact match Ã¢â‚¬â€ score based on how closely the link's own folder matches current segment
          var dropPath = (new URL(dropItem.href)).pathname;
          var dropSegment = dropPath.split('/').filter(Boolean)[0] || '';
          var s = (dropSegment === currentSegment) ? 2 : 1;
          if (s > score) score = s;
        }
      });
    }

    // Direct link (non-void)
    var linkUrl = link.href ? link.href.split('#')[0].split('?')[0] : '';
    if (linkUrl && !linkUrl.includes('javascript:void') && currentUrl === linkUrl) {
      if (3 > score) score = 3; // highest priority
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = link;
    }
  });

  if (bestMatch && bestScore >= 0) {
    bestMatch.classList.add('active');
  }

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

  // Mobile Dropdown Toggle (updated Navigation)
  var dropdowns = document.querySelectorAll('.uc-has-dropdown > .nav-link');
  dropdowns.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 1199.98) {
        var parent = this.parentElement;
        var isOpen = parent.classList.contains('is-open');

        // Prevent default only if it has a dropdown to open
        if (parent.querySelector('.uc-nav-dropdown, .uc-nav-mega')) {
          e.preventDefault();
        }

        // Close others
        document.querySelectorAll('.uc-has-dropdown').forEach(function (el) {
          el.classList.remove('is-open');
        });

        if (!isOpen) {
          parent.classList.add('is-open');
        }
      }
    });
  });

})();


  /* ---------- Hero rotator ---------- */
  (function() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".uc-hero-main__slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".uc-hero-main__dots button"));
    if (slides.length > 1) {
      var index = 0;
      var timer = null;
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      var show = function (next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
        dots.forEach(function (d, i) { d.setAttribute("aria-current", i === index ? "true" : "false"); });
      };

      var play = function () {
        if (reduced) return;
        clearInterval(timer);
        timer = setInterval(function () { show(index + 1); }, 2000);
      };

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () { show(i); play(); });
      });

      show(0);
      play();
    }
  })();


/* ============================================================
   Homepage interactions
   ============================================================ */

/* University of Chenab Ã¢â‚¬â€ Homepage
 interactions
   Scope: mega-menu, sticky header, portals dropdown, search drawer,
   hero rotator, animated counters, program finder. Vanilla JS, no deps. */
(function () {
  "use strict";

  var doc = document;

  /* ---------- Footer year ---------- */
  var year = doc.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = doc.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Utility-bar portals dropdown ---------- */
  var portals = doc.querySelector(".portals");
  if (portals) {
    var pTrigger = portals.querySelector(".portals__trigger");
    var closePortals = function () {
      portals.classList.remove("is-open");
      pTrigger.setAttribute("aria-expanded", "false");
    };
    pTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = portals.classList.toggle("is-open");
      pTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    doc.addEventListener("click", function (e) {
      if (!portals.contains(e.target)) closePortals();
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePortals();
    });
  }

  /* ---------- Mega menu (click + hover + keyboard) ---------- */
  var megaItems = Array.prototype.slice.call(doc.querySelectorAll(".nav__item.has-mega"));
  var closeAllMega = function (except) {
    megaItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove("is-open");
      var btn = item.querySelector(".nav__link");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  };

  megaItems.forEach(function (item) {
    var btn = item.querySelector(".nav__link");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains("is-open");
      closeAllMega(item);
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    var hoverTimer;
    item.addEventListener("mouseenter", function () {
      if (window.matchMedia("(min-width: 1200px)").matches) {
        clearTimeout(hoverTimer);
        closeAllMega(item);
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
    item.addEventListener("mouseleave", function () {
      if (window.matchMedia("(min-width: 1200px)").matches) {
        hoverTimer = setTimeout(function () {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }, 140);
      }
    });
  });

  doc.addEventListener("click", function (e) {
    if (!e.target.closest(".nav__item")) closeAllMega(null);
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllMega(null);
  });

  /* ---------- Search drawer ---------- */
  var searchDrawer = doc.getElementById("search");
  doc.querySelectorAll("[data-search]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!searchDrawer) return;
      searchDrawer.hidden = !searchDrawer.hidden;
      if (!searchDrawer.hidden) {
        var input = searchDrawer.querySelector("input");
        if (input) input.focus();
      }
    });
  });
  doc.querySelectorAll("[data-search-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (searchDrawer) searchDrawer.hidden = true;
    });
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchDrawer && !searchDrawer.hidden) searchDrawer.hidden = true;
  });


  /* ---------- updated Hero Premium Slider ---------- */
  var slides = Array.prototype.slice.call(doc.querySelectorAll(".uc-hero-slide"));
  var progressItems = Array.prototype.slice.call(doc.querySelectorAll(".uc-hero-progress-item"));
  if (slides.length > 1 && progressItems.length > 0) {
    var index = 0;
    var timer = null;
    var duration = 2500; // Fast 2.5s duration for a video-like kinetic feel

    // Apply baseline styles to make transitions smooth and fast
    slides.forEach(function(s) {
       s.style.transition = "opacity 0.6s ease-in-out, transform 4s ease-out";
       s.style.position = "absolute";
       s.style.top = "0";
       s.style.left = "0";
       s.style.width = "100%";
       s.style.height = "100%";
       s.style.backgroundSize = "cover";
       s.style.backgroundPosition = "center";
       s.style.opacity = "0";
       s.style.transform = "scale(1.05)";
    });

    var show = function (next) {
      index = (next + slides.length) % slides.length;
      
      slides.forEach(function (s, i) { 
        if (i === index) {
          s.classList.add("is-active");
          s.style.opacity = "1";
          s.style.transform = "scale(1)";
        } else {
          s.classList.remove("is-active");
          s.style.opacity = "0";
          s.style.transform = "scale(1.05)";
        }
      });

      progressItems.forEach(function (p, i) { 
        if (i === index) {
          p.classList.add("is-active");
        } else {
          p.classList.remove("is-active");
        }
      });
    };

    var play = function () {
      clearInterval(timer);
      timer = setInterval(function () { show(index + 1); }, duration);
    };

    progressItems.forEach(function (item, i) {
      item.style.cursor = "pointer";
      item.addEventListener("click", function () { 
        show(i); 
        play(); 
      });
    });

    show(0);
    play();
  }

  /* ---------- Animated counters ---------- */
  var counters = Array.prototype.slice.call(doc.querySelectorAll("[data-count]"));
  if (counters.length && "IntersectionObserver" in window) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }
      var start = null;
      var dur = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Program finder ---------- */
  var finder = doc.getElementById("finder");
  if (finder) {
    finder.addEventListener("submit", function (e) {
      e.preventDefault();
      var level = finder.querySelector("#level").value;
      var faculty = finder.querySelector("#faculty").value;
      var q = finder.querySelector("#keyword").value.trim();
      var params = [];
      if (level) params.push("level=" + encodeURIComponent(level));
      if (faculty) params.push("faculty=" + encodeURIComponent(faculty));
      if (q) params.push("q=" + encodeURIComponent(q));
      window.location.href = "./admissions/degree-finder.html" + (params.length ? "?" + params.join("&") : "");
    });
  }

  /* ---------- Accreditation rail arrows ---------- */
  var rail = doc.querySelector(".accred__track");
  doc.querySelectorAll("[data-rail]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!rail) return;
      var dir = btn.getAttribute("data-rail") === "prev" ? -1 : 1;
      rail.scrollBy({ left: dir * 340, behavior: "smooth" });
    });
  });

  /* ---------- Active Navbar Link Auto-highlight ---------- */
  var navLinks = doc.querySelectorAll(".nav__link");
  var currentUrl = window.location.href.split('?')[0].split('#')[0];
  
  navLinks.forEach(function (link) {
    if (!link.href) return;
    
    // 1. Exact match (handles root and direct page hits)
    if (link.href.split('?')[0].split('#')[0] === currentUrl) {
      link.classList.add("active");
      return;
    }
    
    // 2. Sub-section matching (e.g. highlighting "Academics" when on "/academics/postgraduate.html")
    var hrefAttr = link.getAttribute("href");
    if (hrefAttr && hrefAttr.startsWith("./") && hrefAttr.endsWith("/index.html")) {
      var section = hrefAttr.slice(2, -11); // extracts "academics" from "./academics/index.html"
      if (section && currentUrl.indexOf("/" + section + "/") !== -1) {
        link.classList.add("active");
      }
    }
  });

})();


/* ============================================================
   PROGRAM INDEX - Program list array
   ============================================================ */

const acadProgramIndex = [
    {
        "url":  "5th-semester-bs-computer-science.html",
        "title":  "Computer Science (BS)"
    },
    {
        "url":  "5th-semester-induction-bba-business-administration.html",
        "title":  "Business Administration (BBA)"
    },
    {
        "url":  "5th-semester-induction-bs-accounting-and-finance.html",
        "title":  "Accounting and finance (BS)"
    },
    {
        "url":  "5th-semester-induction-bs-food-science-technology.html",
        "title":  "BS Food Science \u0026amp;amp; Technology"
    },
    {
        "url":  "5th-semester-induction-bs-human-nutrition-dietetics.html",
        "title":  "Human Nutrition and Dietetics (BS)"
    },
    {
        "url":  "5th-semester-induction-bs-mathematics.html",
        "title":  "Mathematics (BS)"
    },
    {
        "url":  "5th-semester-induction-bs-physics.html",
        "title":  "Physics (BS)"
    },
    {
        "url":  "5th-semester-induction-english-bs.html",
        "title":  "English (BS)"
    },
    {
        "url":  "5th-semester-software-engineering-bs.html",
        "title":  "Software Engineering (BS)"
    },
    {
        "url":  "adp-accounting-and-finance.html",
        "title":  "Associate Degree in Accounting and Finance"
    },
    {
        "url":  "adp-accounting-finance.html",
        "title":  "Accounting \u0026amp;amp; Finance"
    },
    {
        "url":  "adp-business-studies.html",
        "title":  "Business Studies"
    },
    {
        "url":  "adp-computing.html",
        "title":  "Computing"
    },
    {
        "url":  "adp-english.html",
        "title":  "English"
    },
    {
        "url":  "adp-hospitality-management.html",
        "title":  "Hospitality Management"
    },
    {
        "url":  "adp-mathematics.html",
        "title":  "Mathematics"
    },
    {
        "url":  "adp-physics.html",
        "title":  "Physics"
    },
    {
        "url":  "diploma-cna.html",
        "title":  "Certified Nursing Assistant (CNA)"
    },
    {
        "url":  "faculty-profile.html",
        "title":  "Our Professor"
    },
    {
        "url":  "hnd-art-design.html",
        "title":  "Art and Design (HND)"
    },
    {
        "url":  "hnd-business.html",
        "title":  "Business (HND)"
    },
    {
        "url":  "hnd-computing.html",
        "title":  "Computing (HND)"
    },
    {
        "url":  "hnd-health-social-care.html",
        "title":  "Health \u0026amp;amp; Social Care (HND)"
    },
    {
        "url":  "hnd-hospitality-management.html",
        "title":  "Hospitality Management (HND)"
    },
    {
        "url":  "hnd-social-community-work.html",
        "title":  "Social \u0026amp;amp; Community Work (HND)"
    },
    {
        "url":  "hnd.html",
        "title":  "HND Ã¢â‚¬â€ International Qualifications"
    },
    {
        "url":  "pg-accounting-and-finance-mphil.html",
        "title":  "Accounting and Finance (Mphil)"
    },
    {
        "url":  "pg-computer-science-ms.html",
        "title":  "Computer Sciences (MS)"
    },
    {
        "url":  "pg-education-mphil.html",
        "title":  "Education (MPhil)"
    },
    {
        "url":  "pg-english-applied-linguistics-mphil.html",
        "title":  "Applied Linguistics(MPhil)"
    },
    {
        "url":  "pg-english-literature-mphil.html",
        "title":  "English Literature (MPhil)"
    },
    {
        "url":  "pg-food-science-and-technology-mphil.html",
        "title":  "Food Science and Technology (MPhil)"
    },
    {
        "url":  "pg-information-technology-ms.html",
        "title":  "Information Technology (MS)"
    },
    {
        "url":  "pg-management-sciences-mphil.html",
        "title":  "Management Sciences (MPhil)"
    },
    {
        "url":  "pg-mathematics-mphil.html",
        "title":  "Mathematics (MPhil)"
    },
    {
        "url":  "pg-pharmaceutics-mphil.html",
        "title":  "Pharmaceutics (MPhil)"
    },
    {
        "url":  "pg-pharmacology-mphil.html",
        "title":  "Pharmacology (MPhil)"
    },
    {
        "url":  "pg-physical-therapy-ms.html",
        "title":  "Physical Therapy (MS)"
    },
    {
        "url":  "pg-physics-mphil.html",
        "title":  "Physics (MPhil)"
    },
    {
        "url":  "pg-software-engineering-ms.html",
        "title":  "Software Engineering (MS)"
    },
    {
        "url":  "phd-business-administration.html",
        "title":  "Business Administration PhD"
    },
    {
        "url":  "phd-mathematics.html",
        "title":  "Mathematics (Phd)"
    },
    {
        "url":  "sc-ielts.html",
        "title":  "IELTS Preparation \u0026amp;amp; Training Program"
    },
    {
        "url":  "sc-medical-billing.html",
        "title":  "Medical Billing \u0026amp;amp; Coding Certification"
    },
    {
        "url":  "sc-pte.html",
        "title":  "PTE Preparation \u0026amp;amp; Training Program"
    },
    {
        "url":  "ug-accounting-and-finance-bs.html",
        "title":  "Accounting and finance (BS)"
    },
    {
        "url":  "ug-bachelor-of-science-in-nursing.html",
        "title":  "Bachelor of Sciences in Nursing"
    },
    {
        "url":  "ug-bachelor-of-science-in-psychology.html",
        "title":  "Psychology (BS)"
    },
    {
        "url":  "ug-bs-applied-mathematics-and-artificial-intelligence.html",
        "title":  "BS Applied Mathematics and Artificial Intelligence"
    },
    {
        "url":  "ug-bs-business-analytics.html",
        "title":  "Bs Business Analytics"
    },
    {
        "url":  "ug-bs-electronics-and-computing.html",
        "title":  "BS Electronics and Computing"
    },
    {
        "url":  "ug-bs-english.html",
        "title":  "English (BS)"
    },
    {
        "url":  "ug-bs-optometry-and-vision-sciences.html",
        "title":  "BS Optometry and Vision Sciences"
    },
    {
        "url":  "ug-bs-sports-science-and-physical-education.html",
        "title":  "BS Sports Science and Physical Education"
    },
    {
        "url":  "ug-business-administration-bba.html",
        "title":  "Business Administration (BBA)"
    },
    {
        "url":  "ug-civil-engineering-technology-bsc.html",
        "title":  "Civil Engineering Technology (BSc)"
    },
    {
        "url":  "ug-computer-science-bs.html",
        "title":  "Computer Science (BS)"
    },
    {
        "url":  "ug-data-science-bsds.html",
        "title":  "Data Science (BS)"
    },
    {
        "url":  "ug-dietetics-and-nutritional-sciences.html",
        "title":  "Human Nutrition and Dietetics (BS)"
    },
    {
        "url":  "ug-doctor-of-pharmacy-pharm-d.html",
        "title":  "Doctor of Pharmacy (Pharm-D)"
    },
    {
        "url":  "ug-doctor-of-physio-therapy-dpt.html",
        "title":  "Doctor of Physical Therapy (DPT)"
    },
    {
        "url":  "ug-llb.html",
        "title":  "Bachelor of Laws (LLB)"
    },
    {
        "url":  "ug-mathematics-bs.html",
        "title":  "Mathematics (BS)"
    },
    {
        "url":  "ug-medical-imaging-sciences-bs.html",
        "title":  "BS Radiography \u0026amp; Imaging Technology"
    },
    {
        "url":  "ug-medical-lab-sciences-bs.html",
        "title":  "Medical Laboratory Technology (BS)"
    },
    {
        "url":  "ug-physics-bs.html",
        "title":  "Physics (BS)"
    },
    {
        "url":  "ug-post-rn.html",
        "title":  "Post RN"
    },
    {
        "url":  "ug-software-engineering-bs.html",
        "title":  "Software Engineering (BS)"
    }
];


/* ============================================================
   ACADEMICS - Academics specific interactions
   ============================================================ */

/* University of Chenab ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Academics experience layer (updated)
   Orientation + reading comfort helpers. Progressive enhancement only. */
(function () {
  "use strict";
  if (!document.body.classList.contains("acad")) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Subnav: mark current page, keep it in view ---------- */
  function initSubnav() {
    var nav = document.querySelector(".uc-subnav");
    if (!nav) return;
    var rail = nav.querySelector(".uc-subnav__rail");
    var list = nav.querySelector(".uc-subnav__links");
    var active = nav.querySelector(".uc-subnav__links a.active");
    if (active && list) {
      var off = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
      list.scrollLeft = Math.max(0, off);
    }
    if (!rail || !list) return;
    function edges() {
      rail.dataset.start = list.scrollLeft > 8 ? "0" : "1";
      rail.dataset.end =
        list.scrollLeft + list.clientWidth < list.scrollWidth - 8 ? "0" : "1";
    }
    edges();
    list.addEventListener("scroll", edges, { passive: true });
    window.addEventListener("resize", edges);

    var scrollBtn = document.getElementById("subnavScrollBtn");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", function() {
        list.scrollBy({ left: list.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
      });
    }
  }

  /* ---------- 2. On-this-page nav: build mobile chips + scrollspy ---------- */
  function initToc() {
    var sidebar = document.getElementById("program-scrollspy");
    var doc = document.querySelector(".acad-doc");
    if (!sidebar || !doc) return;

    var links = Array.prototype.slice.call(sidebar.querySelectorAll("a[href^='#']"));
    if (!links.length) return;

    // Mobile chip rail mirrors the sidebar
    var mobile = document.createElement("nav");
    mobile.className = "acad-toc-mobile";
    mobile.setAttribute("aria-label", "On this page");
    var scroll = document.createElement("div");
    scroll.className = "acad-toc-mobile__scroll container";
    links.forEach(function (a) {
      var c = document.createElement("a");
      c.href = a.getAttribute("href");
      c.textContent = a.textContent.trim();
      scroll.appendChild(c);
    });
    mobile.appendChild(scroll);
    var anchor = document.querySelector(".acad-shell") || doc;
    anchor.parentNode.insertBefore(mobile, anchor);
    var chips = Array.prototype.slice.call(scroll.querySelectorAll("a"));

    var targets = links
      .map(function (a) {
        return document.querySelector(a.getAttribute("href"));
      })
      .filter(Boolean);
    if (!targets.length) return;

    function setActive(id) {
      links.concat(chips).forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", on);
        if (on && a.parentNode === scroll) {
          var off = a.offsetLeft - (scroll.clientWidth - a.offsetWidth) / 2;
          scroll.scrollTo({ left: Math.max(0, off), behavior: reduce ? "auto" : "smooth" });
        }
      });
    }

    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
        });
        var best = null,
          score = 0;
        targets.forEach(function (t) {
          if ((visible[t.id] || 0) > score) {
            score = visible[t.id];
            best = t.id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] }
    );
    targets.forEach(function (t) {
      io.observe(t);
    });
    setActive(targets[0].id);
  }

  /* ---------- 3. Tables: hint when horizontally scrollable ---------- */
  function initTables() {
    document.querySelectorAll(".acad-tablewrap").forEach(function (wrap) {
      var box = wrap.querySelector(".table-responsive");
      if (!box) return;
      var check = function () {
        wrap.classList.toggle("is-scrollable", box.scrollWidth > box.clientWidth + 4);
      };
      check();
      window.addEventListener("resize", check);
    });
  }

  /* ---------- 4. Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-acad-reveal]");
    if (!items.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 5. Reading progress + back to top ---------- */
  function initChrome() {
    var bar = document.createElement("div");
    bar.className = "acad-progress";
    document.body.appendChild(bar);

    var top = document.createElement("button");
    top.type = "button";
    top.className = "acad-top";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<i class="bi bi-arrow-up"></i>';
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    document.body.appendChild(top);

    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = p + "%";
        top.classList.toggle("is-on", window.scrollY > 900);
        tick = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 6. Filters & Simplified View ---------- */
  function initFilters() {
    var checkboxes = document.querySelectorAll(".filter-checkbox");
    if (!checkboxes.length) return;

    var courseList = document.getElementById("courseList");
    var clearBtn = document.getElementById("clearFilters");
    var toggleView = document.getElementById("simplifiedViewToggle");
    var items = document.querySelectorAll(".uc-course-item");
    var resultsCount = document.getElementById("resultsCount");
    
    function applyFilters() {
      var activeGroups = Array.prototype.slice.call(document.querySelectorAll(".uc-filter-acc .accordion-item"))
        .map(function(item) {
          return Array.prototype.slice.call(item.querySelectorAll(".filter-checkbox:checked"))
            .map(function(cb) { return cb.value.toLowerCase(); });
        })
        .filter(function(group) { return group.length > 0; });

      var count = 0;
      items.forEach(function(item) {
        var cats = (item.getAttribute("data-category") || "").toLowerCase().split(/\s+/);
        var matches = true;
        if (activeGroups.length > 0) {
           matches = activeGroups.every(function(group) {
             return group.some(function(val) { return cats.indexOf(val) !== -1; });
           });
        }
        
        if (matches) {
          item.style.display = "";
          count++;
        } else {
          item.style.display = "none";
        }
      });

      if (resultsCount) {
        resultsCount.innerHTML = "Results: <strong>" + count + "</strong> (of " + items.length + " total)";
      }
    }

    checkboxes.forEach(function(cb) {
      cb.addEventListener("change", applyFilters);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function(e) {
        e.preventDefault();
        checkboxes.forEach(function(cb) { cb.checked = false; });
        applyFilters();
      });
    }

    if (toggleView && courseList) {
      toggleView.addEventListener("change", function() {
        if (this.checked) {
          courseList.classList.add("is-simplified");
        } else {
          courseList.classList.remove("is-simplified");
        }
      });
    }
  }

  /* ---------- 0. Measure sticky header so offsets never guess ---------- */
  function initOffsets() {
    var header = document.querySelector(".header");
    var set = function () {
      var h = header ? Math.round(header.getBoundingClientRect().height) : 76;
      document.body.style.setProperty("--acad-headerh", h + "px");
    };
    set();
    window.addEventListener("resize", set);
    window.addEventListener("load", set);
  }

  function boot() {
    initOffsets();
    initSubnav();
    initToc();
    initTables();
    initReveal();
    initChrome();
    initFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/* =========================================================
   INLINE EXPANDING PROGRAM SEARCH LOGIC
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const inlineSearchWrappers = document.querySelectorAll('.acad-inline-search');
    
    inlineSearchWrappers.forEach(wrapper => {
        const btn = wrapper.querySelector('.acad-inline-search-btn');
        const input = wrapper.querySelector('.acad-inline-search-input');
        const dropdown = wrapper.querySelector('.acad-search-results-dropdown');
        const resultList = dropdown.querySelector('ul');
        
        if(!btn || !input || !dropdown) return;

        // Open search on click
        btn.addEventListener('click', (e) => {
            // Prevent navigating if it's acting as a button now
            if(e.target.tagName !== 'A' || btn.tagName === 'BUTTON' || wrapper.classList.contains('is-expanded')) {
                e.preventDefault();
            }
            
            if(!wrapper.classList.contains('is-expanded')) {
                wrapper.classList.add('is-expanded'); document.body.classList.add('search-is-active'); const hero = wrapper.closest('.acad-hero'); if(hero) hero.classList.add('search-is-active');
                input.focus();
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if(!wrapper.contains(e.target)) {
                wrapper.classList.remove('is-expanded'); document.body.classList.remove('search-is-active'); const hero = wrapper.closest('.acad-hero'); if(hero) hero.classList.remove('search-is-active');
                dropdown.classList.remove('is-active');
                input.value = ''; // clear on close
            }
        });

        // Live filtering logic
        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            
            if(query.length < 2) {
                dropdown.classList.remove('is-active');
                return;
            }

            if(typeof acadProgramIndex !== 'undefined') {
                const matches = acadProgramIndex.filter(p => p.title.toLowerCase().includes(query));
                
                resultList.innerHTML = '';
                
                if(matches.length > 0) {
                    matches.forEach(match => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = '../academics/' + match.url;
                        
                        // Fix paths if we are already in root (like index.html)
                        if(window.location.pathname.endsWith('/index.html') && !window.location.pathname.includes('/academics/')) {
                            a.href = 'academics/' + match.url;
                        } else if (window.location.pathname.includes('/admissions/')) {
                            a.href = '../academics/' + match.url;
                        } else {
                             a.href = match.url; // We are in academics folder
                        }

                        a.innerHTML = match.title + ' <i class="bi bi-arrow-right-short text-muted ms-2"></i>';
                        li.appendChild(a);
                        resultList.appendChild(li);
                    });
                } else {
                    resultList.innerHTML = '<li class="acad-search-results-empty">No programs found for "'+query+'"</li>';
                }
                
                dropdown.classList.add('is-active');
            }
        });
    });
});



/* ============================================================
   INNER PAGES - Inner page specific interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Reveal on scroll ---- */
  var items = document.querySelectorAll("[data-uc-reveal]");
  if (items.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
          });
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0 }
      );
      items.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Subnav Ã¢â‚¬â€ identical logic to academics-updated.js ---- */
  // The scrollable container is .uc-subnav__links (the <ul>) Ã¢â‚¬â€ same as academics CSS.
  var nav = document.querySelector(".uc-subnav");
  if (!nav) return;

  var rail = nav.querySelector(".uc-subnav__rail");
  var list = nav.querySelector(".uc-subnav__links");
  if (!rail || !list) return;

  // 1. Center active link on load (scroll the list, just like academics)
  var active = nav.querySelector(".uc-subnav__links a.active");
  if (active) {
    var off = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollLeft = Math.max(0, off);
  }

  // 2. Edge fades on the rail (decorative CSS ::before/::after)
  function edges() {
    rail.dataset.start = list.scrollLeft > 8 ? "0" : "1";
    rail.dataset.end   = list.scrollLeft + list.clientWidth < list.scrollWidth - 8 ? "0" : "1";
  }
  edges();
  list.addEventListener("scroll", edges, { passive: true });
  window.addEventListener("resize", edges);

  // 3. Scroll button Ã¢â‚¬â€ same pattern as academics-updated.js
  var scrollBtn = document.querySelector(".uc-subnav__scroll");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      list.scrollBy({ left: list.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
    });
  }
});



