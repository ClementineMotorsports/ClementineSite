/* Clementine Motorsports — Global JS */

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  if (!menu || !btn) return;
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  if (!menu || !btn) return;
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }
});

function initFadeUp() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[\d\s\+\-\(\)\.]{7,}$/;

  function fieldError(field, msg) {
    field.style.borderColor = '#e05555';
    let el = field.parentElement.querySelector('.field-error');
    if (!el) {
      el = document.createElement('span');
      el.className = 'field-error';
      el.style.cssText = 'display:block;color:#e05555;font-family:Rajdhani,sans-serif;font-size:0.9rem;font-weight:600;letter-spacing:0.05em;margin-top:0.35rem;';
      field.parentElement.appendChild(el);
    }
    el.textContent = msg;
  }

  function fieldClear(field) {
    field.style.borderColor = '';
    const el = field.parentElement.querySelector('.field-error');
    if (el) el.remove();
  }

  function fieldOk(field) {
    field.style.borderColor = 'rgba(255,107,26,0.55)';
    const el = field.parentElement.querySelector('.field-error');
    if (el) el.remove();
  }

  function validate(name, value) {
    const v = value.trim();
    if (name === 'name') {
      if (!v)           return 'Full name is required.';
      if (v.length < 2) return 'Please enter your full name.';
    }
    if (name === 'email') {
      if (!v)                  return 'Email address is required.';
      if (!EMAIL_RE.test(v))   return 'Please enter a valid email address.';
    }
    if (name === 'phone' && v) {
      if (!PHONE_RE.test(v))   return 'Please enter a valid phone number.';
    }
    if (name === 'vehicle') {
      if (!v) return 'Please select a vehicle.';
    }
    return null;
  }

  /* Live validation — check on blur, clear error as user types */
  ['name', 'email', 'phone', 'vehicle'].forEach(name => {
    const field = form.querySelector('[name="' + name + '"]');
    if (!field) return;

    field.addEventListener('blur', () => {
      const err = validate(name, field.value);
      if (err) fieldError(field, err);
      else if (field.value.trim()) fieldOk(field);
      else fieldClear(field);
    });

    field.addEventListener('input', () => {
      if (field.style.borderColor === 'rgb(224, 85, 85)') {
        if (!validate(name, field.value)) fieldClear(field);
      }
    });
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    /* Validate everything before sending */
    let ok = true;
    ['name', 'email', 'vehicle'].forEach(name => {
      const field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      const err = validate(name, field.value);
      if (err) { fieldError(field, err); ok = false; }
      else fieldOk(field);
    });

    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField && phoneField.value.trim()) {
      const err = validate('phone', phoneField.value);
      if (err) { fieldError(phoneField, err); ok = false; }
      else fieldOk(phoneField);
    }

    if (!ok) {
      /* Scroll to first error */
      const first = form.querySelector('[style*="rgb(224, 85, 85)"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const origText  = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    /* Remove any previous top-level error */
    const prev = form.querySelector('.form-send-error');
    if (prev) prev.remove();

    const vehicle = form.querySelector('[name="vehicle"]').value;

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'b79dc4b9-a8e6-44cc-9a59-e87895623b8f',
          subject:    'Rental Inquiry — ' + vehicle,
          from_name:  'Clementine Motorsports Website',
          name:       form.querySelector('[name="name"]').value.trim(),
          email:      form.querySelector('[name="email"]').value.trim(),
          phone:      phoneField && phoneField.value.trim() ? phoneField.value.trim() : 'Not provided',
          vehicle:    vehicle,
          dates:      (form.querySelector('[name="dates"]').value.trim())   || 'Not specified',
          message:    (form.querySelector('[name="message"]').value.trim()) || '',
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Submission failed');

      form.innerHTML = `
        <div style="text-align:center;padding:3.5rem 2rem;">
          <div style="font-family:Oxanium,sans-serif;font-weight:800;font-size:1.5rem;
               color:var(--clem);margin-bottom:1.2rem;text-transform:uppercase;letter-spacing:.06em;">
            Inquiry Received
          </div>
          <p style="font-family:Rajdhani,sans-serif;font-size:1.05rem;line-height:1.8;color:var(--text);max-width:400px;margin:0 auto;">
            Thank you — we'll confirm availability and follow up within a few hours.
          </p>
          <p style="font-family:Rajdhani,sans-serif;font-size:0.95rem;line-height:1.7;
               color:var(--text-sec);margin-top:1.4rem;">
            Need a faster response?<br />
            <a href="tel:+12242162404" style="color:var(--white);font-weight:700;">(224) 216-2404</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@clementinemotorsports.com" style="color:var(--clem);">info@clementinemotorsports.com</a>
          </p>
        </div>`;

    } catch (err) {
      submitBtn.textContent = origText;
      submitBtn.disabled    = false;

      const errEl = document.createElement('p');
      errEl.className  = 'form-send-error';
      errEl.style.cssText = 'color:#e05555;font-family:Rajdhani,sans-serif;font-weight:600;'
        + 'font-size:0.95rem;margin-top:1rem;text-align:center;line-height:1.6;';
      errEl.innerHTML = 'Something went wrong sending your message.<br />'
        + 'Please call <a href="tel:+12242162404" style="color:var(--white);">(224) 216-2404</a> '
        + 'or email <a href="mailto:info@clementinemotorsports.com" style="color:var(--clem);">info@clementinemotorsports.com</a>';
      form.appendChild(errEl);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFadeUp();
  initContactForm();
});
