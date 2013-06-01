/// <reference path="../Game.ts" />

module Phaser {

    export interface IRenderer {

        render();
        renderGameObject(object);
        renderSprite(camera: Camera, sprite: Sprite): bool;
        renderScrollZone(camera: Camera, sprite: ScrollZone): bool;

    }

}