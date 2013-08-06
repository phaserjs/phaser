/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Plugin.ts" />

/**
* Phaser - Plugins - Camera FX - Scanlines
*
* Give your game that classic retro feel!
*/

module Phaser.Plugins.CameraFX {

    export class Scanlines extends Phaser.Plugin {

        constructor(game: Phaser.Game, parent) {

            super(game, parent);
            this.camera = parent;

        }

        public spacing: number = 4;
        public color: string = 'rgba(0, 0, 0, 0.3)';
        public camera: Phaser.Camera;

        public postRender() {

            this.game.stage.context.fillStyle = this.color;

            for (var y = this.camera.screenView.y; y < this.camera.screenView.height; y += this.spacing)
            {
                this.game.stage.context.fillRect(this.camera.screenView.x, y, this.camera.screenView.width, 1);
            }
        }

    }

}
