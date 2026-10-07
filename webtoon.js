(() => {
 'use strict';
 const section = document.querySelector('#webtoon');
 const works = window.WEBTOON_WORKS;
 if (!section || !Array.isArray(works) || !works.length) return;
 const list = section.querySelector('.webtoon-list');
 const descriptions = section.querySelector('.webtoon-descriptions');
 const sidebar = section.querySelector('.webtoon-sidebar');
 const mobile = matchMedia('(max-width:760px)');
 const reduced = matchMedia('(prefers-reduced-motion:reduce)');
 const make = (tag, cls, text) => { const el=document.createElement(tag); el.className=cls; if(text) el.textContent=text; return el; };
 function copy(item, cls) {
  const block=make('div','webtoon-copy '+cls);
  if(item.role) block.append(make('h3','','역할'),make('p','',item.role));
  block.append(make('p','webtoon-description',item.description));
  return block;
 }
 const images=[], panels=[], mobileCopies=[];
 works.forEach((item,index) => {
  const row=make('li','webtoon-item');
  const img=make('img','webtoon-image');
  img.src=item.image; img.alt=item.alt || ('웹툰 작업물 '+(index+1));
  img.width=item.width || 477; img.height=item.height || 840;
  img.loading='lazy'; img.decoding='async';
  const text=copy(item,'webtoon-mobile-copy');
  row.append(img,text); list.append(row);
  const panel=copy(item,''); panel.dataset.work=String(index+1); descriptions.append(panel);
  images.push(img); panels.push(panel); mobileCopies.push(text);
 });
 section.classList.add('is-enhanced');
 let active=-1, frame=0;
 function select(index) {
  if(index===active) return;
  active=index;
  panels.forEach((panel,i)=>{const shown=i===index;panel.classList.toggle('is-active',shown);panel.setAttribute('aria-hidden',String(!shown));});
 }
 function update() {
  frame=0;
  if(mobile.matches) { select(-1); return; }
  const midpoint=innerHeight/2;
  let next=-1;
  images.forEach((img,i)=>{const rect=img.getBoundingClientRect();if(rect.top+rect.height/2<=midpoint) next=i;});
  select(next);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 function measure(){section.style.setProperty('--webtoon-panel-height',sidebar.offsetHeight+'px');schedule();}
 panels.forEach(panel=>panel.setAttribute('aria-hidden','true'));
 if('ResizeObserver' in window){const observer=new ResizeObserver(measure);observer.observe(sidebar);images.forEach(img=>observer.observe(img));}
 images.forEach(img=>img.addEventListener('load',measure));
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',measure);
 mobile.addEventListener('change',measure);
 document.fonts?.ready.then(measure);
 // On mobile each description appears directly below its own image.
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(!entry.isIntersecting||!mobile.matches)return;observer.unobserve(entry.target);
    if(!reduced.matches&&entry.target.animate) entry.target.animate([{opacity:0,translate:'0 20px'},{opacity:1,translate:'0 0'}],{duration:800,easing:'cubic-bezier(.22,1,.36,1)'});
   });
  },{threshold:.1});mobileCopies.forEach(el=>observer.observe(el));
 }
 measure();
})();
