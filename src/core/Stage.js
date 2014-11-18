/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Stage controls root level display objects upon which everything is displayed.
* It also handles browser visibility handling and the pausing due to loss of focus.
*
* @class Phaser.Stage
* @extends PIXI.Stage
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
 */
Phaser.Stage = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

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
* Parses a Game configuration object.
*
* @method Phaser.Stage#parseConfig
* @protected
* @param {object} config -The configuration object to parse.
*/
Phaser.Stage.prototype.parseConfig = function (config) {

    if (config['disableVisibilityChange'])
    {
        this.disableVisibilityChange = config['disableVisibilityChange'];
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

    Phaser.DOM.getOffset(this.game.canvas, this.offset);

    var _this = this;

    this._onChange = function (event) {
        return _this.visibilityChange(event);
    };

    Phaser.Canvas.setUserSelect(this.game.canvas, 'none');
    Phaser.Canvas.setTouchAction(this.game.canvas, 'none');

    this.checkVisibility();

};

/**
* This is called automatically after the plugins preUpdate and before the State.update.
* Most objects have preUpdate methods and it's where initial movement and positioning is done.
*
* @method Phaser.Stage#preUpdate
*/
Phaser.Stage.prototype.preUpdate = function () {

    this.currentRenderOrderID = 0;

    //  This can't loop in reverse, we need the orderID to be in sequence
    for (var i = 0, len = this.children.length; i < len; i++)
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
    
    var _this = this;
	
    if (this.game.device.cocoonJSApp)
    {
        CocoonJS.App.onSuspended.addEventListener(function () {
            Phaser.Stage.prototype.visibilityChange.call(_this, {type: "pause"});
        });

        CocoonJS.App.onActivated.addEventListener(function () {
            Phaser.Stage.prototype.visibilityChange.call(_this, {type: "resume"});
        });
    }

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

    if (document.hidden || document.mozHidden || document.msHidden || document.webkitHidden || event.type === "pause")
    {
        this.game.gamePaused(event);
    }
    else
    {
        this.game.gameResumed(event);
    }

};

/**
* Sets the background color for the Stage.
*
* The color can be given as a hex string (`'#RRGGBB'`), a CSS color string (`'rgb(r,g,b)'`), or a numeric value (`0xRRGGBB`).
*
* An alpha channel is _not_ supported and will be ignored.
*
* @name Phaser.Stage#setBackgroundColor
* @param {number|string} backgroundColor - The color of the background.
*/
Phaser.Stage.prototype.setBackgroundColor = function(backgroundColor)
{
    var rgb = Phaser.Color.valueToColor(backgroundColor);
    this._backgroundColor = Phaser.Color.getColor(rgb.r, rgb.g, rgb.b);

    this.backgroundColorSplit = [ rgb.r / 255, rgb.g / 255, rgb.b / 255 ];
    this.backgroundColorString = Phaser.Color.RGBtoString(rgb.r, rgb.g, rgb.b, 255, '#');

};

/**
* Destroys the Stage and removes event listeners.
*
* @name Phaser.Stage#destroy
*/
Phaser.Stage.prototype.destroy  = function () {

    if (this._hiddenVar)
    {
        document.removeEventListener(this._hiddenVar, this._onChange, false);
    }

    window.onpagehide = null;
    window.onpageshow = null;

    window.onblur = null;
    window.onfocus = null;

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

        return PIXI.scaleModes.DEFAULT === PIXI.scaleModes.LINEAR;

    },

    set: function (value) {

        if (value)
        {
            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.LINEAR;
        }
        else
        {
            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
        }
    }

});
