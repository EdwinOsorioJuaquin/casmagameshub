class Player {
  constructor(config) {
    this.position = config.position;
    this.velocity = { x: 0, y: 0 };
    this.size = { width: 60, height: 120 };
    this.health = 100;
    this.facing = 1; // 1 derecha, -1 izquierda
    this.controls = config.controls;
    this.comboTimer = 0;
    this.currentCombo = [];
    this.isBlocking = false;
    
    // Estados de animación
    this.state = 'idle';
    this.animationFrame = 0;
  }

  update(input) {
    this.handleInput(input);
    this.updatePhysics();
    this.updateAnimation();
    this.updateComboTimer();
  }

  handleInput(input) {
    // Movimiento horizontal
    if (input.isPressed(this.controls.left)) {
      this.velocity.x = -5;
      this.facing = -1;
    } else if (input.isPressed(this.controls.right)) {
      this.velocity.x = 5;
      this.facing = 1;
    } else {
      this.velocity.x = 0;
    }

    // Salto
    if (input.isPressed(this.controls.jump) && this.isGrounded) {
      this.velocity.y = -15;
    }

    // Ataques
    if (input.isPressed(this.controls.light)) {
      this.executeAttack('light');
    } else if (input.isPressed(this.controls.heavy)) {
      this.executeAttack('heavy');
    }

    // Bloqueo
    this.isBlocking = input.isPressed(this.controls.block);
  }

  executeAttack(type) {
    if (this.comboTimer > 0) {
      this.currentCombo.push(type);
    } else {
      this.currentCombo = [type];
    }
    
    this.comboTimer = 15; // frames para siguiente input de combo
    
    const attack = this.getCurrentAttack();
    if (attack) {
      this.state = 'attacking';
      this.currentAttack = attack;
    }
  }

  getCurrentAttack() {
    const comboString = this.currentCombo.join('-');
    const attacks = {
      'light': { damage: 10, hitbox: { x: this.position.x + 50, y: this.position.y + 30, width: 40, height: 30 } },
      'light-light': { damage: 15, hitbox: { x: this.position.x + 50, y: this.position.y + 30, width: 40, height: 30 } },
      'light-light-heavy': { damage: 30, hitbox: { x: this.position.x + 50, y: this.position.y + 20, width: 60, height: 40 } }
    };

    return attacks[comboString] || attacks['light'];
  }

  takeDamage(damage) {
    if (!this.isBlocking) {
      this.health = Math.max(0, this.health - damage);
      this.state = 'hit';
    }
  }

  render(ctx) {
    // Renderizado moderno con gradientes y efectos
    ctx.save();
    
    if (this.facing === -1) {
      ctx.scale(-1, 1);
      ctx.translate(-this.position.x - this.size.width, this.position.y);
    } else {
      ctx.translate(this.position.x, this.position.y);
    }

    // Cuerpo del guerrero - diseño moderno Sechín
    this.renderWarriorBody(ctx);
    
    // Efectos de estado
    if (this.state === 'attacking') {
      this.renderAttackEffect(ctx);
    }
    if (this.isBlocking) {
      this.renderBlockEffect(ctx);
    }

    ctx.restore();
  }

  renderWarriorBody(ctx) {
    // Base del cuerpo - tonos tierra modernos
    const gradient = ctx.createLinearGradient(0, 0, 0, this.size.height);
    gradient.addColorStop(0, '#8B4513'); // Marrón oscuro
    gradient.addColorStop(1, '#654321'); // Marrón más oscuro
    
    ctx.fillStyle = gradient;
    ctx.fillRect(10, 10, this.size.width - 20, this.size.height - 20);
    
    // Detalles inspirados en guerreros Sechín
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(15, 15, this.size.width - 30, 20); // Cinturón
    
    // Patrones geométricos Sechín
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(25, 25, 10, 10); // Adorno dorado
    ctx.fillRect(45, 25, 10, 10); // Adorno dorado
    
    // Cabeza
    ctx.fillStyle = '#F5DEB3';
    ctx.beginPath();
    ctx.arc(this.size.width / 2, 0, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  renderAttackEffect(ctx) {
    ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
    ctx.fillRect(this.size.width - 10, 30, 30, 20);
  }

  renderBlockEffect(ctx) {
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, this.size.width - 10, this.size.height - 10);
  }
}

export default Player;