// Duelo Sechín (Phaser 3) – v1.1
// - Combos (light>light>heavy), hitstun, knockback, hitstop, screenshake, partículas,
//   timer, KO, reinicio con R, CPU fácil.
// - Usa atlas si existen (warrior.png/json, invader.png/json).
// - Fallback: usa imágenes únicas (warrior-single.png, invader-single.png) o los rectángulos.

import Phaser from 'phaser'
import { storage } from '../core/Storage'

export async function loadDueloSechin(){ return DueloSechin }

class DueloSechin {
  init(mount, { save, onEvent }) {
    this.save = save
    this.onEvent = onEvent
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: mount,
      backgroundColor: '#0b0f19',
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { gravity: { y: 1600 }, debug: false } },
      scene: [new FightScene(this)]
    })
  }
  resize() {}
  pause(){ this.game?.loop.sleep() }
  resume(){ this.game?.loop.wake() }
  destroy(){ this.game?.destroy(true) }
}

// --------------------- Scene ---------------------
class FightScene extends Phaser.Scene {
  constructor(owner){ super('Fight'); this.owner = owner }

  preload(){
    // Atlas (si los agregas más adelante)
    safeLoadAtlas(this, 'warrior', '/assets/sprites/warrior.png', '/assets/sprites/warrior.json')
    safeLoadAtlas(this, 'invader', '/assets/sprites/invader.png', '/assets/sprites/invader.json')
    // Imágenes únicas (lo que te paso abajo)
    safeLoadImage(this, 'warrior-single', '/assets/sprites/warrior-single.png')
    safeLoadImage(this, 'invader-single', '/assets/sprites/invader-single.png')
    // SFX opcionales
    ;['/assets/sfx/hit-1.mp3','/assets/sfx/hit-2.mp3','/assets/sfx/ko.mp3'].forEach((p,i)=>{
      this.load.audio(`sfx${i}`, p)
    })
  }

  create(){
    const W = this.scale.width, H = this.scale.height
    const groundY = H - 80

    const ground = this.add.rectangle(W/2, groundY+20, W, 40, 0x111827).setOrigin(0.5,0.5)
    this.physics.add.existing(ground, true)

    // Partícula blanca para impactos
    ensureWhiteParticle(this)

    // P1 Guerrero Sechín
    this.p1 = new Fighter(this, {
      id:'p1', x: W*0.28, y: groundY-100, facing:+1,
      palette:0x22c55e, atlasKey: has(this,'warrior')?'warrior':null,
      singleKey: has(this,'warrior-single')?'warrior-single':null
    })
    // CPU Invasor
    this.p2 = new Fighter(this, {
      id:'cpu', x: W*0.72, y: groundY-100, facing:-1,
      palette:0xeab308, atlasKey: has(this,'invader')?'invader':null,
      singleKey: has(this,'invader-single')?'invader-single':null, cpu:true
    })

    this.physics.add.collider(this.p1.body, ground)
    this.physics.add.collider(this.p2.body, ground)
    this.physics.world.setBounds(0,0,W,H)
    this.p1.body.setCollideWorldBounds(true)
    this.p2.body.setCollideWorldBounds(true)

    // HUD
    this.timer = 60; this.ko = false
    this.timerText = this.add.text(W/2,36,'60',{ fontSize:20, color:'#e5e7eb' }).setOrigin(0.5)
    this.p1bar = this.add.rectangle(120,28,180,14,0x0f172a).setOrigin(0,0.5)
    this.p2bar = this.add.rectangle(W-300,28,180,14,0x0f172a).setOrigin(0,0.5)
    this.p1hp  = this.add.rectangle(120,28,180,14,0x22c55e).setOrigin(0,0.5)
    this.p2hp  = this.add.rectangle(W-300,28,180,14,0xeab308).setOrigin(0,0.5)

    // Controles
    this.keys = this.input.keyboard.addKeys({ left:'A', right:'D', up:'W', jump:'SPACE', light:'F', heavy:'G' })
    this.input.keyboard.on('keydown-R', ()=> this._resetRound())

    // IA timer
    this.cpuThink = 0

    // Timer HUD
    this.ticker = this.time.addEvent({
      delay:1000, loop:true, callback:()=>{
        if(this.ko) return
        this.timer = Math.max(0, this.timer-1)
        this.timerText.setText(String(this.timer).padStart(2,'0'))
        if(this.timer===0) this._endRound(this.p1.hp>=this.p2.hp?'player':'cpu')
      }
    })

    this.add.text(16,12,'Mover: A/D • Saltar: SPACE • Golpe: F • Pesado: G • Reiniciar: R',{ fontSize:12, color:'#e5e7eb' })
  }

