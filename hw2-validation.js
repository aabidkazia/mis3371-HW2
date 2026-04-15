/***************************************************************
validation.js (HW2) — We'R'Docs Medical Form

Notes (honestly just my working file version):

tried to keep things readable instead of super optimized
some repetition is intentional so I don’t break stuff later
if something looks redundant… yeah I probably noticed it too
***************************************************************/

/* ==============================================================
clearError
basically just hides the little red error text next to fields
============================================================== */
function clearError(errId) {
const el = document.getElementById(errId);
if (!el) return;

el.textContent = "";
el.style.display = "none";
}

/* ==============================================================
showError
puts error message next to input (simple enough)
============================================================== */
function showError(errId, message) {
const el = document.getElementById(errId);
if (!el) return;

el.textContent = message;
el.style.display = "inline";
}

/* ==============================================================
clearReview
resets the review panel back to default message
============================================================== */
function clearReview() {
const reviewBody = document.getElementById("review-body");

if (reviewBody) {
reviewBody.innerHTML =
'<p class="review-placeholder">Click <strong>🔍 Review My Info</strong> to see a summary of your entries here.</p>';
}
}

/* ==============================================================
convertLowercase
I just force userid to lowercase on blur (less user confusion)
============================================================== */
function convertLowercase() {
const field = document.getElementById("userid");

if (field && field.value) {
field.value = field.value.toLowerCase();
}
}

/* ==============================================================
updateSlider (generic)
used for health score etc. I reused it instead of rewriting
============================================================== */
function updateSlider(sliderId, displayId, decimals, suffix) {
const slider = document.getElementById(sliderId);
const display = document.getElementById(displayId);

if (!slider || !display) return;

// not super fancy but works fine
const val = parseFloat(slider.value);
display.textContent = val.toFixed(decimals) + suffix;
}

/* ==============================================================
salary slider display
I could merge this with updateSlider but left it separate
============================================================== */
function updateSalarySlider() {
const slider = document.getElementById("salaryBar");
const display = document.getElementById("salaryVal");

if (!slider || !display) return;

let val = parseInt(slider.value, 10);

// formatting money the easy way
display.textContent = "$" + val.toLocaleString("en-US");
}

