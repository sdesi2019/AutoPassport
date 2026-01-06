// Навигация по секциям
const links = document.querySelectorAll('nav a, a.back, td a[href^="#"], .card-link');
const sections = document.querySelectorAll('main > section');
function showSection(hash) {
  sections.forEach(s => {
    s.style.display = s.id === hash.substring(1) ? '' : 'none';
  });
  // Обновляем активный класс в верхнем меню
  document.querySelectorAll('nav a').forEach(a => {
    const targetHash = a.getAttribute('href');
    // Главная, Водители, Автотранспорт
    const sectionId = hash.substring(1);
    const isHome = targetHash === '#home' && sectionId === 'home';
    const isDrivers = targetHash === '#drivers' && (sectionId === 'drivers' || sectionId === 'driver-passport');
    const isVehicles = targetHash === '#vehicles' && (sectionId === 'vehicles' || sectionId === 'vehicle-passport');

    a.classList.toggle('active', isHome || isDrivers || isVehicles);
  });

  // Если на домашней странице или не определен хэш, показываем домашнюю
  if (!hash || hash === '#home') {
    sections.forEach(s => { if (s.id === 'home') s.style.display = ''; });
    const homeLink = document.querySelector('nav a[href="#home"]');
    if (homeLink) homeLink.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

links.forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      // Используем pushState для сохранения истории переходов
      history.pushState(null, '', href);
      showSection(href);
    }
  });
});

window.addEventListener('popstate', () => { /* Добавляем обработчик для кнопки "Назад" браузера */
    showSection(location.hash || '#home');
});
window.addEventListener('load', () => {
  const hash = location.hash || '#home';
  showSection(hash);
});

// Переключение вкладок
function attachTabs(scopeAttr) {
  document.querySelectorAll(`.tabbar[data-tabs="${scopeAttr}"]`).forEach(tabbar => {
    tabbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        // кнопки
        tabbar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // панели
        const parentTabs = tabbar.parentElement;
        parentTabs.querySelectorAll('.tabpanel').forEach(p => p.classList.remove('active'));
        const panelKey = btn.dataset.tab;
        const panel = parentTabs.querySelector(`.tabpanel[data-panel="${panelKey}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}
attachTabs('driver');
attachTabs('vehicle');

// Image fallback handler: try ASCII filename first; on error fall back to existing Cyrillic filename
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', function onError() {
      const fallback = this.dataset.fallback;
      if (fallback && this.src.indexOf(fallback) === -1) {
        this.removeEventListener('error', onError);
        this.src = fallback;
      }
    });
  });
});
