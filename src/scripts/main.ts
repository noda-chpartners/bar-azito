import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type AzitoWindow = Window & { __azitoKill?: () => void };
const root = window as AzitoWindow;
root.__azitoKill?.();

ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

const lenis = new Lenis({
  lerp: 0.085,
  anchors: {
    offset: -72,
  },
});

lenis.on('scroll', ScrollTrigger.update);

const onTick = (time: number) => {
  lenis.raf(time * 1000);
};

gsap.ticker.add(onTick);
gsap.ticker.lagSmoothing(0);

const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu]');
const menuLabel = document.querySelector<HTMLElement>('[data-menu-label]');
const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
let lastFocus: HTMLElement | null = null;

const setMenu = (open: boolean) => {
  if (!menuBtn || !panel) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  if (menuLabel) menuLabel.textContent = open ? 'メニューを閉じる' : 'メニューを開く';
  panel.classList.toggle('is-open', open);
  panel.toggleAttribute('inert', !open);
  panel.setAttribute('aria-hidden', String(!open));
  panel.setAttribute('aria-modal', String(open));
  document.body.classList.toggle('menu-open', open);
  document.querySelectorAll('main, .footer, .dock').forEach((el) => {
    el.toggleAttribute('inert', open);
  });
  if (open) {
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lenis.stop();
    panel.querySelector('a')?.focus();
  } else {
    lenis.start();
    lastFocus?.focus();
  }
};

menuBtn?.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});

panel?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href) return;
    event.preventDefault();
    setMenu(false);
    lenis.scrollTo(href, { offset: -72 });
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
  }
});

window.matchMedia('(min-width: 960px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

if (!reduced) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      },
    );
  });

  if (window.matchMedia('(min-width: 960px)').matches) {
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });
  }
} else {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
  });
}

const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav a[data-nav]');

document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onToggle: (self) => {
      if (!self.isActive) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${section.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    },
  });
});

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

root.__azitoKill = () => {
  gsap.ticker.remove(onTick);
  lenis.destroy();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};