  update(_,dtms){
    const dt = Math.min(dtms,32)/1000
    if(this.ko) return

    // P1 input
    const p = this.p1
    const press = k => this.keys[k] && this.keys[k].isDown
    p.dir = (press('right')?+1:0) + (press('left')?-1:0)
    if(p.canMove()){
      p.body.setVelocityX(p.dir!==0 ? 260*p.dir : 0)
      if(press('jump') && p.onGround()) p.jump()
    }
    if(Phaser.Input.Keyboard.JustDown(this.keys.light)) p.attack('light', this.p2, this)
    if(Phaser.Input.Keyboard.JustDown(this.keys.heavy)) p.attack('heavy', this.p2, this)

    // CPU fácil
    this.cpuThink -= dt
    if(this.cpuThink<=0){ this.cpuThink = 0.08 + Math.random()*0.06; this._cpuStep(this.p2,this.p1) }

    this.p1.tick(dt); this.p2.tick(dt)

    // Barras
    const W = 180
    this.p1hp.width = W * Math.max(0, this.p1.hp/100)
    this.p2hp.x = this.p2bar.x + (W * (1 - Math.max(0, this.p2.hp/100)))
    this.p2hp.width = W * Math.max(0, this.p2.hp/100)

    if(this.p1.hp<=0 && !this.ko) this._endRound('cpu')
    if(this.p2.hp<=0 && !this.ko) this._endRound('player')
  }

  _cpuStep(cpu, target){
    if(!cpu.canMove()) return
    const dist = Math.abs(target.body.x - cpu.body.x)
    const dir  = target.body.x > cpu.body.x ? +1 : -1
    cpu.facing = -dir
    if(dist>140) cpu.body.setVelocityX(240*dir)
    else if(dist<70) cpu.body.setVelocityX(-200*dir)
    else cpu.body.setVelocityX(0)
    if(!target.onGround() && cpu.onGround() && Math.random()<0.02) cpu.jump()
    if(dist<=100) cpu.attack(Math.random()<0.6?'light':'heavy', target, this)
  }

  _hitEffects(point, power=1){
    const emitter = this.add.particles(point.x, point.y, '__white', {
      speed:{min:20, max:80*power}, scale:{start:0.6+0.2*power, end:0}, alpha:{start:0.9,end:0},
      lifespan:220, quantity:6+4*power, tint:[0xffffff,0xeab308,0x22c55e]
    })
    emitter.explode(10+4*power)
    this.cameras.main.shake(90, 0.004*power)
    this.physics.world.isPaused = true
    this.time.delayedCall(60+60*power, ()=> this.physics.world.isPaused=false)
  }

  _endRound(winner){
    this.ko = true
    const key = 'games.duelo-sechin.stats'
    const stats = storage.get(key, { wins:0, losses:0 })
    if(winner==='player') stats.wins++; else stats.losses++
    storage.set(key, stats)
    this.owner.onEvent?.({ type:'round_end', winner, stats })

    const W = this.scale.width, H = this.scale.height
    this.add.rectangle(W/2,H/2,320,120,0x020617,0.92).setStrokeStyle(1,0xffffff,0.12)
    this.add.text(W/2,H/2-12,winner==='player'?'¡Victoria!':'Derrota',{ fontSize:22, color:'#eab308' }).setOrigin(0.5)
    this.add.text(W/2,H/2+22,'Presiona R para reiniciar',{ fontSize:12, color:'#e5e7eb' }).setOrigin(0.5)
    this.input.keyboard.once('keydown-R', ()=> this._resetRound())
  }

  _resetRound(){ this.scene.restart() }
}

// ---------------- Fighter ----------------
class Fighter {
  constructor(scene, opts){
    this.scene=scene; this.id=opts.id; this.facing=opts.facing??+1; this.palette=opts.palette??0xffffff
    this.hp=100; this.stun=0; this.comboStep=0; this.comboTimer=0

    // Sprite (atlas o fallback)
    let sprite
    if(opts.atlasKey){
      sprite = scene.add.sprite(opts.x, opts.y, opts.atlasKey, 'idle_0')
      ensureAnims(scene, opts.atlasKey)
    } else if (opts.singleKey){
      sprite = scene.add.image(opts.x, opts.y, opts.singleKey).setScale(0.66)
    } else {
      sprite = scene.add.rectangle(opts.x, opts.y, 46, 64, this.palette).setStrokeStyle(2, 0x0b0f19)
    }
    this.sprite=sprite; scene.physics.add.existing(sprite); this.body=sprite.body
    this.body.setSize(38,58).setOffset(-19,-29).setMaxVelocity(320,900).setDragX(1400)

    // “Arma” y hitbox
    this.weapon = scene.add.rectangle(opts.x, opts.y-10, 10, 40, 0xffffff, 0.25).setOrigin(0.5,1)
    scene.physics.add.existing(this.weapon); this.weapon.body.setAllowGravity(false)
    this.hitbox = scene.add.zone(opts.x, opts.y, 28, 26); scene.physics.add.existing(this.hitbox)
    this.hitbox.body.setAllowGravity(false); this.hitbox.active=false
  }

