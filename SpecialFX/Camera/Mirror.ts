/// <reference path="../../build/phaser.d.ts" />

/**
* Phaser - FX - Camera - Mirror
*
* Creates a mirror effect for a camera.
* Can mirror the camera image horizontally, vertically or both with an optional fill color overlay.
*/

module Phaser.FX.Camera {

    export class Mirror {

        constructor(game: Game, parent: Phaser.Camera) {

            this._game = game;
            this._parent = parent;

            this._canvas = <HTMLCanvasElement> document.createElement('canvas');
            this._canvas.width = parent.width;
            this._canvas.height = parent.height;
            this._context = this._canvas.getContext('2d');

        }

        private _game: Game;
        private _parent: Phaser.Camera;
        private _canvas: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;

        private _sx: number;
        private _sy: number;
        private _mirrorX: number;
        private _mirrorY: number;
        private _mirrorWidth: number;
        private _mirrorHeight: number;
        private _mirrorColor: string = null;

        public flipX: bool = false;
        public flipY: bool = true;

        public x: number;
        public y: number;
        public cls: bool = false;

        /**
        * This is the rectangular region to grab from the Camera used in the Mirror effect
        * It is rendered to the Stage at Mirror.x/y (note the use of Stage coordinates, not World coordinates)
        */
        public start(x: number, y: number, region: Phaser.Rectangle, fillColor?: string = 'rgba(0, 0, 100, 0.5)') {

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

        /**
         * Post-render is called during the objects render cycle, after the children/image data has been rendered.
         * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
         */
        public postRender(camera: Phaser.Camera) {

            this._sx = camera.screenView.x + this._mirrorX;
            this._sy = camera.screenView.y + this._mirrorY;

            if (this.flipX == true && this.flipY == false)
            {
                this._sx = 0;
            }
            else if (this.flipY == true && this.flipX == false)
            {
                this._sy = 0;
            }
            
            this._context.drawImage(
                this._game.stage.canvas,	//	Source Image
                this._sx,                   //	Source X (location within the source image)
                this._sy,                   //	Source Y
                this._mirrorWidth,		    //	Source Width
                this._mirrorHeight,         //	Source Height
                0, 			                //	Destination X (where on the canvas it'll be drawn)
                0, 			                //	Destination Y
                this._mirrorWidth, 			//	Destination Width (always same as Source Width unless scaled)
                this._mirrorHeight          //	Destination Height (always same as Source Height unless scaled)
            );

            if (this._mirrorColor)
            {
                this._context.fillRect(0, 0, this._mirrorWidth, this._mirrorHeight);
            }

            if (this.flipX || this.flipY)
            {
                this._game.stage.context.save();
            }

            if (this.flipX && this.flipY)
            {
                this._game.stage.context.transform(-1, 0, 0, -1, this._mirrorWidth, this._mirrorHeight);
                this._game.stage.context.drawImage(this._canvas, -this.x, -this.y);
            }
            else if (this.flipX)
            {
                this._game.stage.context.transform(-1, 0, 0, 1, this._mirrorWidth, 0);
                this._game.stage.context.drawImage(this._canvas, -this.x, this.y);
            }
            else if (this.flipY)
            {
                this._game.stage.context.transform(1, 0, 0, -1, 0, this._mirrorHeight);
                this._game.stage.context.drawImage(this._canvas, this.x, -this.y);
            }

            if (this.flipX || this.flipY)
            {
                this._game.stage.context.restore();
            }

        }

    }

}
