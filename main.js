/* ===== Brouse Shockwave Landing — lead form handling ===== */
(function () {
  "use strict";

  // TODO: paste your Formspree endpoint (or other handler) here.
  // Create a free form at https://formspree.io and drop the URL below.
  // While this is empty, the form runs in DEMO mode and just shows the
  // success state without sending anywhere.
  var ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

  var form = document.getElementById("leadForm");
  var success = document.getElementById("formSuccess");
  if (!form) return;

  var fields = {
    name:     { el: form.name,     test: function (v) { return v.trim().length > 1; },        msg: "Please enter your name." },
    email:    { el: form.email,    test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: "Enter a valid email." },
    phone:    { el: form.phone,    test: function (v) { return v.replace(/\D/g, "").length >= 10; },    msg: "Enter a valid phone number." },
    besttime: { el: form.besttime, test: function (v) { return v !== ""; },                   msg: "Pick a time that works." },
    consent:  { el: form.consent,  test: function () { return form.consent.checked; },          msg: "Please agree to continue." }
  };

  function setError(key, show) {
    var span = form.querySelector('.err[data-for="' + key + '"]');
    var input = fields[key].el;
    if (span) span.textContent = show ? fields[key].msg : "";
    if (input && input.classList) input.classList.toggle("invalid", !!show);
  }

  // clear error on input
  Object.keys(fields).forEach(function (key) {
    var el = fields[key].el;
    var evt = (el.type === "checkbox" || el.tagName === "SELECT") ? "change" : "input";
    el.addEventListener(evt, function () {
      if (fields[key].test(el.value)) setError(key, false);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    Object.keys(fields).forEach(function (key) {
      var valid = fields[key].test(fields[key].el.value);
      setError(key, !valid);
      if (!valid && ok) { ok = false; fields[key].el.focus(); }
    });
    if (!ok) return;

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending…";

    function showSuccess() {
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      // Meta Pixel lead event fires here if a pixel is installed:
      if (typeof fbq === "function") { fbq("track", "Lead"); }
    }

    if (!ENDPOINT) {
      // DEMO mode — no endpoint configured yet.
      setTimeout(showSuccess, 600);
      return;
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (r) {
        if (r.ok) { showSuccess(); }
        else { throw new Error("Bad response"); }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = "Claim your offer";
        alert("Something went wrong sending your request. Please call (814) 472-9355 and we'll get you scheduled.");
      });
  });
})();
