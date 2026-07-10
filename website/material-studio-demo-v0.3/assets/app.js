const state={scene:'hotel-suite',surface:'wall',pattern:'walnut-linear',profile:'slat',tone:8,finish:'matte',aroma:'jasmine',aromaIntensity:46,dimension:2400,mode:'design'};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$('#sceneCanvas'),ctx=canvas.getContext('2d',{alpha:false});
let manifest, sceneImage, textureImage, maskImages={}, edgeImages={}, maskData={}, hoveredSurface=null;
const imageCache=new Map();
const surfacePriority=['trim','doorwall','wall','floor','ceiling','aroma'];
const finishNames={matte:'Silk Matte',satin:'Soft Satin','soft-gloss':'Soft Gloss'};

function loadImage(src){
  if(!src)return Promise.resolve(null);
  if(imageCache.has(src))return imageCache.get(src);
  const p=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
  imageCache.set(src,p);return p;
}
function textureById(id){return manifest.textures.find(x=>x.id===id)}
function profileById(id){return manifest.profiles.find(x=>x.id===id)}
function aromaById(id){return manifest.aromas.find(x=>x.id===id)}
function sceneData(){return manifest.scenes[state.scene]}
function surfaceData(){return manifest.surfaces[state.surface]}
function codeSlug(v){return String(v).toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'')}
function configCode(){const scene=state.scene==='hotel-suite'?'HOT':state.scene==='bathroom'?'BTH':state.scene==='outdoor-terrace'?'OUT':'SHW';const aroma=aromaById(state.aroma)?.short||'NONE';return `MS-${scene}-${codeSlug(state.pattern).slice(0,10)}-${codeSlug(state.profile).slice(0,5)}-${aroma}-${state.dimension}`}

async function loadScene(){
  const s=sceneData();
  sceneImage=await loadImage(s.desktop);
  maskImages={};edgeImages={};maskData={};
  await Promise.all(s.surfaces.map(async surf=>{
    const [mask,edge]=await Promise.all([loadImage(s.masks[surf]),loadImage(s.edges[surf])]);
    maskImages[surf]=mask;edgeImages[surf]=edge;
    const oc=document.createElement('canvas');oc.width=canvas.width;oc.height=canvas.height;const ox=oc.getContext('2d');ox.drawImage(mask,0,0,canvas.width,canvas.height);maskData[surf]=ox.getImageData(0,0,canvas.width,canvas.height).data;
  }));
  await loadTexture();
}
async function loadTexture(){textureImage=await loadImage(textureById(state.pattern).texture)}
function fillTexture(off){
  const ox=off.getContext('2d');ox.clearRect(0,0,off.width,off.height);
  const pattern=ox.createPattern(textureImage,'repeat');
  if(pattern?.setTransform){const scale=Math.max(.42,Math.min(1.05,state.dimension/2600));pattern.setTransform(new DOMMatrix().scale(scale));}
  ox.fillStyle=pattern;ox.fillRect(0,0,off.width,off.height);
  ox.save();
  if(state.profile==='slat'||state.profile==='fluted'||state.profile==='wide-rib'){
    const widths={slat:26,fluted:13,'wide-rib':58};const w=widths[state.profile];
    for(let x=0;x<off.width;x+=w){const grad=ox.createLinearGradient(x,0,x+w,0);grad.addColorStop(0,'rgba(255,255,255,.20)');grad.addColorStop(.34,'rgba(255,255,255,.03)');grad.addColorStop(.72,'rgba(0,0,0,.22)');grad.addColorStop(1,'rgba(0,0,0,.38)');ox.fillStyle=grad;ox.fillRect(x,0,w,off.height)}
  }else if(state.profile==='groove'){
    ox.strokeStyle='rgba(0,0,0,.38)';ox.lineWidth=4;for(let x=0;x<off.width;x+=72){ox.beginPath();ox.moveTo(x,0);ox.lineTo(x,off.height);ox.stroke()}
  }else if(state.profile==='decking'){
    ox.strokeStyle='rgba(0,0,0,.42)';ox.lineWidth=7;for(let y=0;y<off.height;y+=72){ox.beginPath();ox.moveTo(0,y);ox.lineTo(off.width,y);ox.stroke()}
  }
  ox.restore();
  if(state.tone!==0){ox.fillStyle=state.tone>0?`rgba(196,116,45,${Math.abs(state.tone)/190})`:`rgba(44,104,170,${Math.abs(state.tone)/220})`;ox.globalCompositeOperation='color';ox.fillRect(0,0,off.width,off.height);ox.globalCompositeOperation='source-over'}
  ox.globalCompositeOperation='destination-in';ox.drawImage(maskImages[state.surface],0,0,off.width,off.height);ox.globalCompositeOperation='source-over';
}
function render(){
  if(!sceneImage||!textureImage)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(sceneImage,0,0,canvas.width,canvas.height);
  if(state.surface!=='aroma'){
    const off=document.createElement('canvas');off.width=canvas.width;off.height=canvas.height;fillTexture(off);
    ctx.save();
    const mix=state.finish==='matte'?'multiply':state.finish==='satin'?'soft-light':'overlay';ctx.globalCompositeOperation=mix;ctx.globalAlpha=state.finish==='matte'?.72:state.finish==='satin'?.82:.90;ctx.drawImage(off,0,0);ctx.restore();
    if(state.finish==='soft-gloss'){
      const glow=document.createElement('canvas');glow.width=canvas.width;glow.height=canvas.height;const gx=glow.getContext('2d');gx.fillStyle='rgba(255,255,255,.16)';gx.fillRect(0,0,glow.width,glow.height);gx.globalCompositeOperation='destination-in';gx.drawImage(maskImages[state.surface],0,0);ctx.save();ctx.globalCompositeOperation='screen';ctx.drawImage(glow,0,0);ctx.restore();
    }
  }
  if(edgeImages[state.surface]){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.75;ctx.filter='sepia(1) saturate(2) hue-rotate(345deg) brightness(1.35) drop-shadow(0 0 9px #c89b54)';ctx.drawImage(edgeImages[state.surface],0,0);ctx.restore();ctx.filter='none'}
}
function applySceneDefaults(){const d=sceneData().defaults;Object.assign(state,d);if(!sceneData().surfaces.includes(state.surface))state.surface=sceneData().surfaces[0]}
function ensureCompatible(){const s=surfaceData();if(!s.patterns.includes(state.pattern)&&s.patterns.length)state.pattern=s.patterns[0];if(!s.profiles.includes(state.profile)&&s.profiles.length)state.profile=s.profiles[0];if(!s.profiles.length&&state.surface==='aroma')state.profile='flat'}
async function chooseScene(id){state.scene=id;applySceneDefaults();ensureCompatible();await loadScene();renderAll()}
async function chooseSurface(id){state.surface=id;ensureCompatible();if(id==='aroma'&&state.aroma!=='none')state.mode='aroma';else if(state.mode==='aroma')state.mode='design';await loadTexture();renderAll()}
async function choosePattern(id){state.pattern=id;await loadTexture();renderAll()}

