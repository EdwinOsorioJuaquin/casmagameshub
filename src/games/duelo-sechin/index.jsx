import { useEffect, useRef, useState } from "react";
import { PALETTE, PIXEL_RATIO } from "../../lib/constants";

// Controles
const KEYS = { left: "a", right: "d", jump: " ", l: "f", h: "g", block: "h" };

// Input buffer para combos (L,L,H)
class InputBuffer {
  constructor() { this.buf = []; }
  push(code) {
    const now = performance.now();
    this.buf.push({ code, t: now });
    // ventanas de 650ms
    this.buf = this.buf.filter(e => now - e.t < 650);
  }
  consumeCombo() {
    const seq = this.buf.map(b => b.code).join(",");
    if (seq.includes("L,L,H")) { this.buf = []; return true; }
    return false;
  }
}

function useKeys() {
  const keysRef = useRef({});
  const [_, forceUpdate] = useState(false); // para refrescar estado

  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      forceUpdate((x) => !x); // forza un re-render de referencia
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = false;
      forceUpdate((x) => !x);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return keysRef;
}


function loadImg(src) {
  return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; });
}

// --------- COMBATE ----------
const gravity = 2000;    // px/s^2
const ARENA = { W: 960, H: 540, GROUND: 540 - 96 };

function makeFighter(kind, x, facing) {
  // kind: "invader" | "warrior"
  return {
    kind, x, y: ARENA.GROUND, vx: 0, vy: 0, w: 64, h: 112,
    facing, onGround: true, block: false, hp: 100,
    hitbox: null, stun: 0, hitstop: 0, comboTimer: 0, stock: 0,
    // stats por personaje
    stats: kind === "warrior"
      ? { speed: 250, jump: 760, light: {dmg:7,kb:300,wind:0.16,range:34,offy:36},
          heavy: {dmg:14,kb:520,wind:0.28,range:52,offy:24}, combo: {dmg:22,kb:640,wind:0.45} }
      : { speed: 270, jump: 780, light: {dmg:6,kb:280,wind:0.14,range:36,offy:34},
          heavy: {dmg:12,kb:500,wind:0.26,range:56,offy:28}, combo: {dmg:20,kb:600,wind:0.42} },
    pose: "idle", animT: 0,
  };
}

// IA simple con 3 dificultades
function aiTick(ai, foe, dt, level = "medio") {
  if (ai.stun > 0 || ai.hitstop > 0) return;
  const want = { left:false, right:false, jump:false, block:false, l:false, h:false };
  const dist = foe.x - ai.x;
  const abs = Math.abs(dist);

  const params = { // márgenes y agresividad
    facil: { keep: 220, poke: 0.007, heavy: 0.25, jump: 0.01, block: 0.05 },
    medio: { keep: 180, poke: 0.014, heavy: 0.35, jump: 0.02, block: 0.09 },
    dificil:{ keep: 150, poke: 0.022, heavy: 0.45, jump: 0.03, block: 0.12 },
  }[level];

  // mantener distancia “keep”
  if (abs > params.keep) { if (dist > 0) want.right=true; else want.left=true; }
  else if (abs < params.keep - 40) { if (dist > 0) want.left=true; else want.right=true; }

  // orientar
  ai.facing = dist > 0 ? 1 : -1;

  // ataques aleatorios con probabilidad por frame
  if (abs < 160 && Math.random() < params.poke) want.l = true;
  if (abs < 140 && Math.random() < params.poke*params.heavy) want.h = true;

  // saltar a veces para cruzar
  if (ai.onGround && Math.random() < params.jump) want.jump = true;

  // bloquear si rival viene atacando cerca
  const foeThreat = foe.hitbox && Math.abs(foe.x - ai.x) < 140;
  want.block = foeThreat && Math.random() < params.block;

  return want;
}

