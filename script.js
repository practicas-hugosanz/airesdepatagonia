// ── HAMBURGER MENU ──
const hamburger=document.getElementById('hamburger');
const navMobile=document.getElementById('nav-mobile');
hamburger.addEventListener('click',()=>{
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
  document.body.style.overflow=navMobile.classList.contains('open')?'hidden':'';
});
navMobile.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    document.body.style.overflow='';
  });
});

// ── NAV SCROLL ──
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  if(window.scrollY>60){
    nav.style.background='rgba(12,13,8,0.96)';
    nav.style.borderBottom='1px solid rgba(212,168,67,0.1)';
  } else {
    nav.style.background='transparent';
    nav.style.borderBottom='none';
  }
});

// ── STAR CANVAS ──
const canvas=document.getElementById('star-canvas');
const ctx=canvas.getContext('2d');
let stars=[];
function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  stars=[];
  for(let i=0;i<150;i++){
    stars.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height*0.6,
      r:Math.random()*1.2+0.2,
      a:Math.random(),
      speed:Math.random()*0.008+0.003,
      phase:Math.random()*Math.PI*2
    });
  }
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);
let t=0;
function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  t+=0.02;
  stars.forEach(s=>{
    const alpha=0.3+0.7*(0.5+0.5*Math.sin(t*s.speed*50+s.phase));
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,248,220,${alpha*s.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ── PARALLAX MOUNTAINS ──
const mtnFar=document.getElementById('mtn-far');
const mtnMid=document.getElementById('mtn-mid');
const mtnNear=document.getElementById('mtn-near');
const moon3d=document.getElementById('moon3d');
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  mtnFar.style.transform=`translateY(${y*0.15}px)`;
  mtnMid.style.transform=`translateY(${y*0.2}px)`;
  mtnNear.style.transform=`translateY(${y*0.3}px)`;
  moon3d.style.transform=`translateX(-50%) translateY(${y*0.1}px)`;
},{passive:true});

// ── MOUSE PARALLAX HERO ──
const heroContent=document.getElementById('hero-content');
document.getElementById('hero').addEventListener('mousemove',e=>{
  const rx2=(e.clientX/window.innerWidth-0.5)*20;
  const ry2=(e.clientY/window.innerHeight-0.5)*10;
  moon3d.style.transform=`translateX(-50%) rotateX(${-ry2}deg) rotateY(${rx2}deg)`;
  heroContent.style.transform=`translateX(${rx2*0.3}px) translateY(${ry2*0.3}px)`;
});

// ── GENERATE HANGING PLANTS ──
function makePlantSVG(w,h,color1,color2,lampColor,glowing){
  const svgNS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(svgNS,'svg');
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  svg.setAttribute('width',w);
  svg.setAttribute('height',h);
  svg.setAttribute('xmlns',svgNS);

  // Unique id for this lamp's gradient
  const uid='lamp'+Math.random().toString(36).slice(2,7);

  if(glowing){
    const defs=document.createElementNS(svgNS,'defs');

    // Radial gradient for cone of light
    const grad=document.createElementNS(svgNS,'radialGradient');
    grad.setAttribute('id',uid);
    grad.setAttribute('cx','50%');grad.setAttribute('cy','0%');
    grad.setAttribute('r','100%');grad.setAttribute('fx','50%');grad.setAttribute('fy','0%');
    const s1=document.createElementNS(svgNS,'stop');
    s1.setAttribute('offset','0%');s1.setAttribute('stop-color','#f5c842');s1.setAttribute('stop-opacity','0.55');
    const s2=document.createElementNS(svgNS,'stop');
    s2.setAttribute('offset','100%');s2.setAttribute('stop-color','#f5c842');s2.setAttribute('stop-opacity','0');
    grad.appendChild(s1);grad.appendChild(s2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Light cone (triangle pointing down from lamp base)
    const cone=document.createElementNS(svgNS,'polygon');
    const cx=w/2, lampBase=h*0.42;
    const coneW=w*0.45, coneH=h*0.45;
    cone.setAttribute('points',`${cx-w*0.14},${lampBase} ${cx+w*0.14},${lampBase} ${cx+coneW/2},${lampBase+coneH} ${cx-coneW/2},${lampBase+coneH}`);
    cone.setAttribute('fill',`url(#${uid})`);
    cone.setAttribute('class','lamp-cone');
    svg.appendChild(cone);
  }

  // rope/string
  const rope=document.createElementNS(svgNS,'line');
  rope.setAttribute('x1',w/2);rope.setAttribute('y1',0);
  rope.setAttribute('x2',w/2);rope.setAttribute('y2',h*0.28);
  rope.setAttribute('stroke',lampColor||'#3d2008');
  rope.setAttribute('stroke-width','3');
  svg.appendChild(rope);

  // Wicker lamp shape
  const lamp=document.createElementNS(svgNS,'ellipse');
  lamp.setAttribute('cx',w/2);lamp.setAttribute('cy',h*0.38);
  lamp.setAttribute('rx',w*0.32);lamp.setAttribute('ry',h*0.12);
  lamp.setAttribute('fill',lampColor||'#3d2008');
  svg.appendChild(lamp);

  // Fern fronds around lamp
  const fronds=[
    {x:-0.25,y:0.3,rot:-40,len:0.55},
    {x:-0.15,y:0.22,rot:-60,len:0.5},
    {x:0.25,y:0.3,rot:40,len:0.55},
    {x:0.15,y:0.22,rot:60,len:0.5},
    {x:-0.05,y:0.18,rot:-20,len:0.45},
    {x:0.05,y:0.18,rot:20,len:0.45},
  ];
  fronds.forEach(f=>{
    const cx=w*(0.5+f.x);const cy=h*f.y;
    const len=w*f.len;
    const rad=f.rot*Math.PI/180;
    const ex=cx+Math.cos(rad)*len;
    const ey=cy+Math.sin(rad)*len;
    // main stem
    const stem=document.createElementNS(svgNS,'path');
    const cx2=(cx+ex)/2;const cy2=ey+h*0.05;
    stem.setAttribute('d',`M${cx},${cy} Q${cx2},${cy2} ${ex},${ey}`);
    stem.setAttribute('stroke',color1);
    stem.setAttribute('stroke-width','3.5');
    stem.setAttribute('fill','none');
    svg.appendChild(stem);
    // side leaflets
    for(let i=0.2;i<0.9;i+=0.18){
      const lx=cx+(ex-cx)*i;
      const ly=cy+(ey-cy)*i;
      [-1,1].forEach(side=>{
        const leaflet=document.createElementNS(svgNS,'path');
        const llen=w*0.08;
        const perpX=-(ey-cy);const perpY=(ex-cx);
        const nm=Math.sqrt(perpX*perpX+perpY*perpY)||1;
        const lx2=lx+(perpX/nm)*llen*side;
        const ly2=ly+(perpY/nm)*llen*side;
        leaflet.setAttribute('d',`M${lx},${ly} Q${(lx+lx2)/2-5*side},${(ly+ly2)/2-5} ${lx2},${ly2}`);
        leaflet.setAttribute('stroke',color2);
        leaflet.setAttribute('stroke-width','2');
        leaflet.setAttribute('fill','none');
        svg.appendChild(leaflet);
      });
    }
    // small leaf at tip
    const tip=document.createElementNS(svgNS,'ellipse');
    tip.setAttribute('cx',ex);tip.setAttribute('cy',ey);
    tip.setAttribute('rx','5');tip.setAttribute('ry','8');
    tip.setAttribute('fill',color2);tip.setAttribute('opacity','0.7');
    tip.setAttribute('transform',`rotate(${f.rot},${ex},${ey})`);
    svg.appendChild(tip);
  });

  return svg;
}

// Hero plants
const heroPlants=document.getElementById('hero-plants');
heroPlants.innerHTML='';
const isMobile=window.innerWidth<1024;
const heroPlantData=isMobile?[
  {left:'0%',  size:80, a1:'-3deg',a2:'2deg', dur:'5s',  del:'0s'},
  {left:'33%', size:80, a1:'-4deg',a2:'1deg', dur:'6s',  del:'0.5s'},
  {left:'66%', size:80, a1:'-3deg',a2:'5deg', dur:'5.5s',del:'1s'},
]:[
  {left:'2%',size:200,a1:'-4deg',a2:'2deg',dur:'5s',del:'0s'},
  {left:'12%',size:160,a1:'-2deg',a2:'4deg',dur:'6s',del:'1s'},
  {left:'22%',size:220,a1:'-5deg',a2:'1deg',dur:'4.5s',del:'0.5s'},
  {left:'35%',size:140,a1:'-3deg',a2:'5deg',dur:'7s',del:'2s'},
  {left:'55%',size:180,a1:'-4deg',a2:'3deg',dur:'5.5s',del:'1.5s'},
  {left:'68%',size:200,a1:'-2deg',a2:'6deg',dur:'6.5s',del:'0.8s'},
  {left:'78%',size:170,a1:'-5deg',a2:'2deg',dur:'4s',del:'3s'},
  {left:'88%',size:210,a1:'-3deg',a2:'4deg',dur:'5s',del:'1.2s'},
];
heroPlantData.forEach((p,i)=>{
  const wrap=document.createElement('div');
  wrap.className='svg-plant';
  wrap.style.left=p.left;
  wrap.style.setProperty('--dur',p.dur);
  wrap.style.setProperty('--del',p.del);
  wrap.style.setProperty('--a1',p.a1);
  wrap.style.setProperty('--a2',p.a2);
  const glowing=i%2===0;
  const svg=makePlantSVG(p.size,p.size*1.4,'#1a4a1a','#243d1c','#3d2008',glowing);
  if(glowing) svg.classList.add('lamp-lit');
  wrap.appendChild(svg);
  heroPlants.appendChild(wrap);
});

// Plants scene
const plantsScene=document.getElementById('plants-scene-inner');
plantsScene.innerHTML='';
const plantSceneData=isMobile?[
  {left:'0%',  size:80, a1:'-5deg',a2:'3deg', dur:'5s',  del:'0s',  c1:'#1a5a1a',c2:'#2e5224'},
  {left:'33%', size:80, a1:'-6deg',a2:'2deg', dur:'5.5s',del:'0.3s',c1:'#0f3a0f',c2:'#1a3a1a'},
  {left:'66%', size:80, a1:'-3deg',a2:'4deg', dur:'7s',  del:'1s',  c1:'#1a5a1a',c2:'#2e5224'},
]:[
  {left:'0%',size:240,a1:'-6deg',a2:'3deg',dur:'5s',del:'0s',c1:'#1a5a1a',c2:'#2e5224'},
  {left:'10%',size:200,a1:'-3deg',a2:'6deg',dur:'7s',del:'1s',c1:'#1a4a1a',c2:'#243d1c'},
  {left:'22%',size:280,a1:'-5deg',a2:'2deg',dur:'5.5s',del:'0.3s',c1:'#0f3a0f',c2:'#1a3a1a'},
  {left:'34%',size:220,a1:'-4deg',a2:'5deg',dur:'6s',del:'2s',c1:'#1a5a1a',c2:'#2e5224'},
  {left:'46%',size:250,a1:'-6deg',a2:'3deg',dur:'4.5s',del:'1.5s',c1:'#1a4a1a',c2:'#243d1c'},
  {left:'58%',size:230,a1:'-2deg',a2:'7deg',dur:'6.5s',del:'0.8s',c1:'#0f3a0f',c2:'#1a4a1a'},
  {left:'70%',size:270,a1:'-5deg',a2:'2deg',dur:'5s',del:'2.5s',c1:'#1a5a1a',c2:'#2e5224'},
  {left:'82%',size:210,a1:'-4deg',a2:'5deg',dur:'7.5s',del:'1.2s',c1:'#1a4a1a',c2:'#243d1c'},
  {left:'92%',size:190,a1:'-3deg',a2:'4deg',dur:'5.5s',del:'0.6s',c1:'#0f3a0f',c2:'#1a3a1a'},
];
plantSceneData.forEach((p,i)=>{
  const wrap=document.createElement('div');
  wrap.className='scene-plant';
  wrap.style.position='absolute';
  wrap.style.top='0';
  wrap.style.left=p.left;
  wrap.style.transformOrigin='top center';
  wrap.style.animation=`hangSway ${p.dur} ${p.del} ease-in-out infinite alternate backwards`;
  wrap.style.setProperty('--a1',p.a1);
  wrap.style.setProperty('--a2',p.a2);
  const glowing=i%2!==0;
  const svg=makePlantSVG(p.size,p.size*1.5,p.c1,p.c2,'#2a1408',glowing);
  if(glowing) svg.classList.add('lamp-lit');
  wrap.appendChild(svg);
  plantsScene.appendChild(wrap);
});

// Contacto plants
const cPlants=document.getElementById('contacto-plants');
cPlants.innerHTML='';
const cPlantsPos=isMobile?[0,36,70]:[0,15,30,50,65,80,92];
cPlantsPos.forEach((l,i)=>{
  const wrap=document.createElement('div');
  wrap.className='contacto-plant';
  wrap.style.cssText=`position:absolute;top:0;left:${l}%;transform-origin:top center;`;
  wrap.style.animation=`hangSway ${4+i*0.7}s ${i*0.4}s ease-in-out infinite alternate backwards`;
  wrap.style.setProperty('--a1','-4deg');wrap.style.setProperty('--a2','4deg');
  const sz=isMobile?80:160;
  const glowing=i%2===0;
  const svg=makePlantSVG(sz,Math.round(sz*1.4),'#1a4a1a','#243d1c','#2a1408',glowing);
  if(glowing) svg.classList.add('lamp-lit');
  wrap.appendChild(svg);
  cPlants.appendChild(wrap);
});

// ── ABOUT CARD 3D TILT ──
const tiltCard=document.getElementById('tilt-about');
const aboutCard=document.getElementById('about-card');
aboutCard.addEventListener('mousemove',e=>{
  const rect=aboutCard.getBoundingClientRect();
  const x=(e.clientX-rect.left)/rect.width-0.5;
  const y=(e.clientY-rect.top)/rect.height-0.5;
  tiltCard.style.transform=`rotateX(${-y*15}deg) rotateY(${x*20}deg) translateZ(10px)`;
});
aboutCard.addEventListener('mouseleave',()=>{
  tiltCard.style.transform='rotateX(0) rotateY(0) translateZ(0)';
});

// ── CARTA FILTER ──
document.getElementById('filter-bar').addEventListener('click',e=>{
  const btn=e.target.closest('.filter-btn');
  if(!btn)return;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  const f=btn.dataset.f;
  document.querySelectorAll('.tilt-card').forEach(card=>{
    const show=f==='todo'||card.dataset.cat===f;
    card.style.display=show?'block':'none';
  });
});

// Tilt cards on hover
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    card.querySelector('.tilt-text').style.transform=`translateX(${x*6}px) translateY(${-8+y*4}px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.querySelector('.tilt-text').style.transform='';
  });
});

// ── SCROLL REVEAL ──
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:0.08});
document.querySelectorAll('.sr,.sr-left,.sr-right').forEach(el=>{
  revObs.observe(el);
});

// ── FORM ──
function submitForm(e){
  e.preventDefault();
  const ok=document.getElementById('form-ok');
  ok.style.display='block';
  setTimeout(()=>ok.style.display='none',5000);
  return false;
}
