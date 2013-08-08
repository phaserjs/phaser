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
         * The context to which the render debug info will be drawn.
         * Defaults to the Game.Stage.context, but can be redirected anywhere.
         * @type {CanvasRenderingContext2D}
         */
        static context: CanvasRenderingContext2D;

        static currentX: number;
        static currentY: number;
        static font: string = '14px Courier';
        static lineHeight: number = 16;
        static currentColor: string;
        static renderShadow: bool = true;

        static start(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            currentX = x;
            currentY = y;
            currentColor = color;

            DebugUtils.context.fillStyle = color;
            DebugUtils.context.font = font;

        }

        static line(text: string, x?:number = null, y?:number = null) {

            if (x !== null)
            {
                currentX = x;
            }

            if (y !== null)
            {
                currentY = y;
            }

            if (renderShadow)
            {
                DebugUtils.context.fillStyle = 'rgb(0,0,0)';
                DebugUtils.context.fillText(text, currentX + 1, currentY + 1);
                DebugUtils.context.fillStyle = currentColor;
            }

            DebugUtils.context.fillText(text, currentX, currentY);

            currentY += lineHeight;

        }

        static renderSpriteCorners(sprite: Sprite, color?: string = 'rgb(255,0,255)') {

            start(0, 0, color);

            line('x: ' + Math.floor(sprite.transform.upperLeft.x) + ' y: ' + Math.floor(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
            line('x: ' + Math.floor(sprite.transform.upperRight.x) + ' y: ' + Math.floor(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
            line('x: ' + Math.floor(sprite.transform.bottomLeft.x) + ' y: ' + Math.floor(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
            line('x: ' + Math.floor(sprite.transform.bottomRight.x) + ' y: ' + Math.floor(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);

        }

        /**
         * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        static renderSoundInfo(sound: Sound, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            start(x, y, color);

            line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked + ' Pending Playback: ' + sound.pendingPlayback);
            line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
            line('Total Duration: ' + sound.totalDuration + ' Playing: ' + sound.isPlaying);
            line('Time: ' + sound.currentTime);
            line('Volume: ' + sound.volume + ' Muted: ' + sound.mute);
            line('WebAudio: ' + sound.usingWebAudio + ' Audio: ' + sound.usingAudioTag);

            if (sound.currentMarker !== '')
            {
                line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration);
                line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
                line('Position: ' + sound.position);
            }

        }

        /**
         * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderCameraInfo(camera: Camera, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            start(x, y, color);
            line('Camera ID: ' + camera.ID + ' (' + camera.screenView.width + ' x ' + camera.screenView.height + ')');
            line('X: ' + camera.x + ' Y: ' + camera.y + ' Rotation: ' + camera.transform.rotation);
            line('WorldView X: ' + camera.worldView.x + ' Y: ' + camera.worldView.y + ' W: ' + camera.worldView.width + ' H: ' + camera.worldView.height);
            line('ScreenView X: ' + camera.screenView.x + ' Y: ' + camera.screenView.y + ' W: ' + camera.screenView.width + ' H: ' + camera.screenView.height);

            if (camera.worldBounds)
            {
                line('Bounds: ' + camera.worldBounds.width + ' x ' + camera.worldBounds.height);
            }

        }

        /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        static renderPointer(pointer: Pointer, hideIfUp: bool = false, downColor?: string = 'rgba(0,255,0,0.5)', upColor?: string = 'rgba(255,0,0,0.5)', color?: string = 'rgb(255,255,255)') {

            if (hideIfUp == true && pointer.isUp == true)
            {
                return;
            }

            DebugUtils.context.beginPath();
            DebugUtils.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);

            if (pointer.active)
            {
                DebugUtils.context.fillStyle = downColor;
            }
            else
            {
                DebugUtils.context.fillStyle = upColor;
            }

            DebugUtils.context.fill();
            DebugUtils.context.closePath();

            //  Render the points
            DebugUtils.context.beginPath();
            DebugUtils.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
            DebugUtils.context.lineTo(pointer.position.x, pointer.position.y);
            DebugUtils.context.lineWidth = 2;
            DebugUtils.context.stroke();
            DebugUtils.context.closePath();

            //  Render the text
            start(pointer.x, pointer.y - 100, color);

            line('ID: ' + pointer.id + " Active: " + pointer.active);
            line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
            line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
            line('Duration: ' + pointer.duration + " ms");

        }

        /**
         * Render Sprite Input Debug information
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderSpriteInputInfo(sprite: Sprite, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            start(x, y, color);

            line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
            line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
            line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
            line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
            line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());

        }

        /**
         * Render debug information about the Input object.
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderInputInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            start(x, y, color);

            if (game.input.camera)
            {
                line('Input - Camera: ' + game.input.camera.ID);
            }
            else
            {
                line('Input - Camera: null');
            }

            line('X: ' + game.input.x + ' Y: ' + game.input.y);
            line('World X: ' + game.input.worldX + ' World Y: ' + game.input.worldY);
            line('Scale X: ' + game.input.scale.x.toFixed(1) + ' Scale Y: ' + game.input.scale.x.toFixed(1));
            line('Screen X: ' + game.input.activePointer.screenX + ' Screen Y: ' + game.input.activePointer.screenY);

        }

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        static renderSpriteInfo(sprite: Sprite, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            start(x, y, color);
            line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') origin: ' + sprite.transform.origin.x + ' x ' + sprite.transform.origin.y);
            line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
            line('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right);
            line('sx: ' + sprite.transform.scale.x.toFixed(1) + ' sy: ' + sprite.transform.scale.y.toFixed(1));
            line('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1));
            line('center x: ' + sprite.transform.center.x + ' y: ' + sprite.transform.center.y);
            line('cameraView x: ' + sprite.cameraView.x + ' y: ' + sprite.cameraView.y + ' width: ' + sprite.cameraView.width + ' height: ' + sprite.cameraView.height);
            line('inCamera: ' + DebugUtils.game.renderer.spriteRenderer.inCamera(DebugUtils.game.camera, sprite));

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

        static renderPixel(x: number, y: number, fillStyle: string = 'rgba(0,255,0,1)') {

            DebugUtils.context.fillStyle = fillStyle;
            DebugUtils.context.fillRect(x, y, 1, 1);

        }

        static renderPoint(point: Phaser.Point, fillStyle: string = 'rgba(0,255,0,1)') {

            DebugUtils.context.fillStyle = fillStyle;
            DebugUtils.context.fillRect(point.x, point.y, 1, 1);

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
        static renderText(text: string, x: number, y: number, color?: string = 'rgb(255,255,255)', font?: string = '16px Courier') {

            DebugUtils.context.font = font;
            DebugUtils.context.fillStyle = color;
            DebugUtils.context.fillText(text, x, y);

        }

    }

}