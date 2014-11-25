/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A collection of methods for displaying debug information about game objects.
* If your game is running in WebGL then Debug will create a Sprite that is placed at the top of the Stage display list and bind a canvas texture
* to it, which must be uploaded every frame. Be advised: this is very expensive, especially in browsers like Firefox. So please only enable Debug
* in WebGL mode if you really need it (or your desktop can cope with it well) and disable it for production!
* If your game is using a Canvas renderer then the debug information is literally drawn on the top of the active game canvas and no Sprite is used.
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
    * @property {Phaser.Image} sprite - If debugging in WebGL mode we need this.
    */
    this.sprite = null;

    /**
    * @property {Phaser.BitmapData} bmd - In WebGL mode this BitmapData contains a copy of the debug canvas.
    */
    this.bmd = null;

    /**
    * @property {HTMLCanvasElement} canvas - The canvas to which Debug calls draws.
    */
    this.canvas = null;

    /**
    * @property {CanvasRenderingContext2D} context - The 2d context of the canvas.
    */
    this.context = null;

    /**
    * @property {string} font - The font that the debug information is rendered in.
    * @default '14px Courier'
    */
    this.font = '14px Courier';

    /**
    * @property {number} columnWidth - The spacing between columns.
    */
    this.columnWidth = 100;

    /**
    * @property {number} lineHeight - The line height between the debug text.
    */
    this.lineHeight = 16;

    /**
    * @property {boolean} renderShadow - Should the text be rendered with a slight shadow? Makes it easier to read on different types of background.
    */
    this.renderShadow = true;

    /**
    * @property {number} currentX - The current X position the debug information will be rendered at.
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

    /**
    * @property {boolean} dirty - Does the canvas need re-rendering?
    */
    this.dirty = false;

};

