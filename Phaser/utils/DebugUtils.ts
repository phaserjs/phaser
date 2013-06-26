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

        static renderPhysicsBody(body: Phaser.Physics.Body, lineWidth: number = 1, fillStyle: string = 'rgba(0,255,0,0.2)', sleepStyle: string = 'rgba(100,100,100,0.2)') {

            for (var s = 0; s < body.shapes.length; s++)
            {
                DebugUtils.context.beginPath();

                if (body.shapes[s].type == Phaser.Physics.Manager.SHAPE_TYPE_POLY)
                {
                    var verts = body.shapes[s].tverts;

		            DebugUtils.context.moveTo((body.position.x + verts[0].x) * 50, (body.position.y + verts[0].y) * 50);

		            for (var i = 0; i < verts.length; i++) {
			            DebugUtils.context.lineTo((body.position.x + verts[i].x) * 50, (body.position.y + verts[i].y) * 50);
		            }

		            DebugUtils.context.lineTo((body.position.x + verts[verts.length - 1].x) * 50, (body.position.y + verts[verts.length - 1].y) * 50);
                }
                else if (body.shapes[s].type == Phaser.Physics.Manager.SHAPE_TYPE_CIRCLE)
                {
		            var circle = <Phaser.Physics.Shapes.Circle> body.shapes[s];
		            DebugUtils.context.arc(circle.tc.x * 50, circle.tc.y * 50, circle.radius * 50, 0, Math.PI * 2, false);
                }

		        DebugUtils.context.closePath();

		        if (body.isAwake)
		        {
    		        DebugUtils.context.fillStyle = fillStyle;
		        }
		        else
		        {
    		        DebugUtils.context.fillStyle = sleepStyle;
		        }

		        DebugUtils.context.fill();

            }

        }

    }

}