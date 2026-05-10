/**
 * Mominur Rahman — Portfolio
 * Neo-Minimalist Developer
 */
(function () {
  'use strict';

  /* ==================== Theme Manager ==================== */
  const ThemeManager = {
    key: 'portfolio-theme',
    init() {
      const saved = localStorage.getItem(this.key);
      if (saved) {
        this.apply(saved);
      } else {
        this.apply('light');
      }
      this.listenSystem();
    },
    apply(mode) {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(mode);
      this.updateToggleIcon(mode);
    },
    toggle() {
      const current = document.documentElement.classList.contains('light') ? 'dark' : 'light';
      this.apply(current);
      localStorage.setItem(this.key, current);
    },
    updateToggleIcon(mode) {
      const icon = document.querySelector('.theme-icon');
      if (icon) icon.textContent = mode === 'dark' ? '☀️' : '🌙';
    },
    listenSystem() {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.key)) {
          this.apply('light');
        }
      });
    }
  };

  /* ==================== Preloader ==================== */
  const Preloader = {
    init() {
      const el = document.querySelector('.preloader');
      if (!el) return;
      window.addEventListener('load', () => {
        setTimeout(() => el.classList.add('hidden'), 400);
      });
    }
  };

  /* ==================== Scroll Progress Bar ==================== */
  const ProgressBar = {
    init() {
      this.bar = document.getElementById('progress-bar');
      if (!this.bar) return;
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    },
    onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.bar.style.width = Math.min(progress, 100) + '%';
    }
  };

  /* ==================== Reduced Motion ==================== */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================== Intersection Observer — Scroll Reveal ==================== */
  const ScrollReveal = {
    init() {
      if (reducedMotion) {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
          el.classList.add('visible');
        });
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
      });
      this.observer = observer;
    }
  };

  /* ==================== Skill Bars ==================== */
  const SkillBars = {
    init() {
      if (reducedMotion) {
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.style.getPropertyValue('--bar-width');
        });
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      document.querySelectorAll('.skill-bar-fill').forEach(bar => observer.observe(bar));
    }
  };

  /* ==================== Typewriter Effect ==================== */
  const Typewriter = {
    init() {
      this.el = document.querySelector('.typewriter-text');
      if (!this.el) return;
      this.words = JSON.parse(this.el.dataset.words || '[]');
      if (!this.words.length) return;
      this.wordIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.type();
    },
    type() {
      const current = this.words[this.wordIndex];
      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }
      this.el.textContent = current.substring(0, this.charIndex);
      let speed = this.isDeleting ? 40 : 100;
      if (!this.isDeleting && this.charIndex === current.length) {
        speed = 1500;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        speed = 300;
      }
      this.timeout = setTimeout(() => this.type(), speed);
    }
  };

  /* ==================== Stat Counter ==================== */
  const StatCounter = {
    init() {
      if (reducedMotion) {
        document.querySelectorAll('.counter').forEach(el => {
          el.textContent = el.dataset.target + (el.dataset.suffix || '');
        });
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.counter').forEach(el => observer.observe(el));
    },
    animate(el) {
      const target = parseFloat(el.dataset.target);
      const isFloat = target % 1 !== 0;
      const suffix = el.dataset.suffix || '';
      const decimals = isFloat ? 1 : 0;
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (eased * target).toFixed(decimals) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      };
      requestAnimationFrame(step);
    }
  };

  /* ==================== Active Navigation ==================== */
  const ActiveNav = {
    init() {
      this.sections = [];
      this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
      this.navLinks.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        const section = document.getElementById(id);
        if (section) this.sections.push({ link, section });
      });
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    },
    onScroll() {
      const scrollPos = window.scrollY + 120;
      let current = '';
      this.sections.forEach(({ link, section }) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = link.getAttribute('href').substring(1);
        }
      });
      this.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
      });
    }
  };

  /* ==================== Navbar Shrink ==================== */
  const NavbarShrink = {
    init() {
      this.navbar = document.querySelector('.navbar');
      if (!this.navbar) return;
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    },
    onScroll() {
      this.navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  };

  /* ==================== Smooth Scroll ==================== */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const offset = document.querySelector('.navbar') ? 80 : 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
        });
      });
    }
  };

  /* ==================== Back to Top ==================== */
  const BackToTop = {
    init() {
      this.btn = document.querySelector('.back-to-top');
      if (!this.btn) return;
      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    },
    onScroll() {
      this.btn.classList.toggle('visible', window.scrollY > 600);
    }
  };

  /* ==================== Mobile Menu ==================== */
  const MobileMenu = {
    init() {
      const collapse = document.querySelector('.navbar-collapse');
      if (!collapse) return;
      document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
          if (collapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
            const instance = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse);
            instance.hide();
          }
        });
      });
    }
  };

  /* ==================== Project Filters ==================== */
  const ProjectFilters = {
    init() {
      this.buttons = document.querySelectorAll('.filter-btn');
      this.cards = document.querySelectorAll('[data-category]');
      if (!this.buttons.length || !this.cards.length) return;
      this.buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          this.filter(filter);
        });
      });
    },
    filter(category) {
      this.cards.forEach(card => {
        const cardCategory = card.dataset.category;
        const visible = category === 'all' || cardCategory === category;
        card.style.display = visible ? '' : 'none';
        if (visible && !reducedMotion) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }
      });
    }
  };

  /* ==================== Initialize All ==================== */
  function init() {
    ThemeManager.init();
    Preloader.init();
    ProgressBar.init();
    ScrollReveal.init();
    SkillBars.init();
    Typewriter.init();
    StatCounter.init();
    ActiveNav.init();
    NavbarShrink.init();
    SmoothScroll.init();
    BackToTop.init();
    MobileMenu.init();
    ProjectFilters.init();

    /* Theme toggle button click */
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => ThemeManager.toggle());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