/* ==============================================================
password strength checker
kinda long but I wanted clearer steps instead of compact logic
============================================================== */
function checkPasswordStrength() {
const pwd = document.getElementById("passid")?.value || "";
const bar = document.getElementById("strength-bar");
const label = document.getElementById("strength-label");

if (!bar || !label) return;

if (pwd.length === 0) {
bar.style.width = "0%";
bar.style.backgroundColor = "#ccc";
label.textContent = "";
return;
}

let score = 0;

if (pwd.length >= 8) score++;
if (pwd.length >= 12) score++;
if (/[A-Z]/.test(pwd)) score++;
if (/[a-z]/.test(pwd)) score++;
if (/[0-9]/.test(pwd)) score++;
if (/[!@#%^&*()-_+=/><.,`~]/.test(pwd)) score++;

let percent = Math.round((score / 6) * 100);

let color = "#e74c3c";
let text = "Weak — needs more variety";

if (score > 2 && score <= 4) {
color = "#f39c12";
text = "Fair — getting better but still weak spots";
} else if (score > 4) {
color = "#27ae60";
text = "Strong password ✔";
}

bar.style.width = percent + "%";
bar.style.backgroundColor = color;
label.textContent = text;
label.style.color = color;
}

/* ==============================================================
password match check
simple comparison, nothing fancy
============================================================== */
function checkPasswordMatch() {
const p1 = document.getElementById("passid")?.value || "";
const p2 = document.getElementById("passid2")?.value || "";
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

/* ==============================================================
showReview (big one)
honestly this function got kinda long but I didn’t want to split it
============================================================== */
function showReview() {
const frm = document.patientForm;
const body = document.getElementById("review-body");

if (!body || !frm) return;

// helper for rows (I reused this a lot)
function row(label, value, status, note) {
const ok = status !== "ERROR";
const icon = ok ? "✔ OK" : "✖ ERROR";
const cls = ok ? "rv-pass" : "rv-error";

return (
  '<div class="rv-row">' +
  '<span class="rv-label">' + label + '</span>' +
  '<span class="rv-value">' + (value || "<em>— not entered —</em>") + '</span>' +
  '<span class="rv-status ' + cls + '">' + icon + '</span>' +
  (note ? '<span class="rv-note">' + note + '</span>' : "") +
  "</div>"
);

}

// grabbing values (kind of repetitive but easier to debug)
const fname = frm.fname.value.trim();
const mi = frm.mi.value.trim();
const lname = frm.lname.value.trim();

const dob = frm.dob.value;
const ssn = frm.ssn.value.trim();
const email = frm.email.value.trim();
const phone = frm.phone.value.trim();

const addr1 = frm.addr1.value.trim();
const addr2 = frm.addr2.value.trim();
const city = frm.city.value.trim();
const state = frm.state.value;

const zipRaw = frm.zip.value.trim();
const zipShort = zipRaw.substring(0, 5);

const userid = frm.userid.value.trim().toLowerCase();
const pwd = frm.passid.value;
const pwd2 = frm.passid2.value;

const health = frm.healthScore.value;
const salary = parseInt(frm.salaryBar.value, 10);
const symptoms = frm.symptoms.value.trim();

// name formatting (small personal touch)
const fullName = fname + (mi ? " " + mi + "." : "") + " " + lname;

// ZIP display (a bit clunky but readable)
let zipDisplay = zipRaw
? zipShort + (zipRaw.length > 5 ? " (trimmed)" : "")
: "";

// DOB formatting (I always forget this format honestly)
let dobDisplay = dob;
if (dob) {
const parts = dob.split("-");
dobDisplay = parts[1] + "/" + parts[2] + "/" + parts[0];
}

// validation flags (kept simple instead of fancy objects)
let nameStatus = (!fname || !lname) ? "ERROR" : "OK";
let dobStatus = dob ? "OK" : "ERROR";

let emailStatus = /@/.test(email) ? "OK" : "ERROR";
let phoneStatus = /^\d{3}-\d{3}-\d{4}$/.test(phone) ? "OK" : "ERROR";

// building HTML (yeah string concat is messy but works fine)
let html = "";

html += '<div class="rv-section-title">Personal Info</div>';
html += row("Full Name", fullName, nameStatus, "");

html += '<div class="rv-section-title">Contact</div>';
html += row("Email", email, emailStatus, "");
html += row("Phone", phone, phoneStatus, "");

html += '<div class="rv-section-title">Address</div>';
html += row("Address", addr1 + " " + addr2, "OK", "");
html += row("City/State/ZIP", city + ", " + state + " " + zipDisplay, "OK", "");

html += '<div class="rv-section-title">Account</div>';
html += row("User ID", userid, "OK", "");
html += row("Password", pwd ? "••••••••" : "", "OK", "hidden for safety");

body.innerHTML = html;

document.getElementById("review-panel")
?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ==============================================================
handleSubmit
main validator — honestly the biggest function in here
============================================================== */
function handleSubmit() {
const frm = document.patientForm;
let valid = true;

function fail(id, msg, field) {
showError(id, msg);

// focus first error only (less annoying UX)
if (valid && field) field.focus();

valid = false;

}

const fname = frm.fname.value.trim();
const lname = frm.lname.value.trim();

if (!fname) fail("fname-err", "First name required", frm.fname);
if (!lname) fail("lname-err", "Last name required", frm.lname);

const dob = frm.dob.value;
if (!dob) fail("dob-err", "DOB required", frm.dob);

const email = frm.email.value.trim();
if (!email.includes("@")) fail("email-err", "Invalid email", frm.email);

const phone = frm.phone.value.trim();
if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
fail("phone-err", "Bad phone format", frm.phone);
}

// radio checks (I think this was slightly messy but works)
if (!getRadioValue("gender")) {
fail("gender-err", "Pick gender", null);
}

const uid = frm.userid.value.trim().toLowerCase();
frm.userid.value = uid;

if (uid.length < 5) {
fail("userid-err", "User ID too short", frm.userid);
}

const pwd = frm.passid.value;
const pwd2 = frm.passid2.value;

if (pwd !== pwd2) {
fail("passid2-err", "Passwords do not match", frm.passid2);
}

if (!valid) {
showReview(); // show summary even if broken
return false;
}

return true;
}

/* helper for radios (kept at bottom… not sure why I did that lol) */
function getRadioValue(name) {
const radios = document.getElementsByName(name);

for (let i = 0; i < radios.length; i++) {
if (radios[i].checked) return radios[i].value;
}

return "";
}

/* end of file — if something breaks, it’s probably here 😅 */
