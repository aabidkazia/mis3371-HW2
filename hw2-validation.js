/*
  ============================================================
  validation.js (HW2)

  Author: [Your Name]
  Created: March 27, 2026
  Last Updated: March 27, 2026

  Description:
  Handles validation + dynamic features for the patient form.

  Includes:
  - inline error handling
  - sliders + live updates
  - password checks
  - review panel builder
  - final form validation before submit

  Note:
  Tried to keep things organized but still readable.
  ============================================================
*/


/* ===== ERROR HANDLING ===== */

/* clears an error message */
function clearError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
}

/* shows an error message */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = "inline";
  }
}


/* ===== REVIEW PANEL RESET ===== */
function clearReview() {
  const body = document.getElementById("review-body");

  if (body) {
    body.innerHTML =
      '<p class="review-placeholder">' +
      'Click <strong>🔍 Review My Info</strong> to see a summary here.' +
      '</p>';
  }
}


/* ===== USER ID CLEANUP ===== */
function convertLowercase() {
  const field = document.getElementById("userid");

  if (field) {
    field.value = field.value.toLowerCase();
  }
}


/* ===== SLIDERS ===== */
function updateSlider(sliderId, displayId, decimals, suffix) {
  const slider  = document.getElementById(sliderId);
  const display = document.getElementById(displayId);

  if (!slider || !display) return;

  display.textContent =
    parseFloat(slider.value).toFixed(decimals) + suffix;
}

/* salary slider (formatted nicer) */
function updateSalarySlider() {
  const slider  = document.getElementById("salaryBar");
  const display = document.getElementById("salaryVal");

  if (!slider || !display) return;

  const val = parseInt(slider.value, 10);
  display.textContent = "$" + val.toLocaleString();
}


/* ===== PASSWORD STRENGTH ===== */
function checkPasswordStrength() {
  const pwd   = document.getElementById("passid").value;
  const bar   = document.getElementById("strength-bar");
  const label = document.getElementById("strength-label");

  if (!bar || !label) return;

  if (!pwd) {
    bar.style.width = "0%";
    label.textContent = "";
    return;
  }

  let score = 0;

  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[!@#%^&*()\-_+=\/><.,`~]/.test(pwd)) score++;

  const percent = Math.round((score / 6) * 100);

  let color = "#e74c3c";
  let text  = "Weak password";

  if (score >= 3 && score <= 4) {
    color = "#f39c12";
    text  = "Okay — could be stronger";
  } else if (score >= 5) {
    color = "#27ae60";
    text  = "Strong password ✔";
  }

  bar.style.width = percent + "%";
  bar.style.backgroundColor = color;

  label.textContent = text;
  label.style.color = color;
}


/* ===== PASSWORD MATCH ===== */
function checkPasswordMatch() {
  const p1 = document.getElementById("passid").value;
  const p2 = document.getElementById("passid2").value;
  const label = document.getElementById("match-label");

  if (!label) return;

  if (!p2) {
    label.textContent = "";
    return;
  }

  if (p1 === p2) {
    label.textContent = "✔ Passwords match";
    label.style.color = "#27ae60";
  } else {
    label.textContent = "✖ Passwords do not match";
    label.style.color = "#e74c3c";
  }
}


/* ===== HELPER: RADIO VALUE ===== */
function getRadioValue(name) {
  const radios = document.getElementsByName(name);

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }

  return "";
}


/* ===== REVIEW PANEL ===== */
function showReview() {
  const frm  = document.patientForm;
  const body = document.getElementById("review-body");

  if (!body) return;

  /* helper for building rows */
  function row(label, value, status, note) {
    const statusClass = status === "ERROR" ? "rv-error" : "rv-pass";
    const statusText  = status === "ERROR" ? "✖ ERROR" : "✔ OK";

    return `
      <div class="rv-row">
        <span class="rv-label">${label}</span>
        <span class="rv-value">${value || "<em>— not entered —</em>"}</span>
        <span class="rv-status ${statusClass}">${statusText}</span>
        ${note ? `<span class="rv-note">${note}</span>` : ""}
      </div>
    `;
  }

  /* grab values (keeping it simple) */
  const fname = frm.fname.value.trim();
  const lname = frm.lname.value.trim();
  const email = frm.email.value.trim();
  const phone = frm.phone.value.trim();
  const userid = frm.userid.value.trim().toLowerCase();

  /* basic validation (not redoing EVERYTHING here) */
  const nameOK  = fname && lname;
  const emailOK = /.+@.+\..+/.test(email);
  const phoneOK = /^\d{3}-\d{3}-\d{4}$/.test(phone);

  let html = "";

  html += '<div class="rv-section-title">Basic Info</div>';
  html += row("Name", fname + " " + lname, nameOK ? "OK" : "ERROR",
              nameOK ? "" : "Name required");

  html += row("Email", email, emailOK ? "OK" : "ERROR",
              emailOK ? "" : "Invalid format");

  html += row("Phone", phone, phoneOK ? "OK" : "ERROR",
              phoneOK ? "" : "Use NNN-NNN-NNNN");

  html += '<div class="rv-section-title">Account</div>';
  html += row("User ID", userid, userid ? "OK" : "ERROR",
              userid ? "" : "Required");

  body.innerHTML = html;

  document.getElementById("review-panel")
    .scrollIntoView({ behavior: "smooth" });
}


/* ===== MAIN VALIDATION ===== */
function handleSubmit() {
  const frm = document.patientForm;
  let valid = true;

  function fail(id, msg, field) {
    showError(id, msg);

    if (valid && field) {
      field.focus(); // focus first issue
    }

    valid = false;
  }

  /* name */
  if (!frm.fname.value.trim()) {
    fail("fname-err", "First name required", frm.fname);
  }

  if (!frm.lname.value.trim()) {
    fail("lname-err", "Last name required", frm.lname);
  }

  /* email */
  const email = frm.email.value.trim();
  if (!/.+@.+\..+/.test(email)) {
    fail("email-err", "Enter a valid email", frm.email);
  }

  /* phone */
  const phone = frm.phone.value.trim();
  if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
    fail("phone-err", "Format: NNN-NNN-NNNN", frm.phone);
  }

  /* user id */
  let uid = frm.userid.value.trim().toLowerCase();
  frm.userid.value = uid;

  if (uid.length < 5) {
    fail("userid-err", "At least 5 characters", frm.userid);
  }

  /* password */
  const pwd  = frm.passid.value;
  const pwd2 = frm.passid2.value;

  if (pwd.length < 8) {
    fail("passid-err", "At least 8 characters", frm.passid);
  }

  if (pwd !== pwd2) {
    fail("passid2-err", "Passwords must match", frm.passid2);
  }

  /* if anything failed */
  if (!valid) {
    showReview();
    return false;
  }

  return true;
}


/* ============================================================
   end of file
   ============================================================
*/
