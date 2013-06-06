/// <reference path="../Game.ts" />

module Phaser {

    export interface IRenderer {

        render();
        renderGameObject(object);
        renderSprite(camera: Camera, sprite: Sprite): bool;
        renderScrollZone(camera: Camera, sprite: ScrollZone): bool;
        renderCircle(camera: Camera, circle: Circle, context, outline?: bool, fill?: bool, lineColor?: string, fillColor?: string, lineWidth?: number);
        preRenderGroup(camera: Camera, group: Group);
        postRenderGroup(camera: Camera, group: Group);
        preRenderCamera(camera: Camera);
        postRenderCamera(camera: Camera);


    }

}