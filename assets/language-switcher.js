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
    link.className = 'md-header__button market-lang-switch';
    link.href = href;
    link.setAttribute('aria-label', target.label === 'EN' ? 'Switch to English' : '切换到中文');
    link.textContent = target.label;
    header.appendChild(link);
  }

  fetch(new URL('language-map.json', currentScriptBase()), { credentials: 'same-origin' })
    .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error(response.statusText)); })
    .then(installSwitcher)
    .catch(function () {
      installSwitcher({ zh_to_en: { '': 'en/' }, en_to_zh: { 'en/': '' } });
    });
}());
