// Native details menus work without JavaScript.
// This enhancement closes the mobile menu after navigation and supports Escape.
const menu = document.querySelector('.mobile-menu');
if (menu) {
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.open = false;
      const target = link.hash && document.getElementById(link.hash.slice(1));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
}

// The custom frame shows Cody; activate the timestamped player on demand.
document.querySelectorAll('[data-video-src]').forEach(preview => {
  preview.addEventListener('click', event => {
    // Preserve normal new-tab and modified-click link behavior.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const player = document.createElement('iframe');
    player.src = preview.dataset.videoSrc;
    player.title = 'Cody Li presenting RehabAI at MIT, starting at 9 minutes 51 seconds';
    player.width = '1200';
    player.height = '675';
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    preview.replaceWith(player);
    player.focus();
  });
});

// Keep header geometry out of document flow so contraction never shifts content.
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  let headerFramePending = false;
  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
    headerFramePending = false;
  };
  updateHeader();
  window.addEventListener('scroll', () => {
    if (!headerFramePending) {
      headerFramePending = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive: true });
}

// Progressive enhancement: static screens remain available if scripting fails.
const featureStory = document.querySelector('#features');
if (featureStory) {
  const rail = featureStory.querySelector('.feature-grid');
  const cards = [...rail.querySelectorAll('.feature-card')];
  const pin = featureStory.querySelector('.feature-pin');
  const controls = featureStory.querySelector('.feature-controls');
  const desktop = window.matchMedia('(min-width: 850px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const screens = cards.map(card => {
    const screen = document.createElement('figure');
    screen.className = 'feature-screen';
    const picture = card.querySelector('picture').cloneNode(true);
    picture.querySelector('img').loading = 'eager';
    screen.append(picture);
    pin.append(screen);
    return screen;
  });
  let current = -1;
  const setActive = index => {
    if (index === current) return;
    current = index;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === index));
    screens.forEach((screen, i) => {
      screen.classList.toggle('is-active', i === index);
      screen.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  };
  const goTo = index => {
    const target = Math.max(0, Math.min(cards.length - 1, index));
    rail.scrollTo({ left: cards[target].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  const makeButton = (label, text, action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.textContent = text;
    button.addEventListener('click', action);
    controls.append(button);
    return button;
  };
  const previous = makeButton('Previous feature', '←', () => goTo(current - 1));
  const dots = cards.map((card, i) => {
    const dot = makeButton(`Show ${card.querySelector('h2').textContent}`, '', () => goTo(i));
    dot.className = 'feature-dot';
    return dot;
  });
  const next = makeButton('Next feature', '→', () => goTo(current + 1));
  const update = () => {
    if (desktop.matches) {
      const focusLine = window.innerHeight * .55;
      let closest = 0;
      let distance = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const difference = Math.abs(rect.top + rect.height / 2 - focusLine);
        if (difference < distance) { distance = difference; closest = i; }
      });
      setActive(closest);
    } else {
      const nearest = cards.reduce((best, card, i) =>
        Math.abs(card.offsetLeft - rail.scrollLeft) < Math.abs(cards[best].offsetLeft - rail.scrollLeft) ? i : best, 0);
      setActive(nearest);
    }
    rail.style.height = desktop.matches ? '' : `${cards[current].offsetHeight}px`;
  };
  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  };
  rail.addEventListener('scroll', schedule, { passive: true });
  rail.addEventListener('toggle', schedule, true);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  if ('ResizeObserver' in window) {
    const cardResize = new ResizeObserver(schedule);
    cards.forEach(card => cardResize.observe(card));
  }
  rail.addEventListener('keydown', event => {
    if (desktop.matches || event.target !== rail) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  cards.forEach((card, i) => card.addEventListener('focusin', () => {
    if (desktop.matches) setActive(i);
  }));
  featureStory.classList.add('story-enhanced');
  update();
}

// Fill the story line to the reader's position without changing normal scrolling.
const storyTimeline = document.querySelector('.story-timeline');
if (storyTimeline) {
  const track = storyTimeline.querySelector('.timeline-track');
  const milestones = [...storyTimeline.querySelectorAll('.timeline-item')];
  const reducedStoryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let storyFramePending = false;
  const updateStoryTimeline = () => {
    storyFramePending = false;
    const firstDot = milestones[0].querySelector('.timeline-dot').getBoundingClientRect();
    const lastDot = milestones[milestones.length - 1].querySelector('.timeline-dot').getBoundingClientRect();
    const start = firstDot.top + firstDot.height / 2;
    const length = lastDot.top + lastDot.height / 2 - start;
    track.style.height = `${length}px`;
    track.style.bottom = 'auto';
    const readingLine = window.innerHeight * .6;
    const progress = Math.max(0, Math.min(1, (readingLine - start) / length));
    storyTimeline.style.setProperty('--timeline-progress', reducedStoryMotion.matches ? 1 : progress);
    milestones.forEach(item => {
      const dot = item.querySelector('.timeline-dot').getBoundingClientRect();
      item.classList.toggle('is-reached', reducedStoryMotion.matches || dot.top + dot.height / 2 <= readingLine);
    });
  };
  const scheduleStoryTimeline = () => {
    if (storyFramePending) return;
    storyFramePending = true;
    requestAnimationFrame(updateStoryTimeline);
  };
  window.addEventListener('scroll', scheduleStoryTimeline, { passive: true });
  window.addEventListener('resize', scheduleStoryTimeline);
  reducedStoryMotion.addEventListener('change', scheduleStoryTimeline);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleStoryTimeline).observe(storyTimeline);
  updateStoryTimeline();
}
