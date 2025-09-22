// Lightweight HTML partial include loader
// Usage: place <div data-include="partials/header.html"></div> where you want the header, etc.
// This script will also set the page title in the header and mark the active nav link.

(async function () {
  async function injectIncludes() {
    const includeEls = document.querySelectorAll('[data-include]');
    for (const el of includeEls) {
      const url = el.getAttribute('data-include');
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed to fetch ' + url);
        const html = await res.text();
        el.outerHTML = html; // replace the placeholder with the fetched markup
      } catch (e) {
        console.error(e);
      }
    }
  }

  function setActiveNavAndHeading() {
    // Determine current page key from pathname (e.g., index, about)
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const key = file.replace('.html', '') || 'index';

    // Set active nav
    const navLink = document.querySelector(`nav a[data-nav="${key}"]`);
    if (navLink) {
      navLink.setAttribute('aria-current', 'page');
    }

    // Set header H1 text by mapping keys to labels
    const map = {
      index: 'Resume',
      about: 'About Me',
      skills: 'Skills',
      certifications: 'Certifications',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      contact: 'Contact'
    };
    const heading = document.getElementById('page-title');
    if (heading) heading.textContent = map[key] || 'Page';
  }

  // Step 1: Inject partials
  await injectIncludes();
  // Step 2: After DOM updated, set nav/heading
  setActiveNavAndHeading();
})();
