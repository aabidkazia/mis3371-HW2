/*
  validation.js - HW2
  Student Name
  created 3/27/26, last edited 4/2/26

  JS for the patient registration form. handles validation, review panel, etc.
*/


// clears error message for a field
function clearError(errId) {
  var el = document.getElementById(errId);
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
}

// shows an error message under a field
function showError(errId, message) {
  var el = document.getElementById(errId);
  if (el) {
    el.textContent = message;
    el.style.display = "inline";
  }
}

// resets the review panel back to the placeholder text
function clearReview() {
  var body = document.getElementById("review-body");
  if (body) {
    body.innerHTML = '<p class="review-placeholder">Click <strong>&#128269; Review My Info</strong> to see a summary of your entries here.</p>';
  }
}

// called onblur - makes user ID lowercase
function convertLowercase() {
  var field = document.getElementById("userid");
  if (field) {
    field.value = field.value.toLowerCase();
  }
}

// updates the display next to a slider
function updateSlider(sliderId, displayId, decimals, suffix) {
  var slider = document.getElementById(sliderId);
  var display = document.getElementById(displayId);
  if (slider && display) {
    display.textContent = parseFloat(slider.value).toFixed(decimals) + suffix;
  }
}

// salary slider - formats with $ and commas
function updateSalarySlider() {
  var slider = document.getElementById("salaryBar");
  var display = document.getElementById("salaryVal");
  if (slider && display) {
    var val = parseInt(slider.value, 10);
    display.textContent = "$" + val.toLocaleString("en-US");
  }
}

