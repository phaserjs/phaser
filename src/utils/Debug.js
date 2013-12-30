/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of methods for displaying debug information about game objects. Phaser.Debug requires a CANVAS game type in order to render, so if you've got
* your game set to use Phaser.AUTO then swap it for Phaser.CANVAS to ensure WebGL doesn't kick in, then the Debug functions will all display.
*
* @class Phaser.Utils.Debug
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Utils.Debug = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;
  
    /**
    * @property {Context} context - The canvas context on which to render the debug information.
    */
    this.context = game.context;

    /**
    * @property {string} font - The font that the debug information is rendered in.
    * @default '14px Courier'
    */
    this.font = '14px Courier';
   
    /**
    * @property {number} lineHeight - The line height between the debug text.
    */
    this.lineHeight = 16;
    
    /**
    * @property {boolean} renderShadow - Should the text be rendered with a slight shadow? Makes it easier to read on different types of background.
    */
    this.renderShadow = true;
    
    /**
    * @property {Context} currentX - The current X position the debug information will be rendered at.
    * @default
    */
    this.currentX = 0;
    
    /**
    * @property {number} currentY - The current Y position the debug information will be rendered at.
    * @default
    */
    this.currentY = 0;
    
    /**
    * @property {number} currentAlpha - The current alpha the debug information will be rendered at.
    * @default
    */
    this.currentAlpha = 1;

};

