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

// Function to change active tab and display corresponding content
function changeTab(tabIndex) {
  // Get all tabs and content elements
  var tabs = document.querySelectorAll('.tab');
  var tabContents = document.querySelectorAll('.tab-content');

  // Remove 'active' class from all tabs and content
  tabs.forEach(function(tab) {
      tab.classList.remove('active');
  });
  tabContents.forEach(function(content) {
      content.classList.remove('active');
  });

  // Add 'active' class to the clicked tab and corresponding content
  tabs[tabIndex].classList.add('active');
  tabContents[tabIndex].classList.add('active');
}