function renderSceneStrip(){const box=$('#sceneStrip');box.innerHTML='';Object.entries(manifest.scenes).forEach(([id,s])=>{const b=document.createElement('button');b.className='scene-thumb'+(id===state.scene?' active':'');b.style.backgroundImage=`url('${s.thumb}')`;b.innerHTML=`<span>${s.label}</span>`;b.onclick=()=>chooseScene(id);box.appendChild(b)})}
function renderSurfaceList(){const box=$('#surfaceList');box.innerHTML='';const icons={wall:'walnut-linear',floor:'decking-teak',doorwall:'smoked-walnut',ceiling:'ivory-panel',trim:'soft-oak',aroma:'jasmine'};sceneData().surfaces.forEach(id=>{const b=document.createElement('button');b.className='surface-item'+(id===state.surface?' active':'');const tx=id==='aroma'?null:textureById(icons[id]);b.innerHTML=`<span class="surface-icon" style="${tx?`background-image:url('${tx.thumb}')`:'display:grid;place-items:center;background:radial-gradient(circle,#f0dfb5,#29442f 38%,#10100f 72%)'}">${id==='aroma'?'✿':''}</span><span><b>${manifest.surfaces[id].label}</b><small>${id==='wall'?'WPC / SPC / Marble':id==='floor'?'ASA / Indoor surface':id==='doorwall'?'Seamless matching system':id==='ceiling'?'PVC ceiling system':id==='trim'?'Corner & edge':'Optional atmosphere layer'}</small></span>`;b.onclick=()=>chooseSurface(id);box.appendChild(b)})}
function renderPatterns(){const box=$('#patternRibbon');box.innerHTML='';surfaceData().patterns.forEach(id=>{const p=textureById(id);const b=document.createElement('button');b.className='pattern-chip'+(id===state.pattern?' active':'');b.style.backgroundImage=`url('${p.thumb}')`;b.title=p.name;b.onclick=()=>choosePattern(id);box.appendChild(b)});if(!surfaceData().patterns.length)box.innerHTML='<p class="empty-state">Aroma is independent from surface pattern.</p>'}
function renderProfiles(){const box=$('#profileRibbon');box.innerHTML='';surfaceData().profiles.forEach(id=>{const p=profileById(id);if(!p)return;const b=document.createElement('button');b.className='profile-chip'+(id===state.profile?' active':'');b.title=p.name;b.innerHTML=`<img src="${p.icon}" alt="${p.name}">`;b.onclick=()=>{state.profile=id;renderAll()};box.appendChild(b)});if(!surfaceData().profiles.length)box.innerHTML='<p class="empty-state">No profile selection for this layer.</p>'}
function renderFinishes(){const box=$('#finishRibbon');box.innerHTML='';['matte','satin','soft-gloss'].forEach(id=>{const b=document.createElement('button');b.dataset.finish=id;b.className='finish-chip'+(id===state.finish?' active':'');b.style.backgroundImage=`url('${textureById(state.pattern)?.thumb||textureById('walnut-linear').thumb}')`;b.title=finishNames[id];b.onclick=()=>{state.finish=id;renderAll()};box.appendChild(b)})}
function renderAroma(){const a=aromaById(state.aroma);const box=$('#aromaDots');box.innerHTML='';manifest.aromas.forEach(item=>{const b=document.createElement('button');b.className='aroma-dot'+(item.id===state.aroma?' active':'');b.title=item.name;b.onclick=()=>{state.aroma=item.id;if(item.id!=='none')state.mode='aroma';renderAll()};box.appendChild(b)});const asset=a?.asset||manifest.aromas.find(x=>x.id==='jasmine').asset;$('#aromaOrbImg').src=asset;$('#aromaFx').style.backgroundImage=`url('${asset}')`;$('#aromaFx').style.opacity=state.aroma==='none'?'0':String(Math.max(.15,state.aromaIntensity/100))}
function labelTone(){return state.tone<-12?'Cool Neutral':state.tone>12?'Warm Neutral':'Balanced Neutral'}
function intensityName(){return state.aromaIntensity<30?'Subtle':state.aromaIntensity<70?'Soft':'Rich'}
function patternMood(){const p=textureById(state.pattern);if(!p)return'Atmosphere only';return p.tone==='warm'?'Warm · Refined · Calm':'Quiet · Architectural · Cool'}
function renderSummary(){const p=textureById(state.pattern),pr=profileById(state.profile),a=aromaById(state.aroma);$('#sceneName').textContent=sceneData().label;$('#summarySurface').textContent=surfaceData().label;$('#summaryPattern').textContent=p?.name||'Atmosphere layer';$('#summaryProfile').textContent=pr?.name||'—';$('#summaryAroma').textContent=state.aroma==='none'?'None':`${a.name} · ${intensityName()}`;$('#summaryMood').textContent=patternMood();$('#patternValue').textContent=p?.name||'Atmosphere layer';$('#profileValue').textContent=pr?.name||'—';$('#toneValue').textContent=labelTone();$('#finishValue').textContent=finishNames[state.finish];$('#aromaValue').textContent=state.aroma==='none'?'No aroma':`${a.name} · ${intensityName()}`;$('#dimensionValue').textContent=`${state.dimension} mm`;$('#instrumentTitle').textContent=`${surfaceData().label} composition`;$('#instrumentHelp').textContent=state.surface==='aroma'?'Compose the optional aroma profile and atmosphere intensity.':'Select the pattern, profile, tone, finish and dimensions that shape this surface.';const c=configCode();$('#schemeCode').textContent=c;$('#configCode').textContent=c;$('#dialogCode').textContent=c;$('#rulerNeedle').style.left=`${(state.dimension-600)/2400*100}%`;$('#toneRange').value=state.tone;$('#aromaRange').value=state.aromaIntensity;$('#dimensionRange').value=state.dimension}
function renderModes(){document.documentElement.dataset.mode=state.mode;$$('.mode-switch button').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));const o=$('#modeOverlay');o.innerHTML='';if(state.mode==='install'){const d=document.createElement('div');d.className='install-gallery';d.innerHTML=`<div class="install-card">${manifest.installSteps.slice(0,3).map((x,i)=>`<figure><img src="${x.asset}" alt="Installation step"><figcaption>${i+1}. ${x.id.replaceAll('-',' ')}</figcaption></figure>`).join('')}</div>`;o.appendChild(d)}else if(state.mode==='layer'){o.innerHTML='<div class="layer-gallery"><div class="layer-stack"><div>Finish film</div><div>Decorative pattern</div><div>Composite core</div><div>Optional aroma matrix</div><div>Backing layer</div></div></div>'}}
function renderAll(){ensureCompatible();renderSceneStrip();renderSurfaceList();renderPatterns();renderProfiles();renderFinishes();renderAroma();renderSummary();renderModes();render()}
function surfaceAtPoint(x,y){for(const id of surfacePriority){const data=maskData[id];if(!data)continue;const i=(Math.floor(y)*canvas.width+Math.floor(x))*4;if(data[i]>48)return id}return null}
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*canvas.width,y=(e.clientY-r.top)/r.height*canvas.height;hoveredSurface=surfaceAtPoint(x,y);canvas.style.cursor=hoveredSurface?'pointer':'default';const l=$('#activeRegionLabel');if(hoveredSurface){l.textContent=manifest.surfaces[hoveredSurface].label;l.style.left=`${e.clientX-r.left}px`;l.style.top=`${e.clientY-r.top}px`;l.classList.add('show')}else l.classList.remove('show')});
canvas.addEventListener('pointerleave',()=>{$('#activeRegionLabel').classList.remove('show');hoveredSurface=null});
canvas.addEventListener('click',()=>{if(hoveredSurface&&sceneData().surfaces.includes(hoveredSurface))chooseSurface(hoveredSurface)});
$$('.mode-switch button').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;renderAll()});
$('#toneRange').oninput=e=>{state.tone=+e.target.value;renderAll()};$('#aromaRange').oninput=e=>{state.aromaIntensity=+e.target.value;if(state.aroma!=='none')state.mode='aroma';renderAll()};$('#dimensionRange').oninput=e=>{state.dimension=+e.target.value;renderAll()};
$('#aromaOrb').onclick=()=>{const i=manifest.aromas.findIndex(x=>x.id===state.aroma);state.aroma=manifest.aromas[(i+1)%manifest.aromas.length].id;if(state.aroma!=='none')state.mode='aroma';renderAll()};
$('#scenePrev').onclick=()=>{const ids=Object.keys(manifest.scenes),i=ids.indexOf(state.scene);chooseScene(ids[(i-1+ids.length)%ids.length])};$('#sceneNext').onclick=()=>{const ids=Object.keys(manifest.scenes),i=ids.indexOf(state.scene);chooseScene(ids[(i+1)%ids.length])};
$('#copyCode').onclick=async()=>{await navigator.clipboard.writeText(configCode());$('#copyCode').textContent='✓';setTimeout(()=>$('#copyCode').textContent='⧉',900)};
$('#saveBtn').onclick=()=>{localStorage.setItem('materialStudioV03',JSON.stringify(state));$('#saveBtn').textContent='Saved';setTimeout(()=>$('#saveBtn').textContent='Save scheme',1000)};
$('#specBtn').onclick=()=>{const p={...state,sceneName:sceneData().label,surfaceName:surfaceData().label,patternName:textureById(state.pattern)?.name,profileName:profileById(state.profile)?.name,aromaName:aromaById(state.aroma)?.name,configurationCode:configCode(),generatedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(p,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${configCode()}-spec.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const dialog=$('#leadDialog');$$('[data-dialog]').forEach(b=>b.onclick=()=>{const type=b.dataset.dialog;$('#dialogEyebrow').textContent=type==='sample'?'Sample request':'Project enquiry';$('#dialogTitle').textContent=type==='sample'?'Request this material scheme':'Ask for a project quotation';$('#dialogIntro').textContent=type==='sample'?'The current scheme is attached automatically.':'Share project scale, market and commercial requirements.';$('#dialogCode').textContent=configCode();dialog.showModal()});
let audioCtx,nodes=[];$('#soundBtn').onclick=async e=>{const on=e.currentTarget.getAttribute('aria-pressed')==='true';if(on){nodes.forEach(n=>{try{n.stop()}catch{}});nodes=[];await audioCtx?.close();audioCtx=null;e.currentTarget.setAttribute('aria-pressed','false');return}audioCtx=new(AudioContext||webkitAudioContext)();const master=audioCtx.createGain();master.gain.value=.016;master.connect(audioCtx.destination);[110,164.8,220].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=i?'triangle':'sine';o.frequency.value=f;g.gain.value=i?.18:.55;o.connect(g).connect(master);o.start();nodes.push(o)});e.currentTarget.setAttribute('aria-pressed','true')};
async function init(){manifest=await fetch('assets/asset-manifest.json').then(r=>r.json());const saved=localStorage.getItem('materialStudioV03');let restored=false;if(saved){try{Object.assign(state,JSON.parse(saved));restored=true}catch{}}if(!restored||!manifest.scenes[state.scene]){state.scene='hotel-suite';applySceneDefaults()}ensureCompatible();await loadScene();renderAll()}
init().catch(err=>{console.error(err);document.body.insertAdjacentHTML('beforeend',`<pre style="position:fixed;inset:auto 10px 10px;background:#400;color:#fff;padding:12px;z-index:999">${err.message}</pre>`) });
