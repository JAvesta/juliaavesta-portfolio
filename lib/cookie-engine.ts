/* eslint-disable */
// @ts-nocheck
// Cookie, ported unchanged from the single-file JuliaOS site (plain DOM + one rAF loop),
// wrapped so React can start it and fully stop it. Imperative on purpose: a 60fps sprite
// loop should never re-render React.

/* Cookie, the pixel chihuahua: walks the taskbar, sits, naps, plays ball.
   Tap/click: mini menu (Pet / Feed). Drag with a mouse, or press-and-hold then drag on touch. */
export function startCookie(): () => void {
  var stopped = false, rafId = 0, docListeners = [];
  function onDoc(type, fn, capture){ document.addEventListener(type, fn, !!capture); docListeners.push([type, fn, !!capture]); }
  var FR = {"walk1": ["...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "..........kfpfffkfpfk.", "...........kfpfffpfk..", "...k......kffffffffk..", "..kfk.....kffffwkffkk.", ".kfk..kkkkkffffkkfLLkk", ".kfkkkfffffffffffpLLk.", "..kffffffffffPffffkk..", "...kffffffffPPyfkk....", "...kffffffffffkk......", "...kffffffffffk.......", "....kkfLLLLLkkk.......", "...kfkkfkkkfkkfk......", "...kfkkfk.kfkkfk......", "...kLkkLk.kLkkLk......", "....k..k...k..k......."], "walk2": ["...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "..........kfpfffkfpfk.", "...........kfpfffpfk..", ".k........kffffffffk..", "kfk.......kffffwkffkk.", "kfk...kkkkkffffkkfLLkk", ".kfkkkfffffffffffpLLk.", "..kffffffffffPffffkk..", "...kffffffffPPyfkk....", "...kffffffffffkk......", "...kffffffffffk.......", "....kkfLLLLLkk........", "....kffkkkkkffk.......", "....kffk...kffk.......", "....kLLk...kLLk.......", ".....kk.....kk........"], "sit": ["...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "..........kfpfffkfpfk.", "...........kfpfffpfk..", "...k......kffffffffk..", "..kfk...kkkffffwkffkk.", ".kfk..kkfffffffkkfLLkk", ".kfk.kfffffffffffpLLk.", "..kfkkfffffffPffffkk..", "...kkfffffffPPyfkk....", "....kfffffffffkk......", ".....kfffffffk........", ".....kfLLLLLffk.......", ".....kfffffkffk.......", ".....kLLLLkkffk.......", "......kkkk.kLLk.......", "............kk........"], "sleep": ["......................", "......................", ".............k........", "............kfk.......", ".......kkk..kffk......", "....kkkdddkkfpfk.....k", "...kddddddddfppfk...kf", "..kdddfffffdfppfkk.kpf", ".kdddffLLfffdfffkkkfpf", ".kddfLLLLfffkffffffpfk", ".kddfLLLLffkffffffffk.", ".kddfLLLLffkfffffffkk.", ".kddfffffffkfffkfkfLkk", ".kddfffffffkffffkfLLkk", "..kdffffffffkffffpLLk.", "...kdffffffffkkkkkkk..", "....kddddddddkkkkk....", ".....kkkkkkkk........."], "happy": ["...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "..........kfpfffkfpfk.", "...........kfpfffpfk..", "...k......kffffkfffk..", "..kfk...kkkfffkkkffkk.", ".kfk..kkffffffffffLLkk", ".kfk.kfffffffffffpLLk.", "..kfkkfffffffPffffkPk.", "...kkfffffffPPyfkkkk..", "....kfffffffffkk......", ".....kfffffffk........", ".....kfLLLLLffk.......", ".....kfffffkffk.......", ".....kLLLLkkffk.......", "......kkkk.kLLk.......", "............kk........"], "dangle": ["...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "..........kfpfffkfpfk.", "...........kfpfffpfk..", "...k......kffffffffk..", "..kfk...kkkffffwkffkk.", ".kfk..kkfffffffkkfLLkk", ".kfk.kfffffffffffpLLk.", "..kfkkfffffffPffffkk..", "...kkfffffffPPyfkk....", "....kfffffffffkk......", ".....kfffffffk........", ".....kfLLLLLfk........", "......kffffffk........", "......kffkkffk........", "......kffkkffk........", "......kLLkkLLk........"], "play": ["...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "..........kfpfffkfpfk.", "...........kfpfffpfk..", "...k......kffffffffk..", "..kfk.....kffffwkffkk.", ".kfk..kkkkkffffkkfLLkk", ".kfkkkfffffffffffpLLk.", "..kffffffffffPffffkPk.", "...kffffffffPPyfkkkk..", "...kffffffffffkk......", "...kffffffffffk.......", "....kkfLLLLLkkk.......", "...kfkkfkkkfkkfk......", "...kfkkfk.kfkkfk......", "...kLkkLk.kLkkLk......", "....k..k...k..k......."], "eat1": ["......................", "......................", "......................", "...........k.......k..", "..........kfk.....kfk.", "...k......kpfkkk.kfpk.", "..kfk...kkkfpfffkfpfk.", ".kfk..kkfffkfpfffpfk..", ".kfk.kfffffffffffffk..", "..kfkkfffffffffkkffkk.", "...kkfffffffffffffLLkk", "....kffffffffffffpLLk.", ".....kfffffffPffffkk..", ".....kfLLLLLPPyfkk....", ".....kfffffkffkk......", ".....kLLLLkkffk.......", "......kkkk.kLLk.......", "............kk........"], "eat2": ["......................", "......................", "...........k.......k..", "..........kfk.....kfk.", "..........kpfkkk.kfpk.", "...k......kfpfffkfpfk.", "..kfk...kkkkfpfffpfk..", ".kfk..kkfffffffffffk..", ".kfk.kfffffffffkkffkk.", "..kfkkffffffffffffLLkk", "...kkffffffffffffpLLk.", "....kffffffffPffffkk..", ".....kffffffPPyfkk....", ".....kfLLLLLffkk......", ".....kfffffkffk.......", ".....kLLLLkkffk.......", "......kkkk.kLLk.......", "............kk........"]};
  var COL = { k:'#1E1B2E', w:'#FFFFFF', f:'#E2AE74', L:'#F7E1C4', p:'#F4A3C8', P:'#D23C7E', y:'#FFE58A', d:'#C68A52' };
  function svg(rows){ var o = ''; rows.forEach(function(r, y){ var x = 0; while (x < r.length){ var c = r[x]; if (c === '.'){ x++; continue; } var x2 = x; while (x2 < r.length && r[x2] === c) x2++; o += '<rect x="' + x + '" y="' + y + '" width="' + (x2 - x) + '" height="1" fill="' + COL[c] + '"/>'; x = x2; } });
    return '<svg viewBox="0 0 22 18" width="66" height="54" shape-rendering="crispEdges" aria-hidden="true">' + o + '</svg>'; }
  var SV = {}; Object.keys(FR).forEach(function(k){ SV[k] = svg(FR[k]); });
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- elements ---- */
  var pet = document.createElement('div'); pet.className = 'pet'; pet.setAttribute('role', 'button'); pet.tabIndex = 0;
  pet.setAttribute('aria-label', 'Cookie the chihuahua. Press to pet or feed, drag to move.'); pet.setAttribute('aria-haspopup', 'menu');
  pet.innerHTML = '<span class="pet-body"><span class="pet-spr"></span></span><span class="pet-fx" aria-hidden="true"></span>';
  var ball = document.createElement('span'); ball.className = 'pet-ball'; ball.hidden = true; ball.setAttribute('aria-hidden', 'true');
  var bowl = document.createElement('span'); bowl.className = 'pet-bowl'; bowl.hidden = true; bowl.setAttribute('aria-hidden', 'true'); bowl.innerHTML = '<i></i>';
  var bubble = document.createElement('span'); bubble.className = 'pet-bubble'; bubble.hidden = true; bubble.setAttribute('role', 'status');
  var menu = document.createElement('div'); menu.className = 'pet-menu'; menu.hidden = true; menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', 'Cookie');
  menu.innerHTML = '<button type="button" role="menuitem" data-pet="pet"><span class="pm-ic pm-heart"></span>Pet</button><button type="button" role="menuitem" data-pet="feed"><svg class="pm-svg" viewBox="0 0 8 5" width="20" height="12" shape-rendering="crispEdges" aria-hidden="true"><rect x="0" y="0" width="2" height="1" fill="#1E1B2E"/><rect x="6" y="0" width="2" height="1" fill="#1E1B2E"/><rect x="0" y="1" width="8" height="3" fill="#1E1B2E"/><rect x="1" y="1" width="1" height="1" fill="#F7E1C4"/><rect x="6" y="1" width="1" height="1" fill="#F7E1C4"/><rect x="1" y="2" width="6" height="1" fill="#F7E1C4"/><rect x="1" y="3" width="1" height="1" fill="#F7E1C4"/><rect x="6" y="3" width="1" height="1" fill="#F7E1C4"/><rect x="0" y="4" width="2" height="1" fill="#1E1B2E"/><rect x="6" y="4" width="2" height="1" fill="#1E1B2E"/></svg>Feed</button><button type="button" role="menuitem" data-pet="off" class="pm-off">Turn off</button>';
  [ball, bowl, pet, bubble, menu].forEach(function(n){ document.body.appendChild(n); });
  var body = pet.querySelector('.pet-body'), spr = pet.querySelector('.pet-spr'), fx = pet.querySelector('.pet-fx');

  /* ---- yip sound (plays on petting, which is always a direct tap or click) ---- */
  var actx = null;
  function yip(n){
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      for (var i = 0; i < (n || 2); i++){
        var t = actx.currentTime + i * 0.13, o = actx.createOscillator(), g = actx.createGain();
        var base = 900 + Math.random() * 250;
        o.type = 'triangle';
        o.frequency.setValueAtTime(base, t); o.frequency.exponentialRampToValueAtTime(base * 1.7, t + 0.035); o.frequency.exponentialRampToValueAtTime(base * 0.8, t + 0.09);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.11);
      }
    } catch(e){}
  }
  function crunch(){
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime, len = 0.05, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var src = actx.createBufferSource(), g = actx.createGain(); src.buffer = buf; g.gain.value = 0.08; src.connect(g); g.connect(actx.destination); src.start(t);
    } catch(e){}
  }

  /* ---- state ---- */
  var W = 66, x = 120, lift = 0, vy = 0, dir = 1, state = 'walk', until = 0, frame = '', walkT = 0, turnLock = 0;
  var bx = 0, bvx = 0, by = 0, bvy = 0, pets = 0, eatT = 0, hidden = false;
  hidden = true; try { hidden = localStorage.getItem('jos-pet') !== 'on'; } catch(e){}   /* off unless the visitor turned it on */
  function ground(){ var tb = document.querySelector('.taskbar'); return tb ? tb.getBoundingClientRect().top : window.innerHeight; }
  function maxX(){ return Math.max(4, window.innerWidth - W - 4); }
  function setFrame(f){ if (f !== frame){ spr.innerHTML = SV[f]; frame = f; } }
  function face(d, now){ if (d !== dir && now > turnLock){ dir = d; turnLock = now + 450; } }
  function choose(){
    var r = Math.random(), now = performance.now();
    ball.hidden = true; fx.className = 'pet-fx';
    if (reduce){ state = r < .5 ? 'sit' : 'sleep'; until = now + 8000; }
    else if (r < .38){ state = 'walk'; dir = x < 80 ? 1 : x > maxX() - 80 ? -1 : (Math.random() < .5 ? -1 : 1); until = now + 3000 + Math.random() * 4000; }
    else if (r < .58){ state = 'sit'; until = now + 2500 + Math.random() * 2500; }
    else if (r < .75){ state = 'sleep'; until = now + 7000 + Math.random() * 5000; }
    else {
      state = 'play'; until = now + 6000; ball.hidden = hidden;
      var away = x > window.innerWidth / 2 ? -1 : 1; dir = away;
      bx = x + W / 2 + away * 40; by = 0; bvx = away * 140; bvy = 160;
    }
    if (state === 'sleep') fx.className = 'pet-fx zzz';
  }
  function say(t, ms){ if (hidden) return; bubble.textContent = t; bubble.hidden = false; clearTimeout(say.t); say.t = setTimeout(function(){ bubble.hidden = true; }, ms || 1600); }
  function squash(){ body.classList.remove('land'); void body.offsetWidth; body.classList.add('land'); }

  /* ---- loop ---- */
  var last = performance.now();
  function loop(now){
    if (hidden){ ball.hidden = true; bowl.hidden = true; bubble.hidden = true; last = now; if (!stopped) rafId = requestAnimationFrame(loop); return; }
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var mx = maxX();
    if (x > mx) x = mx;
    switch (state){
      case 'held': setFrame('dangle'); break;
      case 'menu': setFrame('sit'); break;
      case 'fall':
        vy += 1700 * dt; lift -= vy * dt; setFrame('dangle'); pet.classList.add('falling');
        if (lift <= 0){ lift = 0; pet.classList.remove('falling'); squash(); state = 'sit'; until = now + 1600; say(vy > 900 ? 'oof!' : 'whee!'); vy = 0; }
        break;
      case 'happy': setFrame('happy'); if (now > until) choose(); break;
      case 'eat':
        eatT += dt; setFrame(eatT % .5 < .25 ? 'eat1' : 'eat2');
        if (eatT % .5 < dt) crunch();
        if (now > until){ bowl.hidden = true; state = 'happy'; until = now + 1500; say('yum! ♥'); hearts(); if (Math.random() < .5){ until = now + 1200; setTimeout(function(){ if (state === 'happy'){ state = 'sleep'; until = performance.now() + 8000; fx.className = 'pet-fx zzz'; say('food coma…'); } }, 1300); } }
        break;
      case 'walk':
        x += dir * 38 * dt; walkT += dt; setFrame(walkT % .36 < .18 ? 'walk1' : 'walk2');
        if (x <= 4){ x = 4; face(1, now); } else if (x >= mx){ x = mx; face(-1, now); }
        if (now > until) choose();
        break;
      case 'sit': setFrame('sit'); if (now > until) choose(); break;
      case 'sleep': setFrame('sleep'); if (now > until) choose(); break;
      case 'play':
        var lo = 6, hi = mx + W - 18;                      /* the ball stays where Cookie can reach it */
        bvy -= 900 * dt; by += bvy * dt; if (by <= 0){ by = 0; bvy = Math.abs(bvy) * .55; if (bvy < 40) bvy = 0; }
        bx += bvx * dt; bvx *= Math.pow(.55, dt);
        if (bx < lo){ bx = lo; bvx = Math.abs(bvx) * .6; } if (bx > hi){ bx = hi; bvx = -Math.abs(bvx) * .6; }
        var target = Math.max(4, Math.min(mx, bx - W / 2)), d = target - x;
        if (Math.abs(d) > 14){ face(d > 0 ? 1 : -1, now); x += (d > 0 ? 1 : -1) * 95 * dt; walkT += dt * 1.6; setFrame(walkT % .36 < .18 ? 'walk1' : 'play'); }
        else {
          setFrame('play');
          if (Math.abs(bvx) < 20 && by === 0){
            var kick = bx < 120 ? 1 : bx > window.innerWidth - 120 ? -1 : (Math.random() < .5 ? -1 : 1);   /* kick away from walls */
            face(kick, now); bvx = kick * (120 + Math.random() * 90); bvy = 150 + Math.random() * 120;
          }
        }
        x = Math.max(4, Math.min(mx, x));
        ball.style.transform = 'translate(' + Math.round(bx) + 'px,' + Math.round(ground() - 12 - by) + 'px)';
        if (now > until) choose();
        break;
    }
    var top = ground() - 54 - lift + 2;
    pet.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(top) + 'px)';
    spr.style.transform = dir < 0 ? 'scaleX(-1)' : 'none';
    bubble.style.transform = 'translate(' + Math.round(Math.min(x + 10, window.innerWidth - bubble.offsetWidth - 6)) + 'px,' + Math.round(top - 30) + 'px)';
    if (!menu.hidden) menu.style.transform = 'translate(' + Math.round(Math.max(6, Math.min(x - 20, window.innerWidth - menu.offsetWidth - 6))) + 'px,' + Math.round(top - menu.offsetHeight - 8) + 'px)';
    if (!bowl.hidden) bowl.style.transform = 'translate(' + Math.round(dir > 0 ? x + W - 6 : x - 24) + 'px,' + Math.round(ground() - 14) + 'px)';
    if (!stopped) rafId = requestAnimationFrame(loop);
  }

  /* ---- actions ---- */
  function hearts(){
    for (var i = 0; i < 3; i++){ var h = document.createElement('i'); h.className = 'pet-heart'; h.style.left = (14 + i * 14) + 'px'; h.style.animationDelay = (i * 90) + 'ms'; pet.appendChild(h); setTimeout(function(n){ return function(){ n.remove(); }; }(h), 1200); }
  }
  function petIt(){
    pets++; state = 'happy'; until = performance.now() + 1400; ball.hidden = true; fx.className = 'pet-fx';
    hearts(); yip(pets % 3 === 0 ? 3 : 2);
    var lines = ['wag wag!', 'more pets pls', 'arf!', '♥ ♥', 'yip yip!'];
    say(pets === 1 ? 'arf! ♥' : lines[pets % lines.length]);
  }
  function feed(){
    state = 'eat'; eatT = 0; until = performance.now() + 2600; ball.hidden = true; fx.className = 'pet-fx';
    bowl.hidden = hidden; bowl.classList.remove('empty'); setTimeout(function(){ bowl.classList.add('empty'); }, 2000);
    say('nom nom nom', 2400);
  }
  function openMenu(){
    state = 'menu'; ball.hidden = true; fx.className = 'pet-fx'; bubble.hidden = true; menu.hidden = false;
    pet.setAttribute('aria-expanded', 'true'); setTimeout(function(){ var b = menu.querySelector('button'); if (b) b.focus({ preventScroll:true }); }, 0);
  }
  function closeMenu(resume){ if (menu.hidden) return; menu.hidden = true; pet.setAttribute('aria-expanded', 'false'); if (resume && state === 'menu'){ state = 'sit'; until = performance.now() + 1500; } }
  menu.addEventListener('click', function(e){
    var b = e.target.closest('[data-pet]'); if (!b) return;
    closeMenu(false); var act = b.getAttribute('data-pet');
    if (act === 'off'){ hidden = true; try { localStorage.setItem('jos-pet', 'off'); } catch(err){} apply(); var ic = document.getElementById('shimeji-icon'); if (ic) ic.focus({ preventScroll:true }); return; }
    if (act === 'pet') petIt(); else feed(); pet.focus({ preventScroll:true });
  });
  menu.addEventListener('keydown', function(e){
    var items = Array.prototype.slice.call(menu.querySelectorAll('button')), i = items.indexOf(document.activeElement);
    if (e.key === 'Escape'){ e.stopPropagation(); closeMenu(true); pet.focus(); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); items[(i + items.length - 1) % items.length].focus(); }
  });
  onDoc('pointerdown', function(e){ if (!menu.hidden && !e.target.closest('.pet-menu') && !e.target.closest('.pet')) closeMenu(true); }, true);

  /* ---- pointer: tap = menu, drag (mouse) / hold-then-drag (touch) = carry ---- */
  var down = null;
  pet.addEventListener('pointerdown', function(e){
    e.preventDefault(); e.stopPropagation(); pet.setPointerCapture(e.pointerId);
    down = { x:e.clientX, y:e.clientY, drag:false, touch:e.pointerType !== 'mouse', ox:e.clientX - x, oy:(ground() - 54 - lift) - e.clientY };
    if (down.touch) down.hold = setTimeout(function(){ if (down){ down.drag = true; startDrag(); } }, 280);
  });
  function startDrag(){ closeMenu(false); state = 'held'; ball.hidden = true; bowl.hidden = true; fx.className = 'pet-fx'; pet.classList.add('held'); say('hey!'); }
  pet.addEventListener('pointermove', function(e){
    if (!down) return;
    if (!down.drag && !down.touch && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5){ down.drag = true; startDrag(); }
    if (!down.drag) return;
    x = Math.max(0, Math.min(window.innerWidth - W, e.clientX - down.ox));
    lift = Math.max(0, ground() - 54 - Math.max(0, e.clientY + down.oy));
  });
  function up(){
    if (!down) return; clearTimeout(down.hold);
    if (down.drag){ pet.classList.remove('held'); vy = 0; if (lift > 0) state = 'fall'; else { squash(); state = 'sit'; until = performance.now() + 1200; } }
    else { if (menu.hidden) openMenu(); else closeMenu(true); }
    down = null;
  }
  pet.addEventListener('pointerup', up); pet.addEventListener('pointercancel', up);
  pet.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); if (menu.hidden) openMenu(); else closeMenu(true); } });

  /* ---- show / hide from the JuliaOS menu ---- */
  function apply(){ pet.hidden = hidden; if (hidden){ ball.hidden = true; bubble.hidden = true; bowl.hidden = true; closeMenu(false); } var b = document.getElementById('pet-toggle'); if (b) b.textContent = hidden ? 'Show Cookie the pet' : 'Hide Cookie the pet';
    var ic = document.getElementById('shimeji-icon');
    if (ic){ ic.setAttribute('aria-pressed', String(!hidden)); ic.classList.toggle('off', hidden); ic.querySelector('.sh-state').textContent = hidden ? 'OFF' : 'ON'; ic.setAttribute('aria-label', 'Cookie the desktop pet: ' + (hidden ? 'off' : 'on') + '. Click to turn ' + (hidden ? 'on' : 'off') + '.'); }
  }
  onDoc('click', function(e){
    if (e.target.closest('#pet-toggle, #shimeji-icon')){
      hidden = !hidden; try { localStorage.setItem('jos-pet', hidden ? 'off' : 'on'); } catch(err){}
      apply();
      if (!hidden){ x = Math.max(4, Math.min(maxX(), window.innerWidth / 2 - W / 2)); lift = Math.max(0, ground() - 140); vy = 0; state = 'fall'; say('hi hi!'); }
    }
  });
  apply(); state = 'walk'; until = performance.now() + 4000;
  rafId = requestAnimationFrame(loop);

  /* cleanup for React (unmount / Fast Refresh): nothing keeps running after this */
  return function stop(){
    stopped = true; cancelAnimationFrame(rafId);
    docListeners.forEach(function(l){ document.removeEventListener(l[0], l[1], l[2]); });
    [ball, bowl, pet, bubble, menu].forEach(function(n){ n.remove(); });
  };
}
