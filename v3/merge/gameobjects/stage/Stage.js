/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Stage controls root level display objects upon which everything is displayed.
* It also handles browser visibility handling and the pausing due to loss of focus.
*
* @class Phaser.GameObject.Stage
* @extends PIXI.DisplayObjectContainer
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
 */
Phaser.Stage = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    // Phaser.GameObject.Container.call(this, game);

    /**
    * @property {string} name - The name of this object.
    * @default
    */
    this.name = '_stage_root';

    /**
    * By default if the browser tab loses focus the game will pause.
    * You can stop that behavior by setting this property to true.
    * Note that the browser can still elect to pause your game if it wishes to do so,
    * for example swapping to another browser tab. This will cause the RAF callback to halt,
    * effectively pausing your game, even though no in-game pause event is triggered if you enable this property.
    * @property {boolean} disableVisibilityChange
    * @default
    */
    this.disableVisibilityChange = false;

    /**
    * @property {boolean} exists - If exists is true the Stage and all children are updated, otherwise it is skipped.
    * @default
    */
    // this.exists = true;

    /**
    * @property {Phaser.Matrix} worldTransform - Current transform of the object based on world (parent) factors
    * @private
    * @readOnly
    */
    // this.worldTransform = new Phaser.Matrix();

    /**
    * @property {Phaser.Stage} stage - The stage reference (the Stage is its own stage)
    * @private
    * @readOnly
    */
    // this.stage = this;

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
    * @property {function} _onChange - The blur/focus event handler.
    * @private
    */
    this._onChange = null;

    this.color = new Phaser.Component.Color(this);

    this.children = new Phaser.Component.Children(this);

    this.alpha = 1;
    this.visible = true;

    /**
    * @property {number} _bgColor - Stage background color object. Populated by setBackgroundColor.
    * @private
    this._bgColor = { r: 255, g: 0, b: 255, a: 0, color: 0, rgba: 'rgba(0,0,0,0.1)' };

    if (!this.game.transparent)
    {
        //  transparent = 0,0,0,0 - otherwise r,g,b,1
        // this._bgColor.a = 1;
    }
    */

    if (game.config)
    {
        this.parseConfig(game.config);
    }

};

// Phaser.Stage.prototype = Object.create(Phaser.GameObject.Container.prototype);
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
        this.setBackgroundColor(config['backgroundColor']);
    }

};

/**
* Initialises the stage and adds the event listeners.
* @method Phaser.Stage#boot
* @private
*/
Phaser.Stage.prototype.boot = function () {

    Phaser.DOM.getOffset(this.game.canvas, this.offset);

    Phaser.Canvas.setUserSelect(this.game.canvas, 'none');
    Phaser.Canvas.setTouchAction(this.game.canvas, 'none');

    this.checkVisibility();

    this.setBackgroundColor('#000000');

};

/**
* This is called automatically after the plugins preUpdate and before the State.update.
* Most objects have preUpdate methods and it's where initial movement and positioning is done.
*
* @method Phaser.Stage#preUpdate
*/
Phaser.Stage.prototype.preUpdate = function ()
{
    // this.worldAlpha = this.alpha;

    // this.currentRenderOrderID = 0;

    //  This can't loop in reverse, we need the renderOrderID to be in sequence
    for (var i = 0; i < this.children.list.length; i++)
    {
        this.children.list[i].preUpdate();
    }
};

/**
* This is called automatically after the State.update, but before particles or plugins update.
*
* @method Phaser.Stage#update
*/
Phaser.Stage.prototype.update = function () {

    //  Goes in reverse, because it's highly likely the child will destroy itself in `update`
    var i = this.children.list.length;

    while (i--)
    {
        this.children.list[i].update();
    }

};

/**
* This is called automatically before the renderer runs and after the plugins have updated.
* In postUpdate this is where all the final physics calculations and object positioning happens.
* The objects are processed in the order of the display list.
*
* @method Phaser.Stage#postUpdate
*/
Phaser.Stage.prototype.postUpdate = function () {

    /*
    //  Apply the camera shake, fade, bounds, etc
    this.game.camera.update();

    //  Camera target first?
    if (this.game.camera.target)
    {
        this.game.camera.target.postUpdate();

        this.updateTransform();

        this.game.camera.updateTarget();
    }
    */

    for (var i = 0; i < this.children.list.length; i++)
    {
        this.children.list[i].postUpdate();
    }

    // this.updateTransform();

};

/**
* Starts a page visibility event listener running, or window.onpagehide/onpageshow if not supported by the browser.
* Also listens for window.onblur and window.onfocus.
* 
* @method Phaser.Stage#checkVisibility
*/
Phaser.Stage.prototype.checkVisibility = function () {

    if (document.hidden !== undefined)
    {
        this._hiddenVar = 'visibilitychange';
    }
    else if (document.webkitHidden !== undefined)
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
    else
    {
        this._hiddenVar = null;
    }

    var _this = this;

    this._onChange = function (event) {
        return _this.visibilityChange(event);
    };

    //  Does browser support it? If not (like in IE9 or old Android) we need to fall back to blur/focus
    if (this._hiddenVar)
    {
        document.addEventListener(this._hiddenVar, this._onChange, false);
    }

    window.onblur = this._onChange;
    window.onfocus = this._onChange;

    window.onpagehide = this._onChange;
    window.onpageshow = this._onChange;
    
    if (this.game.device.cocoonJSApp)
    {
        CocoonJS.App.onSuspended.addEventListener(function () {
            Phaser.Stage.prototype.visibilityChange.call(_this, { type: "pause" });
        });

        CocoonJS.App.onActivated.addEventListener(function () {
            Phaser.Stage.prototype.visibilityChange.call(_this, { type: "resume" });
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
* If you've set your game to be transparent then calls to setBackgroundColor are ignored.
*
* @method Phaser.Stage#setBackgroundColor
* @param {number|string} color - The color of the background.
*/
Phaser.Stage.prototype.setBackgroundColor = function (color)
{
    this.game.canvas.style.backgroundColor = color;

    /*
    Phaser.Color.valueToColor(color, this._bgColor);
    Phaser.Color.updateColor(this._bgColor);

    //  For gl.clearColor (canvas uses _bgColor.rgba)
    this._bgColor.r /= 255;
    this._bgColor.g /= 255;
    this._bgColor.b /= 255;
    this._bgColor.a = 1;
    */

};

/**
* Destroys the Stage and removes event listeners.
*
* @method Phaser.Stage#destroy
*/
Phaser.Stage.prototype.destroy = function () {

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

        return this._bgColor.color;

    },

    set: function (color) {

        this.setBackgroundColor(color);

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

        return Phaser.scaleModes.DEFAULT === Phaser.scaleModes.LINEAR;

    },

    set: function (value) {

        if (value)
        {
            Phaser.scaleModes.DEFAULT = Phaser.scaleModes.LINEAR;
        }
        else
        {
            Phaser.scaleModes.DEFAULT = Phaser.scaleModes.NEAREST;
        }
    }

});
