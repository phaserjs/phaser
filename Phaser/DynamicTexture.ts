/// <reference path="Game.ts" />

/**
* Phaser - DynamicTexture
*
* A DynamicTexture can be thought of as a mini canvas into which you can draw anything.
* Game Objects can be assigned a DynamicTexture, so when they render in the world they do so
* based on the contents of the texture at the time. This allows you to create powerful effects
* once and have them replicated across as many game objects as you like.
*/

module Phaser {

    export class DynamicTexture {

        /**
         * DynamicTexture constructor
         * Create a new <code>DynamicTexture</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param width {number} Init width of this texture.
         * @param height {number} Init height of this texture.
         */
        constructor(game: Game, width: number, height: number) {

            this._game = game;

            this.canvas = <HTMLCanvasElement> document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');

            this.bounds = new Rectangle(0, 0, width, height);

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;

        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;

        //  Input / Output nodes?

        /**
         * Bound of this texture with width and height info.
         * @type {Rectangle}
         */
        public bounds: Rectangle;
        /**
         * This class is actually a wrapper of canvas.
         * @type {HTMLCanvasElement}
         */
        public canvas: HTMLCanvasElement;
        /**
         * Canvas context of this object.
         * @type {CanvasRenderingContext2D}
         */
        public context: CanvasRenderingContext2D;

        /**
         * Get a color of a specific pixel.
         * @param x {number} X position of the pixel in this texture.
         * @param y {number} Y position of the pixel in this texture.
         * @return {number} A native color value integer (format: 0xRRGGBB)
         */
        public getPixel(x: number, y: number): number {

            //r = imageData.data[0];
            //g = imageData.data[1];
            //b = imageData.data[2];
            //a = imageData.data[3];
            var imageData = this.context.getImageData(x, y, 1, 1);

            return this.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);

        }

        /**
         * Get a color of a specific pixel (including alpha value).
         * @param x {number} X position of the pixel in this texture.
         * @param y {number} Y position of the pixel in this texture.
         * @return  A native color value integer (format: 0xAARRGGBB)
         */
        public getPixel32(x: number, y: number) {

            var imageData = this.context.getImageData(x, y, 1, 1);

            return this.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);

        }

        /**
         * Get pixels in array in a specific rectangle.
         * @param rect {Rectangle} The specific rectangle.
         * @returns {array} CanvasPixelArray.
         */
        public getPixels(rect: Rectangle) {

            return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);

        }

        /**
         * Set color of a specific pixel.
         * @param x {number} X position of the target pixel.
         * @param y {number} Y position of the target pixel.
         * @param color {number} Native integer with color value. (format: 0xRRGGBB)
         */
        public setPixel(x: number, y: number, color: number) {

            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);

        }

        /**
         * Set color (with alpha) of a specific pixel.
         * @param x {number} X position of the target pixel.
         * @param y {number} Y position of the target pixel.
         * @param color {number} Native integer with color value. (format: 0xAARRGGBB)
         */
        public setPixel32(x: number, y: number, color: number) {

            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);

        }

        /**
         * Set image data to a specific rectangle.
         * @param rect {Rectangle} Target rectangle.
         * @param input {object} Source image data.
         */
        public setPixels(rect: Rectangle, input) {

            this.context.putImageData(input, rect.x, rect.y);

        }

        /**
         * Fill a given rectangle with specific color.
         * @param rect {Rectangle} Target rectangle you want to fill.
         * @param color {number} A native number with color value. (format: 0xRRGGBB)
         */
        public fillRect(rect: Rectangle, color: number) {

            this.context.fillStyle = color;
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);

        }

        /**
         *
         */
        public pasteImage(key: string, frame?: number = -1, destX?: number = 0, destY?: number = 0, destWidth?: number = null, destHeight?: number = null) {

            var texture = null;
            var frameData;

            this._sx = 0;
            this._sy = 0;
            this._dx = destX;
            this._dy = destY;

            //  TODO - Load a frame from a sprite sheet, otherwise we'll draw the whole lot
            if (frame > -1)
            {
                //if (this._game.cache.isSpriteSheet(key))
                //{
                //    texture = this._game.cache.getImage(key);
                //this.animations.loadFrameData(this._game.cache.getFrameData(key));
                //}
            }
            else
            {
                texture = this._game.cache.getImage(key);
                this._sw = texture.width;
                this._sh = texture.height;
                this._dw = texture.width;
                this._dh = texture.height;
            }

            if (destWidth !== null)
            {
                this._dw = destWidth;
            }

            if (destHeight !== null)
            {
                this._dh = destHeight;
            }

            if (texture != null)
            {
                this.context.drawImage(
                    texture,        //  Source Image
                    this._sx,       //  Source X (location within the source image)
                    this._sy,       //  Source Y
                    this._sw,       //  Source Width
                    this._sh,       //  Source Height
                    this._dx,       //  Destination X (where on the canvas it'll be drawn)
                    this._dy,       //  Destination Y
                    this._dw,       //  Destination Width (always same as Source Width unless scaled)
                    this._dh        //  Destination Height (always same as Source Height unless scaled)
                );
            }

        }

        //  TODO - Add in support for: alphaBitmapData: BitmapData = null, alphaPoint: Point = null, mergeAlpha: bool = false
        /**
         * Copy pixel from another DynamicTexture to this texture.
         * @param sourceTexture {DynamicTexture} Source texture object.
         * @param sourceRect {Rectangle} The specific region rectangle to be copied to this in the source.
         * @param destPoint {Point} Top-left point the target image data will be paste at.
         */
        public copyPixels(sourceTexture: DynamicTexture, sourceRect: Rectangle, destPoint: Point) {

            //  Swap for drawImage if the sourceRect is the same size as the sourceTexture to avoid a costly getImageData call
            if (sourceRect.equals(this.bounds) == true)
            {
                this.context.drawImage(sourceTexture.canvas, destPoint.x, destPoint.y);
            }
            else
            {
                this.context.putImageData(sourceTexture.getPixels(sourceRect), destPoint.x, destPoint.y);
            }

        }

        /**
         * Clear the whole canvas.
         */
        public clear() {

            this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);

        }

        public get width(): number {
            return this.bounds.width;
        }

        public get height(): number {
            return this.bounds.height;
        }

        /**
         * Given an alpha and 3 color values this will return an integer representation of it
         *
         * @param alpha {number} The Alpha value (between 0 and 255)
         * @param red   {number} The Red channel value (between 0 and 255)
         * @param green {number} The Green channel value (between 0 and 255)
         * @param blue  {number} The Blue channel value (between 0 and 255)
         *
         * @return  A native color value integer (format: 0xAARRGGBB)
         */
        private getColor32(alpha: number, red: number, green: number, blue: number): number {

            return alpha << 24 | red << 16 | green << 8 | blue;

        }

        /**
         * Given 3 color values this will return an integer representation of it
         *
         * @param red   {number} The Red channel value (between 0 and 255)
         * @param green {number} The Green channel value (between 0 and 255)
         * @param blue  {number} The Blue channel value (between 0 and 255)
         *
         * @return  A native color value integer (format: 0xRRGGBB)
         */
        private getColor(red: number, green: number, blue: number): number {

            return red << 16 | green << 8 | blue;

        }

    }

}