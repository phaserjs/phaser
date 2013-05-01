/// <reference path="../Game.d.ts" />
/// <reference path="Sprite.d.ts" />
module Phaser {
    class Particle extends Sprite {
        constructor(game: Game);
        public lifespan: number;
        public friction: number;
        public update(): void;
        public onEmit(): void;
    }
}