Phaser.Utils.Debug.prototype = {

    /**
    * Internal method that boots the debug displayer.
    *
    * @method Phaser.Utils.Debug#boot
    * @protected
    */
    boot: function () {

        if (this.game.renderType === Phaser.CANVAS)
        {
            this.context = this.game.context;
        }
        else
        {
            this.bmd = this.game.make.bitmapData(this.game.width, this.game.height);
            this.sprite = this.game.make.image(0, 0, this.bmd);
            this.game.stage.addChild(this.sprite);

            this.canvas = Phaser.Canvas.create(this.game.width, this.game.height, '', true);
            this.context = this.canvas.getContext('2d');
        }

    },

    /**
    * Internal method that clears the canvas (if a Sprite) ready for a new debug session.
    *
    * @method Phaser.Utils.Debug#preUpdate
    */
    preUpdate: function () {

        if (this.dirty && this.sprite)
        {
            this.bmd.clear();
            this.bmd.draw(this.canvas, 0, 0);

            this.context.clearRect(0, 0, this.game.width, this.game.height);
            this.dirty = false;
        }

    },

    /**
    * Clears the Debug canvas.
    *
    * @method Phaser.Utils.Debug#reset
    */
    reset: function () {

        if (this.context)
        {
            this.context.clearRect(0, 0, this.game.width, this.game.height);
        }

        if (this.sprite)
        {
            this.bmd.clear();
        }

    },

    /**
    * Internal method that resets and starts the debug output values.
    *
    * @method Phaser.Utils.Debug#start
    * @protected
    * @param {number} [x=0] - The X value the debug info will start from.
    * @param {number} [y=0] - The Y value the debug info will start from.
    * @param {string} [color='rgb(255,255,255)'] - The color the debug text will drawn in.
    * @param {number} [columnWidth=0] - The spacing between columns.
    */
    start: function (x, y, color, columnWidth) {

        if (typeof x !== 'number') { x = 0; }
        if (typeof y !== 'number') { y = 0; }
        color = color || 'rgb(255,255,255)';
        if (typeof columnWidth === 'undefined') { columnWidth = 0; }

        this.currentX = x;
        this.currentY = y;
        this.currentColor = color;
        this.currentAlpha = this.context.globalAlpha;
        this.columnWidth = columnWidth;

        this.dirty = true;

        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.font = this.font;
        this.context.globalAlpha = 1;

    },

    /**
    * Internal method that stops the debug output.
    *
    * @method Phaser.Utils.Debug#stop
    * @protected
    */
    stop: function () {

        this.context.restore();
        this.context.globalAlpha = this.currentAlpha;

    },

    /**
    * Internal method that outputs a single line of text split over as many columns as needed, one per parameter.
    *
    * @method Phaser.Utils.Debug#line
    * @protected
    */
    line: function () {

        var x = this.currentX;

        for (var i = 0; i < arguments.length; i++)
        {
            if (this.renderShadow)
            {
                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.fillText(arguments[i], x + 1, this.currentY + 1);
                this.context.fillStyle = this.currentColor;
            }

            this.context.fillText(arguments[i], x, this.currentY);

            x += this.columnWidth;
        }

        this.currentY += this.lineHeight;

    },

    /**
    * Render Sound information, including decoded state, duration, volume and more.
    *
    * @method Phaser.Utils.Debug#soundInfo
    * @param {Phaser.Sound} sound - The sound object to debug.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    soundInfo: function (sound, x, y, color) {

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
            this.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration + ' (ms: ' + sound.durationMS + ')');
            this.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
            this.line('Position: ' + sound.position);
        }

        this.stop();

    },

    /**
    * Render camera information including dimensions and location.
    *
    * @method Phaser.Utils.Debug#cameraInfo
    * @param {Phaser.Camera} camera - The Phaser.Camera to show the debug information for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    cameraInfo: function (camera, x, y, color) {

        this.start(x, y, color);
        this.line('Camera (' + camera.width + ' x ' + camera.height + ')');
        this.line('X: ' + camera.x + ' Y: ' + camera.y);

        if (camera.bounds)
        {
            this.line('Bounds x: ' + camera.bounds.x + ' Y: ' + camera.bounds.y + ' w: ' + camera.bounds.width + ' h: ' + camera.bounds.height);
        }

        this.line('View x: ' + camera.view.x + ' Y: ' + camera.view.y + ' w: ' + camera.view.width + ' h: ' + camera.view.height);
        this.stop();

    },

    /**
    * Render Timer information.
    *
    * @method Phaser.Utils.Debug#timer
    * @param {Phaser.Timer} timer - The Phaser.Timer to show the debug information for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    timer: function (timer, x, y, color) {

        this.start(x, y, color);
        this.line('Timer (running: ' + timer.running + ' expired: ' + timer.expired + ')');
        this.line('Next Tick: ' + timer.next + ' Duration: ' + timer.duration);
        this.line('Paused: ' + timer.paused + ' Length: ' + timer.length);
        this.stop();

    },

    /**
    * Renders the Pointer.circle object onto the stage in green if down or red if up along with debug text.
    *
    * @method Phaser.Utils.Debug#pointer
    * @param {Phaser.Pointer} pointer - The Pointer you wish to display.
    * @param {boolean} [hideIfUp=false] - Doesn't render the circle if the pointer is up.
    * @param {string} [downColor='rgba(0,255,0,0.5)'] - The color the circle is rendered in if down.
    * @param {string} [upColor='rgba(255,0,0,0.5)'] - The color the circle is rendered in if up (and hideIfUp is false).
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    pointer: function (pointer, hideIfUp, downColor, upColor, color) {

        if (pointer == null)
        {
            return;
        }

        if (typeof hideIfUp === 'undefined') { hideIfUp = false; }
        downColor = downColor || 'rgba(0,255,0,0.5)';
        upColor = upColor || 'rgba(255,0,0,0.5)';

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
        this.line('ID: ' + pointer.id + " Active: " + pointer.active);
        this.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
        this.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
        this.line('Duration: ' + pointer.duration + " ms");
        this.line('is Down: ' + pointer.isDown + " is Up: " + pointer.isUp);
        this.stop();

    },

    /**
    * Render Sprite Input Debug information.
    *
    * @method Phaser.Utils.Debug#spriteInputInfo
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite to display the input data for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    spriteInputInfo: function (sprite, x, y, color) {

        this.start(x, y, color);
        this.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
        this.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
        this.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
        this.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
        this.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        this.stop();

    },

    /**
    * Renders Phaser.Key object information.
    *
    * @method Phaser.Utils.Debug#key
    * @param {Phaser.Key} key - The Key to render the information for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    key: function (key, x, y, color) {

        this.start(x, y, color, 150);

        this.line('Key:', key.keyCode, 'isDown:', key.isDown);
        this.line('justPressed:', key.justPressed(), 'justReleased:', key.justReleased());
        this.line('Time Down:', key.timeDown.toFixed(0), 'duration:', key.duration.toFixed(0));

        this.stop();

    },

    /**
    * Render debug information about the Input object.
    *
    * @method Phaser.Utils.Debug#inputInfo
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    inputInfo: function (x, y, color) {

        this.start(x, y, color);
        this.line('Input');
        this.line('X: ' + this.game.input.x + ' Y: ' + this.game.input.y);
        this.line('World X: ' + this.game.input.worldX + ' World Y: ' + this.game.input.worldY);
        this.line('Scale X: ' + this.game.input.scale.x.toFixed(1) + ' Scale Y: ' + this.game.input.scale.x.toFixed(1));
        this.line('Screen X: ' + this.game.input.activePointer.screenX + ' Screen Y: ' + this.game.input.activePointer.screenY);
        this.stop();

    },

    /**
    * Renders the Sprites bounds. Note: This is really expensive as it has to calculate the bounds every time you call it!
    *
    * @method Phaser.Utils.Debug#spriteBounds
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite to display the bounds of.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the rectangle as a fillRect (default, true) or a strokeRect (false)
    */
    spriteBounds: function (sprite, color, filled) {

        var bounds = sprite.getBounds();

        bounds.x += this.game.camera.x;
        bounds.y += this.game.camera.y;

        this.rectangle(bounds, color, filled);

    },
    /**
    * Renders the Rope's segments. Note: This is really expensive as it has to calculate new segments everytime you call it
    *
    * @method Phaser.Utils.Debug#ropeSegments
    * @param {Phaser.Rope} rope - The rope to display the segments of.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the rectangle as a fillRect (default, true) or a strokeRect (false)
    */
    ropeSegments: function(rope, color, filled) {
        var segments = rope.segments;
        segments.forEach(function(segment) {
            this.rectangle(segment, color, filled);
        }, this);

    },

    /**
    * Render debug infos (including name, bounds info, position and some other properties) about the Sprite.
    *
    * @method Phaser.Utils.Debug#spriteInfo
    * @param {Phaser.Sprite} sprite - The Sprite to display the information of.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    spriteInfo: function (sprite, x, y, color) {

        this.start(x, y, color);

        this.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') anchor: ' + sprite.anchor.x + ' x ' + sprite.anchor.y);
        this.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1));
        this.line('angle: ' + sprite.angle.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
        this.line('visible: ' + sprite.visible + ' in camera: ' + sprite.inCamera);

        this.stop();

    },

    /**
    * Renders the sprite coordinates in local, positional and world space.
    *
    * @method Phaser.Utils.Debug#spriteCoords
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite to display the coordinates for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    spriteCoords: function (sprite, x, y, color) {

        this.start(x, y, color, 100);

        if (sprite.name)
        {
            this.line(sprite.name);
        }

        this.line('x:', sprite.x.toFixed(2), 'y:', sprite.y.toFixed(2));
        this.line('pos x:', sprite.position.x.toFixed(2), 'pos y:', sprite.position.y.toFixed(2));
        this.line('world x:', sprite.world.x.toFixed(2), 'world y:', sprite.world.y.toFixed(2));

        this.stop();

    },

    /**
    * Renders Line information in the given color.
    *
    * @method Phaser.Utils.Debug#lineInfo
    * @param {Phaser.Line} line - The Line to display the data for.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    lineInfo: function (line, x, y, color) {

        this.start(x, y, color, 80);
        this.line('start.x:', line.start.x.toFixed(2), 'start.y:', line.start.y.toFixed(2));
        this.line('end.x:', line.end.x.toFixed(2), 'end.y:', line.end.y.toFixed(2));
        this.line('length:', line.length.toFixed(2), 'angle:', line.angle);
        this.stop();

    },

    /**
    * Renders a single pixel at the given size.
    *
    * @method Phaser.Utils.Debug#pixel
    * @param {number} x - X position of the pixel to be rendered.
    * @param {number} y - Y position of the pixel to be rendered.
    * @param {string} [color] - Color of the pixel (format is css color string).
    * @param {number} [size=2] - The 'size' to render the pixel at.
    */
    pixel: function (x, y, color, size) {

        size = size || 2;

        this.start();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, size, size);
        this.stop();

    },

    /**
    * Renders a Phaser geometry object including Rectangle, Circle, Point or Line.
    *
    * @method Phaser.Utils.Debug#geom
    * @param {Phaser.Rectangle|Phaser.Circle|Phaser.Point|Phaser.Line} object - The geometry object to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
    * @param {number} [forceType=0] - Force rendering of a specific type. If 0 no type will be forced, otherwise 1 = Rectangle, 2 = Circle, 3 = Point and 4 = Line.
    */
    geom: function (object, color, filled, forceType) {

        if (typeof filled === 'undefined') { filled = true; }
        if (typeof forceType === 'undefined') { forceType = 0; }

        color = color || 'rgba(0,255,0,0.4)';

        this.start();

        this.context.fillStyle = color;
        this.context.strokeStyle = color;

        if (object instanceof Phaser.Rectangle || forceType === 1)
        {
            if (filled)
            {
                this.context.fillRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
            }
            else
            {
                this.context.strokeRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
            }
        }
        else if (object instanceof Phaser.Circle || forceType === 2)
        {
            this.context.beginPath();
            this.context.arc(object.x - this.game.camera.x, object.y - this.game.camera.y, object.radius, 0, Math.PI * 2, false);
            this.context.closePath();

            if (filled)
            {
                this.context.fill();
            }
            else
            {
                this.context.stroke();
            }
        }
        else if (object instanceof Phaser.Point || forceType === 3)
        {
            this.context.fillRect(object.x - this.game.camera.x, object.y - this.game.camera.y, 4, 4);
        }
        else if (object instanceof Phaser.Line || forceType === 4)
        {
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.moveTo((object.start.x + 0.5) - this.game.camera.x, (object.start.y + 0.5) - this.game.camera.y);
            this.context.lineTo((object.end.x + 0.5) - this.game.camera.x, (object.end.y + 0.5) - this.game.camera.y);
            this.context.closePath();
            this.context.stroke();
        }

        this.stop();

    },

    /**
    * Renders a Rectangle.
    *
    * @method Phaser.Utils.Debug#geom
    * @param {Phaser.Rectangle|object} object - The geometry object to render.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
    */
    rectangle: function (object, color, filled) {

        if (typeof filled === 'undefined') { filled = true; }

        color = color || 'rgba(0, 255, 0, 0.4)';

        this.start();

        if (filled)
        {
            this.context.fillStyle = color;
            this.context.fillRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
        }
        else
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(object.x - this.game.camera.x, object.y - this.game.camera.y, object.width, object.height);
        }

        this.stop();

    },

    /**
    * Render a string of text.
    *
    * @method Phaser.Utils.Debug#text
    * @param {string} text - The line of text to draw.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color] - Color of the debug info to be rendered (format is css color string).
    * @param {string} [font] - The font of text to draw.
    */
    text: function (text, x, y, color, font) {

        color = color || 'rgb(255,255,255)';
        font = font || '16px Courier';

        this.start();
        this.context.font = font;

        if (this.renderShadow)
        {
            this.context.fillStyle = 'rgb(0,0,0)';
            this.context.fillText(text, x + 1, y + 1);
        }

        this.context.fillStyle = color;
        this.context.fillText(text, x, y);

        this.stop();

    },

    /**
    * Visually renders a QuadTree to the display.
    *
    * @method Phaser.Utils.Debug#quadTree
    * @param {Phaser.QuadTree} quadtree - The quadtree to render.
    * @param {string} color - The color of the lines in the quadtree.
    */
    quadTree: function (quadtree, color) {

        color = color || 'rgba(255,0,0,0.3)';

        this.start();

        var bounds = quadtree.bounds;

        if (quadtree.nodes.length === 0)
        {
            this.context.strokeStyle = color;
            this.context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            this.text('size: ' + quadtree.objects.length, bounds.x + 4, bounds.y + 16, 'rgb(0,200,0)', '12px Courier');

            this.context.strokeStyle = 'rgb(0,255,0)';

            for (var i = 0; i < quadtree.objects.length; i++)
            {
                this.context.strokeRect(quadtree.objects[i].x, quadtree.objects[i].y, quadtree.objects[i].width, quadtree.objects[i].height);
            }
        }
        else
        {
            for (var i = 0; i < quadtree.nodes.length; i++)
            {
                this.quadTree(quadtree.nodes[i]);
            }
        }

        this.stop();

    },

    /**
    * Render a Sprites Physics body if it has one set. Note this only works for Arcade and
    * Ninja (AABB, circle only) Physics.
    * To display a P2 body you should enable debug mode on the body when creating it.
    *
    * @method Phaser.Utils.Debug#body
    * @param {Phaser.Sprite} sprite - The sprite whos body will be rendered.
    * @param {string} [color='rgba(0,255,0,0.4)'] - color of the debug info to be rendered. (format is css color string).
    * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
    */
    body: function (sprite, color, filled) {

        if (sprite.body)
        {
            this.start();

            if (sprite.body.type === Phaser.Physics.ARCADE)
            {
                Phaser.Physics.Arcade.Body.render(this.context, sprite.body, color, filled);
            }
            else if (sprite.body.type === Phaser.Physics.NINJA)
            {
                Phaser.Physics.Ninja.Body.render(this.context, sprite.body, color, filled);
            }
            else if (sprite.body.type === Phaser.Physics.BOX2D)
            {
                Phaser.Physics.Box2D.renderBody(this.context, sprite.body, color);
            }

            this.stop();
        }

    },

    /**
    * Render a Sprites Physic Body information.
    *
    * @method Phaser.Utils.Debug#bodyInfo
    * @param {Phaser.Sprite} sprite - The sprite to be rendered.
    * @param {number} x - X position of the debug info to be rendered.
    * @param {number} y - Y position of the debug info to be rendered.
    * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
    */
    bodyInfo: function (sprite, x, y, color) {

        if (sprite.body)
        {
            this.start(x, y, color, 210);

            if (sprite.body.type === Phaser.Physics.ARCADE)
            {
                Phaser.Physics.Arcade.Body.renderBodyInfo(this, sprite.body);
            }
            else if (sprite.body.type === Phaser.Physics.BOX2D)
            {
                this.game.physics.box2d.renderBodyInfo(this, sprite.body);
            }

            this.stop();
        }

    },

    /**
    * Renders 'debug draw' data for the Box2D world if it exists.
    * This uses the standard debug drawing feature of Box2D, so colors will be decided by
    * the Box2D engine.
    *
    * @method Phaser.Utils.Debug#box2dWorld
    */
    box2dWorld: function () {
    
        this.start();
        
        this.context.translate(-this.game.camera.view.x, -this.game.camera.view.y, 0);
        this.game.physics.box2d.renderDebugDraw(this.context);
        
        this.stop();

    },

    /**
    * Renders 'debug draw' data for the given Box2D body.
    * This uses the standard debug drawing feature of Box2D, so colors will be decided by the Box2D engine.
    *
    * @method Phaser.Utils.Debug#box2dBody
    * @param {Phaser.Sprite} sprite - The sprite whos body will be rendered.
    * @param {string} [color='rgb(0,255,0)'] - color of the debug info to be rendered. (format is css color string).
    */
    box2dBody: function (body, color) {
    
        this.start();
        Phaser.Physics.Box2D.renderBody(this.context, body, color);
        this.stop();

    }

};

Phaser.Utils.Debug.prototype.constructor = Phaser.Utils.Debug;