Phaser.Utils.Debug.prototype = {

    /**
    * Internal method that resets and starts the debug output values.
    * @method Phaser.Utils.Debug#start
    * @param {number} x - The X value the debug info will start from.
    * @param {number} y - The Y value the debug info will start from.
    * @param {string} color - The color the debug info will drawn in.
    */
    start: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        if (typeof x !== 'number') { x = 0; }
        if (typeof y !== 'number') { y = 0; }

        color = color || 'rgb(255,255,255)';

        this.currentX = x;
        this.currentY = y;
        this.currentColor = color;
        this.currentAlpha = this.context.globalAlpha;

        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = color;
        this.context.font = this.font;
        this.context.globalAlpha = 1;

    },

    /**
    * Internal method that stops the debug output.
    * @method Phaser.Utils.Debug#stop
    */
    stop: function () {


        this.context.restore();
        this.context.globalAlpha = this.currentAlpha;

    },

    /**
    * Internal method that outputs a single line of text.
    * @method Phaser.Utils.Debug#line
    * @param {string} text - The line of text to draw.
    * @param {number} x - The X value the debug info will start from.
    * @param {number} y - The Y value the debug info will start from.
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

    /**
    * Visually renders a QuadTree to the display.
    * @method Phaser.Utils.Debug#renderQuadTree
    * @param {Phaser.QuadTree} quadtree - The quadtree to render.
    * @param {string} color - The color of the lines in the quadtree.
    */
    renderQuadTree: function (quadtree, color) {

        color = color || 'rgba(255,0,0,0.3)';

        this.start();

        var bounds = quadtree.bounds;

        if (quadtree.nodes.length === 0)
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            this.renderText(quadtree.ID + ' / ' + quadtree.objects.length, bounds.x + 4, bounds.y + 16, 'rgb(0,200,0)', '12px Courier');

            this.context.strokeStyle = 'rgb(0,255,0)';

            // children
            for (var i = 0; i < quadtree.objects.length; i++)
            {
                this.context.strokeRect(quadtree.objects[i].x, quadtree.objects[i].y, quadtree.objects[i].width, quadtree.objects[i].height);
            }
        }
        else
        {
            for (var i = 0; i < quadtree.nodes.length; i++)
            {
                this.renderQuadTree(quadtree.nodes[i]);
            }
        }

        this.stop();

    },

    /**
    * Renders the corners and point information of the given Sprite.
    * @method Phaser.Utils.Debug#renderSpriteCorners
    * @param {Phaser.Sprite} sprite - The sprite to be rendered.
    * @param {boolean} [showText=false] - If true the x/y coordinates of each point will be rendered.
    * @param {boolean} [showBounds=false] - If true the bounds will be rendered over the top of the sprite.
    * @param {string} [color='rgb(255,0,255)'] - The color the text is rendered in.
    */
    renderSpriteCorners: function (sprite, showText, showBounds, color) {

        if (this.context == null)
        {
            return;
        }

        showText = showText || false;
        showBounds = showBounds || false;
        color = color || 'rgb(255,255,255)';

        this.start(0, 0, color);

        if (showBounds)
        {
            this.context.beginPath();
            this.context.strokeStyle = 'rgba(0, 255, 0, 0.7)';
            this.context.strokeRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
            this.context.closePath();
            this.context.stroke();
        }

        this.context.beginPath();
        this.context.moveTo(sprite.topLeft.x, sprite.topLeft.y);
        this.context.lineTo(sprite.topRight.x, sprite.topRight.y);
        this.context.lineTo(sprite.bottomRight.x, sprite.bottomRight.y);
        this.context.lineTo(sprite.bottomLeft.x, sprite.bottomLeft.y);
        this.context.closePath();
        this.context.strokeStyle = 'rgba(255, 0, 255, 0.7)';
        this.context.stroke();

        this.renderPoint(sprite.offset);
        this.renderPoint(sprite.center);
        this.renderPoint(sprite.topLeft);
        this.renderPoint(sprite.topRight);
        this.renderPoint(sprite.bottomLeft);
        this.renderPoint(sprite.bottomRight);

        if (showText)
        {
            this.currentColor = color;
            this.line('x: ' + Math.floor(sprite.topLeft.x) + ' y: ' + Math.floor(sprite.topLeft.y), sprite.topLeft.x, sprite.topLeft.y);
            this.line('x: ' + Math.floor(sprite.topRight.x) + ' y: ' + Math.floor(sprite.topRight.y), sprite.topRight.x, sprite.topRight.y);
            this.line('x: ' + Math.floor(sprite.bottomLeft.x) + ' y: ' + Math.floor(sprite.bottomLeft.y), sprite.bottomLeft.x, sprite.bottomLeft.y);
            this.line('x: ' + Math.floor(sprite.bottomRight.x) + ' y: ' + Math.floor(sprite.bottomRight.y), sprite.bottomRight.x, sprite.bottomRight.y);
        }

        this.stop();

    },

    /**
    * Render Sound information, including decoded state, duration, volume and more.
    * @method Phaser.Utils.Debug#renderSoundInfo
    * @param {Phaser.Sound} sound - The sound object to debug.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderSoundInfo: function (sound, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked);
        this.line('Is Ready?: ' + this.game.cache.isSoundReady(sound.key) + ' Pending Playback: ' + sound.pendingPlayback);
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

        this.stop();

    },

    /**
    * Render camera information including dimensions and location.
    * @method Phaser.Utils.Debug#renderCameraInfo
    * @param {Phaser.Camera} camera - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderCameraInfo: function (camera, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Camera (' + camera.width + ' x ' + camera.height + ')');
        this.line('X: ' + camera.x + ' Y: ' + camera.y);
        this.line('Bounds x: ' + camera.bounds.x + ' Y: ' + camera.bounds.y + ' w: ' + camera.bounds.width + ' h: ' + camera.bounds.height);
        this.line('View x: ' + camera.view.x + ' Y: ' + camera.view.y + ' w: ' + camera.view.width + ' h: ' + camera.view.height);
        this.stop();
        
    },

    /**
    * Renders the Pointer.circle object onto the stage in green if down or red if up along with debug text.
    * @method Phaser.Utils.Debug#renderPointer
    * @param {Phaser.Pointer} pointer - Description.
    * @param {boolean} [hideIfUp=false] - Doesn't render the circle if the pointer is up.
    * @param {string} [downColor='rgba(0,255,0,0.5)'] - The color the circle is rendered in if down.
    * @param {string} [upColor='rgba(255,0,0,0.5)'] - The color the circle is rendered in if up (and hideIfUp is false).
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderPointer: function (pointer, hideIfUp, downColor, upColor, color) {

        if (this.context == null || pointer == null)
        {
            return;
        }

        if (typeof hideIfUp === 'undefined') { hideIfUp = false; }
        downColor = downColor || 'rgba(0,255,0,0.5)';
        upColor = upColor || 'rgba(255,0,0,0.5)';
        color = color || 'rgb(255,255,255)';

        if (hideIfUp === true && pointer.isUp === true)
        {
            return;
        }

        this.start(pointer.x, pointer.y - 100, color);
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
        // this.start(pointer.x, pointer.y - 100, color);
        this.line('ID: ' + pointer.id + " Active: " + pointer.active);
        this.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
        this.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
        this.line('Duration: ' + pointer.duration + " ms");
        this.stop();

    },

    /**
    * Render Sprite Input Debug information.
    * @method Phaser.Utils.Debug#renderSpriteInputInfo
    * @param {Phaser.Sprite} sprite - The sprite to be rendered.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderSpriteInputInfo: function (sprite, x, y, color) {

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
        this.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
        this.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
        this.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
        this.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        this.stop();

    },

    /**
    * Render Sprite collision.
    * @method Phaser.Utils.Debug#renderSpriteCollision
    * @param {Phaser.Sprite} sprite - The sprite to be rendered.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderSpriteCollision: function (sprite, x, y, color) {

        color = color || 'rgb(255,255,255)';

        this.start(x, y, color);
        this.line('Sprite Collision: (' + sprite.width + ' x ' + sprite.height + ')');
        this.line('left: ' + sprite.body.touching.left);
        this.line('right: ' + sprite.body.touching.right);
        this.line('up: ' + sprite.body.touching.up);
        this.line('down: ' + sprite.body.touching.down);
        this.line('velocity.x: ' + sprite.body.velocity.x);
        this.line('velocity.y: ' + sprite.body.velocity.y);
        this.stop();

    },

    /**
    * Render debug information about the Input object.
    * @method Phaser.Utils.Debug#renderInputInfo
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
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
    * Render debug infos (including name, bounds info, position and some other properties) about the Sprite.
    * @method Phaser.Utils.Debug#renderSpriteInfo
    * @param {Phaser.Sprite} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderSpriteInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') anchor: ' + sprite.anchor.x + ' x ' + sprite.anchor.y);
        this.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1));
        this.line('angle: ' + sprite.angle.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
        this.line('visible: ' + sprite.visible + ' in camera: ' + sprite.inCamera);
        this.line('body x: ' + sprite.body.x.toFixed(1) + ' y: ' + sprite.body.y.toFixed(1));

        //  0 = scaleX
        //  1 = skewY
        //  2 = translateX
        //  3 = skewX
        //  4 = scaleY
        //  5 = translateY

        // this.line('id: ' + sprite._id);
        // this.line('scale x: ' + sprite.worldTransform[0]);
        // this.line('scale y: ' + sprite.worldTransform[4]);
        // this.line('tx: ' + sprite.worldTransform[2]);
        // this.line('ty: ' + sprite.worldTransform[5]);
        // this.line('skew x: ' + sprite.worldTransform[3]);
        // this.line('skew y: ' + sprite.worldTransform[1]);
        this.line('deltaX: ' + sprite.body.deltaX());
        this.line('deltaY: ' + sprite.body.deltaY());
        // this.line('sdx: ' + sprite.deltaX());
        // this.line('sdy: ' + sprite.deltaY());

        // this.line('inCamera: ' + this.game.renderer.spriteRenderer.inCamera(this.game.camera, sprite));
        this.stop();

    },

    /**
    * Render the World Transform information of the given Sprite.
    * @method Phaser.Utils.Debug#renderWorldTransformInfo
    * @param {Phaser.Sprite} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderWorldTransformInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('World Transform');
        this.line('skewX:  ' + sprite.worldTransform[3]);
        this.line('skewY:  ' + sprite.worldTransform[1]);
        this.line('scaleX: ' + sprite.worldTransform[0]);
        this.line('scaleY: ' + sprite.worldTransform[4]);
        this.line('transX: ' + sprite.worldTransform[2]);
        this.line('transY: ' + sprite.worldTransform[5]);
        this.stop();

    },

    /**
    * Render the Local Transform information of the given Sprite.
    * @method Phaser.Utils.Debug#renderLocalTransformInfo
    * @param {Phaser.Sprite} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderLocalTransformInfo: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Local Transform');
        this.line('skewX:  ' + sprite.localTransform[3]);
        this.line('skewY:  ' + sprite.localTransform[1]);
        this.line('scaleX: ' + sprite.localTransform[0]);
        this.line('scaleY: ' + sprite.localTransform[4]);
        this.line('transX: ' + sprite.localTransform[2]);
        this.line('transY: ' + sprite.localTransform[5]);
        this.stop();

    },

    renderSpriteCoords: function (sprite, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        if (sprite.name)
        {
            this.line(sprite.name);
        }

        this.line('x: ' + sprite.x);
        this.line('y: ' + sprite.y);
        this.line('pos x: ' + sprite.position.x);
        this.line('pos y: ' + sprite.position.y);
        this.line('local x: ' + sprite.localTransform[2]);
        this.line('local y: ' + sprite.localTransform[5]);
        this.line('t x: ' + sprite.worldTransform[2]);
        this.line('t y: ' + sprite.worldTransform[5]);
        this.line('world x: ' + sprite.world.x);
        this.line('world y: ' + sprite.world.y);

        this.stop();

    },

    renderGroupInfo: function (group, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);

        this.line('Group (size: ' + group.length + ')');
        this.line('x: ' + group.x);
        this.line('y: ' + group.y);

        this.stop();

    },

    /**
    * Renders Point coordinates in the given color.
    * @method Phaser.Utils.Debug#renderPointInfo
    * @param {Phaser.Point} sprite - Description.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    renderPointInfo: function (point, x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255, 255, 255)';

        this.start(x, y, color);
        this.line('px: ' + point.x.toFixed(1) + ' py: ' + point.y.toFixed(1));
        this.stop();

    },

    /**
    * Renders just the Sprite.body bounds.
    * @method Phaser.Utils.Debug#renderSpriteBody
    * @param {Phaser.Sprite} sprite - Description.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderSpriteBody: function (sprite, color) {

        if (this.context == null || sprite.body.touching.none === true)
        {
            return;
        }

        color = color || 'rgba(255,0,255, 0.3)';

        this.start(0, 0, color);

        this.context.fillStyle = color;
        this.context.fillRect(sprite.body.screenX, sprite.body.screenY, sprite.body.width, sprite.body.height);

        this.stop();
        this.start(0, 0, color);

        this.context.beginPath();
        this.context.strokeStyle = '#000000';

        if (sprite.body.touching.up)
        {
            this.context.moveTo(sprite.body.x, sprite.body.y);
            this.context.lineTo(sprite.body.x + sprite.body.width, sprite.body.y);
        }

        if (sprite.body.touching.down)
        {
            this.context.moveTo(sprite.body.x, sprite.body.y + sprite.body.height);
            this.context.lineTo(sprite.body.x + sprite.body.width, sprite.body.y + sprite.body.height);
        }

        if (sprite.body.touching.left)
        {
            this.context.moveTo(sprite.body.x, sprite.body.y);
            this.context.lineTo(sprite.body.x, sprite.body.y + sprite.body.height);
        }

        if (sprite.body.touching.right)
        {
            this.context.moveTo(sprite.body.x + sprite.body.width, sprite.body.y);
            this.context.lineTo(sprite.body.x + sprite.body.width, sprite.body.y + sprite.body.height);
        }

        this.context.stroke();

        this.stop();

    },

    /**
    * Renders just the full Sprite bounds.
    * @method Phaser.Utils.Debug#renderSpriteBounds
    * @param {Phaser.Sprite} sprite - Description.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [fill=false] - If false the bounds outline is rendered, if true the whole rectangle is rendered.
    */
    renderSpriteBounds: function (sprite, color, fill) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,0,255)';

        if (typeof fill === 'undefined') { fill = false; }

        this.start(0, 0, color);

        if (fill)
        {
            this.context.fillStyle = color;
            this.context.fillRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
        }
        else
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(sprite.bounds.x, sprite.bounds.y, sprite.bounds.width, sprite.bounds.height);
            this.context.strokeRect(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height);
            // this.context.strokeRect(sprite.body.hull.x, sprite.body.hull.y, sprite.body.hull.width, sprite.body.hull.height);
            this.context.stroke();

            // this.context.strokeStyle = '#ff0000';
            // this.context.strokeRect(sprite.body.hullX.x, sprite.body.hullX.y, sprite.body.hullX.width, sprite.body.hullX.height);
            // this.context.stroke();
            // this.context.strokeStyle = '#00ff00';
            // this.context.strokeRect(sprite.body.hullY.x, sprite.body.hullY.y, sprite.body.hullY.width, sprite.body.hullY.height);
            // this.context.stroke();
        }

        this.stop();

    },

    /**
    * Renders a single pixel.
    * @method Phaser.Utils.Debug#renderPixel
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderPixel: function (x, y, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, 2, 2);
        this.stop();

    },

    /**
    * Renders a Point object.
    * @method Phaser.Utils.Debug#renderPoint
    * @param {Phaser.Point} point - The Point to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderPoint: function (point, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,1)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(point.x, point.y, 4, 4);
        this.stop();

    },

    /**
    * Renders a Rectangle.
    * @method Phaser.Utils.Debug#renderRectangle
    * @param {Phaser.Rectangle} rect - The Rectangle to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderRectangle: function (rect, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        this.stop();
        
    },

    /**
    * Renders a Circle.
    * @method Phaser.Utils.Debug#renderCircle
    * @param {Phaser.Circle} circle - The Circle to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    */
    renderCircle: function (circle, color) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgba(0,255,0,0.3)';

        this.start();
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.closePath();
        this.stop();

    },

    /**
    * Render text.
    * @method Phaser.Utils.Debug#renderText
    * @param {string} text - The line of text to draw.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {string} font - The font of text to draw.
    */
    renderText: function (text, x, y, color, font) {

        if (this.context == null)
        {
            return;
        }

        color = color || 'rgb(255,255,255)';
        font = font || '16px Courier';

        this.start();
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.stop();

    },

    /**
    * Dumps the Linked List to the console.
    * 
    * @method Phaser.Utils.Debug#Phaser.LinkedList#dump 
    * @param {Phaser.LinkedList} list - The LinkedList to dump.
    */
    dumpLinkedList: function (list) {

        var spacing = 20;

        var output = "\n" + Phaser.Utils.pad('Node', spacing) + "|" + Phaser.Utils.pad('Next', spacing) + "|" + Phaser.Utils.pad('Previous', spacing) + "|" + Phaser.Utils.pad('First', spacing) + "|" + Phaser.Utils.pad('Last', spacing);
        console.log(output);

        var output = Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing);
        console.log(output);

        var entity = list;

        var testObject = entity.last.next;
        entity = entity.first;
        
        do
        {
            var name = entity.sprite.name || '*';
            var nameNext = '-';
            var namePrev = '-';
            var nameFirst = '-';
            var nameLast = '-';

            if (entity.next)
            {
                nameNext = entity.next.sprite.name;
            }

            if (entity.prev)
            {
                namePrev = entity.prev.sprite.name;
            }

            if (entity.first)
            {
                nameFirst = entity.first.sprite.name;
            }

            if (entity.last)
            {
                nameLast = entity.last.sprite.name;
            }

            if (typeof nameNext === 'undefined')
            {
                nameNext = '-';
            }

            if (typeof namePrev === 'undefined')
            {
                namePrev = '-';
            }

            if (typeof nameFirst === 'undefined')
            {
                nameFirst = '-';
            }

            if (typeof nameLast === 'undefined')
            {
                nameLast = '-';
            }

            var output = Phaser.Utils.pad(name, spacing) + "|" + Phaser.Utils.pad(nameNext, spacing) + "|" + Phaser.Utils.pad(namePrev, spacing) + "|" + Phaser.Utils.pad(nameFirst, spacing) + "|" + Phaser.Utils.pad(nameLast, spacing);
            console.log(output);

            entity = entity.next;

        }
        while(entity != testObject)

    }

};

Phaser.Utils.Debug.prototype.constructor = Phaser.Utils.Debug;
