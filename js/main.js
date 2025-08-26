// /js/main.js

// Run once when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // 1) Render Lucide icons if available
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // 2) Housecall Pro "Book Online" safeguard
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-orgname="Frost-Air"][data-token]');
    if (btn && window.HCPWidget && typeof HCPWidget.openModal === 'function') {
      e.preventDefault();
      HCPWidget.openModal();
    }
  });

  // 3) FAQ accordion (no-op on pages without .faq-btn)
  setupFaqAccordion(document);

  // 4) Responsive header: mobile menu toggle (with slide animation)
  const btn = document.getElementById('navToggle');
  const panel = document.getElementById('mobileNav');
  if (btn && panel) {
    const setBtnIcon = (name) => {
      btn.innerHTML = `<i data-lucide="${name}"></i>`;
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    };

    const open = () => {
      panel.classList.remove('hidden');   // unhide so it can animate
      // force reflow to ensure the next class change animates
      // eslint-disable-next-line no-unused-expressions
      panel.offsetHeight;
      panel.classList.add('open');        // triggers CSS transition to 1fr / opacity:1
      btn.setAttribute('aria-expanded', 'true');
      setBtnIcon('x');
    };

    const close = () => {
      panel.classList.remove('open');     // animates to 0fr / opacity:0
      btn.setAttribute('aria-expanded', 'false');
      setBtnIcon('menu');
      // wait for CSS transition to finish, then hide
      setTimeout(() => panel.classList.add('hidden'), 260);
    };

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });

    // Close on link click or ESC
    panel.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Initial icon
    setBtnIcon('menu');
  }
});

function setupFaqAccordion(root) {
  const buttons = root.querySelectorAll('.faq-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = root.getElementById(panelId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));

      const icon = btn.querySelector('.faq-icon');
      if (icon) icon.textContent = expanded ? '+' : '−';

      if (panel) {
        panel.style.gridTemplateRows = expanded ? '0fr' : '1fr';
        panel.style.opacity = expanded ? '0' : '1';
        panel.style.marginTop = expanded ? '0' : '0.75rem';
      }
    });
  });
}
