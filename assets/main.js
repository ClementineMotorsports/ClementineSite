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

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const vehicle = form.querySelector('[name="vehicle"]').value;
    const payload = {
      access_key:  'b79dc4b9-a8e6-44cc-9a59-e87895623b8f',
      subject:     'Rental Inquiry — ' + vehicle,
      from_name:   'Clementine Motorsports Website',
      name:        form.querySelector('[name="name"]').value,
      email:       form.querySelector('[name="email"]').value,
      phone:       form.querySelector('[name="phone"]').value    || 'Not provided',
      vehicle:     vehicle,
      dates:       form.querySelector('[name="dates"]').value    || 'Not specified',
      message:     form.querySelector('[name="message"]').value  || '',
    };

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        form.innerHTML = `
          <div style="text-align:center;padding:3rem 2rem;">
            <div style="font-family:Oxanium,sans-serif;font-weight:800;font-size:1.4rem;color:var(--clem);margin-bottom:1rem;text-transform:uppercase;letter-spacing:.05em;">Inquiry Sent</div>
            <p style="font-family:Rajdhani,sans-serif;font-size:1rem;line-height:1.75;color:var(--text);">
              We received your request and will respond within a few hours.<br />
              Questions? Call <a href="tel:+12242162404" style="color:var(--white);">(224) 216-2404</a> or email <a href="mailto:info@clementinemotorsports.com" style="color:var(--clem);">info@clementinemotorsports.com</a>
            </p>
          </div>`;
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      submitBtn.textContent = 'Send Inquiry →';
      submitBtn.disabled = false;
      const errorEl = form.querySelector('.form-error') || document.createElement('p');
      errorEl.className = 'form-error';
      errorEl.style.cssText = 'color:#ff6b6b;font-family:Rajdhani,sans-serif;font-size:0.95rem;margin-top:0.8rem;text-align:center;';
      errorEl.textContent = 'Something went wrong — please call (224) 216-2404 or email info@clementinemotorsports.com';
      if (!form.querySelector('.form-error')) form.appendChild(errorEl);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFadeUp();
  initContactForm();
});
