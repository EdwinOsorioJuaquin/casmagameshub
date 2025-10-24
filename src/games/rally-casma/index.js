import Phaser from 'phaser'


export async function loadRallyCasma(){ return RallyCasma }


class RallyCasma {
init(mount){
this.game = new Phaser.Game({
type: Phaser.AUTO,
parent: mount,
width: mount.clientWidth,
height: mount.clientHeight,
backgroundColor: '#0b0f19',
physics: { default: 'arcade', arcade: { debug: false } },
scene: {
preload(){ this.load.image('car','/assets/car.png') },
create(){ this.car = this.add.image(200,200,'car') },
update(){ /* control y checkpoint */ }
}
})
}
resize(w,h){ this.game.scale.resize(w,h) }
pause(){ this.game.scene.pause() }
resume(){ this.game.scene.resume() }
destroy(){ this.game.destroy(true) }
}