const config = {
  scene: 'hotel-suite',
  surface: 'wall',
  pattern: 'walnut-linear',
  profile: 'slat',
  tone: 0,
  finish: 'matte',
  aroma: 'jasmine',
  aromaIntensity: 48,
  dimension: 2400,
  mode: 'design'
};

const patterns = [
  {id:'walnut-linear',name:'Walnut Linear',file:'walnut-linear.svg',mood:'Warm · Refined · Calm'},
  {id:'stone-grey',name:'Stone Grey',file:'stone-grey.svg',mood:'Quiet · Architectural · Cool'},
  {id:'soft-oak',name:'Soft Oak',file:'soft-oak.svg',mood:'Natural · Light · Relaxed'},
  {id:'marble-white',name:'Marble White',file:'marble-white.svg',mood:'Clean · Spacious · Polished'},
  {id:'marble-gold',name:'Marble Gold',file:'marble-gold.svg',mood:'Expressive · Premium · Warm'},
  {id:'charcoal-rib',name:'Charcoal Rib',file:'charcoal-rib.svg',mood:'Dark · Graphic · Dramatic'},
  {id:'decking-teak',name:'Decking Teak',file:'decking-teak.svg',mood:'Outdoor · Tactile · Grounded'},
  {id:'modern-concrete',name:'Modern Concrete',file:'modern-concrete.svg',mood:'Urban · Minimal · Quiet'}
];
const profiles = [
  {id:'flat',name:'Flat'}, {id:'slat',name:'Slat 18'}, {id:'fluted',name:'Fluted'}, {id:'wide-rib',name:'Wide Rib'}, {id:'groove',name:'Groove'}, {id:'decking',name:'Decking'}
];
const finishes = [
  {id:'matte',name:'Matte'}, {id:'satin',name:'Satin'}, {id:'gloss',name:'Soft Gloss'}
];
const aromas = [
  {id:'none',name:'None',short:'NONE'}, {id:'jasmine',name:'Jasmine',short:'JAS'}, {id:'cedar',name:'Cedar Wood',short:'CED'}, {id:'tea',name:'Green Tea',short:'TEA'}, {id:'citrus',name:'Citrus',short:'CIT'}, {id:'spa',name:'Spa Mist',short:'SPA'}
];
const surfaceNames={wall:'Wall',floor:'Floor',doorwall:'Door–Wall',ceiling:'Ceiling',trim:'Trim',aroma:'Aroma'};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const root = document.documentElement;

function activePattern(){return patterns.find(x=>x.id===config.pattern)}
function activeProfile(){return profiles.find(x=>x.id===config.profile)}
function activeFinish(){return finishes.find(x=>x.id===config.finish)}
function activeAroma(){return aromas.find(x=>x.id===config.aroma)}
function codeSlug(v){return v.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'')}
function code(){return `MS-${codeSlug(config.surface).slice(0,8)}-${codeSlug(config.pattern).slice(0,10)}-${codeSlug(config.profile).slice(0,5)}-${activeAroma().short}-${config.dimension}`}

function renderPatterns(){
  const box=$('#patternRibbon');box.innerHTML='';
  patterns.forEach(p=>{
    const b=document.createElement('button');b.className='pattern-chip'+(p.id===config.pattern?' active':'');b.style.backgroundImage=`url('assets/textures/${p.file}')`;b.title=p.name;b.setAttribute('aria-label',p.name);b.onclick=()=>{config.pattern=p.id;update()};box.appendChild(b);
  });
}
function renderProfiles(){
  const box=$('#profileOptions');box.innerHTML='';
  profiles.forEach(p=>{
    const b=document.createElement('button');b.className='profile-option'+(p.id===config.profile?' active':'');b.title=p.name;b.innerHTML=`<img src="assets/profiles/${p.id}.svg" alt="${p.name}">`;b.onclick=()=>{config.profile=p.id;update()};box.appendChild(b);
  });
}
function renderFinishes(){
  const box=$('#finishOptions');box.innerHTML='';
  finishes.forEach(f=>{
    const b=document.createElement('button');b.className='finish-option'+(f.id===config.finish?' active':'');b.title=f.name;b.onclick=()=>{config.finish=f.id;update()};box.appendChild(b);
  });
}
function renderAromas(){
  const box=$('#aromaOptions');box.innerHTML='';
  aromas.forEach(a=>{
    const b=document.createElement('button');b.className='aroma-option'+(a.id===config.aroma?' active':'');b.title=a.name;b.onclick=()=>{config.aroma=a.id;if(a.id!=='none')config.mode='aroma';update()};box.appendChild(b);
  });
}
function pulseSurface(){
  const el=$(`[data-overlay="${config.surface}"]`);if(!el)return;el.classList.remove('active-pulse');void el.offsetWidth;el.classList.add('active-pulse');
}
function update(){
  root.dataset.surface=config.surface;root.dataset.mode=config.mode;root.dataset.finish=config.finish;root.dataset.aroma=config.aroma;
  root.style.setProperty('--selected-texture',`url('textures/${activePattern().file}')`);
  const warmth=config.tone;root.style.setProperty('--tone-shift',`${warmth/5}deg`);root.style.setProperty('--tone-bright',`${1+warmth/300}`);root.style.setProperty('--aroma-opacity',`${config.aroma==='none'?0:Math.max(.18,config.aromaIntensity/100)}`);
  $$('.surface-item,.scene-region').forEach(el=>el.classList.toggle('active',el.dataset.surface===config.surface));
  $$('.scene-region').forEach(el=>el.classList.toggle('is-active',el.dataset.surface===config.surface));
  $$('.mode-switch button').forEach(el=>el.classList.toggle('active',el.dataset.mode===config.mode));
  $('#summarySurface').textContent=surfaceNames[config.surface];$('#summaryPattern').textContent=activePattern().name;$('#summaryProfile').textContent=activeProfile().name;$('#summaryAroma').textContent=config.aroma==='none'?'None':`${activeAroma().name} ${config.aromaIntensity<35?'Subtle':config.aromaIntensity<70?'Soft':'Rich'}`;$('#summaryMood').textContent=activePattern().mood;
  $('#patternLabel').textContent=activePattern().name;$('#profileLabel').textContent=activeProfile().name;$('#finishLabel').textContent=activeFinish().name;$('#aromaLabel').textContent=config.aroma==='none'?'No aroma':`${activeAroma().name} ${config.aromaIntensity<35?'Subtle':config.aromaIntensity<70?'Soft':'Rich'}`;$('#dimensionLabel').textContent=`${config.dimension} mm`;$('#toneLabel').textContent=config.tone<-12?'Cool Neutral':config.tone>12?'Warm Neutral':'Balanced Neutral';
  $('#aromaArt').src=`assets/aroma/${config.aroma==='none'?'jasmine':config.aroma}.svg`;$('#aromaOrb img').src=`assets/aroma/${config.aroma==='none'?'jasmine':config.aroma}.svg`;$('#aromaOrb').style.opacity=config.aroma==='none'?'.24':'1';
  const pos=(config.dimension-600)/(3000-600)*100;$('#dimensionNeedle').style.left=`${pos}%`;$('#configurationCode').textContent=code();$('#dialogCode').textContent=code();
  $('#toneRange').value=config.tone;$('#aromaIntensity').value=config.aromaIntensity;$('#dimensionRange').value=config.dimension;
  renderPatterns();renderProfiles();renderFinishes();renderAromas();pulseSurface();
}

