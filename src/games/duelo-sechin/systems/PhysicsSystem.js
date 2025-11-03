export default class PhysicsSystem {
  constructor() {
    this.gravity = 0.8;
    this.friction = 0.85;
    this.groundLevel = 350;
  }

  update(entities, deltaTime) {
    entities.forEach(entity => {
      // Aplicar gravedad
      if (!entity.isGrounded) {
        entity.velocity.y += this.gravity;
      }

      // Actualizar posición
      entity.position.x += entity.velocity.x;
      entity.position.y += entity.velocity.y;

      // Colisión con el suelo
      if (entity.position.y + entity.size.height > this.groundLevel) {
        entity.position.y = this.groundLevel - entity.size.height;
        entity.velocity.y = 0;
        entity.isGrounded = true;
      } else {
        entity.isGrounded = false;
      }

      // Fricción en el aire
      if (!entity.isGrounded) {
        entity.velocity.x *= this.friction;
      }

      // Limites de la pantalla
      if (entity.position.x < 0) {
        entity.position.x = 0;
        entity.velocity.x = 0;
      } else if (entity.position.x + entity.size.width > 800) {
        entity.position.x = 800 - entity.size.width;
        entity.velocity.x = 0;
      }
    });
  }
}