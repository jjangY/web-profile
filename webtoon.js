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
  if(Array.isArray(item.sections)) {
   block.classList.add('has-sequence');
   item.sections.forEach((part,partIndex)=>{
    const group=make('div','webtoon-copy-set');
    group.append(make('h3','',part.title));
    const body=make('div','webtoon-copy-body');
    body.append(make('p','webtoon-description',part.description));
    group.append(body);
    if(partIndex===item.sections.length-1 && item.link?.url) {
     const link=make('a','geulgil-visit webtoon-visit');
     link.href=item.link.url;
     link.target='_blank'; link.rel='noopener noreferrer';
     const label=item.link.label || '작품 바로가기';
     link.setAttribute('aria-label',label+' — 새 탭에서 열기');
     link.append(make('span','',label));
     const icon=document.querySelector('.geulgil-visit svg');
     if(icon) link.append(icon.cloneNode(true));
     group.append(link);
    }
    block.append(group);
   });
   return block;
  }
  if(item.title) block.append(make('h3','',item.title));
  const body=make('div','webtoon-copy-body');
  if(item.role) { block.append(make('h3','','역할')); body.append(make('p','',item.role)); }
  body.append(make('p','webtoon-description',item.description));
  block.append(body);
  return block;
 }
 const images=[], mediaGroups=[], panels=[], mobileCopies=[], diagrams=[];
 works.forEach((item,index) => {
  const row=make('li','webtoon-item');
  const paired=Array.isArray(item.images) && item.images.length===2;
  const media=make('div',paired ? 'webtoon-media webtoon-media-pair' : 'webtoon-media');
  if(item.type==='process') {
   const diagram=make('ol','webtoon-process');
   diagram.setAttribute('aria-label','웹툰 제작 과정');
   item.steps.forEach((step,i)=>{
    const node=make('li','webtoon-process-step');
    node.append(make('span','webtoon-process-label',step));
    if(i<item.steps.length-1) {
     const arrow=make('span','webtoon-process-arrow','↓');
     arrow.setAttribute('aria-hidden','true'); node.append(arrow);
    }
    diagram.append(node);
   });
   media.append(diagram); diagrams.push(diagram);
  }
  const sources=item.type==='process' ? [] : (paired ? item.images : [item]);
  sources.forEach((source,imageIndex)=>{
   const img=make('img','webtoon-image');
   img.src=source.image; img.alt=source.alt || ('웹툰 작업물 '+(index+1));
   img.width=source.width || 477; img.height=source.height || 840;
   img.loading='lazy'; img.decoding='async';
   if(paired){
    const cell=make('div','webtoon-pair-cell');
    if(imageIndex===1) cell.style.setProperty('--pair-offset',(sources[0].height/sources[0].width*50)+'%');
    cell.append(img); media.append(cell);
   } else media.append(img);
   images.push(img);
  });
  const text=copy(item,'webtoon-mobile-copy');
  row.append(media,text); list.append(row);
  mediaGroups.push(media);
  const panel=copy(item,''); panel.dataset.work=String(index+1); descriptions.append(panel);
  panels.push(panel); mobileCopies.push(text);
 });
 const processMedia=mediaGroups[works.findIndex(item=>item.type==='process')];
 section.classList.add('is-enhanced');
 let active=-1, frame=0;
 function select(index) {
  if(index===active) return;
  active=index;
  panels.forEach((panel,i)=>{const shown=i===index;panel.classList.toggle('is-active',shown);panel.setAttribute('aria-hidden',String(!shown));});
 }
 function update() {
  frame=0;
  if(mobile.matches) { sidebar.style.setProperty('--sidebar-top','60px'); select(-1); return; }
  const midpoint=innerHeight/2;
  // After the process centre crosses the viewport centre, move up with the page.
  const processRect=processMedia?.getBoundingClientRect();
  const passed=processRect ? Math.max(0,midpoint-processRect.top-processRect.height/2) : 0;
  sidebar.style.setProperty('--sidebar-top',(60-passed)+'px');
  let next=-1;
  mediaGroups.forEach((media,i)=>{const rect=media.getBoundingClientRect();if(rect.top <= (i===0 ? innerHeight*.65 : midpoint)) next=i;});
  select(next);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 function measure(){
  const height=sidebar.offsetHeight;
  section.style.setProperty('--webtoon-panel-height',height+'px');
  const diagramHeight=processMedia?.getBoundingClientRect().height || 0;
  const tail=Math.max(0,60+height-innerHeight/2-diagramHeight/2);
  section.style.setProperty('--webtoon-tail',tail+'px');
  schedule();
 }
 panels.forEach(panel=>panel.setAttribute('aria-hidden','true'));
 if('ResizeObserver' in window){const observer=new ResizeObserver(measure);observer.observe(sidebar);mediaGroups.forEach(media=>observer.observe(media));}
 images.forEach(img=>img.addEventListener('load',measure));
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',measure);
 mobile.addEventListener('change',measure);
 document.fonts?.ready.then(measure);
 // On mobile each description appears directly below its own image.
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(!entry.isIntersecting||!mobile.matches)return;observer.unobserve(entry.target);
    if(entry.target.classList.contains('has-sequence')) { entry.target.classList.add('is-revealed'); return; }
    if(!reduced.matches&&entry.target.animate) entry.target.animate([{opacity:0,translate:'0 20px'},{opacity:1,translate:'0 0'}],{duration:800,easing:'cubic-bezier(.22,1,.36,1)'});
   });
  },{threshold:.1});mobileCopies.forEach(el=>observer.observe(el));
 }
 if('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
   });
  },{threshold:.05});
  diagrams.forEach(diagram=>{diagram.classList.add('will-reveal');observer.observe(diagram);});
 }
 measure();
})();
