@@ -0,0 +1,605 @@
<!DOCTYPE html>
<!--
  ================================================================
  Program name:   patient-form.html  (Homework 2)
  Author:         Student Name
  Date created:   March 27, 2026
  Date last edited: March 27, 2026
  Version:        2.0
  Description:    We'R'Docs Medical Center — New Patient Registration
                  Form. Built on HW1. Adds: HTML5 pattern validation
                  on all fields, title attributes for context help,
                  live password strength checking, salary/health
                  slide bars with dynamic JS display, a "Review"
                  button that redisplays all entered data in a review
                  panel without reloading the page, and lowercase
                  conversion of the User ID field.
                  External CSS: style.css
                  External JS:  validation.js
  ================================================================
-->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We'R'Docs Medical &ndash; New Patient Registration</title>
  <link href="style.css" rel="stylesheet">
  <script src="validation.js"></script>
</head>

<body onload="initPage();">

<!-- ================================================================
     BANNER / HEADER
     ================================================================ -->
<div id="banner">
  <div id="banner-logo">
    <svg width="72" height="72" viewBox="0 0 72 72"
         xmlns="http://www.w3.org/2000/svg" aria-label="We'R'Docs Medical Logo" role="img">
      <circle cx="36" cy="36" r="34" fill="#1a56db" stroke="#ffffff" stroke-width="3"/>
      <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
      <rect x="29" y="14" width="14" height="44" rx="5" fill="#ffffff"/>
      <rect x="14" y="29" width="44" height="14" rx="5" fill="#ffffff"/>
    </svg>
  </div>
  <div id="banner-text">
    <h1>We&#39;R&#39;Docs Medical Center</h1>
    <p id="dynamic-date"></p>
    <p id="banner-tagline">Caring for You &mdash; Body, Mind &amp; Spirit</p>
  </div>
</div>

<!-- ================================================================
     PAGE WRAPPER — two-column layout (form left, review right)
     ================================================================ -->
<div id="page-wrapper">

<!-- ================================================================
     MAIN FORM COLUMN
     ================================================================ -->
