import React, { useRef, useEffect } from 'react';
import DueloSechin from '../index';

const GameCanvas = ({ onGameEnd }) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const game = new DueloSechin(canvas);
    gameRef.current = game;
    
    game.init();
    game.start();

    return () => {
      game.stop();
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border-2 border-yellow-600 rounded-lg shadow-lg"
      />
      <div className="absolute top-4 left-4 text-white font-bold text-lg">
        DUELO SECHÍN
      </div>
    </div>
  );
};

export default GameCanvas;