/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../geom/Circle.ts" />

/**
* Phaser - PixelUtils
*
* A collection of methods useful for manipulating pixels.
*/

module Phaser {

    export class PixelUtils {

        static boot() {

            PixelUtils.pixelCanvas = <HTMLCanvasElement> document.createElement('canvas');
            PixelUtils.pixelCanvas.width = 1;
            PixelUtils.pixelCanvas.height = 1;
            PixelUtils.pixelContext = PixelUtils.pixelCanvas.getContext('2d');

        }

        /**
         * Canvas element used in 1x1 pixel checks.
         * @type {HTMLCanvasElement}
         */
        static pixelCanvas: HTMLCanvasElement;

        /**
         * Render context of pixelCanvas
         * @type {CanvasRenderingContext2D}
         */
        static pixelContext: CanvasRenderingContext2D;

        static getPixel(key: string, x: number, y: number): number {

            //  write out a single pixel (won't help with rotated sprites though.. hmm)

            var imageData = PixelUtils.pixelContext.getImageData(0, 0, 1, 1);

            return ColorUtils.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);

        }

    }

}