$$('.surface-item,.scene-region').forEach(el=>el.addEventListener('click',()=>{config.surface=el.dataset.surface;if(config.surface==='aroma'&&config.aroma!=='none')config.mode='aroma';else if(config.mode==='aroma')config.mode='design';update()}));
$$('.mode-switch button').forEach(el=>el.addEventListener('click',()=>{config.mode=el.dataset.mode;update()}));
$('#toneRange').addEventListener('input',e=>{config.tone=Number(e.target.value);update()});
$('#aromaIntensity').addEventListener('input',e=>{config.aromaIntensity=Number(e.target.value);if(config.aroma!=='none')config.mode='aroma';update()});
$('#dimensionRange').addEventListener('input',e=>{config.dimension=Number(e.target.value);update()});
$('#aromaOrb').addEventListener('click',()=>{const idx=aromas.findIndex(a=>a.id===config.aroma);config.aroma=aromas[(idx+1)%aromas.length].id;config.mode=config.aroma==='none'?'design':'aroma';update()});

$('#copyCode').onclick=async()=>{await navigator.clipboard.writeText(code());$('#copyCode').textContent='✓';setTimeout(()=>$('#copyCode').textContent='⧉',1000)};
$('#saveScheme').onclick=()=>{localStorage.setItem('materialStudioScheme',JSON.stringify(config));$('#saveScheme').textContent='Saved';setTimeout(()=>$('#saveScheme').textContent='Save scheme',1200)};

const dialog=$('#leadDialog');
function openDialog(type){
  const copy={sample:['Sample request','Request this material scheme','Choose this to receive a coordinated sample set.'],quote:['Project enquiry','Ask for a project quotation','Share the project scale and commercial requirements.']}[type];
  $('#dialogEyebrow').textContent=copy[0];$('#dialogTitle').textContent=copy[1];$('#dialogIntro').textContent=copy[2];$('#dialogCode').textContent=code();dialog.showModal();
}
$('#requestSample').onclick=()=>openDialog('sample');$('#askQuote').onclick=()=>openDialog('quote');
$('#downloadSpec').onclick=()=>{
  const payload={...config,patternName:activePattern().name,profileName:activeProfile().name,finishName:activeFinish().name,aromaName:activeAroma().name,configurationCode:code(),generatedAt:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${code()}-spec.json`;a.click();URL.revokeObjectURL(a.href);
};

let audioCtx, ambientNodes=[];
$('#soundToggle').onclick=async e=>{
  const on=e.currentTarget.getAttribute('aria-pressed')==='true';
  if(on){ambientNodes.forEach(n=>{try{n.stop?.()}catch{}});ambientNodes=[];audioCtx?.close();audioCtx=null;e.currentTarget.setAttribute('aria-pressed','false');return;}
  audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  const gain=audioCtx.createGain();gain.gain.value=.018;gain.connect(audioCtx.destination);
  [110,164.81,220].forEach((freq,i)=>{const osc=audioCtx.createOscillator();const g=audioCtx.createGain();osc.type=i===0?'sine':'triangle';osc.frequency.value=freq;g.gain.value=i===0?.6:.18;osc.connect(g).connect(gain);osc.start();ambientNodes.push(osc)});
  e.currentTarget.setAttribute('aria-pressed','true');
};

const saved=localStorage.getItem('materialStudioScheme');if(saved){try{Object.assign(config,JSON.parse(saved))}catch{}}
update();