  onGround(){ return this.body.blocked.down }
  canMove(){ return this.stun<=0 && this.hp>0 }
  jump(){ this.body.setVelocityY(-560) }

  tick(dt){
    this.sprite.setFlipX(this.facing<0); this.weapon.setFlipX(this.facing<0)
    const frontX = this.sprite.x + (this.facing>0? +28 : -28)
    this.weapon.setPosition(frontX, this.sprite.y-6)
    this.hitbox.setPosition(this.weapon.x + (this.facing>0? +12 : -12), this.weapon.y-18)
    this.stun = Math.max(0, this.stun - dt)
    if(this.comboTimer>0) this.comboTimer = Math.max(0, this.comboTimer-dt); else this.comboStep=0
    if(this._hurtTint>0){ this._hurtTint-=dt; if(this._hurtTint<=0 && this.sprite.setTint) this.sprite.clearTint() }
  }

  attack(kind, target, scene){
    if(!this.canMove()) return
    const light = kind==='light'
    let dmg=light?8:14, kb=light?180:280, stun=light?0.18:0.32, windup=light?90:130, active=light?80:110, recovery=light?140:180

    // combo: L (step0→1), L (1→2), H (≥1→finisher)
    if(this.comboStep===0 && light) this.comboStep=1
    else if(this.comboStep===1 && light) this.comboStep=2
    else if(this.comboStep>=1 && !light) this.comboStep=3
    this.comboTimer=0.6

    scene.tweens.add({
      targets:this.weapon, angle:this.facing>0?-40:40, duration:windup, ease:'sine.inOut',
      onComplete:()=>{
        this.hitbox.active = true
        const endActive = ()=> this.hitbox.active=false
        scene.time.delayedCall(active, endActive)
        scene.tweens.add({ targets:this.weapon, angle:this.facing>0?+34:-34, duration:active, ease:'sine.in',
          onComplete:()=> scene.tweens.add({ targets:this.weapon, angle:0, duration:recovery, ease:'sine.out' })
        })
        const tryHit=()=>{
          if(!this.hitbox.active || this.hp<=0) return
          if(Phaser.Geom.Intersects.RectangleToRectangle(this.hitbox.getBounds(), target.sprite.getBounds())){
            this._dealDamage(target, dmg, kb, stun, scene); this.hitbox.active=false
          }
        }
        tryHit(); scene.time.delayedCall(active*0.33, tryHit); scene.time.delayedCall(active*0.66, tryHit)
      }
    })
  }

  _dealDamage(target, dmg, kb, stun, scene){
    if(target.hp<=0) return
    target.hp=Math.max(0,target.hp-dmg); target.stun=Math.max(target.stun,stun)
    target.body.setVelocityX(kb*this.facing); target.body.setVelocityY(-120)
    target._hurtTint=0.22; if(target.sprite.setTint) target.sprite.setTint(0xffffff)
    const p=new Phaser.Math.Vector2((this.sprite.x+target.sprite.x)/2,(this.sprite.y+target.sprite.y)/2-12)
    scene._hitEffects(p, dmg>=12?1.4:1)
    const sfx = scene.sound.get('sfx0') || scene.sound.get('sfx1'); if(sfx) scene.sound.play(sfx.key,{volume:0.6})
  }
}

// ---------------- util ----------------
function has(scene, key){ return scene.textures.exists(key) }
function safeLoadAtlas(scene, key, png, json){ try{ scene.load.atlas(key,png,json) }catch{} }
function safeLoadImage(scene, key, png){ try{ scene.load.image(key,png) }catch{} }
function ensureWhiteParticle(scene){
  if(scene.textures.exists('__white')) return
  const g = scene.make.graphics({x:0,y:0,add:false}); g.fillStyle(0xffffff,1); g.fillCircle(4,4,4)
  g.generateTexture('__white',8,8); g.destroy()
}
function ensureAnims(scene, atlas){
  const mk = (name, n, rate, rep=-1)=> {
    const key=`${atlas}-${name}`
    if(scene.anims.exists(key)) return
    const frames = Array.from({length:n},(_,i)=>({key:atlas, frame:`${name}_${i}`}))
    scene.anims.create({ key, frames, frameRate:rate, repeat:rep })
  }
  mk('idle',6,8,-1); mk('walk',8,10,-1); mk('atkL',4,16,0); mk('atkH',6,14,0); mk('hit',2,12,0); mk('ko',6,8,0)
}