// live password strength checker
// checks length, upper, lower, number, special char
function checkPasswordStrength() {
  var pwd = document.getElementById("passid").value;
  var bar = document.getElementById("strength-bar");
  var label = document.getElementById("strength-label");
  if (!bar || !label) return;

  if (pwd.length === 0) {
    bar.style.width = "0%";
    bar.style.backgroundColor = "#ccc";
    label.textContent = "";
    return;
  }

  var score = 0;
  if (pwd.length >= 8)   score++;
  if (pwd.length >= 12)  score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[!@#%^&*()\-_+=\/><.,`~]/.test(pwd)) score++;

  var pct = Math.round((score / 6) * 100);

  var color, text;
  if (score <= 2) {
    color = "#e74c3c";
    text = "Weak — add uppercase, numbers, and special characters";
  } else if (score <= 4) {
    color = "#f39c12";
    text = "Fair — try adding more variety";
  } else {
    color = "#27ae60";
    text = "Strong password ✔";
  }

  bar.style.width = pct + "%";
  bar.style.backgroundColor = color;
  label.textContent = text;
  label.style.color = color;
}

// checks if both password fields match, shows message
function checkPasswordMatch() {
  var p1 = document.getElementById("passid").value;
  var p2 = document.getElementById("passid2").value;
  var label = document.getElementById("match-label");
  if (!label) return;

  if (p2.length === 0) {
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

/* builds the review panel - called when user clicks "Review My Info"
   doesn't reload the page, just fills in the div */
function showReview() {
  var frm = document.patientForm;
  var body = document.getElementById("review-body");
  if (!body) return;

  // helper to build a row in the review table
  function row(label, value, status, note) {
    var statusClass = status === "ERROR" ? "rv-error" : "rv-pass";
    var statusIcon  = status === "ERROR" ? "&#10008; ERROR" : "&#10004; OK";
    var noteStr = note ? '<span class="rv-note">' + note + '</span>' : "";
    return '<div class="rv-row">'
      + '<span class="rv-label">' + label + '</span>'
      + '<span class="rv-value">' + (value || '<em>— not entered —</em>') + '</span>'
      + '<span class="rv-status ' + statusClass + '">' + statusIcon + '</span>'
      + noteStr
      + '</div>';
  }

  // get whichever radio button is selected
  function getRadio(groupName) {
    var radios = document.getElementsByName(groupName);
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return "";
  }

  // read all field values
  var fname  = frm.fname.value.trim();
  var mi     = frm.mi.value.trim();
  var lname  = frm.lname.value.trim();
  var dob    = frm.dob.value;
  var ssn    = frm.ssn.value.trim();
  var email  = frm.email.value.trim();
  var phone  = frm.phone.value.trim();
  var addr1  = frm.addr1.value.trim();
  var addr2  = frm.addr2.value.trim();
  var city   = frm.city.value.trim();
  var state  = frm.state.value;
  var zipRaw = frm.zip.value.trim();
  var zipShort = zipRaw.substring(0, 5);
  var gender  = getRadio("gender");
  var vaccin  = getRadio("vaccinated");
  var insur   = getRadio("insurance");
  var health  = frm.healthScore.value;
  var salary  = parseInt(frm.salaryBar.value, 10);
  var symptoms = frm.symptoms.value.trim();
  var userid  = frm.userid.value.trim().toLowerCase();
  var pwd     = frm.passid.value;
  var pwd2    = frm.passid2.value;

  // checkboxes - collect which ones are checked
  var cbNames = [
    {name:"hx_chickenpox", label:"Chicken Pox"},
    {name:"hx_measles",    label:"Measles"},
    {name:"hx_covid",      label:"COVID-19"},
    {name:"hx_smallpox",   label:"Small Pox"},
    {name:"hx_tetanus",    label:"Tetanus Shot"},
    {name:"hx_flu",        label:"Flu Shot"},
    {name:"hx_hepb",       label:"Hepatitis B"}
  ];

  var cbChecked = [];
  for (var i = 0; i < cbNames.length; i++) {
    var el = document.querySelector('input[name="' + cbNames[i].name + '"]');
    if (el && el.checked) cbChecked.push(cbNames[i].label);
  }
  var cbDisplay = cbChecked.length > 0 ? cbChecked.join(", ") : "None selected";

  // validation for each field
  var nameDisplay = fname + (mi ? " " + mi + "." : "") + " " + lname;

  var nameStatus = "OK", nameNote = "";
  if (!fname || !lname) {
    nameStatus = "ERROR";
    nameNote = "First and Last name are required.";
  }

  var dobStatus = "OK", dobNote = "", dobDisplay = dob;
  if (!dob) {
    dobStatus = "ERROR";
    dobNote = "Date of Birth is required.";
  } else {
    var dobObj = new Date(dob);
    var today  = new Date();
    var minDob = new Date();
    minDob.setFullYear(today.getFullYear() - 120);

    if (dobObj > today)  { dobStatus = "ERROR"; dobNote = "Cannot be in the future."; }
    else if (dobObj < minDob) { dobStatus = "ERROR"; dobNote = "Date is more than 120 years ago."; }

    // reformat to MM/DD/YYYY
    var parts = dob.split("-");
    dobDisplay = parts[1] + "/" + parts[2] + "/" + parts[0];
  }

  var ssnStatus = "OK", ssnNote = "", ssnDisplay = "***-**-****";
  if (!ssn || ssn.replace(/\D/g,"").length < 9) {
    ssnStatus = "ERROR";
    ssnNote = "Valid SSN required.";
  }

  var emailStatus = "OK", emailNote = "";
  if (!email || !/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(email)) {
    emailStatus = "ERROR";
    emailNote = "Must be in name@domain.tld format.";
  }

  var phoneStatus = "OK", phoneNote = "";
  if (!phone || !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
    phoneStatus = "ERROR";
    phoneNote = "Must be in NNN-NNN-NNNN format.";
  }

  var addrStatus = "OK", addrNote = "";
  if (!addr1 || addr1.length < 2) {
    addrStatus = "ERROR";
    addrNote = "Address Line 1 is required (min 2 chars).";
  }

  var cityStatus = "OK", cityNote = "";
  if (!city || city.length < 2) {
    cityStatus = "ERROR";
    cityNote = "City is required (min 2 chars).";
  }

  var stateStatus = "OK", stateNote = "";
  if (!state) {
    stateStatus = "ERROR";
    stateNote = "Please select a state.";
  }

  var zipStatus = "OK", zipNote = "";
  if (!zipRaw || !/^\d{5}(-\d{4})?$/.test(zipRaw)) {
    zipStatus = "ERROR";
    zipNote = "Must be 5 digits (ZIP+4 accepted and will be truncated).";
  }
  var zipDisplay = zipRaw ? zipShort + (zipRaw.length > 5 ? " <em>(truncated from " + zipRaw + ")</em>" : "") : "";

  var genderStatus = gender ? "OK" : "ERROR";
  var genderNote   = gender ? "" : "Please select a gender.";

  var vaccinStatus = vaccin ? "OK" : "ERROR";
  var vaccinNote   = vaccin ? "" : "Please answer vaccination question.";

  var insurStatus = insur ? "OK" : "ERROR";
  var insurNote   = insur ? "" : "Please answer insurance question.";

  var useridStatus = "OK", useridNote = "";
  if (!userid || userid.length < 5 || userid.length > 30) {
    useridStatus = "ERROR";
    useridNote = "User ID must be 5–30 characters.";
  } else if (!/^[a-z][a-z0-9_\-]{4,29}$/.test(userid)) {
    useridStatus = "ERROR";
    useridNote = "Must start with a letter. Letters, numbers, underscore, dash only. No spaces.";
  }

  var pwdStatus = "OK", pwdNote = "";
  if (!pwd || pwd.length < 8 || pwd.length > 30) {
    pwdStatus = "ERROR"; pwdNote = "Password must be 8–30 characters.";
  } else if (!/[A-Z]/.test(pwd)) {
    pwdStatus = "ERROR"; pwdNote = "Needs at least 1 uppercase letter.";
  } else if (!/[a-z]/.test(pwd)) {
    pwdStatus = "ERROR"; pwdNote = "Needs at least 1 lowercase letter.";
  } else if (!/[0-9]/.test(pwd)) {
    pwdStatus = "ERROR"; pwdNote = "Needs at least 1 number.";
  } else if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pwd)) {
    pwdStatus = "ERROR"; pwdNote = "Needs at least 1 special character (!@#%^&*...).";
  } else if (/"/.test(pwd)) {
    pwdStatus = "ERROR"; pwdNote = "Password cannot contain quotation marks.";
  } else if (userid && pwd.toLowerCase().indexOf(userid) !== -1) {
    pwdStatus = "ERROR"; pwdNote = "Password cannot contain your User ID.";
  }

  var pwd2Status = "OK", pwd2Note = "";
  if (!pwd2) {
    pwd2Status = "ERROR"; pwd2Note = "Please re-enter your password.";
  } else if (pwd !== pwd2) {
    pwd2Status = "ERROR"; pwd2Note = "Passwords do not match.";
  }

  // build the HTML for the review panel
  var html = "";

  html += '<div class="rv-section-title">Personal Information</div>';
  html += row("Full Name",       nameDisplay, nameStatus, nameNote);
  html += row("Date of Birth",   dobDisplay,  dobStatus,  dobNote);
  html += row("Social Security", ssnDisplay,  ssnStatus,  ssnNote);

  html += '<div class="rv-section-title">Contact Information</div>';
  html += row("Email Address", email, emailStatus, emailNote);
  html += row("Phone Number",  phone, phoneStatus, phoneNote);

  html += '<div class="rv-section-title">Address</div>';
  var addrFull = addr1 + (addr2 ? "<br>" + addr2 : "") + "<br>" + city + ", " + state + " " + zipDisplay;
  html += row("Address", addrFull, addrStatus, addrNote);
  if (cityStatus === "ERROR")  html += row("City",  city,   cityStatus,  cityNote);
  if (stateStatus === "ERROR") html += row("State", state,  stateStatus, stateNote);
  if (zipStatus === "ERROR")   html += row("ZIP",   zipRaw, zipStatus,   zipNote);

  html += '<div class="rv-section-title">Health &amp; Preferences</div>';
  html += row("Medical History",    cbDisplay,                           "OK", "");
  html += row("Gender",             gender || "",                         genderStatus, genderNote);
  html += row("Fully Vaccinated",   vaccin || "",                         vaccinStatus, vaccinNote);
  html += row("Has Insurance",      insur  || "",                         insurStatus,  insurNote);
  html += row("Health Score",       health + " / 10",                    "OK", "");
  html += row("Desired Salary",     "$" + salary.toLocaleString("en-US") + " / yr", "OK", "");
  html += row("Described Symptoms", symptoms || "<em>None provided</em>", "OK", "");

  html += '<div class="rv-section-title">Account Credentials</div>';
  html += row("User ID",            userid || "",                                         useridStatus, useridNote);
  html += row("Password",           pwd ? "&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226; (hidden)" : "", pwdStatus, pwdNote);
  html += row("Password Confirmed", pwd2 ? "&#10004; Entered" : "",                      pwd2Status,   pwd2Note);

  body.innerHTML = html;

  document.getElementById("review-panel").scrollIntoView({behavior: "smooth", block: "start"});
}

// main submit handler - validates everything before the form goes through
function handleSubmit() {
  var frm   = document.patientForm;
  var valid = true;

  function fail(errId, msg, fieldEl) {
    showError(errId, msg);
    if (fieldEl && valid) fieldEl.focus();
    valid = false;
  }

  // name fields
  var fname = frm.fname.value.trim();
  var lname = frm.lname.value.trim();

  if (!fname || !/^[A-Za-z'\-]{1,30}$/.test(fname))
    fail("fname-err", "First name: letters, apostrophes, dashes only (1–30 chars).", frm.fname);

  if (frm.mi.value && !/^[A-Za-z]$/.test(frm.mi.value))
    fail("mi-err", "Middle initial must be a single letter.", frm.mi);

  if (!lname || lname.length < 1 || lname.length > 30)
    fail("lname-err", "Last name is required (1–30 characters).", frm.lname);

  // date of birth
  var dob = frm.dob.value;
  if (!dob) {
    fail("dob-err", "Date of Birth is required.", frm.dob);
  } else {
    var dobObj = new Date(dob);
    var today  = new Date();
    var minDob = new Date();
    minDob.setFullYear(today.getFullYear() - 120);
    if (dobObj > today)  fail("dob-err", "Date of Birth cannot be in the future.", frm.dob);
    if (dobObj < minDob) fail("dob-err", "Date of Birth cannot be more than 120 years ago.", frm.dob);
  }

  // SSN
  var ssn = frm.ssn.value.trim();
  if (!ssn || ssn.replace(/\D/g,"").length < 9)
    fail("ssn-err", "Valid SSN required (format: XXX-XX-XXXX).", frm.ssn);

  // email
  var email = frm.email.value.trim();
  if (!email || !/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(email))
    fail("email-err", "Valid email required: name@domain.tld", frm.email);

  // phone
  var phone = frm.phone.value.trim();
  if (!phone || !/^\d{3}-\d{3}-\d{4}$/.test(phone))
    fail("phone-err", "Phone must be in NNN-NNN-NNNN format.", frm.phone);

  // address
  if (!frm.addr1.value.trim() || frm.addr1.value.trim().length < 2)
    fail("addr1-err", "Address Line 1 is required (at least 2 characters).", frm.addr1);

  if (frm.addr2.value.trim() && frm.addr2.value.trim().length < 2)
    fail("addr2-err", "If entered, Address Line 2 must be at least 2 characters.", frm.addr2);

  // city, state, zip
  var city = frm.city.value.trim();
  if (!city || city.length < 2)
    fail("city-err", "City is required (min 2 characters).", frm.city);

  if (!frm.state.value)
    fail("state-err", "Please select a state.", frm.state);

  var zip = frm.zip.value.trim();
  if (!zip || !/^\d{5}(-\d{4})?$/.test(zip))
    fail("zip-err", "ZIP must be 5 digits or ZIP+4 (e.g. 77496 or 77496-1234).", frm.zip);

  // radio buttons - just check they picked something
  if (!getRadioValue("gender")) {
    showError("gender-err", "Please select a gender.");
    valid = false;
  }
  if (!getRadioValue("vaccinated")) valid = false; // has its own inline error in HTML
  if (!getRadioValue("insurance"))  valid = false;

  // user ID
  var uid = frm.userid.value.trim().toLowerCase();
  frm.userid.value = uid;
  if (!uid || uid.length < 5 || uid.length > 30) {
    fail("userid-err", "User ID must be 5–30 characters.", frm.userid);
  } else if (!/^[a-z][a-z0-9_\-]{4,29}$/.test(uid)) {
    fail("userid-err", "Must start with a letter. Letters, numbers, underscore, dash. No spaces.", frm.userid);
  }

  // password checks
  var pwd  = frm.passid.value;
  var pwd2 = frm.passid2.value;

  if (!pwd || pwd.length < 8 || pwd.length > 30) {
    fail("passid-err", "Password must be 8–30 characters.", frm.passid);
  } else if (!/[A-Z]/.test(pwd)) {
    fail("passid-err", "Password needs at least 1 uppercase letter.", frm.passid);
  } else if (!/[a-z]/.test(pwd)) {
    fail("passid-err", "Password needs at least 1 lowercase letter.", frm.passid);
  } else if (!/[0-9]/.test(pwd)) {
    fail("passid-err", "Password needs at least 1 number.", frm.passid);
  } else if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pwd)) {
    fail("passid-err", "Password needs at least 1 special character (!@#%^&*...).", frm.passid);
  } else if (/"/.test(pwd)) {
    fail("passid-err", "Password cannot contain quotation marks.", frm.passid);
  } else if (uid && pwd.toLowerCase().indexOf(uid) !== -1) {
    fail("passid-err", "Password cannot contain your User ID.", frm.passid);
  }

  if (!pwd2) {
    fail("passid2-err", "Please re-enter your password.", frm.passid2);
  } else if (pwd !== pwd2) {
    fail("passid2-err", "Passwords do not match.", frm.passid2);
  }

  // show review panel with errors highlighted if something failed
  if (!valid) {
    showReview();
    return false;
  }

  return true;
}

// gets the value of whichever radio in a group is selected
function getRadioValue(groupName) {
  var radios = document.getElementsByName(groupName);
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return "";
}
