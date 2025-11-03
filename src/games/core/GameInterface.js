export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.running = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    
    // Configuración de renderizado de alta calidad
    this.setHighQualityRendering();
  }

  setHighQualityRendering() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  start() {
    this.running = true;
    this.gameLoop();
  }

  stop() {
    this.running = false;
  }

  gameLoop = (currentTime = 0) => {
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.running) {
      this.update(this.deltaTime);
      this.render();
      requestAnimationFrame(this.gameLoop);
    }
  }

  update(deltaTime) {
    // Sobrescribir en subclases
  }

  render() {
    // Sobrescribir en subclases
  }
}