<div id="main-content">

  <h2>New Patient Registration</h2>
  <p class="form-intro">
    Fields marked <span class="req">*</span> are required.
    Hover over any field for instructions. Use <kbd>Tab</kbd> to move between fields.
  </p>

  <form name="patientForm" id="patientForm"
        onsubmit="return handleSubmit();"
        action="thankyou.html"
        novalidate>

    <!-- ============================================================
         BLOCK 1 — PERSONAL INFORMATION
         ============================================================ -->
    <fieldset>
      <legend>&#128100; Block 1 &mdash; Personal Information</legend>
      <table class="form-table">

        <!-- First Name / MI / Last Name — same row -->
        <tr>
          <td class="lbl"><label for="fname">Name <span class="req">*</span></label></td>
          <td>
            <!-- First Name: 1-30 chars, letters/apostrophes/dashes only -->
            <input type="text" id="fname" name="fname"
                   maxlength="30" size="16"
                   placeholder="First Name"
                   tabindex="1"
                   title="First Name: 1 to 30 characters. Letters, apostrophes, and dashes only. No numbers."
                   pattern="[A-Za-z'\-]{1,30}"
                   required
                   oninput="clearError('fname-err')">
            <span class="err-msg" id="fname-err"></span>
            &nbsp;
            <label for="mi" class="inline-lbl">MI</label>
            <!-- Middle Initial: exactly 1 letter, optional -->
            <input type="text" id="mi" name="mi"
                   maxlength="1" size="2"
                   placeholder="M"
                   tabindex="2"
                   title="Middle Initial: 1 letter only. This field is optional."
                   pattern="[A-Za-z]"
                   style="width:2.8em;text-align:center;"
                   oninput="clearError('mi-err')">
            <span class="err-msg" id="mi-err"></span>
            &nbsp;
            <label for="lname" class="inline-lbl">Last <span class="req">*</span></label>
            <!-- Last Name: 1-30 chars, letters/apostrophes/numbers 2-5/dashes -->
            <input type="text" id="lname" name="lname"
                   maxlength="30" size="16"
                   placeholder="Last Name"
                   tabindex="3"
                   title="Last Name: 1 to 30 characters. Letters, apostrophes, dashes, and suffix numbers (2nd–5th) only."
                   pattern="[A-Za-z'\-0-9\s]{1,30}"
                   required
                   oninput="clearError('lname-err')">
            <span class="err-msg" id="lname-err"></span>
          </td>
        </tr>

        <!-- Date of Birth: MM/DD/YYYY with min/max enforced by JS -->
        <tr>
          <td class="lbl"><label for="dob">Date of Birth <span class="req">*</span></label></td>
          <td>
            <!-- Using type="date" for browser date-picker; min/max set by initPage() -->
            <input type="date" id="dob" name="dob"
                   tabindex="4"
                   title="Date of Birth: Must be a real past date. Cannot be in the future or more than 120 years ago."
                   required
                   oninput="clearError('dob-err')">
            <span class="err-msg" id="dob-err"></span>
            <span class="hint">Must be between 120 years ago and today.</span>
          </td>
        </tr>

        <!-- Social Security — obscured, password style -->
        <tr>
          <td class="lbl"><label for="ssn">Social Security # <span class="req">*</span></label></td>
          <td>
            <!-- type="password" obscures digits as *** on screen -->
            <input type="password" id="ssn" name="ssn"
                   maxlength="11" size="14"
                   placeholder="XXX-XX-XXXX"
                   tabindex="5"
                   title="Social Security Number: Enter in XXX-XX-XXXX format. This field is obscured for your security."
                   pattern="\d{3}-?\d{2}-?\d{4}"
                   required
                   oninput="clearError('ssn-err')">
            <span class="err-msg" id="ssn-err"></span>
            <span class="hint">&#128274; Obscured for security. Format: XXX-XX-XXXX</span>
          </td>
        </tr>

      </table>
    </fieldset>

    <!-- ============================================================
         BLOCK 2 — CONTACT INFORMATION
         ============================================================ -->
    <fieldset>
      <legend>&#128222; Block 2 &mdash; Contact Information</legend>
      <table class="form-table">

        <!-- Email -->
        <tr>
          <td class="lbl"><label for="email">Email Address <span class="req">*</span></label></td>
          <td>
            <input type="text" id="email" name="email"
                   maxlength="80" size="34"
                   placeholder="name@domain.com"
                   tabindex="6"
                   title="Email Address: Must be in the format name@domain.tld — example: john@gmail.com"
                   pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                   required
                   oninput="clearError('email-err')">
            <span class="err-msg" id="email-err"></span>
          </td>
        </tr>

        <!-- Phone -->
        <tr>
          <td class="lbl"><label for="phone">Phone Number <span class="req">*</span></label></td>
          <td>
            <!-- Pattern enforces NNN-NNN-NNNN format -->
            <input type="text" id="phone" name="phone"
                   maxlength="12" size="14"
                   placeholder="713-555-1234"
                   tabindex="7"
                   title="Phone Number: Enter in the format NNN-NNN-NNNN (digits and dashes only). Example: 713-555-1234"
                   pattern="\d{3}-\d{3}-\d{4}"
                   required
                   oninput="clearError('phone-err')">
            <span class="err-msg" id="phone-err"></span>
            <span class="hint">Format: NNN-NNN-NNNN</span>
          </td>
        </tr>

      </table>
    </fieldset>

    <!-- ============================================================
         BLOCK 3 — ADDRESS
         ============================================================ -->
    <fieldset>
      <legend>&#127968; Block 3 &mdash; Home Address</legend>
      <table class="form-table">

        <tr>
          <td class="lbl"><label for="addr1">Address Line 1 <span class="req">*</span></label></td>
          <td>
            <input type="text" id="addr1" name="addr1"
                   maxlength="30" size="34"
                   placeholder="Street number and name"
                   tabindex="8"
                   title="Address Line 1: Required. 2 to 30 characters. Enter your street number and street name."
                   minlength="2"
                   required
                   oninput="clearError('addr1-err')">
            <span class="err-msg" id="addr1-err"></span>
          </td>
        </tr>

        <tr>
          <td class="lbl"><label for="addr2">Address Line 2</label></td>
          <td>
            <input type="text" id="addr2" name="addr2"
                   maxlength="30" size="34"
                   placeholder="Apt, Suite, Unit (optional)"
                   tabindex="9"
                   title="Address Line 2: Optional. If entered, must be 2 to 30 characters. Use for Apt, Suite, or Unit numbers."
                   minlength="2"
                   oninput="clearError('addr2-err')">
            <span class="err-msg" id="addr2-err"></span>
          </td>
        </tr>

        <!-- City / State / ZIP on same row -->
        <tr>
          <td class="lbl"><label for="city">City / State / ZIP <span class="req">*</span></label></td>
          <td>
            <input type="text" id="city" name="city"
                   maxlength="30" size="18"
                   placeholder="City"
                   tabindex="10"
                   title="City: Required. 2 to 30 characters. Letters and spaces only."
                   pattern="[A-Za-z\s\-\.]{2,30}"
                   required
                   oninput="clearError('city-err')">
            <span class="err-msg" id="city-err"></span>
            &nbsp;
            <label for="state" class="inline-lbl">State <span class="req">*</span></label>
            <select id="state" name="state" tabindex="11"
                    title="State: Required. Select your state from the dropdown list."
                    onchange="clearError('state-err')">
              <option value="">(State)</option>
              <option value="AL">AL</option><option value="AK">AK</option>
              <option value="AZ">AZ</option><option value="AR">AR</option>
              <option value="CA">CA</option><option value="CO">CO</option>
              <option value="CT">CT</option><option value="DE">DE</option>
              <option value="DC">DC</option><option value="FL">FL</option>
              <option value="GA">GA</option><option value="HI">HI</option>
              <option value="ID">ID</option><option value="IL">IL</option>
              <option value="IN">IN</option><option value="IA">IA</option>
              <option value="KS">KS</option><option value="KY">KY</option>
              <option value="LA">LA</option><option value="ME">ME</option>
              <option value="MD">MD</option><option value="MA">MA</option>
              <option value="MI">MI</option><option value="MN">MN</option>
              <option value="MS">MS</option><option value="MO">MO</option>
              <option value="MT">MT</option><option value="NE">NE</option>
              <option value="NV">NV</option><option value="NH">NH</option>
              <option value="NJ">NJ</option><option value="NM">NM</option>
              <option value="NY">NY</option><option value="NC">NC</option>
              <option value="ND">ND</option><option value="OH">OH</option>
              <option value="OK">OK</option><option value="OR">OR</option>
              <option value="PA">PA</option><option value="PR">PR</option>
              <option value="RI">RI</option><option value="SC">SC</option>
              <option value="SD">SD</option><option value="TN">TN</option>
              <option value="TX" selected>TX</option><option value="UT">UT</option>
              <option value="VT">VT</option><option value="VA">VA</option>
              <option value="WA">WA</option><option value="WV">WV</option>
              <option value="WI">WI</option><option value="WY">WY</option>
            </select>
            <span class="err-msg" id="state-err"></span>
            &nbsp;
            <label for="zip" class="inline-lbl">ZIP <span class="req">*</span></label>
            <!-- ZIP: 5 digits required; up to 10 with dash for ZIP+4; will be truncated to 5 on review -->
            <input type="text" id="zip" name="zip"
                   maxlength="10" size="10"
                   placeholder="77496"
                   tabindex="12"
                   title="ZIP Code: Required. Enter 5 digits (e.g. 77496). You may include ZIP+4 (e.g. 77496-1234) — it will be truncated to 5 digits on review."
                   pattern="\d{5}(-\d{4})?"
                   required
                   oninput="clearError('zip-err')">
            <span class="err-msg" id="zip-err"></span>
          </td>
        </tr>

      </table>
    </fieldset>

    <!-- ============================================================
         BLOCK 4 — CHOICES (checkboxes, radios, sliders, textarea)
         ============================================================ -->
    <fieldset>
      <legend>&#9745; Block 4 &mdash; Health &amp; Preferences</legend>

      <!-- CHECKBOXES — medical history -->
      <p class="section-note">Check ALL that apply to your medical history:</p>
      <table class="form-table">
        <tr>
          <td class="lbl">Have you had&hellip;</td>
          <td class="checkbox-group">
            <label class="cb-label" title="Check if you have previously had Chicken Pox">
              <input type="checkbox" name="hx_chickenpox" value="chickenpox"> Chicken Pox
            </label>
            <label class="cb-label" title="Check if you have previously had Measles">
              <input type="checkbox" name="hx_measles" value="measles"> Measles
            </label>
            <label class="cb-label" title="Check if you have previously had COVID-19">
              <input type="checkbox" name="hx_covid" value="covid"> COVID-19
            </label>
            <label class="cb-label" title="Check if you have previously had Small Pox">
              <input type="checkbox" name="hx_smallpox" value="smallpox"> Small Pox
            </label>
            <label class="cb-label" title="Check if you have received a Tetanus vaccination">
              <input type="checkbox" name="hx_tetanus" value="tetanus"> Tetanus Shot
            </label>
            <label class="cb-label" title="Check if you receive an annual Flu Shot">
              <input type="checkbox" name="hx_flu" value="flu"> Flu Shot (Annual)
            </label>
            <label class="cb-label" title="Check if you have received the Hepatitis B vaccine">
              <input type="checkbox" name="hx_hepb" value="hepb"> Hepatitis B
            </label>
          </td>
        </tr>
      </table>

      <!-- RADIO BUTTONS -->
      <table class="form-table" style="margin-top:10px;">
        <!-- Radio Set 1: Gender -->
        <tr>
          <td class="lbl">Gender <span class="req">*</span></td>
          <td class="radio-group">
            <label class="rb-label" title="Select Male for gender">
              <input type="radio" name="gender" value="Male"> Male
            </label>
            <label class="rb-label" title="Select Female for gender">
              <input type="radio" name="gender" value="Female"> Female
            </label>
            <label class="rb-label" title="Select if you prefer not to specify a gender">
              <input type="radio" name="gender" value="Other"> Other / Prefer not to say
            </label>
          </td>
        </tr>
        <!-- Radio Set 2: Vaccinated -->
        <tr>
          <td class="lbl">Fully Vaccinated? <span class="req">*</span></td>
          <td class="radio-group">
            <label class="rb-label" title="Select Yes if you are fully vaccinated against COVID-19">
              <input type="radio" name="vaccinated" value="Yes"> Yes
            </label>
            <label class="rb-label" title="Select No if you are not fully vaccinated">
              <input type="radio" name="vaccinated" value="No"> No
            </label>
          </td>
        </tr>
        <!-- Radio Set 3: Insurance -->
        <tr>
          <td class="lbl">Has Insurance? <span class="req">*</span></td>
          <td class="radio-group">
            <label class="rb-label" title="Select Yes if you currently have health insurance coverage">
              <input type="radio" name="insurance" value="Yes"> Yes
            </label>
            <label class="rb-label" title="Select No if you do not currently have health insurance">
              <input type="radio" name="insurance" value="No"> No
            </label>
          </td>
        </tr>
      </table>

      <!-- SLIDE BAR 1: Health Score (1–10) -->
      <table class="form-table" style="margin-top:12px;">
        <tr>
          <td class="lbl">
            <label for="healthScore">Overall Health <span class="req">*</span></label>
          </td>
          <td>
            <div class="slider-row">
              <span class="slider-end">1<br><small>Poor</small></span>
              <input type="range" id="healthScore" name="healthScore"
                     min="1" max="10" value="5" step="1"
                     tabindex="13"
                     title="Overall Health Score: Slide to rate your health from 1 (very poor) to 10 (excellent)."
                     oninput="updateSlider('healthScore','healthVal', 1, '')">
              <span class="slider-end">10<br><small>Excellent</small></span>
              <span class="slider-current">Score: <strong id="healthVal">5</strong> / 10</span>
            </div>
          </td>
        </tr>

        <!-- SLIDE BAR 2: Desired Salary ($20,000 – $200,000) — NEW for HW2 -->
        <tr>
          <td class="lbl">
            <label for="salaryBar">Desired Salary</label>
          </td>
          <td>
            <div class="slider-row">
              <span class="slider-end">$20k<br><small>Min</small></span>
              <input type="range" id="salaryBar" name="salaryBar"
                     min="20000" max="200000" value="60000" step="5000"
                     tabindex="14"
                     title="Desired Annual Salary: Slide to select your desired annual salary range from $20,000 to $200,000."
                     oninput="updateSalarySlider()">
              <span class="slider-end">$200k<br><small>Max</small></span>
              <span class="slider-current"><strong id="salaryVal">$60,000</strong> / yr</span>
            </div>
            <span class="hint">Slide to indicate your preferred annual salary range.</span>
          </td>
        </tr>
      </table>

      <!-- TEXTAREA: Symptoms -->
      <table class="form-table" style="margin-top:8px;">
        <tr>
          <td class="lbl"><label for="symptoms">Describe Symptoms</label></td>
          <td>
            <!-- Note: pattern avoids double-quotes which can break DB -->
            <textarea id="symptoms" name="symptoms"
                      rows="5" cols="55"
                      tabindex="15"
                      title="Current Symptoms: Optional. Describe your symptoms, how long you have had them, and their severity. Please do not use quotation marks."
                      placeholder="Describe your current symptoms, duration, and severity. (Optional — no quotation marks please)"
                      pattern='[^"]*'></textarea>
            <span class="hint">Optional. Avoid using quotation marks &quot; in this field.</span>
          </td>
        </tr>
      </table>

    </fieldset>

    <!-- ============================================================
         BLOCK 5 — ACCOUNT CREDENTIALS
         ============================================================ -->
    <fieldset>
      <legend>&#128274; Block 5 &mdash; Account Credentials</legend>
      <table class="form-table">

        <!-- User ID -->
        <tr>
          <td class="lbl"><label for="userid">User ID <span class="req">*</span></label></td>
          <td>
            <!-- Converted to lowercase automatically on blur/submit -->
            <input type="text" id="userid" name="userid"
                   maxlength="30" size="24"
                   placeholder="Choose a username"
                   tabindex="16"
                   title="User ID: 5 to 30 characters. Letters, numbers, underscore or dash only. Must start with a letter. NO spaces. Will be converted to lowercase automatically."
                   pattern="[A-Za-z][A-Za-z0-9_\-]{4,29}"
                   required
                   oninput="clearError('userid-err')"
                   onblur="convertLowercase()">
            <span class="err-msg" id="userid-err"></span>
            <span class="hint">5–30 chars. Letters/numbers/underscore/dash. Must start with a letter. No spaces. Auto-converted to lowercase.</span>
          </td>
        </tr>

        <!-- Password -->
        <tr>
          <td class="lbl"><label for="passid">Password <span class="req">*</span></label></td>
          <td>
            <!-- type="password" obscures characters as *** -->
            <input type="password" id="passid" name="passid"
                   maxlength="30" size="24"
                   placeholder="Min 8 characters"
                   tabindex="17"
                   title="Password: 8 to 30 characters. Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#%^&amp;*()-_+=). No quotation marks allowed."
                   required
                   oninput="checkPasswordStrength(); clearError('passid-err')">
            <span class="err-msg" id="passid-err"></span>
            <!-- Live password strength indicator -->
            <div id="strength-bar-wrap">
              <div id="strength-bar"></div>
            </div>
            <span id="strength-label" class="hint"></span>
          </td>
        </tr>

        <!-- Re-enter Password -->
        <tr>
          <td class="lbl"><label for="passid2">Re-enter Password <span class="req">*</span></label></td>
          <td>
            <input type="password" id="passid2" name="passid2"
                   maxlength="30" size="24"
                   placeholder="Repeat password"
                   tabindex="18"
                   title="Re-enter Password: Must exactly match the password you entered above."
                   required
                   oninput="checkPasswordMatch(); clearError('passid2-err')">
            <span class="err-msg" id="passid2-err"></span>
            <span id="match-label" class="hint"></span>
          </td>
        </tr>

      </table>
    </fieldset>

    <!-- ── ACTION BUTTONS ──────────────────────────────────────── -->
    <div id="form-buttons">
      <!-- Review button: shows entered data WITHOUT submitting -->
      <input type="button" id="btn-review" value="&#128269; Review My Info"
             tabindex="19"
             onclick="showReview();">
      <!-- Reset clears all fields -->
      <input type="reset"  id="btn-reset"  value="&#10006; Start Over"
             tabindex="20"
             onclick="clearReview();">
      <!-- Submit: runs full JS validation then goes to thankyou.html -->
      <input type="submit" id="btn-submit" value="&#10004; Submit Registration"
             tabindex="21">
    </div>

  </form>
