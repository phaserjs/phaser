/// <reference path="../Game.ts" />
/// <reference path="../core/Point.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../core/Circle.ts" />
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
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderSpriteInfo(sprite: Sprite, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            DebugUtils.game.stage.context.fillStyle = color;
            DebugUtils.game.stage.context.fillText('Sprite: ' + ' (' + sprite.frameBounds.width + ' x ' + sprite.frameBounds.height + ')', x, y);
            DebugUtils.game.stage.context.fillText('x: ' + sprite.frameBounds.x.toFixed(1) + ' y: ' + sprite.frameBounds.y.toFixed(1) + ' angle: ' + sprite.angle.toFixed(1), x, y + 14);
            //DebugUtils.game.stage.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            //DebugUtils.game.stage.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);

        }

    }

}