/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Plugin.ts" />

/**
* Phaser - Plugins - Camera FX - Shadow
*
* Creates a drop shadow effect on the camera window.
*/

module Phaser.Plugins.CameraFX {

    export class Shadow extends Phaser.Plugin {

        constructor(game: Phaser.Game, parent) {

            super(game, parent);
            this.camera = parent;

        }

        public camera: Phaser.Camera;

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
         * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
         * It happens directly AFTER a canvas context.save has happened if added to a Camera.
         */
        public preRender() {

            //  Shadow
            if (this.showShadow == true)
            {
                this.game.stage.context.shadowColor = this.shadowColor;
                this.game.stage.context.shadowBlur = this.shadowBlur;
                this.game.stage.context.shadowOffsetX = this.shadowOffset.x;
                this.game.stage.context.shadowOffsetY = this.shadowOffset.y;
            }

        }

        /**
         * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
         */
        public render() {

            //  Shadow off
            if (this.showShadow == true)
            {
                this.game.stage.context.shadowBlur = 0;
                this.game.stage.context.shadowOffsetX = 0;
                this.game.stage.context.shadowOffsetY = 0;
            }

        }

    }

}
