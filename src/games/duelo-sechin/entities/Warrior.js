export default class Warrior {
  constructor(config) {
    this.position = config.position;
    this.velocity = { x: 0, y: 0 };
    this.size = { width: 80, height: 160 };
    this.health = 100;
    this.facing = 1;
    this.controls = config.controls;
    this.type = config.type;
    
    // Sistema de combate
    this.comboTimer = 0;
    this.currentCombo = [];
    this.currentAttack = null;
    this.isBlocking = false;
    
    // Estados y animaciones
    this.state = 'idle';
    this.animationFrame = 0;
    this.stateTime = 0;
    
    // Física
    this.isGrounded = false;
    this.jumpForce = -18;
    this.speed = 6;
    
    // Hitboxes
    this.updateHitboxes();
  }

  update(input, deltaTime) {
    this.stateTime += deltaTime;
    this.handleInput(input);
    this.updateCombat();
    this.updateAnimation();
    this.updateHitboxes();
  }

  handleInput(input) {
    // Movimiento horizontal
    if (input.isPressed(this.controls.left)) {
      this.velocity.x = -this.speed;
      this.facing = -1;
    } else if (input.isPressed(this.controls.right)) {
      this.velocity.x = this.speed;
      this.facing = 1;
    } else {
      this.velocity.x *= 0.8; // Fricción
    }

    // Salto
    if (input.isPressed(this.controls.jump) && this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      this.state = 'jumping';
    }

    // Ataques
    if (input.isPressed(this.controls.light)) {
      this.executeAttack('light');
    } else if (input.isPressed(this.controls.heavy)) {
      this.executeAttack('heavy');
    }

    // Bloqueo
    this.isBlocking = input.isPressed(this.controls.block);
    
    // Actualizar estado
    if (this.state !== 'attacking' && this.state !== 'hit') {
      if (!this.isGrounded) {
        this.state = 'jumping';
      } else if (Math.abs(this.velocity.x) > 0.1) {
        this.state = 'running';
      } else {
        this.state = 'idle';
      }
    }
  }

  executeAttack(type) {
    if (this.state === 'attacking') return;
    
    if (this.comboTimer > 0) {
      this.currentCombo.push(type);
    } else {
      this.currentCombo = [type];
    }
    
    this.comboTimer = 20;
    this.state = 'attacking';
    this.stateTime = 0;
    this.currentAttack = this.getCurrentAttack();
  }

  getCurrentAttack() {
    const comboString = this.currentCombo.join('-');
    const baseX = this.position.x + (this.facing === 1 ? 60 : -40);
    
    const attacks = {
      'light': { 
        damage: 12, 
        hitbox: { x: baseX, y: this.position.y + 60, width: 50, height: 30 },
        duration: 15
      },
      'heavy': { 
        damage: 20, 
        hitbox: { x: baseX, y: this.position.y + 50, width: 70, height: 40 },
        duration: 25
      },
      'light-light': { 
        damage: 18, 
        hitbox: { x: baseX, y: this.position.y + 55, width: 55, height: 35 },
        duration: 18
      },
      'light-heavy': { 
        damage: 25, 
        hitbox: { x: baseX, y: this.position.y + 45, width: 65, height: 45 },
        duration: 22
      }
    };

    return attacks[comboString] || attacks['light'];
  }

  updateCombat() {
    // Timer de combo
    if (this.comboTimer > 0) {
      this.comboTimer--;
    } else {
      this.currentCombo = [];
    }

    // Finalizar ataque
    if (this.state === 'attacking' && this.stateTime * 60 > this.currentAttack.duration) {
      this.state = 'idle';
      this.currentAttack = null;
    }
  }

  updateAnimation() {
    this.animationFrame = Math.floor(this.stateTime * 10) % 4;
  }

  updateHitboxes() {
    // Hitbox del personaje
    this.hitbox = {
      x: this.position.x + 15,
      y: this.position.y + 20,
      width: this.size.width - 30,
      height: this.size.height - 20
    };

    // Hitbox de ataque si está atacando
    if (this.currentAttack) {
      this.attackHitbox = { ...this.currentAttack.hitbox };
    } else {
      this.attackHitbox = null;
    }
  }

  takeDamage(damage) {
    if (this.isBlocking) {
      damage *= 0.3; // Reducción por bloqueo
    }
    
    this.health = Math.max(0, this.health - damage);
    this.state = 'hit';
    this.stateTime = 0;
  }

  applyKnockback(force, direction) {
    this.velocity.x = force * direction;
    this.velocity.y = -8;
  }
}