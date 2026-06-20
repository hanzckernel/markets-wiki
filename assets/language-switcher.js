(function () {
  function currentScriptBase() {
    var script = document.currentScript || Array.prototype.slice.call(document.scripts).find(function (item) {
      return item.src && item.src.indexOf('language-switcher.js') !== -1;
    });
    return script ? new URL('.', script.src) : new URL('./assets/', window.location.href);
  }

  function normalizedPath(pathname) {
    var decoded = decodeURI(pathname).replace(/^\/+/, '');
    if (decoded.indexOf('markets-wiki/') === 0) {
      decoded = decoded.slice('markets-wiki/'.length);
    }
    if (decoded === 'index.html') {
      decoded = '';
    }
    decoded = decoded.replace(/index\.html$/, '');
    if (decoded && decoded.slice(-1) !== '/') {
      decoded += '/';
    }
    return decoded;
  }

  function projectPrefix(pathname) {
    var decoded = decodeURI(pathname);
    return decoded.indexOf('/markets-wiki/') === 0 ? '/markets-wiki/' : '/';
  }

  function targetFor(path, map) {
    if (path.indexOf('en/') === 0) {
      return {
        label: '中文',
        path: map.en_to_zh[path] || ''
      };
    }
    return {
      label: 'EN',
      path: map.zh_to_en[path] || map.zh_to_en[path.replace(/^zh\//, '')] || 'en/'
    };
  }

  function installSwitcher(map) {
    var current = normalizedPath(window.location.pathname);
    var prefix = projectPrefix(window.location.pathname);
    var target = targetFor(current, map);
    var href = prefix + target.path;
    var header = document.querySelector('.md-header__inner') || document.querySelector('.md-header');
    if (!header || document.querySelector('.market-lang-switch')) {
      return;
    }
    var link = document.createElement('a');
    link.className = 'md-header__button md-icon market-lang-switch';
    link.href = href;
    var ariaLabel = target.label === 'EN' ? 'Switch to English' : '切换到中文';
    link.setAttribute('aria-label', ariaLabel);
    link.setAttribute('title', ariaLabel);
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.87 15.07 10.33 12.56l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17A15.73 15.73 0 0 1 9 11.35 15.57 15.57 0 0 1 6.69 8H4.69A17.7 17.7 0 0 0 7.67 12.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12m-2.62 7 1.62-4.33L19.12 17h-3.24Z"/></svg>';
    header.appendChild(link);
  }

  fetch(new URL('language-map.json', currentScriptBase()), { credentials: 'same-origin' })
    .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error(response.statusText)); })
    .then(installSwitcher)
    .catch(function () {
      installSwitcher({ zh_to_en: { '': 'en/' }, en_to_zh: { 'en/': '' } });
    });
}());
