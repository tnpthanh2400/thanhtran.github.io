(() => {
  const root = document.documentElement;
  const body = document.body;

  // Pointer spotlight — subtle and disabled on coarse pointers via CSS behavior.
  window.addEventListener('pointermove', (e) => {
    root.style.setProperty('--mx', `${e.clientX}px`);
    root.style.setProperty('--my', `${e.clientY}px`);
  }, { passive: true });

  // Scroll progress.
  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // Mobile menu.
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll reveal.
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => reveal.observe(el));

  // Count-up metrics with separators.
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = Number(el.dataset.decimals || 0);
      const start = performance.now();
      const duration = 1150;
      const frame = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        const formatted = Number(value.toFixed(decimals)).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        el.textContent = prefix + formatted + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      countObs.unobserve(el);
    });
  }, { threshold: .35 });
  counters.forEach(el => countObs.observe(el));

  // Work filters.
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      workCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const hide = filter !== 'all' && !categories.includes(filter);
        card.classList.toggle('hide', hide);
      });
    });
  });

  // Interactive funnel diagnostic.
  const diagData = {
    reach: {
      type: 'Audience / Message',
      title: 'High reach, low engagement',
      copy: 'I would first test whether the issue is audience quality, message relevance, or creative-market fit before increasing spend.',
      checks: ['Segment fit', 'Message resonance', 'Creative pattern', 'Channel quality']
    },
    conversion: {
      type: 'Offer / Stage / Follow-up',
      title: 'High engagement, low conversion',
      copy: 'Engagement says the market is paying attention. The next question is whether the offer, qualification logic, buying stage, or follow-up motion is blocking progression.',
      checks: ['Offer friction', 'Qualification', 'Journey stage', 'Sales follow-up']
    },
    stall: {
      type: 'Buying stage / Sales process',
      title: 'Opportunity or pipeline stalls',
      copy: 'I would look for buying-stage friction, missing stakeholder coverage, weak signal handoff, or a mismatch between marketing treatment and the active Sales process.',
      checks: ['Stage movement', 'Stakeholder coverage', 'Signal visibility', 'Sales process']
    },
    scale: {
      type: 'Investment / Scale',
      title: 'A segment is outperforming',
      copy: 'Strong performance is a signal to learn from. I would identify what is working, validate that it is repeatable, then reallocate budget and scale deliberately.',
      checks: ['Incrementality', 'Repeatability', 'Budget capacity', 'Next experiment']
    }
  };
  const diagBtns = document.querySelectorAll('.diag-btn[data-diag]');
  const diagPanel = document.querySelector('.diag-panel');
  if (diagBtns.length && diagPanel) {
    const renderDiag = key => {
      const d = diagData[key];
      diagPanel.innerHTML = `
        <div class="diag-type">${d.type}</div>
        <h3>${d.title}</h3>
        <p>${d.copy}</p>
        <div class="diag-checks">${d.checks.map(c => `<span>${c}</span>`).join('')}</div>`;
    };
    diagBtns.forEach(btn => btn.addEventListener('click', () => {
      diagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDiag(btn.dataset.diag);
    }));
    renderDiag('reach');
  }

  // Tech stack explorer. Every tool below is supported by the uploaded resume.
  const stackData = {
    revenue: {
      label: 'Revenue + ABM',
      title: 'Account intelligence where revenue teams work.',
      copy: 'CRM, account intelligence and data tools I use to prioritize accounts, connect buying signals and support Sales activation.',
      tools: ['Salesforce', 'Demandbase', '6sense', 'ZoomInfo']
    },
    automation: {
      label: 'Automation',
      title: 'Lifecycle, nurture and funnel operations.',
      copy: 'Marketing automation platforms used for lifecycle programs, lead scoring, routing, qualification and campaign operations.',
      tools: ['Marketo', 'HubSpot', 'Pardot', 'Salesforce Marketing Cloud']
    },
    paid: {
      label: 'Paid Media',
      title: 'From account advertising to performance demand.',
      copy: 'Platforms used across paid search, paid social, programmatic, ABM advertising and social publishing.',
      tools: ['DV360', 'Demandbase Ads', 'LinkedIn Ads', 'Google Ads', 'Instagram Ads', 'Facebook Ads', 'Hootsuite']
    },
    analytics: {
      label: 'Analytics',
      title: 'Measurement that leads to a decision.',
      copy: 'Analytics, visualization and quantitative tools used to understand funnel performance, audience behavior and business outcomes.',
      tools: ['Google Analytics 4', 'Tableau', 'Looker', 'Sisense', 'Clarity', 'Advanced Excel', 'SPSS', 'JMP']
    },
    web: {
      label: 'Web + CMS',
      title: 'Campaign experiences and web publishing.',
      copy: 'Content management and web platforms I have worked with to support campaign experiences and digital execution.',
      tools: ['WordPress', 'Webflow', 'Wix', 'Contentful']
    },
    workflow: {
      label: 'Workflow',
      title: 'Keeping execution moving across teams.',
      copy: 'Project and workflow tools used to coordinate cross-functional execution, requests and delivery.',
      tools: ['Monday.com', 'Trello', 'Notion', 'ServiceNow', 'Jira']
    }
  };
  const stackTabs = document.querySelectorAll('.stack-tab[data-stack]');
  const stackLabel = document.querySelector('[data-stack-label]');
  const stackTitle = document.querySelector('[data-stack-title]');
  const stackCopy = document.querySelector('[data-stack-copy]');
  const toolCloud = document.querySelector('[data-tool-cloud]');
  if (stackTabs.length && stackLabel && stackTitle && stackCopy && toolCloud) {
    const renderStack = key => {
      const data = stackData[key];
      stackLabel.textContent = data.label;
      stackTitle.textContent = data.title;
      stackCopy.textContent = data.copy;
      toolCloud.innerHTML = data.tools.map(tool => `<span class="tool-chip">${tool}</span>`).join('');
    };
    stackTabs.forEach(btn => btn.addEventListener('click', () => {
      stackTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStack(btn.dataset.stack);
    }));
    renderStack('revenue');
  }

  // Pointer-reactive cards — subtle tilt + shine on fine pointers.
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.case-card, .work-card').forEach(card => {
      if (!card.querySelector('.card-shine')) {
        const shine = document.createElement('span');
        shine.className = 'card-shine';
        card.appendChild(shine);
      }
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - .5) * -3.5;
        const ry = ((x / r.width) - .5) * 4.5;
        card.style.setProperty('--cx', `${x}px`);
        card.style.setProperty('--cy', `${y}px`);
        card.style.transform = `translateY(-7px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Current year.
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Add no-op loaded class for future page transitions.
  requestAnimationFrame(() => body.classList.add('is-loaded'));
})();
