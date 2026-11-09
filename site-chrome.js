(function () {
  const mount = document.getElementById('site-chrome');
  if (!mount) return;

  function initNav() {
    const hb = document.getElementById('hamburger');
    const mobilePanel = document.getElementById('mobilePanel');
    const mobilePanelScroll = document.getElementById('mobilePanelScroll');
    if (!hb || !mobilePanel || !mobilePanelScroll) return;

    let menuCloseTimer;

    const closeMobileMenu = () => {
      document.body.classList.remove('menu-open');
      hb.setAttribute('aria-expanded', 'false');
      hb.setAttribute('aria-label', 'Open menu');
      clearTimeout(menuCloseTimer);
      menuCloseTimer = setTimeout(() => {
        mobilePanelScroll.querySelectorAll('.m-group.open').forEach(g => g.classList.remove('open'));
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

    const items = document.querySelectorAll('.nav-item[data-menu]');
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
      mega.style.left = (centeredLeft - itemLeft) + 'px';
      const megaLeft = centeredLeft - itemLeft;
      const bridgeLeft = Math.min(0, megaLeft);
      const bridgeRight = Math.max(item.offsetWidth, megaLeft + w);
      item.style.setProperty('--bridge-left', bridgeLeft + 'px');
      item.style.setProperty('--bridge-w', (bridgeRight - bridgeLeft) + 'px');
    }

    // Hover intent: see index.html. A neighbor only takes over an open menu
    // after the pointer rests on it, so diagonal paths to the panel survive.
    const CLOSE_DELAY = 350;
    const SWITCH_DELAY = 180;
    let openItem = null;
    let switchTimer;
    let pendingItem = null;
    const pointer = { x: 0, y: 0, px: 0, py: 0, t: 0 };
    let switchTries = 0;
    document.addEventListener('mousemove', (e) => {
      pointer.px = pointer.x; pointer.py = pointer.y;
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now();
    }, { passive: true });

    const headingToPanel = () => {
      const mega = openItem && openItem.querySelector('.mega');
      if (!mega || performance.now() - pointer.t > 100) return false;
      const r = mega.getBoundingClientRect();
      const dist = (x, y) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
      return pointer.y >= pointer.py && dist(pointer.x, pointer.y) < dist(pointer.px, pointer.py);
    };

    const openNow = (item) => {
      clearTimeout(closeTimer);
      clearTimeout(switchTimer);
      pendingItem = null;
      items.forEach(i => {
        if (i === item) return;
        i.classList.remove('open');
        const b = i.querySelector('.nav-link');
        if (b && b.setAttribute) b.setAttribute('aria-expanded', 'false');
      });
      item.classList.add('open');
      item.querySelector('.nav-link').setAttribute('aria-expanded', 'true');
      positionMenu(item);
      document.body.classList.add('nav-open');
      openItem = item;
    };

    const closeAll = () => {
      clearTimeout(closeTimer);
      clearTimeout(switchTimer);
      pendingItem = null;
      items.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.nav-link');
        if (b && b.setAttribute) b.setAttribute('aria-expanded', 'false');
      });
      document.body.classList.remove('nav-open');
      openItem = null;
    };

    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeAll, CLOSE_DELAY);
    };

    const trySwitch = (item) => {
      if (pendingItem !== item) return;
      if (switchTries < 4 && headingToPanel()) { switchTries++; switchTimer = setTimeout(() => trySwitch(item), 100); return; }
      openNow(item);
    };

    items.forEach(item => {
      const btn = item.querySelector('.nav-link');

      item.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
        if (!openItem || openItem === item) { openNow(item); return; }
        clearTimeout(switchTimer);
        pendingItem = item;
        switchTries = 0;
        switchTimer = setTimeout(() => trySwitch(item), SWITCH_DELAY);
      });
      item.addEventListener('mouseleave', () => {
        if (pendingItem === item) { clearTimeout(switchTimer); pendingItem = null; }
        scheduleClose();
      });
      btn.addEventListener('focus', () => openNow(item));
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        item.classList.contains('open') ? closeAll() : openNow(item);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeAll();
        if (document.body.classList.contains('menu-open')) closeMobileMenu();
      }
    });

    const panel = mobilePanelScroll;
    const versionSwitcher = document.querySelector('.nav-version-switcher');
    const versionButtons = versionSwitcher ? versionSwitcher.querySelectorAll('[data-nav-version]') : [];

    const getNavVersion = () => document.documentElement.getAttribute('data-nav-version') || 'current';

    const getMegaContent = (item) => {
      const version = getNavVersion();
      return item.querySelector('.nav-version-' + version) || item.querySelector('.mega-inner');
    };

    const bindWaitlistForms = (root = document) => {
      root.querySelectorAll('.waitlist-form').forEach(form => {
        if (form.dataset.bound) return;
        form.dataset.bound = 'true';
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const wrap = form.closest('.waitlist-wrap');
          if (wrap) wrap.classList.add('is-success');
        });
      });
    };

    const soonBadgeHTML = `<span class="nav-soon-badge m-soon-badge" aria-hidden="true"><span class="nav-soon-label soon-pill">Coming Soon</span></span>`;

    const buildMobileMenu = () => {
      panel.innerHTML = '';
      items.forEach(item => {
        const labelEl = item.querySelector('.nav-link-text');
        const label = labelEl ? labelEl.textContent : item.querySelector('.nav-link').textContent.trim();
        const megaContent = getMegaContent(item);
        const group = document.createElement('div');
        group.className = 'm-group';

        const parent = document.createElement('button');
        parent.className = 'm-parent';
        const showSoon = getNavVersion() === 'promo' && item.hasAttribute('data-menswear');
        parent.innerHTML = `<span class="m-parent-label"><span>${label}</span>${showSoon ? soonBadgeHTML : ''}</span><span class="m-toggle" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>`;
        group.appendChild(parent);

        const sub = document.createElement('div');
        sub.className = 'm-sub';

        if (megaContent && megaContent.classList.contains('mega-promo')) {
          const promo = document.createElement('div');
          promo.className = 'm-promo';
          promo.innerHTML = `
            <div class="m-promo-visual"><div class="feature-img" data-feat="menswear-promo"></div></div>
            <div class="m-promo-body">
              <span class="m-promo-eyebrow">Coming Soon Online</span>
              <div class="m-promo-title">Menswear is on its way online</div>
              <div class="m-promo-form-block">
                <p class="m-promo-copy">Available now in our Palm Springs &amp; Solana Beach stores. Join the waitlist for first access when menswear launches online, with curated shirts, outerwear, and essentials from makers like Original Madras Trading Co.</p>
                <div class="waitlist-wrap">
                  <form class="waitlist-form" action="#" novalidate>
                    <input type="email" name="email" placeholder="Your email address" autocomplete="email" required aria-label="Email address">
                    <button type="submit">Join the waitlist</button>
                  </form>
                  <p class="waitlist-success" role="status">You&rsquo;re on the list. We&rsquo;ll be in touch.</p>
                </div>
              </div>
            </div>`;
          sub.appendChild(promo);
        } else {
          const inner = document.createElement('div');
          inner.className = 'm-sub-inner';
          (megaContent ? megaContent.querySelectorAll('.mega-col') : []).forEach(col => {
            const cl = col.querySelector('.col-label');
            if (cl) {
              const l = document.createElement('span');
              l.className = 'm-sub-label';
              l.textContent = cl.textContent;
              inner.appendChild(l);
            }
            col.querySelectorAll('.col-list a').forEach(a => {
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
          panel.querySelectorAll('.m-group.open').forEach(g => g.classList.remove('open'));
          if (!isOpen) group.classList.add('open');
        });
        panel.appendChild(group);
      });
      document.querySelectorAll('a.nav-direct').forEach((direct) => {
        const link = document.createElement('a');
        link.className = 'm-parent m-direct';
        link.href = direct.getAttribute('href') || 'trade.html';
        link.textContent = direct.textContent.trim() || 'Trade Program';
        panel.appendChild(link);
      });
      bindWaitlistForms(panel);
    };

    const setNavVersion = (version) => {
      document.documentElement.setAttribute('data-nav-version', version);
      sessionStorage.setItem('navVersion', version);
      versionButtons.forEach(btn => {
        const active = btn.dataset.navVersion === version;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      closeAll();
      buildMobileMenu();
    };

    const savedVersion = sessionStorage.getItem('navVersion');
    if (savedVersion === 'promo' || savedVersion === 'current') setNavVersion(savedVersion);
    else setNavVersion('current');

    versionButtons.forEach(btn => {
      btn.addEventListener('click', () => setNavVersion(btn.dataset.navVersion));
    });

    bindWaitlistForms();
    buildMobileMenu();

    const navBackdrop = document.getElementById('navBackdrop');
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeAll);
    }
  }

  async function loadChrome() {
    document.body.classList.add('chrome-loading');

    try {
      const res = await fetch('index.html');
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      if (!document.getElementById('site-nav-styles')) {
        const sourceStyle = doc.querySelector('style');
        if (sourceStyle) {
          const style = document.createElement('style');
          style.id = 'site-nav-styles';
          style.textContent = sourceStyle.textContent;
          document.head.insertBefore(style, document.head.firstChild);
        }
      }

      ['.announce', '.header', '#navBackdrop', '#mobilePanel', '.nav-version-switcher'].forEach(sel => {
        const el = doc.querySelector(sel);
        if (el) mount.appendChild(document.importNode(el, true));
      });

      const logo = mount.querySelector('.logo');
      if (logo) logo.setAttribute('href', 'index.html');

      const page = (location.pathname.split('/').pop() || 'index.html').split('?')[0] || 'index.html';
      mount.querySelectorAll('a.nav-direct').forEach((a) => {
        const href = (a.getAttribute('href') || '').split('?')[0];
        if (href === page) a.setAttribute('aria-current', 'page');
      });

      initNav();
    } catch (err) {
      console.error('Failed to load site chrome:', err);
    } finally {
      document.body.classList.remove('chrome-loading');
    }
  }

  loadChrome();
})();
