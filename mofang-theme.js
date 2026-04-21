const MofangTheme = {
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  },

  STORAGE_KEY: 'mofang-theme',

  init() {
    const savedTheme = this.getSavedTheme();
    this.applyTheme(savedTheme);
    this.bindEvents();
  },

  getSavedTheme() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) || this.THEMES.AUTO;
    } catch {
      return this.THEMES.AUTO;
    }
  },

  saveTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch {}
  },

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.THEMES.DARK;
    }
    return this.THEMES.LIGHT;
  },

  getEffectiveTheme(theme) {
    if (theme === this.THEMES.AUTO) {
      return this.getSystemTheme();
    }
    return theme;
  },

  applyTheme(theme) {
    const effectiveTheme = this.getEffectiveTheme(theme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    this.updateToggleIcon(effectiveTheme);
  },

  updateToggleIcon(theme) {
    const toggleButtons = document.querySelectorAll('.mofang-theme-toggle');
    toggleButtons.forEach(btn => {
      const icon = btn.querySelector('.mofang-theme-icon');
      if (icon) {
        if (theme === this.THEMES.DARK) {
          icon.textContent = '☀️';
        } else {
          icon.textContent = '🌙';
        }
      }
    });
  },

  getNextTheme(current) {
    const themeOrder = [this.THEMES.LIGHT, this.THEMES.DARK, this.THEMES.AUTO];
    const currentIndex = themeOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  },

  toggleTheme() {
    const currentTheme = this.getSavedTheme();
    let nextTheme = this.getNextTheme(currentTheme);
    
    this.applyTheme(nextTheme);
    this.saveTheme(nextTheme);
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.mofang-theme-toggle');
      if (toggleBtn) {
        this.toggleTheme();
      }
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const savedTheme = this.getSavedTheme();
        if (savedTheme === this.THEMES.AUTO) {
          this.applyTheme(savedTheme);
        }
      });
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MofangTheme.init());
} else {
  MofangTheme.init();
}
