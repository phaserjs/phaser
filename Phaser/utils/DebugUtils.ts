/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../geom/Circle.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="RectangleUtils.ts" />

/**
* Phaser - DebugUtils
*
* A collection of methods for displaying debug information about game objects.
*/

module Phaser {

    export class DebugUtils {

        static game: Game;

        /**
         * Render context of stage's canvas.
         * @type {CanvasRenderingContext2D}
         */
        static context: CanvasRenderingContext2D;

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderSpriteInfo(sprite: Sprite, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            DebugUtils.context.fillStyle = color;
            DebugUtils.context.fillText('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') origin: ' + sprite.transform.origin.x + ' x ' + sprite.transform.origin.y, x, y);
            DebugUtils.context.fillText('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1), x, y + 14);
            DebugUtils.context.fillText('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right, x, y + 28);
            DebugUtils.context.fillText('sx: ' + sprite.transform.scale.x.toFixed(1) + ' sy: ' + sprite.transform.scale.y.toFixed(1), x, y + 42);
            DebugUtils.context.fillText('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1), x, y + 56);
            DebugUtils.context.fillText('cx: ' + sprite.cameraView.x + ' cy: ' + sprite.cameraView.y + ' cw: ' + sprite.cameraView.width + ' ch: ' + sprite.cameraView.height + ' cb: ' + sprite.cameraView.bottom + ' cr: ' + sprite.cameraView.right, x, y + 70);
            DebugUtils.context.fillText('inCamera: ' + DebugUtils.game.renderer.inCamera(DebugUtils.game.camera, sprite), x, y + 84);

        }

        static renderSpriteBounds(sprite: Sprite, camera?: Camera = null, color?: string = 'rgba(0,255,0,0.2)') {

            if (camera == null)
            {
                camera = DebugUtils.game.camera;
            }

            var dx = sprite.worldView.x;
            var dy = sprite.worldView.y;

            DebugUtils.context.fillStyle = color;
            DebugUtils.context.fillRect(dx, dy, sprite.width, sprite.height);

        }

        static renderRectangle(rect: Phaser.Rectangle, fillStyle: string = 'rgba(0,255,0,0.3)') {

            DebugUtils.context.fillStyle = fillStyle;
            DebugUtils.context.fillRect(rect.x, rect.y, rect.width, rect.height);

        }

        static renderCircle(circle: Phaser.Circle, fillStyle: string = 'rgba(0,255,0,0.3)') {

            DebugUtils.context.fillStyle = fillStyle;
            DebugUtils.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            DebugUtils.context.fill();

        }

        /**
         * Render text
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderText(text: string, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            DebugUtils.context.font = '16px Courier';
            DebugUtils.context.fillStyle = color;
            DebugUtils.context.fillText(text, x, y);

        }

    }

}