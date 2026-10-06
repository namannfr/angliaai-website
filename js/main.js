/* AngliaAI website — interactions (plain JavaScript, no dependencies)
   1. Mobile menu
   2. Architecture diagram (five layers)
   3. Product screen tabs
   4. Examiner adjudication demo
   5. Contact form
   6. Scroll reveal
*/
(function () {
  "use strict";

  /* 1. MOBILE MENU ------------------------------------------------------ */
  var menuBtn = document.querySelector('[aria-controls="mobile-menu"]');
  var menu = document.getElementById("mobile-menu");
  var ICON_MENU = menuBtn ? menuBtn.innerHTML : "";
  var ICON_CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.innerHTML = open ? ICON_CLOSE : ICON_MENU;
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* 2. ARCHITECTURE DIAGRAM ---------------------------------------------- */
  // Edit the layer copy here (the stacked mobile version is written in the HTML).
  var LAYERS = [
    {
      "n": 1,
      "key": "conversation",
      "name": "Conversation",
      "short": "Adaptive two-way interview",
      "what": "An adaptive two-way conversation that follows up on what the candidate actually says, so no two interviews are identical.",
      "why": "Spontaneous interaction is where published research finds automated scoring weakest. It is also where assessment matters most.",
      "parts": [
        "Adaptive follow-up questions",
        "Unscored warm-up",
        "Live transcript",
        "Reasonable adjustments"
      ]
    },
    {
      "n": 2,
      "key": "scoring",
      "name": "Scoring & Calibration",
      "short": "Your rubric, versioned",
      "what": "Scores against the client’s own rubric through a versioned calibration profile built from the client’s marked exemplars.",
      "why": "The organisation keeps its own standard. A new client is a calibration exercise, not a new test.",
      "parts": [
        "Rubric ingestion",
        "Calibration profile",
        "Marked exemplars",
        "Version control"
      ]
    },
    {
      "n": 3,
      "key": "assurance",
      "name": "Assurance",
      "short": "The differentiating layer",
      "what": "A confidence gate, standard-drift monitoring, cohort fairness monitoring and generation of the validity evidence pack.",
      "why": "This layer is designed to turn a score into a decision an institution can defend to its own quality committee or auditor.",
      "parts": [
        "Confidence gate",
        "Drift monitoring",
        "Fairness monitoring",
        "Evidence pack"
      ]
    },
    {
      "n": 4,
      "key": "human",
      "name": "Human Examiner",
      "short": "Permanent by design",
      "what": "Certified examiners adjudicate low-confidence cases and handle appeals. The human layer is permanent, not transitional.",
      "why": "It keeps meaningful human review where a decision carries significant effects for an individual, and every adjudicated case becomes reference data.",
      "parts": [
        "Adjudication queue",
        "Appeals",
        "Re-marking",
        "Examiner notes"
      ]
    },
    {
      "n": 5,
      "key": "record",
      "name": "Record",
      "short": "Sealed and reconstructable",
      "what": "Sealed assessment records pinned to the engine version, calibration profile and rubric in force at the time.",
      "why": "A released result is never edited. It is superseded, so a historic decision can be reconstructed under the conditions that produced it.",
      "parts": [
        "Sealed records",
        "Version pinning",
        "Immutable audit log",
        "Evidence export"
      ]
    }
  ];
  var tablist = document.querySelector('[role="tablist"][aria-label="Architecture layers"]');
  var panel = document.getElementById("layer-panel");
  if (tablist && panel) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var BASE = "group grid grid-cols-[3.25rem_1fr_auto] items-center rounded-[4px] border px-5 py-4 text-left transition-colors ";
    var selectLayer = function (i, focus) {
      tabs.forEach(function (tab, n) {
        var sel = n === i, assurance = LAYERS[n].key === "assurance", s = tab.children;
        tab.className = BASE + (sel ? "border-ink bg-ink text-white" : assurance ? "border-accent bg-accent-soft hover:border-accent-deep" : "border-rule bg-surface hover:border-rule-strong");
        tab.setAttribute("aria-selected", String(sel));
        tab.tabIndex = sel ? 0 : -1;
        s[0].className = "font-mono text-[0.74rem] " + (sel ? "text-white/60" : "text-ink-muted");
        s[2].className = "font-mono text-[0.7rem] " + (sel ? "text-white/60" : assurance ? "text-accent-deep" : "text-ink-muted");
      });
      var l = LAYERS[i];
      panel.setAttribute("aria-labelledby", "layer-tab-" + i);
      panel.innerHTML =
        '<p class="label">Layer ' + l.n + " of 5</p>" +
        '<h3 class="mt-3 text-[1.7rem] font-semibold tracking-tight">' + l.name + "</h3>" +
        '<p class="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">' + l.what + "</p>" +
        '<div class="mt-6 border-t border-rule pt-5"><p class="label">Why it exists</p>' +
        '<p class="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">' + l.why + "</p></div>" +
        '<ul class="mt-auto flex flex-wrap gap-2 pt-7">' +
        l.parts.map(function (p) { return '<li class="rounded-[2px] border border-rule bg-paper px-2.5 py-1 font-mono text-[0.72rem] text-ink-soft">' + p + "</li>"; }).join("") +
        "</ul>";
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (tab, i) { tab.addEventListener("click", function () { selectLayer(i); }); });
    tablist.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      var cur = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
      selectLayer((cur + (e.key === "ArrowDown" ? 1 : tabs.length - 1)) % tabs.length, true);
    });
  }

  /* 3. PRODUCT SCREEN TABS ----------------------------------------------- */
  var screenTabs = Array.prototype.slice.call(document.querySelectorAll('[role="tablist"][aria-label="Product screens"] [role="tab"]'));
  var TAB_BASE = "min-h-[44px] shrink-0 rounded-[3px] border px-4 text-[0.9rem] transition-colors ";
  screenTabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      screenTabs.forEach(function (t, n) {
        var sel = n === i;
        t.className = TAB_BASE + (sel ? "border-ink bg-ink text-white" : "border-rule-strong bg-surface text-ink-soft hover:border-ink hover:text-ink");
        t.setAttribute("aria-selected", String(sel));
        document.getElementById("screen-panel-" + n).hidden = !sel;
      });
    });
  });

  /* 4. EXAMINER ADJUDICATION DEMO ---------------------------------------- */
  var bandBtns = Array.prototype.slice.call(document.querySelectorAll("button[aria-pressed]"));
  var BAND_BASE = "min-h-[44px] rounded-[3px] border text-[0.95rem] font-medium transition-colors ";
  bandBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      bandBtns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-pressed", String(on));
        b.className = BAND_BASE + (on ? "border-ink bg-ink text-white" : "border-rule-strong hover:border-ink");
      });
      var note = btn.closest("fieldset").parentElement.querySelector('p[aria-live="polite"]');
      if (note) note.textContent = "Decision recorded in this demo: " + btn.textContent.trim() + ". Nothing is saved.";
    });
  });

  /* 5. CONTACT FORM ------------------------------------------------------- */
  // FRONTEND ONLY. To connect a real provider, send `new FormData(form)` to your
  // endpoint here (e.g. fetch("https://your-form-provider/…", { method: "POST", body: data }))
  // and show the success message instead of the "not connected" notice.
  var form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var out = form.querySelector('div[aria-live="polite"]');
      out.innerHTML = '<p class="rounded-[3px] border border-flag-line bg-flag-soft p-3.5 text-[0.9rem] text-ink">This enquiry form is not yet connected, so your message has not been sent. Please use the contact details on this page once they are published.</p>';
    });
  }

  /* 6. SCROLL REVEAL ------------------------------------------------------ */
  // Content is visible by default; only elements below the fold animate in.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.remove("reveal-pending");
        en.target.classList.add("reveal-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.classList.add("reveal-pending");
      io.observe(el);
    });
  }
})();
