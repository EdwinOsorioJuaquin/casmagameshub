export class GameInterface {
/**
* @param {HTMLDivElement} mountNode - contenedor donde el juego crea su canvas/renderer
* @param {object} options - { save, onEvent }
*/
init(mountNode, options) {}
/** llamado por el shell cuando cambia el tamaño */
resize(width, height) {}
/** llamado por el shell cuando se pausa/reanuda */
pause() {}
resume() {}
/** liberar recursos */
destroy() {}
}