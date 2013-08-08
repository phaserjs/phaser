/// <reference path="../Game.ts" />

module Phaser {

    export interface IRenderer {

        render();

        renderCount: number;

        renderGameObject;

        cameraRenderer;
        groupRenderer;
        spriteRenderer;
        geometryRenderer;
        scrollZoneRenderer;
        tilemapRenderer;

    }

}