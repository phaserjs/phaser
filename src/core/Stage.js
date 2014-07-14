/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Stage controls the canvas on which everything is displayed. It handles display within the browser,
* focus handling, game resizing, scaling and the pause, boot and orientation screens.
*
* @class Phaser.Stage
* @extends PIXI.Stage
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {number} width - Width of the canvas element.
* @param {number} height - Height of the canvas element.
 */
Phaser.Stage = function (game, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {Phaser.Point} offset - Holds the offset coordinates of the Game.canvas from the top-left of the browser window (used by Input and other classes)
    */
    this.offset = new Phaser.Point();

    /**
    * @property {Phaser.Rectangle} bounds - The bounds of the Stage. Typically x/y = Stage.offset.x/y and the width/height match the game width and height.
    */
    this.bounds = new Phaser.Rectangle(0, 0, width, height);

    PIXI.Stage.call(this, 0x000000);

    /**
    * @property {string} name - The name of this object.
    * @default
    */
    this.name = '_stage_root';

    /**
    * @property {boolean} interactive - Pixi level var, ignored by Phaser.
    * @default
    * @private
    */
    this.interactive = false;

    /**
    * @property {boolean} disableVisibilityChange - By default if the browser tab loses focus the game will pause. You can stop that behaviour by setting this property to true.
    * @default
    */
    this.disableVisibilityChange = false;

    /**
    * @property {number|false} checkOffsetInterval - The time (in ms) between which the stage should check to see if it has moved.
    * @default
    */
    this.checkOffsetInterval = 2500;

    /**
    * @property {boolean} exists - If exists is true the Stage and all children are updated, otherwise it is skipped.
    * @default
    */
    this.exists = true;

    /**
    * @property {number} currentRenderOrderID - Reset each frame, keeps a count of the total number of objects updated.
    */
    this.currentRenderOrderID = 0;

    /**
    * @property {string} hiddenVar - The page visibility API event name.
    * @private
    */
    this._hiddenVar = 'hidden';

    /**
    * @property {number} _nextOffsetCheck - The time to run the next offset check.
    * @private
    */
    this._nextOffsetCheck = 0;

    /**
    * @property {number} _backgroundColor - Stage background color.
    * @private
    */
    this._backgroundColor = 0x000000;

    if (game.config)
    {
        this.parseConfig(game.config);
    }

};

Phaser.Stage.prototype = Object.create(PIXI.Stage.prototype);
Phaser.Stage.prototype.constructor = Phaser.Stage;

/**
* This is called automatically after the plugins preUpdate and before the State.update.
* Most objects have preUpdate methods and it's where initial movement and positioning is done.
*
* @method Phaser.Stage#preUpdate
*/
Phaser.Stage.prototype.preUpdate = function () {

    this.currentRenderOrderID = 0;

    //  This can't loop in reverse, we need the orderID to be in sequence
    var len = this.children.length;

    for (var i = 0; i < len; i++)
    {
        this.children[i].preUpdate();
    }

};

/**
* This is called automatically after the State.update, but before particles or plugins update.
*
* @method Phaser.Stage#update
*/
Phaser.Stage.prototype.update = function () {

    var i = this.children.length;

    while (i--)
    {
        this.children[i].update();
    }

};

/**
* This is called automatically before the renderer runs and after the plugins have updated.
* In postUpdate this is where all the final physics calculatations and object positioning happens.
* The objects are processed in the order of the display list.
* The only exception to this is if the camera is following an object, in which case that is updated first.
*
* @method Phaser.Stage#postUpdate
*/
Phaser.Stage.prototype.postUpdate = function () {

    if (this.game.world.camera.target)
    {
        this.game.world.camera.target.postUpdate();

        this.game.world.camera.update();

        var i = this.children.length;

        while (i--)
        {
            if (this.children[i] !== this.game.world.camera.target)
            {
                this.children[i].postUpdate();
            }
        }
    }
    else
    {
        this.game.world.camera.update();

        var i = this.children.length;

        while (i--)
        {
            this.children[i].postUpdate();
        }
    }

    if (this.checkOffsetInterval !== false)
    {
        if (this.game.time.now > this._nextOffsetCheck)
        {
            Phaser.Canvas.getOffset(this.game.canvas, this.offset);
            this.bounds.x = this.offset.x;
            this.bounds.y = this.offset.y;
            this._nextOffsetCheck = this.game.time.now + this.checkOffsetInterval;
        }
    }

};

/**
* Parses a Game configuration object.
*
* @method Phaser.Stage#parseConfig
* @protected
* @param {object} config -The configuration object to parse.
*/
Phaser.Stage.prototype.parseConfig = function (config) {

    if (config['checkOffsetInterval'])
    {
        this.checkOffsetInterval = config['checkOffsetInterval'];
    }

    if (config['disableVisibilityChange'])
    {
        this.disableVisibilityChange = config['disableVisibilityChange'];
    }

    if (config['fullScreenScaleMode'])
    {
        this.fullScreenScaleMode = config['fullScreenScaleMode'];
    }

    if (config['scaleMode'])
    {
        this.scaleMode = config['scaleMode'];
    }

    if (config['backgroundColor'])
    {
        this.backgroundColor = config['backgroundColor'];
    }

};

