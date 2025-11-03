export default class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticles(config) {
    for (let i = 0; i < config.count; i++) {
      this.particles.push({
        x: config.x,
        y: config.y,
        vx: (Math.random() - 0.5) * config.spread,
        vy: (Math.random() - 0.5) * config.spread,
        life: config.life,
        maxLife: config.life,
        color: config.color,
        size: Math.random() * config.size + 1
      });
    }
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= deltaTime * 60;
      
      // Remover partículas muertas
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  renderBackground(ctx) {
    this.renderParticles(ctx, 'background');
  }

  renderForeground(ctx) {
    this.renderParticles(ctx, 'foreground');
  }

  renderParticles(ctx, type) {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}