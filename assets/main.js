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
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value;
    const email   = form.querySelector('[name="email"]').value;
    const phone   = form.querySelector('[name="phone"]').value || 'Not provided';
    const vehicle = form.querySelector('[name="vehicle"]').value;
    const dates   = form.querySelector('[name="dates"]').value || 'Not specified';
    const message = form.querySelector('[name="message"]').value || '';
    const subject = encodeURIComponent('Rental Inquiry — ' + vehicle);
    const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nVehicle: ' + vehicle + '\nDates: ' + dates + '\n\nMessage:\n' + message);
    window.location.href = 'mailto:hello@clementinemotorsports.com?subject=' + subject + '&body=' + body;
    form.innerHTML = '<div style="text-align:center;padding:3rem 2rem;"><div style="font-family:Oxanium,sans-serif;font-weight:800;font-size:1.4rem;color:var(--clem);margin-bottom:1rem;text-transform:uppercase;letter-spacing:.05em;">Request Sent</div><p style="color:var(--dim);font-size:.92rem;line-height:1.7;">Your mail client should have opened. If not, email us directly at <a href="mailto:hello@clementinemotorsports.com" style="color:var(--clem);">hello@clementinemotorsports.com</a></p></div>';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFadeUp();
  initContactForm();
});
