/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/

Phaser.Utils = {
    //  Until we have a proper entry-point
}

/**
* A collection of methods for displaying debug information about game objects.
*
* @class DebugUtils
*/
Phaser.Utils.Debug = function (game) {

    this.game = game;
    this.context = game.context;

};

Phaser.Utils.Debug.prototype = {

    font: '14px Courier',
    lineHeight: 16,
    renderShadow: true,
    currentX: 0,
    currentY: 0,
    context: null,

    /**
    * Internal method that resets the debug output values.
    * @method start
    * @param {Number} x The X value the debug info will start from.
    * @param {Number} y The Y value the debug info will start from.
    * @param {String} color The color the debug info will drawn in.
    */
    start: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        x = x || null;
        y = y || null;
        color = color || 'rgb(255,255,255)';

        if (x && y)
        {
            this.currentX = x;
            this.currentY = y;
            this.currentColor = color;
        }

        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = color;
        this.context.font = this.font;

    },

    stop: function () {

        this.context.restore();

    },

    /**
    * Internal method that outputs a single line of text.
    * @method line
    * @param {String} text The line of text to draw.
    * @param {Number} x The X value the debug info will start from.
    * @param {Number} y The Y value the debug info will start from.
    */
    line: function (text, x, y) {

        if (this.context == null)
        {
            return;
        }

        x = x || null;
        y = y || null;

        if (x !== null) {
            this.currentX = x;
        }

        if (y !== null) {
            this.currentY = y;
        }

        if (this.renderShadow)
        {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillText(text, this.currentX + 1, this.currentY + 1);
            this.context.fillStyle = this.currentColor;
        }

        this.context.fillText(text, this.currentX, this.currentY);
        this.currentY += this.lineHeight;

    },

    renderSpriteCorners: function (sprite, color) {

        if (this.context == null)
        {
            return;
        }

        if (typeof color === "undefined") { color = 'rgb(255,0,255)'; }

        this.start(0, 0, color);
        this.line('x: ' + Math.floor(sprite.transform.upperLeft.x) + ' y: ' + Math.floor(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
        this.line('x: ' + Math.floor(sprite.transform.upperRight.x) + ' y: ' + Math.floor(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
        this.line('x: ' + Math.floor(sprite.transform.bottomLeft.x) + ' y: ' + Math.floor(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
        this.line('x: ' + Math.floor(sprite.transform.bottomRight.x) + ' y: ' + Math.floor(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);

    },

    /**
    * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */
    renderSoundInfo: function (sound, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked + ' Pending Playback: ' + sound.pendingPlayback);
        this.line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
        this.line('Total Duration: ' + sound.totalDuration + ' Playing: ' + sound.isPlaying);
        this.line('Time: ' + sound.currentTime);
        this.line('Volume: ' + sound.volume + ' Muted: ' + sound.mute);
        this.line('WebAudio: ' + sound.usingWebAudio + ' Audio: ' + sound.usingAudioTag);

        if (sound.currentMarker !== '')
        {
            this.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration);
            this.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
            this.line('Position: ' + sound.position);
        }

    },

    /**
    * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */
    renderCameraInfo: function (camera, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,0)';

        this.start(x, y, color);
        this.line('Camera (' + camera.width + ' x ' + camera.height + ')');
        this.line('X: ' + camera.x + ' Y: ' + camera.y);
        this.stop();
        
    },

    /**
    * Renders the Pointer.circle object onto the stage in green if down or red if up.
    * @method renderDebug
    */
    renderPointer: function (pointer, hideIfUp, downColor, upColor, color) {

        if (this.context == null)
        {
            return;
        }

        if (typeof hideIfUp === "undefined") { hideIfUp = false; }
        if (typeof downColor === "undefined") { downColor = 'rgba(0,255,0,0.5)'; }
        if (typeof upColor === "undefined") { upColor = 'rgba(255,0,0,0.5)'; }
        if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }

        if (hideIfUp == true && pointer.isUp == true)
        {
            return;
        }

        this.context.beginPath();
        this.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);

        if (pointer.active)
        {
            this.context.fillStyle = downColor;
        }
        else
        {
            this.context.fillStyle = upColor;
        }

        this.context.fill();
        this.context.closePath();

        //  Render the points
        this.context.beginPath();
        this.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
        this.context.lineTo(pointer.position.x, pointer.position.y);
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.closePath();

        //  Render the text
        this.start(pointer.x, pointer.y - 100, color);
        this.line('ID: ' + pointer.id + " Active: " + pointer.active);
        this.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
        this.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
        this.line('Duration: ' + pointer.duration + " ms");

    },

    /**
    * Render debug information about the Input object.
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */
    renderInputInfo: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,0)';

        this.start(x, y, color);
        this.line('Input');
        this.line('X: ' + this.game.input.x + ' Y: ' + this.game.input.y);
        this.line('World X: ' + this.game.input.worldX + ' World Y: ' + this.game.input.worldY);
        this.line('Scale X: ' + this.game.input.scale.x.toFixed(1) + ' Scale Y: ' + this.game.input.scale.x.toFixed(1));
        this.line('Screen X: ' + this.game.input.activePointer.screenX + ' Screen Y: ' + this.game.input.activePointer.screenY);
        this.stop();

    },

    /**
    * Render debug infos. (including name, bounds info, position and some other properties)
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */
    renderSpriteInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') anchor: ' + sprite.anchor.x + ' x ' + sprite.anchor.y);
        // this.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
        // this.line('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right);
        // this.line('sx: ' + sprite.scale.x.toFixed(1) + ' sy: ' + sprite.scale.y.toFixed(1));

        //  0 = scaleX
        //  1 = skewY
        //  2 = translateX
        //  3 = skewX
        //  4 = scaleY
        //  5 = translateY


        this.line('scale x: ' + sprite.worldTransform[0]);
        this.line('scale y: ' + sprite.worldTransform[4]);
        this.line('tx: ' + sprite.worldTransform[2]);
        this.line('ty: ' + sprite.worldTransform[5]);
        this.line('skew x: ' + sprite.worldTransform[1]);
        this.line('skew y: ' + sprite.worldTransform[3]);

        // this.line('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1));
        // this.line('center x: ' + sprite.transform.center.x + ' y: ' + sprite.transform.center.y);
        // this.line('cameraView x: ' + sprite.cameraView.x + ' y: ' + sprite.cameraView.y + ' width: ' + sprite.cameraView.width + ' height: ' + sprite.cameraView.height);
        // this.line('inCamera: ' + this.game.renderer.spriteRenderer.inCamera(this.game.camera, sprite));

    },

    renderSpriteBounds: function (sprite, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0, 255, 0, 0.2)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(sprite.worldView.x, sprite.worldView.y, sprite.worldView.width, sprite.worldView.height);
        this.stop();

    },

    renderPixel: function (x, y, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = fillStyle;
        this.context.fillRect(x, y, 2, 2);
        this.stop();

    },

    renderPoint: function (point, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = fillStyle;
        this.context.fillRect(point.x, point.y, 4, 4);
        this.stop();

    },

    renderRectangle: function (rect, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.fillStyle = fillStyle;
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.stop();
        
    },

    renderCircle: function (circle, fillStyle) {

        if (this.context == null)
        {
            return;
        }

        fillStyle = fillStyle || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.beginPath();
        this.context.fillStyle = fillStyle;
        this.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.closePath();
        this.stop();

    },

    /**
    * Render text
    * @param x {number} X position of the debug info to be rendered.
    * @param y {number} Y position of the debug info to be rendered.
    * @param [color] {number} color of the debug info to be rendered. (format is css color string)
    */    
    renderText: function (text, x, y, color, font) {

        if (this.context == null)
        {
            return;
        }

        if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
        if (typeof font === "undefined") { font = '16px Courier'; }

        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);

    }

};
