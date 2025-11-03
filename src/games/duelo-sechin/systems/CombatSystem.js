export default class CombatSystem {
  constructor() {
    this.activeHits = new Set();
  }

  resolveCombat(player, enemy) {
    // Verificar ataques del jugador
    if (player.attackHitbox && this.checkCollision(player.attackHitbox, enemy.hitbox)) {
      this.applyHit(player, enemy);
    }

    // Verificar ataques del enemigo
    if (enemy.attackHitbox && this.checkCollision(enemy.attackHitbox, player.hitbox)) {
      this.applyHit(enemy, player);
    }
  }

  applyHit(attacker, defender) {
    const hitId = `${attacker.type}-${defender.type}-${Date.now()}`;
    
    // Evitar hits múltiples en el mismo ataque
    if (this.activeHits.has(hitId)) return;
    this.activeHits.add(hitId);
    
    setTimeout(() => this.activeHits.delete(hitId), 200);

    const damage = attacker.currentAttack.damage;
    defender.takeDamage(damage);
    
    // Aplicar knockback
    const knockbackForce = damage * 0.5;
    defender.applyKnockback(knockbackForce, attacker.facing);
    
    // Efectos visuales
    this.createHitEffects(attacker, defender);
  }

  createHitEffects(attacker, defender) {
    // Aquí se integrará con el sistema de partículas
    const hitPosition = {
      x: (attacker.position.x + defender.position.x) / 2,
      y: (attacker.position.y + defender.position.y) / 2
    };
    
    // Efectos de partículas serán manejados por el sistema principal
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
}