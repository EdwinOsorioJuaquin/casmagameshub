export class InputManager {
constructor(bindings){
this.bindings = bindings || {
left: ['ArrowLeft','KeyA'], right: ['ArrowRight','KeyD'], up: ['ArrowUp','KeyW'], down: ['ArrowDown','KeyS'], jump: ['Space'], action: ['KeyF']
}
this.state = new Map()
this._down = this._down.bind(this)
this._up = this._up.bind(this)
}
attach(){ window.addEventListener('keydown', this._down); window.addEventListener('keyup', this._up) }
detach(){ window.removeEventListener('keydown', this._down); window.removeEventListener('keyup', this._up) }
_down(e){ this._set(e.code,true) }
_up(e){ this._set(e.code,false) }
_set(code,v){ for(const [name,keys] of Object.entries(this.bindings)){ if(keys.includes(code)) this.state.set(name,v) } }
pressed(name){ return !!this.state.get(name) }
}