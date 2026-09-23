(() => {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

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
      const duration = 1100;
      const frame = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      countObs.unobserve(el);
    });
  }, { threshold: .4 });
  counters.forEach(el => countObs.observe(el));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      workCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        card.classList.toggle('hide', filter !== 'all' && !categories.includes(filter));
      });
    });
  });

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
      copy: 'I would look for buying-stage friction, missing stakeholder coverage, weak signal handoff, or a mismatch between marketing treatment and the active sales process.',
      checks: ['Stage movement', 'Stakeholders', 'Signal visibility', 'Sales process']
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

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
