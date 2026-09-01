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
    }

    items.forEach(item => {
      const btn = item.querySelector('.nav-link');

      const open = () => {
        clearTimeout(closeTimer);
        items.forEach(i => {
          i.classList.remove('open');
          const b = i.querySelector('.nav-link');
          if (b && b.setAttribute) b.setAttribute('aria-expanded', 'false');
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

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        items.forEach(i => {
          i.classList.remove('open');
          i.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
        });
        document.body.classList.remove('nav-open');
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
              <p class="m-promo-copy">Available now in our Palm Springs &amp; Solana Beach stores. Join the waitlist for first access when menswear launches online, with curated shirts, outerwear, and essentials from makers like Original Madras Trading Co.</p>
              <div class="waitlist-wrap">
                <form class="waitlist-form" action="#" novalidate>
                  <input type="email" name="email" placeholder="Your email address" autocomplete="email" required aria-label="Email address">
                  <button type="submit">Join the waitlist</button>
                </form>
                <p class="waitlist-success" role="status">You&rsquo;re on the list. We&rsquo;ll be in touch.</p>
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
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });
      document.body.classList.remove('nav-open');
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
      navBackdrop.addEventListener('click', () => {
        items.forEach(i => {
          i.classList.remove('open');
          i.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
        });
        document.body.classList.remove('nav-open');
      });
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

      initNav();
    } catch (err) {
      console.error('Failed to load site chrome:', err);
    } finally {
      document.body.classList.remove('chrome-loading');
    }
  }

  loadChrome();
})();
