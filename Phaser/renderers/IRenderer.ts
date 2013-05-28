/// <reference path="../Game.ts" />

module Phaser {

    export interface IRenderer {

        //  properties
        _game: Game;

        //  methods
        render();
        renderSprite(camera: Camera, sprite: Sprite): bool;

    }

}