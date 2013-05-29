/// <reference path="../../build/phaser.d.ts" />

/**
* Phaser - FX - Camera - Shadow
*
* Creates a drop-shadow effect on the camera window.
*/

module Phaser.FX.Camera {

    export class Shadow {

        constructor(game: Game, parent: Camera) {

            this._game = game;
            this._parent = parent;

        }

        private _game: Game;
        private _parent: Camera;

        /**
         * Render camera shadow or not. (default is false)
         * @type {boolean}
         */
        public showShadow: bool = false;

        /**
         * Color of shadow, in css color string.
         * @type {string}
         */
        public shadowColor: string = 'rgb(0,0,0)';

        /**
         * Blur factor of shadow.
         * @type {number}
         */
        public shadowBlur: number = 10;

        /**
         * Offset of the shadow from camera's position.
         * @type {Point}
         */
        public shadowOffset: Point = new Point(4, 4);

        /**
        * You can name the function that starts the effect whatever you like, but we used 'start' in our effects.
        */
        public start() {
        }

        /**
         * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
         * It happens directly AFTER a canvas context.save has happened if added to a Camera.
         */
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            //  Shadow
            if (this.showShadow == true)
            {
                this._game.stage.context.shadowColor = this.shadowColor;
                this._game.stage.context.shadowBlur = this.shadowBlur;
                this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
                this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
            }

        }

        /**
         * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
         */
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number) {

            //  Shadow off
            if (this.showShadow == true)
            {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }

        }

    }

}
