(function () {
  const root = document.querySelector('[data-phylum-mega-nav]');
  if (!root) return;

  const hb = root.querySelector('#phylum-hamburger') || root.querySelector('#hamburger');
  const mobilePanelScroll = root.querySelector('#phylum-mobilePanelScroll') || root.querySelector('#mobilePanelScroll');
  const navBackdrop = root.querySelector('#phylum-navBackdrop') || root.querySelector('#navBackdrop');
  if (!hb || !mobilePanelScroll) return;

  let menuCloseTimer;

  const closeMobileMenu = () => {
    document.body.classList.remove('menu-open');
    hb.setAttribute('aria-expanded', 'false');
    hb.setAttribute('aria-label', 'Open menu');
    clearTimeout(menuCloseTimer);
    menuCloseTimer = setTimeout(() => {
      mobilePanelScroll.querySelectorAll('.m-group.open').forEach((g) => g.classList.remove('open'));
      mobilePanelScroll.scrollTop = 0;
    }, 620);
  };

  const openMobileMenu = () => {
    clearTimeout(menuCloseTimer);
    document.body.classList.add('menu-open');
    hb.setAttribute('aria-expanded', 'true');
    hb.setAttribute('aria-label', 'Close menu');
    mobilePanelScroll.scrollTop = 0;
  };

  hb.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? closeMobileMenu() : openMobileMenu();
  });

  const items = root.querySelectorAll('.nav-item[data-menu]');
  let closeTimer;
  const GUTTER = 24;

  function positionMenu(item) {
    const mega = item.querySelector('.mega');
    if (!mega) return;
    mega.style.left = '0px';
    const itemLeft = item.getBoundingClientRect().left;
    const w = mega.offsetWidth;
    let centeredLeft = (window.innerWidth - w) / 2;
    centeredLeft = Math.max(GUTTER, Math.min(centeredLeft, window.innerWidth - w - GUTTER));
    mega.style.left = centeredLeft - itemLeft + 'px';
  }

  items.forEach((item) => {
    const btn = item.querySelector('.nav-link');

    const open = () => {
      clearTimeout(closeTimer);
      items.forEach((i) => {
        i.classList.remove('open');
        const b = i.querySelector('.nav-link');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      positionMenu(item);
      document.body.classList.add('nav-open');
    };

    const scheduleClose = () => {
      closeTimer = setTimeout(() => {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }, 200);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', scheduleClose);
    btn.addEventListener('focus', open);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      item.classList.contains('open') ? scheduleClose() : open();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    items.forEach((i) => {
      i.classList.remove('open');
      i.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('nav-open');
    if (document.body.classList.contains('menu-open')) closeMobileMenu();
  });

  const versionSwitcher = document.querySelector('.nav-version-switcher');
  const versionButtons = versionSwitcher ? versionSwitcher.querySelectorAll('[data-nav-version]') : [];

  const getNavVersion = () =>
    document.documentElement.getAttribute('data-nav-version') || root.dataset.navVersion || 'promo';

  const getMegaContent = (item) => {
    const version = getNavVersion();
    return item.querySelector('.nav-version-' + version) || item.querySelector('.mega-inner');
  };

  const bindWaitlistForms = (scope) => {
    scope.querySelectorAll('.waitlist-form').forEach((form) => {
      if (form.dataset.bound) return;
      form.dataset.bound = 'true';
      if (form.getAttribute('action') === '#') {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          form.closest('.waitlist-wrap')?.classList.add('is-success');
        });
      }
    });
  };

  const buildMobilePromoFromDesktop = (megaContent) => {
    const wrap = document.createElement('div');
    wrap.className = 'm-promo';

    const visualSrc = megaContent.querySelector('.mega-promo-visual');
    if (visualSrc) {
      const visual = document.createElement('div');
      visual.className = 'm-promo-visual';
      const img = visualSrc.querySelector('.feature-img');
      if (img) visual.appendChild(img.cloneNode(true));
      wrap.appendChild(visual);
    }

    const contentSrc = megaContent.querySelector('.mega-promo-content');
    if (contentSrc) {
      const body = contentSrc.cloneNode(true);
      body.classList.add('m-promo-body');
      wrap.appendChild(body);
    }

    return wrap;
  };

  const buildMobileMenu = () => {
    mobilePanelScroll.innerHTML = '';
    items.forEach((item) => {
      const labelEl = item.querySelector('.nav-link-text');
      const label = labelEl
        ? labelEl.textContent
        : item.querySelector('.nav-link')?.textContent.trim() || '';

      const megaContent = getMegaContent(item);
      const group = document.createElement('div');
      group.className = 'm-group';

      const parent = document.createElement('button');
      parent.type = 'button';
      parent.className = 'm-parent';

      const showSoon = getNavVersion() === 'promo' && item.hasAttribute('data-menswear');
      const badge = item.querySelector('.nav-soon-badge');
      const badgeClone = showSoon && badge ? badge.cloneNode(true) : null;

      const labelWrap = document.createElement('span');
      labelWrap.className = 'm-parent-label';
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      labelWrap.appendChild(labelSpan);
      if (badgeClone) labelWrap.appendChild(badgeClone);

      const toggle = document.createElement('span');
      toggle.className = 'm-toggle';
      toggle.setAttribute('aria-hidden', 'true');
      toggle.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
      parent.appendChild(labelWrap);
      parent.appendChild(toggle);
      group.appendChild(parent);

      const sub = document.createElement('div');
      sub.className = 'm-sub';

      if (megaContent && megaContent.classList.contains('mega-promo')) {
        sub.appendChild(buildMobilePromoFromDesktop(megaContent));
      } else {
        const inner = document.createElement('div');
        inner.className = 'm-sub-inner';
        (megaContent ? megaContent.querySelectorAll('.mega-col') : []).forEach((col) => {
          const cl = col.querySelector('.col-label');
          if (cl) {
            const l = document.createElement('span');
            l.className = 'm-sub-label';
            l.textContent = cl.textContent;
            inner.appendChild(l);
          }
          col.querySelectorAll('.col-list a').forEach((a) => {
            const link = document.createElement('a');
            link.href = a.getAttribute('href') || '#';
            link.textContent = a.textContent;
            inner.appendChild(link);
          });
        });
        sub.appendChild(inner);

        const feature = megaContent ? megaContent.querySelector('.mega-feature') : null;
        if (feature) {
          const featClone = feature.cloneNode(true);
          featClone.classList.add('m-feature');
          sub.appendChild(featClone);
        }
      }

      group.appendChild(sub);
      parent.addEventListener('click', () => {
        const isOpen = group.classList.contains('open');
        mobilePanelScroll.querySelectorAll('.m-group.open').forEach((g) => g.classList.remove('open'));
        if (!isOpen) group.classList.add('open');
      });
      mobilePanelScroll.appendChild(group);
    });
    bindWaitlistForms(mobilePanelScroll);
  };

  const applyNavVersion = (version) => {
    document.documentElement.setAttribute('data-nav-version', version);
    versionButtons.forEach((btn) => {
      const active = btn.dataset.navVersion === version;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    items.forEach((i) => {
      i.classList.remove('open');
      i.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('nav-open');
    buildMobileMenu();
  };

  const savedVersion = sessionStorage.getItem('navVersion');
  if (versionSwitcher && (savedVersion === 'promo' || savedVersion === 'current')) {
    applyNavVersion(savedVersion);
  } else if (versionSwitcher) {
    applyNavVersion('current');
  } else {
    applyNavVersion(root.dataset.navVersion || 'promo');
  }

  versionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const version = btn.dataset.navVersion;
      sessionStorage.setItem('navVersion', version);
      applyNavVersion(version);
    });
  });

  bindWaitlistForms(root);

  navBackdrop?.addEventListener('click', () => {
    items.forEach((i) => {
      i.classList.remove('open');
      i.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('nav-open');
  });

  window.addEventListener('resize', () => {
    const openItem = root.querySelector('.nav-item.open');
    if (openItem) positionMenu(openItem);
  });

  document.addEventListener('shopify:section:load', (event) => {
    if (event.target.contains(root)) location.reload();
  });
})();
