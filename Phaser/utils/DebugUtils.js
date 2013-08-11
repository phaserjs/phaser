/// <reference path="../_definitions.ts" />
/**
* Phaser - DebugUtils
*
* A collection of methods for displaying debug information about game objects.
*/
var Phaser;
(function (Phaser) {
    var DebugUtils = (function () {
        function DebugUtils() {
        }
        DebugUtils.start = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.currentX = x;
            Phaser.DebugUtils.currentY = y;
            Phaser.DebugUtils.currentColor = color;

            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.font = Phaser.DebugUtils.font;
        };

        DebugUtils.line = function (text, x, y) {
            if (typeof x === "undefined") { x = null; }
            if (typeof y === "undefined") { y = null; }
            if (x !== null) {
                Phaser.DebugUtils.currentX = x;
            }

            if (y !== null) {
                Phaser.DebugUtils.currentY = y;
            }

            if (Phaser.DebugUtils.renderShadow) {
                Phaser.DebugUtils.context.fillStyle = 'rgb(0,0,0)';
                Phaser.DebugUtils.context.fillText(text, Phaser.DebugUtils.currentX + 1, Phaser.DebugUtils.currentY + 1);
                Phaser.DebugUtils.context.fillStyle = Phaser.DebugUtils.currentColor;
            }

            Phaser.DebugUtils.context.fillText(text, Phaser.DebugUtils.currentX, Phaser.DebugUtils.currentY);

            Phaser.DebugUtils.currentY += Phaser.DebugUtils.lineHeight;
        };

        DebugUtils.renderSpriteCorners = function (sprite, color) {
            if (typeof color === "undefined") { color = 'rgb(255,0,255)'; }
            Phaser.DebugUtils.start(0, 0, color);

            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.upperLeft.x) + ' y: ' + Math.floor(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.upperRight.x) + ' y: ' + Math.floor(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.bottomLeft.x) + ' y: ' + Math.floor(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.bottomRight.x) + ' y: ' + Math.floor(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);
        };

        DebugUtils.renderSoundInfo = /**
        * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (sound, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);

            Phaser.DebugUtils.line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked + ' Pending Playback: ' + sound.pendingPlayback);
            Phaser.DebugUtils.line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
            Phaser.DebugUtils.line('Total Duration: ' + sound.totalDuration + ' Playing: ' + sound.isPlaying);
            Phaser.DebugUtils.line('Time: ' + sound.currentTime);
            Phaser.DebugUtils.line('Volume: ' + sound.volume + ' Muted: ' + sound.mute);
            Phaser.DebugUtils.line('WebAudio: ' + sound.usingWebAudio + ' Audio: ' + sound.usingAudioTag);

            if (sound.currentMarker !== '') {
                Phaser.DebugUtils.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration);
                Phaser.DebugUtils.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
                Phaser.DebugUtils.line('Position: ' + sound.position);
            }
        };

        DebugUtils.renderCameraInfo = /**
        * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (camera, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Camera ID: ' + camera.ID + ' (' + camera.screenView.width + ' x ' + camera.screenView.height + ')');
            Phaser.DebugUtils.line('X: ' + camera.x + ' Y: ' + camera.y + ' Rotation: ' + camera.transform.rotation);
            Phaser.DebugUtils.line('WorldView X: ' + camera.worldView.x + ' Y: ' + camera.worldView.y + ' W: ' + camera.worldView.width + ' H: ' + camera.worldView.height);
            Phaser.DebugUtils.line('ScreenView X: ' + camera.screenView.x + ' Y: ' + camera.screenView.y + ' W: ' + camera.screenView.width + ' H: ' + camera.screenView.height);

            if (camera.worldBounds) {
                Phaser.DebugUtils.line('Bounds: ' + camera.worldBounds.width + ' x ' + camera.worldBounds.height);
            }
        };

        DebugUtils.renderPointer = /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        function (pointer, hideIfUp, downColor, upColor, color) {
            if (typeof hideIfUp === "undefined") { hideIfUp = false; }
            if (typeof downColor === "undefined") { downColor = 'rgba(0,255,0,0.5)'; }
            if (typeof upColor === "undefined") { upColor = 'rgba(255,0,0,0.5)'; }
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            if (hideIfUp == true && pointer.isUp == true) {
                return;
            }

            Phaser.DebugUtils.context.beginPath();
            Phaser.DebugUtils.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);

            if (pointer.active) {
                Phaser.DebugUtils.context.fillStyle = downColor;
            } else {
                Phaser.DebugUtils.context.fillStyle = upColor;
            }

            Phaser.DebugUtils.context.fill();
            Phaser.DebugUtils.context.closePath();

            //  Render the points
            Phaser.DebugUtils.context.beginPath();
            Phaser.DebugUtils.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
            Phaser.DebugUtils.context.lineTo(pointer.position.x, pointer.position.y);
            Phaser.DebugUtils.context.lineWidth = 2;
            Phaser.DebugUtils.context.stroke();
            Phaser.DebugUtils.context.closePath();

            //  Render the text
            Phaser.DebugUtils.start(pointer.x, pointer.y - 100, color);

            Phaser.DebugUtils.line('ID: ' + pointer.id + " Active: " + pointer.active);
            Phaser.DebugUtils.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
            Phaser.DebugUtils.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
            Phaser.DebugUtils.line('Duration: ' + pointer.duration + " ms");
        };

        DebugUtils.renderSpriteInputInfo = /**
        * Render Sprite Input Debug information
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);

            Phaser.DebugUtils.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
            Phaser.DebugUtils.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
            Phaser.DebugUtils.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
            Phaser.DebugUtils.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
            Phaser.DebugUtils.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        };

        DebugUtils.renderInputInfo = /**
        * Render debug information about the Input object.
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);

            if (Phaser.DebugUtils.game.input.camera) {
                Phaser.DebugUtils.line('Input - Camera: ' + Phaser.DebugUtils.game.input.camera.ID);
            } else {
                Phaser.DebugUtils.line('Input - Camera: null');
            }

            Phaser.DebugUtils.line('X: ' + Phaser.DebugUtils.game.input.x + ' Y: ' + Phaser.DebugUtils.game.input.y);
            Phaser.DebugUtils.line('World X: ' + Phaser.DebugUtils.game.input.worldX + ' World Y: ' + Phaser.DebugUtils.game.input.worldY);
            Phaser.DebugUtils.line('Scale X: ' + Phaser.DebugUtils.game.input.scale.x.toFixed(1) + ' Scale Y: ' + Phaser.DebugUtils.game.input.scale.x.toFixed(1));
            Phaser.DebugUtils.line('Screen X: ' + Phaser.DebugUtils.game.input.activePointer.screenX + ' Screen Y: ' + Phaser.DebugUtils.game.input.activePointer.screenY);
        };

        DebugUtils.renderSpriteWorldView = function (sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite World Coords (' + sprite.width + ' x ' + sprite.height + ')');
            Phaser.DebugUtils.line('x: ' + sprite.worldView.x + ' y: ' + sprite.worldView.y);
            Phaser.DebugUtils.line('bottom: ' + sprite.worldView.bottom + ' right: ' + sprite.worldView.right.toFixed(1));
        };

        DebugUtils.renderSpriteWorldViewBounds = function (sprite, color) {
            if (typeof color === "undefined") { color = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.renderRectangle(sprite.worldView, color);
        };

        DebugUtils.renderSpriteInfo = /**
        * Render debug infos. (including name, bounds info, position and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') origin: ' + sprite.transform.origin.x + ' x ' + sprite.transform.origin.y);
            Phaser.DebugUtils.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
            Phaser.DebugUtils.line('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right);
            Phaser.DebugUtils.line('sx: ' + sprite.transform.scale.x.toFixed(1) + ' sy: ' + sprite.transform.scale.y.toFixed(1));
            Phaser.DebugUtils.line('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1));
            Phaser.DebugUtils.line('center x: ' + sprite.transform.center.x + ' y: ' + sprite.transform.center.y);
            Phaser.DebugUtils.line('cameraView x: ' + sprite.cameraView.x + ' y: ' + sprite.cameraView.y + ' width: ' + sprite.cameraView.width + ' height: ' + sprite.cameraView.height);
            Phaser.DebugUtils.line('inCamera: ' + Phaser.DebugUtils.game.renderer.spriteRenderer.inCamera(Phaser.DebugUtils.game.camera, sprite));
        };

        DebugUtils.renderSpriteBounds = function (sprite, camera, color) {
            if (typeof camera === "undefined") { camera = null; }
            if (typeof color === "undefined") { color = 'rgba(0,255,0,0.2)'; }
            if (camera == null) {
                camera = Phaser.DebugUtils.game.camera;
            }

            var dx = sprite.worldView.x;
            var dy = sprite.worldView.y;

            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.fillRect(dx, dy, sprite.width, sprite.height);
        };

        DebugUtils.renderPixel = function (x, y, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,1)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(x, y, 1, 1);
        };

        DebugUtils.renderPoint = function (point, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,1)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(point.x, point.y, 1, 1);
        };

        DebugUtils.renderRectangle = function (rect, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };

        DebugUtils.renderCircle = function (circle, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            Phaser.DebugUtils.context.fill();
        };

        DebugUtils.renderText = /**
        * Render text
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (text, x, y, color, font) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            if (typeof font === "undefined") { font = '16px Courier'; }
            Phaser.DebugUtils.context.font = font;
            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.fillText(text, x, y);
        };
        DebugUtils.font = '14px Courier';
        DebugUtils.lineHeight = 16;

        DebugUtils.renderShadow = true;
        return DebugUtils;
    })();
    Phaser.DebugUtils = DebugUtils;
})(Phaser || (Phaser = {}));
