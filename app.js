(function () {
  'use strict';

  function showSection(hash) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(s => {
      s.style.display = s.id === hash.substring(1) ? '' : 'none';
    });
    // Update active class in top nav
    document.querySelectorAll('nav a').forEach(a => {
      const targetHash = a.getAttribute('href');
      const sectionId = hash.substring(1);
      const isHome = targetHash === '#home' && sectionId === 'home';
      const isDrivers = targetHash === '#drivers' && (sectionId === 'drivers' || sectionId === 'driver-passport');
      const isVehicles = targetHash === '#vehicles' && (sectionId === 'vehicles' || sectionId === 'vehicle-passport');

      a.classList.toggle('active', isHome || isDrivers || isVehicles);
    });

    if (!hash || hash === '#home') {
      document.querySelectorAll('main > section').forEach(s => { if (s.id === 'home') s.style.display = ''; });
      const homeLink = document.querySelector('nav a[href="#home"]');
      if (homeLink) homeLink.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function attachTabs(scopeAttr) {
    document.querySelectorAll(`.tabbar[data-tabs="${scopeAttr}"]`).forEach(tabbar => {
      tabbar.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          // buttons
          tabbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          // panels
          const parentTabs = tabbar.parentElement;
          parentTabs.querySelectorAll('.tabpanel').forEach(p => p.classList.remove('active'));
          const panelKey = btn.dataset.tab;
          const panel = parentTabs.querySelector(`.tabpanel[data-panel="${panelKey}"]`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  function init() {
    // Navigation links and behavior
    const links = document.querySelectorAll('nav a, a.back, td a[href^="#"], .card-link');

    links.forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          history.pushState(null, '', href);
          showSection(href);
        }
      });
    });

    window.addEventListener('popstate', () => {
      showSection(location.hash || '#home');
    });

    // initialize display according to current hash
    const hash = location.hash || '#home';
    showSection(hash);

    // Attach tab handlers after DOM is ready
    attachTabs('driver');
    attachTabs('vehicle');

    // Image fallback handler: try ASCII filename first; on error fall back to existing Cyrillic filename
    document.querySelectorAll('img[data-fallback]').forEach(img => {
      img.addEventListener('error', function onError() {
        const fallback = this.dataset.fallback;
        if (fallback && this.src.indexOf(fallback) === -1) {
          this.removeEventListener('error', onError);
          this.src = fallback;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
