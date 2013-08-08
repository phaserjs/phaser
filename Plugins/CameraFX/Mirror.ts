/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/core/Plugin.ts" />

/**
* Phaser - Plugins - Camera FX - Mirrir
*
* Give your game that classic retro feel!
*/

module Phaser.Plugins.CameraFX {

    export class Mirror extends Phaser.Plugin {

        constructor(game: Phaser.Game, parent) {

            super(game, parent);
            this.camera = parent;

            this._canvas = <HTMLCanvasElement> document.createElement('canvas');
            this._canvas.width = parent.width;
            this._canvas.height = parent.height;
            this._context = this._canvas.getContext('2d');

        }

        private _canvas: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;

        private _sx: number;
        private _sy: number;
        private _mirrorX: number;
        private _mirrorY: number;
        private _mirrorWidth: number;
        private _mirrorHeight: number;
        private _mirrorColor: string = null;

        public camera: Phaser.Camera;

        public flipX: boolean = false;
        public flipY: boolean = true;

        public x: number;
        public y: number;
        public cls: boolean = false;

        /**
        * This is the rectangular region to grab from the Camera used in the Mirror effect
        * It is rendered to the Stage at Mirror.x/y (note the use of Stage coordinates, not World coordinates)
        */
        public start(x: number, y: number, region: Phaser.Rectangle, fillColor: string = 'rgba(0, 0, 100, 0.5)') {

            this.x = x;
            this.y = y;

            this._mirrorX = region.x;
            this._mirrorY = region.y;
            this._mirrorWidth = region.width;
            this._mirrorHeight = region.height;

            if (fillColor)
            {
                this._mirrorColor = fillColor;
                this._context.fillStyle = this._mirrorColor;
            }

        }

        public postRender() {

            this._sx = this.camera.screenView.x + this._mirrorX;
            this._sy = this.camera.screenView.y + this._mirrorY;

            if (this.flipX == true && this.flipY == false)
            {
                this._sx = 0;
            }
            else if (this.flipY == true && this.flipX == false)
            {
                this._sy = 0;
            }
            
            this._context.drawImage(
                this.game.stage.canvas,
                this._sx,
                this._sy,
                this._mirrorWidth,
                this._mirrorHeight,
                0,
                0,
                this._mirrorWidth,
                this._mirrorHeight
            );

            if (this._mirrorColor)
            {
                this._context.fillRect(0, 0, this._mirrorWidth, this._mirrorHeight);
            }

            if (this.flipX || this.flipY)
            {
                this.game.stage.context.save();
            }

            if (this.flipX && this.flipY)
            {
                this.game.stage.context.transform(-1, 0, 0, -1, this._mirrorWidth, this._mirrorHeight);
                this.game.stage.context.drawImage(this._canvas, -this.x, -this.y);
            }
            else if (this.flipX)
            {
                this.game.stage.context.transform(-1, 0, 0, 1, this._mirrorWidth, 0);
                this.game.stage.context.drawImage(this._canvas, -this.x, this.y);
            }
            else if (this.flipY)
            {
                this.game.stage.context.transform(1, 0, 0, -1, 0, this._mirrorHeight);
                this.game.stage.context.drawImage(this._canvas, this.x, -this.y);
            }

            if (this.flipX || this.flipY)
            {
                this.game.stage.context.restore();
            }

        }

    }

}