</div><!-- end #main-content -->

<!-- ================================================================
     REVIEW PANEL — shown to the right / below when Review clicked
     Uses <div> and <span> tags; does NOT rewrite the page
     ================================================================ -->
<div id="review-panel">
  <div id="review-header">
    <h3>&#128203; Please Review This Information</h3>
    <p class="review-subhead">Check your entries below before submitting. Fields with errors are marked in red.</p>
  </div>
  <div id="review-body">
    <!-- Populated dynamically by showReview() in validation.js -->
    <p class="review-placeholder">Click <strong>&#128269; Review My Info</strong> to see a summary of your entries here.</p>
  </div>
</div>

</div><!-- end #page-wrapper -->

<!-- ================================================================
     FOOTER
     ================================================================ -->
<div id="footer">
  <div id="footer-left">
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="15" cy="15" r="14" fill="#1a56db"/>
      <rect x="11" y="4"  width="8"  height="22" rx="3" fill="#fff"/>
      <rect x="4"  y="11" width="22" height="8"  rx="3" fill="#fff"/>
    </svg>
    <span class="footer-brand">We&#39;R&#39;Docs Medical</span>
  </div>
  <div id="footer-center">
    <button type="button" id="btn-contact"
            onclick="alert('We\'R\'Docs Medical Center\nPhone: (713) 555-9100\nEmail: info@werdocs.com\n\nFor medical emergencies, call 911.');">
      &#128222; Contact Us
    </button>
    <div id="social-links">
      <a href="https://www.facebook.com"  target="_blank" rel="noopener">Facebook</a>
      <span class="sep">|</span>
      <a href="https://www.twitter.com"   target="_blank" rel="noopener">Twitter / X</a>
      <span class="sep">|</span>
      <a href="https://www.instagram.com" target="_blank" rel="noopener">Instagram</a>
    </div>
  </div>
  <div id="footer-right">
    PO BOX 18881<br>Sugar Land, TX &nbsp;77496<br>
    &copy; <span id="footer-year"></span> We&#39;R&#39;Docs Medical Center. All rights reserved.
  </div>
