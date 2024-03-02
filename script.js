// Init TWA
Telegram.WebApp.ready();

// Event occurs whenever theme settings are changed in the user's Telegram app (including switching to night mode).
Telegram.WebApp.onEvent('themeChanged', function() {
    document.documentElement.className = Telegram.WebApp.colorScheme;
});

Telegram.WebApp.setHeaderColor('secondary_bg_color');

setViewportData();
Telegram.WebApp.onEvent('viewportChanged', setViewportData);

Telegram.WebApp.onEvent('themeChanged', function() {
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
});

document.addEventListener('DOMContentLoaded', function() {
  var tabItems = document.querySelectorAll('.tab-item');
 
  tabItems.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var tabId = this.getAttribute('data-tab');
      var content = document.getElementById(tabId);
 
      // Удаляем активный класс у текущих вкладок и контента
      document.querySelector('.tab-item.active').classList.remove('active');
      document.querySelector('.tab-pane.active').classList.remove('active');
 
      // Добавляем активный класс для выбранной вкладки и контента
      this.classList.add('active');
      content.classList.add('active');
    });
  });
});