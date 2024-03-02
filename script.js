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