</div>

<!-- ================================================================
     INLINE JS — dynamic date, footer year, DOB min/max dates
     ================================================================ -->
<script>
  /* initPage() — called onload. Sets dynamic date + DOB date limits */
  function initPage() {
    /* -- Dynamic banner date -- */
    var days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    var now = new Date();
    var d   = now.getDate();
    var sfx = (d===1||d===21||d===31)?"st":(d===2||d===22)?"nd":(d===3||d===23)?"rd":"th";
    document.getElementById("dynamic-date").innerHTML =
      "Today is: <strong>" + days[now.getDay()] + ", " +
      months[now.getMonth()] + " " + d + sfx + ", " + now.getFullYear() + "</strong>";
    document.getElementById("footer-year").textContent = now.getFullYear();

    /* -- Set DOB min (120 years ago) and max (today) dynamically -- */
    var maxDate = now.toISOString().split("T")[0];          /* today */
    var minYear = new Date();
    minYear.setFullYear(now.getFullYear() - 120);
    var minDate = minYear.toISOString().split("T")[0];      /* 120 yrs ago */
    document.getElementById("dob").setAttribute("max", maxDate);
    document.getElementById("dob").setAttribute("min", minDate);
  }
</script>
<!-- ================================================================
     END OF DOCUMENT: patient-form.html  (HW2)
     ================================================================ -->
</body>
</html>