/**
* Initialises the stage and adds the event listeners.
* @method Phaser.Stage#boot
* @private
*/
Phaser.Stage.prototype.boot = function () {

    Phaser.Canvas.getOffset(this.game.canvas, this.offset);

    this.bounds.setTo(this.offset.x, this.offset.y, this.game.width, this.game.height);

    var _this = this;

    this._onChange = function (event) {
        return _this.visibilityChange(event);
    };

    Phaser.Canvas.setUserSelect(this.game.canvas, 'none');
    Phaser.Canvas.setTouchAction(this.game.canvas, 'none');

    this.checkVisibility();

};

/**
* Starts a page visibility event listener running, or window.blur/focus if not supported by the browser.
* @method Phaser.Stage#checkVisibility
*/
Phaser.Stage.prototype.checkVisibility = function () {

    if (document.webkitHidden !== undefined)
    {
        this._hiddenVar = 'webkitvisibilitychange';
    }
    else if (document.mozHidden !== undefined)
    {
        this._hiddenVar = 'mozvisibilitychange';
    }
    else if (document.msHidden !== undefined)
    {
        this._hiddenVar = 'msvisibilitychange';
    }
    else if (document.hidden !== undefined)
    {
        this._hiddenVar = 'visibilitychange';
    }
    else
    {
        this._hiddenVar = null;
    }

    //  Does browser support it? If not (like in IE9 or old Android) we need to fall back to blur/focus
    if (this._hiddenVar)
    {
        document.addEventListener(this._hiddenVar, this._onChange, false);
    }

    window.onpagehide = this._onChange;
    window.onpageshow = this._onChange;

    window.onblur = this._onChange;
    window.onfocus = this._onChange;

};

/**
* This method is called when the document visibility is changed.
* 
* @method Phaser.Stage#visibilityChange
* @param {Event} event - Its type will be used to decide whether the game should be paused or not.
*/
Phaser.Stage.prototype.visibilityChange = function (event) {

    if (event.type === 'pagehide' || event.type === 'blur' || event.type === 'pageshow' || event.type === 'focus')
    {
        if (event.type === 'pagehide' || event.type === 'blur')
        {
            this.game.focusLoss(event);
        }
        else if (event.type === 'pageshow' || event.type === 'focus')
        {
            this.game.focusGain(event);
        }

        return;
    }

    if (this.disableVisibilityChange)
    {
        return;
    }

    if (document.hidden || document.mozHidden || document.msHidden || document.webkitHidden)
    {
        this.game.gamePaused(event);
    }
    else
    {
        this.game.gameResumed(event);
    }

};

/**
* Sets the background color for the Stage. The color can be given as a hex value (#RRGGBB) or a numeric value (0xRRGGBB)
*
* @name Phaser.Stage#setBackgroundColor
* @param {number|string} backgroundColor - The color of the background.
*/
Phaser.Stage.prototype.setBackgroundColor = function(backgroundColor)
{
    if (typeof backgroundColor === 'string')
    {
        var rgb = Phaser.Color.hexToColor(backgroundColor);
        this._backgroundColor = Phaser.Color.getColor(rgb.r, rgb.g, rgb.b);
    }
    else
    {
        var rgb = Phaser.Color.getRGB(backgroundColor);
        this._backgroundColor = backgroundColor;
    }

    this.backgroundColorSplit = [ rgb.r / 255, rgb.g / 255, rgb.b / 255 ];
    this.backgroundColorString = Phaser.Color.RGBtoString(rgb.r, rgb.g, rgb.b, 255, '#');

};

/**
* @name Phaser.Stage#backgroundColor
* @property {number|string} backgroundColor - Gets and sets the background color of the stage. The color can be given as a number: 0xff0000 or a hex string: '#ff0000'
*/
Object.defineProperty(Phaser.Stage.prototype, "backgroundColor", {

    get: function () {

        return this._backgroundColor;

    },

    set: function (color) {

        if (!this.game.transparent)
        {
            this.setBackgroundColor(color);
        }

    }

});

/**
* Enable or disable texture smoothing for all objects on this Stage. Only works for bitmap/image textures. Smoothing is enabled by default.
*
* @name Phaser.Stage#smoothed
* @property {boolean} smoothed - Set to true to smooth all sprites rendered on this Stage, or false to disable smoothing (great for pixel art)
*/
Object.defineProperty(Phaser.Stage.prototype, "smoothed", {

    get: function () {

        return !PIXI.scaleModes.LINEAR;

    },

    set: function (value) {

        if (value)
        {
            PIXI.scaleModes.LINEAR = 0;
        }
        else
        {
            PIXI.scaleModes.LINEAR = 1;
        }
    }

});
