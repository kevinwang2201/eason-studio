'use strict';
// Public website settings. Change email only after you have a studio contact mailbox.
const STUDIO_CONFIG = Object.freeze({contactEmail: 'zxcv19960714@gmail.com'});
(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const menu = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menu && mobileNav) {
    menu.addEventListener('click', () => {
      const opening = mobileNav.hidden;
      mobileNav.hidden = !opening;
      menu.setAttribute('aria-expanded', String(opening));
      menu.setAttribute('aria-label', opening ? '關閉導覽選單' : '開啟導覽選單');
    });
    mobileNav.addEventListener('click', event => {if (event.target.closest('a')) {mobileNav.hidden = true;menu.setAttribute('aria-expanded','false');}});
  }
  // Highlight the section currently in view on the one-page site.
  const navLinks = [...document.querySelectorAll('.desktop-nav a, .header-contact')];
  const sections = ['about','services','portfolio','contact'].map(id=>document.getElementById(id));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(a=>{
        const active=a.getAttribute('href')==='#'+visible.target.id;
        a.classList.toggle('active',active);
        if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
      });
    },{rootMargin:'-15% 0px -60% 0px',threshold:0});
    sections.filter(Boolean).forEach(el=>observer.observe(el));
  }
  const form = document.getElementById('contact-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    const project = params.get('project');
    if (service && [...form.elements.service.options].some(o => o.value === service)) form.elements.service.value = service;
    if (project) form.elements.project.value = project.slice(0,120);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const msg = document.getElementById('form-message');
      if (!form.reportValidity()) return;
      const email = STUDIO_CONFIG.contactEmail;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.className = 'form-message';
        msg.textContent = '尚未設定工作室收件信箱。請先編輯 js/main.js 的 contactEmail，再啟用表單。';
        return;
      }
      const fd = new FormData(form);
      const fields = [
        ['稱呼',fd.get('name')],['聯絡 Email',fd.get('email')],['公司／品牌',fd.get('company')||'未提供'],
        ['服務類型',fd.get('service')],['預算',fd.get('budget')||'尚未確定'],
        ['來源作品',fd.get('project')||'無'],['合作需求',fd.get('message')]
      ];
      const subject = `[EASON STUDIO 合作詢問] ${String(fd.get('service')).slice(0,40)}`;
      const body = fields.map(([k,v]) => `${k}：${v}`).join('\n\n');
      location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      msg.className = 'form-message success';
      msg.textContent = '已開啟你的電子郵件應用程式。請確認郵件內容並手動按下寄送。';
    });
  }
})();
