/// <reference path="../../build/phaser.d.ts" />

/**
* Phaser - FX - Camera - Border
*
* Creates a border around a camera.
*/

module Phaser.FX.Camera {

    export class Border {

        constructor(game: Game, parent: Camera) {

            this._game = game;
            this._parent = parent;

        }

        private _game: Game;
        private _parent: Camera;

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

        /**
        * You can name the function that starts the effect whatever you like, but we used 'start' in our effects.
        */
        public start() {
        }

        /**
         * Post-render is called during the objects render cycle, after the children/image data has been rendered.
         * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
         */
        public postRender(camera: Phaser.Camera) {

            if (this.showBorder == true)
            {
                this._game.stage.context.strokeStyle = this.borderColor;
                this._game.stage.context.lineWidth = 1;
                this._game.stage.context.rect(camera.x, camera.y, camera.width, camera.height);
                this._game.stage.context.stroke();
            }

        }

    }

}
