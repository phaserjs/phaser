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
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderSpriteInfo(sprite: Sprite, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            DebugUtils.game.stage.context.fillStyle = color;
            DebugUtils.game.stage.context.fillText('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') origin: ' + sprite.transform.origin.x + ' x ' + sprite.transform.origin.y, x, y);
            DebugUtils.game.stage.context.fillText('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1), x, y + 14);
            DebugUtils.game.stage.context.fillText('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right, x, y + 28);
            DebugUtils.game.stage.context.fillText('sx: ' + sprite.transform.scale.x.toFixed(1) + ' sy: ' + sprite.transform.scale.y.toFixed(1), x, y + 42);
            DebugUtils.game.stage.context.fillText('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1), x, y + 56);
            DebugUtils.game.stage.context.fillText('cx: ' + sprite.cameraView.x + ' cy: ' + sprite.cameraView.y + ' cw: ' + sprite.cameraView.width + ' ch: ' + sprite.cameraView.height + ' cb: ' + sprite.cameraView.bottom + ' cr: ' + sprite.cameraView.right, x, y + 70);
            DebugUtils.game.stage.context.fillText('inCamera: ' + DebugUtils.game.renderer.inCamera(DebugUtils.game.camera, sprite), x, y + 84);

        }

        static renderSpriteBounds(sprite: Sprite, camera?: Camera = null, color?: string = 'rgba(0,255,0,0.2)') {

            if (camera == null)
            {
                camera = DebugUtils.game.camera;
            }

            //var dx = (camera.screenView.x * sprite.transform.scrollFactor.x) + sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
            //var dy = (camera.screenView.y * sprite.transform.scrollFactor.y) + sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
            var dx = sprite.worldView.x;
            var dy = sprite.worldView.y;

            DebugUtils.game.stage.context.fillStyle = color;
            DebugUtils.game.stage.context.fillRect(dx, dy, sprite.width, sprite.height);

        }

        static renderSpritePhysicsBody(sprite: Sprite, camera?: Camera = null, color?: string = 'rgba(255,0,0,0.2)') {

            if (camera == null)
            {
                camera = DebugUtils.game.camera;
            }

            var dx = (camera.screenView.x * sprite.transform.scrollFactor.x) + sprite.body.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
            var dy = (camera.screenView.y * sprite.transform.scrollFactor.y) + sprite.body.y - (camera.worldView.y * sprite.transform.scrollFactor.y);

            DebugUtils.game.stage.context.fillStyle = color;
            DebugUtils.game.stage.context.fillRect(dx, dy, sprite.body.width, sprite.body.height);

        }

    }

}