// Dibuja SVG con sombreado simple
function drawFighter(ctx, img, p) {
  const s = 1.0;
  const x = Math.round(p.x), y = Math.round(p.y);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(p.facing * s, s);
  // sombra elíptica
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(0, 4, 26, 10, 0, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  // “squash & stretch” para animar sin spritesheet
  const stretch = p.pose === "jump" ? 0.92 : p.pose.startsWith("attack") ? 1.04 : 1.0;
  ctx.scale(1, stretch);

  // imagen base
  ctx.drawImage(img, -p.w/2 - 32, -p.h - 36, 128, 128);

  // debug del área de golpe propia
  //if (p.hitbox) { ctx.strokeStyle="#ffe89a"; const r=p.hitbox; ctx.strokeRect(r.x - x, r.y - y, r.w, r.h); }
  ctx.restore();
}

export default function DueloSechin() {
  const canvasRef = useRef(null);
  const keysRef = useKeys();
const buffer = useRef(new InputBuffer());

  const [roundUI, setRoundUI] = useState({ p1:0, p2:0, timer: 60, winner: null, msg: "" });
  const [difficulty, setDifficulty] = useState("medio"); // facil|medio|dificil
  // referencias reactivas para sincronizar el HUD
const p1HpRef = useRef(100);
const p2HpRef = useRef(100);
const roundsRef = useRef({ p1: 0, p2: 0 });


  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");
    const W = ARENA.W, H = ARENA.H;
    cvs.width = W * PIXEL_RATIO; cvs.height = H * PIXEL_RATIO;
    cvs.style.width = W + "px"; cvs.style.height = H + "px";
    ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    // Cargar sprites (SVG)
    let imgs = {};
    let stop = false;
    (async () => {
      imgs.invader = await loadImg("/assets/sprites/invader-single.svg");
      imgs.warrior = await loadImg("/assets/sprites/warrior-single.svg");

      let p1 = makeFighter("warrior", 260, 1);
      let p2 = makeFighter("invader", 700, -1);

      let last = performance.now();
      let matchTimer = 60; // s
      let rounds = { p1:0, p2:0 };
      let koFreeze = 0;

      function resetRound(swapSides=false) {
        p1 = makeFighter(p1.kind, swapSides? 700:260, swapSides? -1:1);
        p2 = makeFighter(p2.kind, swapSides? 260:700, swapSides? 1:-1);
        matchTimer = 60;
        koFreeze = 0;
        setRoundUI(u => ({ ...u, timer: Math.ceil(matchTimer), winner: null, msg: "" }));
      }

      function endRound(winner) {
        if (winner === "p1") rounds.p1++; else if (winner === "p2") rounds.p2++;
        const msg = winner === "time" ? "¡Tiempo!" : (winner==="p1"?"¡P1 gana el round!":"¡P2 gana el round!");
        setRoundUI({ p1: rounds.p1, p2: rounds.p2, timer: 0, winner, msg });
        koFreeze = 1.2;
        if (rounds.p1 >= 2 || rounds.p2 >= 2) {
          // Fin de pelea; re-iniciar match tras pausa
          setTimeout(() => { rounds = { p1:0, p2:0 }; resetRound(Math.random()>0.5); }, 1500);
        } else {
          setTimeout(() => resetRound(true), 1200);
        }

        if (winner === "p1") rounds.p1++;
else if (winner === "p2") rounds.p2++;

roundsRef.current = { ...rounds };

      }

      function tickPlayer(pl, dt, input) {
        // bloqueo / movimiento
        pl.block = !!input?.block;
        if (pl.stun <= 0 && pl.hitstop <= 0) {
          if (input?.left) pl.vx = -pl.stats.speed, pl.facing = -1, pl.pose = "walk";
          else if (input?.right) pl.vx = pl.stats.speed, pl.facing = 1, pl.pose = "walk";
          else pl.vx = 0, (pl.onGround && (pl.pose = "idle"));

          if (pl.onGround && input?.jump) { pl.vy = -pl.stats.jump; pl.onGround = false; pl.pose = "jump"; }

          // ataques
          const startAttack = (type) => {
            const data = pl.stats[type];
            pl.pose = "attack" + type.toUpperCase();
            pl.animT = 0;
            const ox = pl.facing > 0 ? pl.w/2 : -data.range;
            pl.hitbox = { x: pl.x + ox, y: pl.y - pl.h + data.offy, w: data.range, h: 26,
                          dmg: data.dmg, kb: data.kb, stop: type==="heavy"?0.09:0.06, owner: pl };
          };
          if (input?.combo) { // L,L,H detectado
            pl.pose = "combo";
            const data = pl.stats.combo;
            pl.animT = 0;
            const ox = pl.facing > 0 ? pl.w/2 : -48;
            pl.hitbox = { x: pl.x + ox, y: pl.y - pl.h + 24, w: 64, h: 30, dmg: data.dmg, kb: data.kb, stop: 0.12, owner: pl };
          } else if (input?.l) startAttack("light");
          else if (input?.h) startAttack("heavy");
        }

        // físicas
        if (!pl.onGround) pl.vy += gravity * dt;
        pl.x += pl.vx * dt;
        pl.y += pl.vy * dt;

        // suelo
        if (pl.y >= ARENA.GROUND) { pl.y = ARENA.GROUND; pl.vy = 0; pl.onGround = true; if(pl.vx===0 && pl.stun<=0) pl.pose = "idle"; }

        // límites
        pl.x = Math.max(48, Math.min(ARENA.W - 48, pl.x));

        // timers
        if (pl.stun > 0) pl.stun -= dt;
        if (pl.hitstop > 0) pl.hitstop -= dt;
        pl.animT += dt;

        // desaparición hitbox al pasar “ventana de viento”
        if (pl.hitbox) {
          const dataDur = pl.pose === "attackHEAVY" ? pl.stats.heavy.wind :
                          pl.pose === "attackLIGHT" ? pl.stats.light.wind :
                          pl.pose === "combo" ? pl.stats.combo.wind : 0.18;
          if (pl.animT >= dataDur) pl.hitbox = null;
        }
      }

      function collide(att, def, defRefKey) {
  if (!att.hitbox) return;

  const r = att.hitbox;
  const b = { x: def.x - def.w / 2, y: def.y - def.h, w: def.w, h: def.h };

  const overlap =
    r.x < b.x + b.w &&
    r.x + r.w > b.x &&
    r.y < b.y + b.h &&
    r.y + r.h > b.y;

  if (!overlap) return;

  const facingAttToDef = Math.sign(def.x - att.x);
  const blocking = def.block && def.facing === facingAttToDef;

  const dmg = Math.max(1, Math.round(r.dmg * (blocking ? 0.35 : 1)));
  def.hp = Math.max(0, def.hp - dmg);

  // Sincronizar la barra visible
  if (defRefKey === "p1") p1HpRef.current = def.hp;
  if (defRefKey === "p2") p2HpRef.current = def.hp;
  setRoundUI((u) => ({ ...u })); // refrescar HUD

  // Física del impacto
  def.vx = (att.x < def.x ? 1 : -1) * (blocking ? r.kb * 0.4 : r.kb);
  def.vy = -(blocking ? 60 : 140);
  def.onGround = false;
  def.stun = blocking ? 0.08 : 0.25;
  att.hitstop = r.stop;

  att.hitbox = null;

  // Efecto visual de impacto
ctx.save();
ctx.globalAlpha = 0.2;
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, W, H);
ctx.restore();

}


      function render() {
        // fondo
        ctx.fillStyle = PALETTE.coal; ctx.fillRect(0,0,W,H);
        // suelo
        ctx.fillStyle = "#26262c"; ctx.fillRect(0, ARENA.GROUND+1, W, H-ARENA.GROUND-1);
        // 13 torres (Chankillo)
        ctx.fillStyle = "#3a3a40";
        for (let i=0;i<13;i++) ctx.fillRect(30 + i * 70, ARENA.GROUND-180 + (i%2?12:0), 22, 180);

       // --- HUD ---
ctx.fillStyle = "#aaa";
ctx.fillText(
  `Rondas  P1 ${roundsRef.current.p1} - ${roundsRef.current.p2} P2`,
  W / 2 - 80,
  46
);
ctx.font = "16px system-ui, sans-serif";

const drawBar = (x, y, val, color) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, 300, 14);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 300 * (val / 100), 14);
  ctx.strokeStyle = "#222";
  ctx.strokeRect(x, y, 300, 14);
};

// --- dibujar vida según refs ---
drawBar(24, 24, p1HpRef.current, "#86efac");
drawBar(W - 324, 24, p2HpRef.current, "#fca5a5");


// Bordes suaves
ctx.shadowColor = "#000";
ctx.shadowBlur = 4;
ctx.shadowBlur = 0;

// Nombres
ctx.fillStyle = "#d0a85c";
ctx.fillText(`P1: ${p1.kind?.toUpperCase() ?? "???"}`, 24, 20);
ctx.textAlign = "center";
ctx.fillText(roundUI.timer.toString().padStart(2, "0"), W / 2, 20);
ctx.textAlign = "left";
ctx.fillText(`P2: ${p2.kind?.toUpperCase() ?? "???"}`, W - 160, 20);

// Rondas
ctx.fillStyle = "#aaa";
ctx.fillText(`Rondas  P1 ${roundUI.p1} - ${roundUI.p2} P2`, W / 2 - 80, 46);

        // personajes
        drawFighter(ctx, imgs[p1.kind], p1);
        drawFighter(ctx, imgs[p2.kind], p2);

        // mensaje
        if (roundUI.winner) {
          ctx.fillStyle = "#fff"; ctx.font = "28px system-ui,sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(roundUI.msg, W/2, 120);
          ctx.textAlign = "left";
        }

        // ayuda controles
        ctx.fillStyle="#cfcfcf"; ctx.font="14px system-ui,sans-serif";
        ctx.fillText("A/D mover • SPACE saltar • F ligero • G pesado • H bloquear • Combo: F, F, G", 24, H-16);
      }

      function gameLoop(now) {
        if (stop) return;
        let dt = Math.min((now - last) / 1000, 1/30); last = now;

        if (koFreeze > 0) { koFreeze -= dt; render(); requestAnimationFrame(gameLoop); return; }

        // input jugador
        const keys = keysRef.current;
const inputP1 = {
  left: !!keys[KEYS.left],
  right: !!keys[KEYS.right],
  jump: !!keys[KEYS.jump],
  l: !!keys[KEYS.l],
  h: !!keys[KEYS.h],
  block: !!keys[KEYS.block],
  combo: buffer.current.consumeCombo()
};


        // IA
        const ai = aiTick(p2, p1, dt, difficulty) || {};
        const inputP2 = { ...ai };

        // actualizaciones
        if (p1.hitstop <= 0) tickPlayer(p1, dt, inputP1);
        if (p2.hitstop <= 0) tickPlayer(p2, dt, inputP2);

        // colisiones
        collide(p1, p2, "p2");
collide(p2, p1, "p1");


        // agotar tiempo
        matchTimer -= dt; const t = Math.max(0, Math.ceil(matchTimer));
        if (t !== roundUI.timer) setRoundUI(u => ({ ...u, timer: t }));

        // fin por HP
        if (p1.hp <= 0 || p2.hp <= 0) endRound(p1.hp <= 0 ? "p2" : "p1");
        // fin por tiempo
        else if (matchTimer <= 0) endRound(p1.hp === p2.hp ? (Math.random()>0.5?"p1":"p2") : (p1.hp > p2.hp ? "p1" : "p2"));

        render();
        requestAnimationFrame(gameLoop);
      }

      resetRound();
      requestAnimationFrame(gameLoop);
    })();

    return () => { stop = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]); // puedes cambiar dificultad en caliente

  return (
    <div className="min-h-[540px] w-full flex flex-col items-center gap-2 bg-neutral-950 py-4">
      <div className="flex items-center gap-3 text-neutral-200 text-sm">
        <span>Dificultad IA:</span>
        <select className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
                value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
          <option value="facil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="dificil">Difícil</option>
        </select>
      </div>
      <canvas ref={canvasRef} className="rounded-2xl shadow-xl border border-neutral-800" />
    </div>
  );
}
