export default class RealisticRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  renderCharacter(ctx, character) {
    ctx.save();
    
    if (character.facing === -1) {
      ctx.scale(-1, 1);
      ctx.translate(-character.position.x - character.size.width, character.position.y);
    } else {
      ctx.translate(character.position.x, character.position.y);
    }

    this.renderWarriorModern(ctx, character);
    
    // Debug: mostrar hitboxes
    if (process.env.NODE_ENV === 'development') {
      this.renderDebugInfo(ctx, character);
    }

    ctx.restore();
  }

  renderWarriorModern(ctx, warrior) {
    const { width, height } = warrior.size;
    
    // Cuerpo principal con sombras realistas
    this.renderBody(ctx, width, height, warrior);
    
    // Cabeza y rostro con detalles andinos
    this.renderHead(ctx, width, height, warrior);
    
    // Brazos y piernas dinámicas
    this.renderLimbs(ctx, width, height, warrior);
    
    // Equipamiento y armas
    this.renderEquipment(ctx, width, height, warrior);
    
    // Efectos de estado
    this.renderStateEffects(ctx, width, height, warrior);
  }

  renderBody(ctx, width, height, warrior) {
    // Torso con musculatura definida
    const torsoGradient = ctx.createLinearGradient(20, 30, 20, height * 0.6);
    
    if (warrior.type === 'player') {
      // Guerrero Sechín - tonos tierra
      torsoGradient.addColorStop(0, '#8B4513');
      torsoGradient.addColorStop(0.5, '#A0522D');
      torsoGradient.addColorStop(1, '#CD853F');
    } else {
      // Invasor - tonos oscuros
      torsoGradient.addColorStop(0, '#2F4F4F');
      torsoGradient.addColorStop(0.5, '#708090');
      torsoGradient.addColorStop(1, '#778899');
    }
    
    ctx.fillStyle = torsoGradient;
    
    // Torso musculado
    ctx.beginPath();
    ctx.ellipse(width/2, 80, 25, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Músculos pectorales
    ctx.beginPath();
    ctx.ellipse(width/2 - 15, 70, 12, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(width/2 + 15, 70, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Abdominales
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(width/2 - 20, 95 + i * 8, 40, 4);
    }
  }

  renderHead(ctx, width, height, warrior) {
    // Cabeza
    ctx.fillStyle = warrior.type === 'player' ? '#F5DEB3' : '#D2B48C';
    ctx.beginPath();
    ctx.arc(width/2, 40, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Rasgos faciales
    ctx.fillStyle = '#000000';
    
    // Ojos
    ctx.beginPath();
    ctx.arc(width/2 - 10, 35, 4, 0, Math.PI * 2);
    ctx.arc(width/2 + 10, 35, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Boca según estado
    if (warrior.state === 'attacking') {
      ctx.beginPath();
      ctx.arc(width/2, 50, 8, 0, Math.PI);
      ctx.stroke();
    } else {
      ctx.fillRect(width/2 - 5, 48, 10, 2);
    }
    
    // Tocado tradicional Sechín
    if (warrior.type === 'player') {
      const headdressGradient = ctx.createLinearGradient(width/2 - 30, 15, width/2 + 30, 15);
      headdressGradient.addColorStop(0, '#FFD700');
      headdressGradient.addColorStop(0.5, '#FFEC8B');
      headdressGradient.addColorStop(1, '#FFD700');
      
      ctx.fillStyle = headdressGradient;
      ctx.fillRect(width/2 - 30, 15, 60, 10);
      
      // Patrones geométricos
      ctx.fillStyle = '#8B0000';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(width/2 - 25 + i * 12, 17, 6, 6);
      }
    }
  }

  renderLimbs(ctx, width, height, warrior) {
    const frame = warrior.animationFrame;
    const state = warrior.state;
    
    // Brazos - animación según estado
    let leftArmAngle = -0.5;
    let rightArmAngle = 0.5;
    
    if (state === 'running') {
      leftArmAngle = Math.sin(frame * 0.5) * 0.8 - 0.5;
      rightArmAngle = Math.sin(frame * 0.5 + Math.PI) * 0.8 + 0.5;
    } else if (state === 'attacking') {
      rightArmAngle = -1.5 + Math.sin(warrior.stateTime * 20) * 0.5;
    } else if (state === 'blocking') {
      leftArmAngle = -1.2;
      rightArmAngle = -1.2;
    }
    
    this.renderArm(ctx, width/2 - 25, 70, leftArmAngle, warrior.type, 'left');
    this.renderArm(ctx, width/2 + 25, 70, rightArmAngle, warrior.type, 'right');
    
    // Piernas - animación
    let leftLegAngle = 0.2;
    let rightLegAngle = -0.2;
    
    if (state === 'running') {
      leftLegAngle = Math.sin(frame * 0.5) * 0.4 + 0.2;
      rightLegAngle = Math.sin(frame * 0.5 + Math.PI) * 0.4 - 0.2;
    } else if (state === 'jumping') {
      leftLegAngle = -0.3;
      rightLegAngle = -0.3;
    }
    
    this.renderLeg(ctx, width/2 - 15, height * 0.6, leftLegAngle, warrior.type);
    this.renderLeg(ctx, width/2 + 15, height * 0.6, rightLegAngle, warrior.type);
  }

  renderArm(ctx, x, y, angle, type, side) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const armGradient = ctx.createLinearGradient(0, 0, 0, 60);
    if (type === 'player') {
      armGradient.addColorStop(0, '#A0522D');
      armGradient.addColorStop(1, '#CD853F');
    } else {
      armGradient.addColorStop(0, '#708090');
      armGradient.addColorStop(1, '#778899');
    }
    
    ctx.fillStyle = armGradient;
    
    // Brazo superior
    ctx.fillRect(-8, 0, 16, 35);
    
    // Antebrazo
    ctx.translate(0, 35);
    ctx.fillRect(-6, 0, 12, 30);
    
    // Mano
    ctx.fillStyle = type === 'player' ? '#F5DEB3' : '#D2B48C';
    ctx.fillRect(-8, 30, 16, 12);
    
    // Arma o puño
    if (side === 'right' && this.isAttacking(angle)) {
      this.renderWeapon(ctx, type);
    }
    
    ctx.restore();
  }

  renderLeg(ctx, x, y, angle, type) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const legGradient = ctx.createLinearGradient(0, 0, 0, 70);
    if (type === 'player') {
      legGradient.addColorStop(0, '#8B4513');
      legGradient.addColorStop(1, '#A0522D');
    } else {
      legGradient.addColorStop(0, '#2F4F4F');
      legGradient.addColorStop(1, '#708090');
    }
    
    ctx.fillStyle = legGradient;
    
    // Muslo
    ctx.fillRect(-10, 0, 20, 40);
    
    // Pantorrilla
    ctx.translate(0, 40);
    ctx.fillRect(-8, 0, 16, 35);
    
    // Pie
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-12, 35, 24, 10);
    
    ctx.restore();
  }

  renderWeapon(ctx, type) {
    if (type === 'player') {
      // Macana tradicional Sechín con diseño moderno
      const weaponGradient = ctx.createLinearGradient(0, -20, 0, 20);
      weaponGradient.addColorStop(0, '#B8860B');
      weaponGradient.addColorStop(0.5, '#FFD700');
      weaponGradient.addColorStop(1, '#B8860B');
      
      ctx.fillStyle = weaponGradient;
      ctx.fillRect(5, -25, 30, 8);
      
      // Piedra afilada
      ctx.fillStyle = '#696969';
      ctx.beginPath();
      ctx.moveTo(35, -30);
      ctx.lineTo(50, -20);
      ctx.lineTo(35, -10);
      ctx.closePath();
      ctx.fill();
    } else {
      // Espada del invasor
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(5, -30, 25, 4);
      ctx.fillRect(28, -32, 15, 8);
    }
  }

  renderEquipment(ctx, width, height, warrior) {
    // Cinturón ceremonial
    const beltGradient = ctx.createLinearGradient(10, height * 0.5, width - 10, height * 0.5);
    beltGradient.addColorStop(0, '#8B0000');
    beltGradient.addColorStop(0.5, '#B22222');
    beltGradient.addColorStop(1, '#8B0000');
    
    ctx.fillStyle = beltGradient;
    ctx.fillRect(15, height * 0.5, width - 30, 8);
    
    // Adornos del cinturón
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(25 + i * 20, height * 0.5 - 3, 10, 14);
    }
    
    // Protecciones de cuero en piernas
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(width/2 - 25, height * 0.6 + 40, 16, 25);
    ctx.fillRect(width/2 + 9, height * 0.6 + 40, 16, 25);
  }

  renderStateEffects(ctx, width, height, warrior) {
    if (warrior.state === 'attacking') {
      // Efecto de velocidad/ataque
      ctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 50, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    if (warrior.isBlocking) {
      // Escudo de energía
      ctx.strokeStyle = 'rgba(0, 100, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 45, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    if (warrior.state === 'hit') {
      // Efecto de daño
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(0, 0, width, height);
    }
  }

  isAttacking(armAngle) {
    return armAngle < -1.0;
  }

  renderDebugInfo(ctx, warrior) {
    // Hitbox del personaje
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(warrior.hitbox.x - warrior.position.x, 
                  warrior.hitbox.y - warrior.position.y, 
                  warrior.hitbox.width, warrior.hitbox.height);
    
    // Hitbox de ataque
    if (warrior.attackHitbox) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.strokeRect(warrior.attackHitbox.x - warrior.position.x, 
                    warrior.attackHitbox.y - warrior.position.y, 
                    warrior.attackHitbox.width, warrior.attackHitbox.height);
    }
  }
}