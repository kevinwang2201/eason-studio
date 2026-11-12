 'use strict';
(function () {
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const categoryNames={automation:'AI AUTOMATION',website:'WEB DEVELOPMENT',video:'CREATIVE AI'};
  const safeImage = path => typeof path==='string' && /^assets\/images\/projects\/[a-zA-Z0-9_./-]+\.(svg|png|jpg|jpeg|webp)$/i.test(path) && !path.includes('..') ? './'+path : './assets/images/projects/placeholder.svg';
  function safeUrl(v){try{const u=new URL(v);return u.protocol==='https:'?u.href:null}catch{return null}}
  function youtubeId(v){if(!v)return null;try {const u=new URL(v);const host=u.hostname.toLowerCase().replace(/^www\./,'');let id=null;if(host==='youtu.be')id=u.pathname.slice(1).split('/')[0];else if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))id=u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.match(/^\/(shorts|embed)\/([^/]+)/)?.[2];return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?id:null;}catch{return null}}
  const list=document.getElementById('all-projects');
  const modal=document.getElementById('project-modal');
  const modalBody=document.getElementById('project-modal-content');
  if(!list)return;
  let previousFocus=null;
  let projects=[];
  function card(p){return `<article class="project-card"><button type="button" class="project-cover" data-project="${esc(p.id)}" aria-label="查看 ${esc(p.title)} 作品詳情"><img loading="lazy" src="${esc(safeImage(p.cover))}" alt="${esc(p.title)} 封面"><span class="cover-arrow" aria-hidden="true">↗</span></button><div class="project-info"><div class="project-info-top"><span class="category-label">${categoryNames[p.category]||'PROJECT'}</span><span class="project-status">${esc(p.status||'展示中')}</span></div><h3><button class="project-title-button" type="button" data-project="${esc(p.id)}">${esc(p.title)}</button></h3><p>${esc(p.summary)}</p></div></article>`}
  function render(filter='all') {const shown=filter==='all'?projects:projects.filter(p=>p.category===filter);list.innerHTML=shown.map(card).join('');document.getElementById('empty-projects').hidden=shown.length>0;}
  function openProject(id){const p=projects.find(x=>x.id===id);if(!p)return;previousFocus=document.activeElement;
    const tags=Array.isArray(p.technologies)?p.technologies:[], features=Array.isArray(p.features)?p.features:[], photos=Array.isArray(p.images)?p.images:[];
    const yt=youtubeId(p.youtube), demo=safeUrl(p.demoUrl);
    const service={automation:'AI 自動化',website:'網站開發',video:'AI 影片'}[p.category]||'其他合作';
    modalBody.innerHTML=`<div class="detail-intro"><div class="eyebrow">${categoryNames[p.category]||'PROJECT'} / ${esc(p.status||'展示中')}</div><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><div class="detail-tags">${tags.map(t=>`<span class="pill">${esc(t)}</span>`).join('')}</div></div><img class="detail-hero-image" src="${esc(safeImage(p.cover))}" alt="${esc(p.title)} 作品封面"><div class="detail-columns"><div class="detail-copy"><h2>專案介紹</h2><p>${esc(p.description||'')}</p>${p.problem?`<h2>面對的問題</h2><p>${esc(p.problem)}</p>`:''}${p.solution?`<h2>解決方向</h2><p>${esc(p.solution)}</p>`:''}</div><aside class="detail-sidebar"><h3>重點功能</h3><ul>${features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><div class="project-buttons">${demo?`<a class="button button-dark" href="${esc(demo)}" target="_blank" rel="noopener noreferrer">開啟展示 ↗</a>`:''}<a class="button button-primary" href="#contact" id="project-contact">洽詢類似方案 ↗</a></div></aside></div>${photos.length?`<div class="detail-gallery"><h2>作品畫面</h2><div class="gallery-grid">${photos.map((path,i)=>`<img loading="lazy" src="${esc(safeImage(path))}" alt="${esc(p.title)} 展示圖 ${i+1}">`).join('')}</div></div>`:''}${yt?`<div class="detail-gallery"><h2>影片展示</h2><div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="${esc(p.title)} 影片" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>`:''}`;
    const contactLink=modalBody.querySelector('#project-contact');
    if(contactLink)contactLink.addEventListener('click',()=>{const form=document.getElementById('contact-form');if(form){form.elements.project.value=p.title;form.elements.service.value=service;}closeProject();});
    modal.hidden=false;document.body.classList.add('modal-open');modal.querySelector('.project-modal-close').focus();
  }
  function closeProject(){if(modal.hidden)return;modal.hidden=true;modalBody.innerHTML='';document.body.classList.remove('modal-open');previousFocus?.focus();}
  modal.querySelector('.project-modal-close').addEventListener('click',closeProject);
  modal.addEventListener('click',e=>{if(e.target===modal)closeProject()});
  document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')closeProject();if(e.key==='Tab') {const active=[...modal.querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length);if(!active.length)return;const first=active[0],last=active[active.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  list.addEventListener('click',e=>{const trigger=e.target.closest('[data-project]');if(trigger)openProject(trigger.dataset.project)});
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});render(btn.dataset.filter)}));
  async function load(){try{const response=await fetch('./data/projects.json',{cache:'no-cache'});if(!response.ok)throw Error(`HTTP ${response.status}`);const data=await response.json();if(!Array.isArray(data))throw Error('資料不是陣列');projects=data.filter(p=>p&&typeof p.id==='string'&&/^[a-z0-9-]+$/.test(p.id)&&p.published===true).sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999));render();}catch(err){console.error(err);list.innerHTML='<div class="error-note">作品資料無法讀取。請確認 data/projects.json 格式，並透過 GitHub Pages 或本機 HTTP 伺服器開啟網站。</div>';}}
  load();
})();
