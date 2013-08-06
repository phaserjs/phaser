/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Plugin.ts" />

/**
* Phaser - Plugins - Camera FX - Border
*
* Creates a border around a camera.
*/

module Phaser.Plugins.CameraFX {

    export class Border extends Phaser.Plugin {

        constructor(game: Phaser.Game, parent) {

            super(game, parent);
            this.camera = parent;

        }

        public camera: Phaser.Camera;

        /**
         * Whether render border of this camera or not. (default is false)
         * @type {boolean}
         */
        public showBorder: bool = false;

        /**
         * Color of border of this camera. (in css color string)
         * @type {string}
         */
        public borderColor: string = 'rgb(255,255,255)';

        public postRender() {

            if (this.showBorder == true)
            {
                this.game.stage.context.strokeStyle = this.borderColor;
                this.game.stage.context.lineWidth = 1;
                this.game.stage.context.rect(this.camera.x, this.camera.y, this.camera.width, this.camera.height);
                this.game.stage.context.stroke();
            }

        }

    }

}
