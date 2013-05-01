/// <reference path="../Game.d.ts" />
module Phaser {
    class Tile {
        constructor(game: Game, tilemap: Tilemap, index: number, width: number, height: number);
        private _game;
        public name: string;
        public mass: number;
        public width: number;
        public height: number;
        public allowCollisions: number;
        public collideLeft: bool;
        public collideRight: bool;
        public collideUp: bool;
        public collideDown: bool;
        public tilemap: Tilemap;
        public index: number;
        public destroy(): void;
        public setCollision(collision: number, resetCollisions: bool): void;
        public resetCollision(): void;
        public toString(): string;
    }
}
