/// <reference path="../_definitions.ts" />

module Phaser.Renderer.Headless {

    export class HeadlessRenderer implements Phaser.IRenderer {

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        public game: Phaser.Game;
        public renderCount: number;

        public render() {
            //  Nothing, headless remember?
        }

        public renderGameObject(camera, object) {
            //  Nothing, headless remember?
        }

        public cameraRenderer;
        public groupRenderer;
        public spriteRenderer;
        public geometryRenderer;
        public scrollZoneRenderer;
        public tilemapRenderer;

    }

}