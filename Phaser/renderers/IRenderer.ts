/// <reference path="../Game.ts" />

module Phaser {

    export interface IRenderer {

        render();
        renderSprite(camera: Camera, sprite: Sprite): bool;

    }

}