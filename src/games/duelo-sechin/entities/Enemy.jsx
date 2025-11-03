import Warrior from './Warrior';

export default class Enemy extends Warrior {
  constructor(config) {
    super(config);
    this.difficulty = config.difficulty;
    this.aiTimer = 0;
    this.attackCooldown = 0;
  }

  updateAI(player, deltaTime) {
    this.aiTimer += deltaTime;
    this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime * 60);
    
    const distance = Math.abs(this.position.x - player.position.x);
    
    // Comportamiento según dificultad
    switch (this.difficulty) {
      case 'easy':
        this.easyAI(player, distance);
        break;
      case 'medium':
        this.mediumAI(player, distance);
        break;
      case 'hard':
        this.hardAI(player, distance);
        break;
    }
    
    // Actualizar como warrior normal
    this.update({ isPressed: () => false }, deltaTime);
  }

  easyAI(player, distance) {
    if (distance < 200) {
      // Moverse aleatoriamente
      if (this.aiTimer % 2 < 0.1) {
        this.velocity.x = (Math.random() - 0.5) * 3;
      }
      
      // Atacar ocasionalmente
      if (distance < 100 && this.attackCooldown === 0 && Math.random() < 0.02) {
        this.executeAttack('light');
        this.attackCooldown = 60;
      }
    }
  }

  mediumAI(player, distance) {
    // Seguir al jugador
    const direction = player.position.x > this.position.x ? 1 : -1;
    this.velocity.x = direction * 4;
    this.facing = direction;
    
    // Patrones de ataque más inteligentes
    if (distance < 120 && this.attackCooldown === 0) {
      if (Math.random() < 0.03) {
        this.executeAttack('light');
        this.attackCooldown = 40;
      } else if (distance < 80 && Math.random() < 0.02) {
        this.executeAttack('heavy');
        this.attackCooldown = 50;
      }
    }
    
    // Bloquear ocasionalmente
    this.isBlocking = distance < 90 && Math.random() < 0.3;
  }

  hardAI(player, distance) {
    // IA avanzada con predicción de movimiento
    const playerSpeed = player.velocity.x;
    const predictedX = player.position.x + playerSpeed * 10;
    const direction = predictedX > this.position.x ? 1 : -1;
    
    this.velocity.x = direction * 5;
    this.facing = direction;
    
    // Ataques combinados y defensa inteligente
    if (distance < 130 && this.attackCooldown === 0) {
      if (player.state === 'attacking') {
        // Contraataque
        this.executeAttack('heavy');
        this.attackCooldown = 30;
      } else if (distance < 100) {
        // Combinaciones de ataques
        const attackType = Math.random() < 0.7 ? 'light' : 'heavy';
        this.executeAttack(attackType);
        this.attackCooldown = attackType === 'light' ? 25 : 35;
      }
    }
    
    // Bloqueo defensivo inteligente
    this.isBlocking = (player.state === 'attacking' && distance < 110) || 
                     (this.health < 30 && distance < 100);
  }
}