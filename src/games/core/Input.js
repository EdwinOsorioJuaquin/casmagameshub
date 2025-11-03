export class InputManager {
  constructor() {
    this.keys = new Map();
    this.mouse = { x: 0, y: 0, pressed: false };
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.keys.set(e.code, true);
    });

    document.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });

    document.addEventListener('mousemove', (e) => {
      const rect = document.querySelector('canvas').getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    document.addEventListener('mousedown', () => {
      this.mouse.pressed = true;
    });

    document.addEventListener('mouseup', () => {
      this.mouse.pressed = false;
    });
  }

  isPressed(key) {
    return this.keys.get(key) || false;
  }

  getMousePosition() {
    return { ...this.mouse };
  }
}