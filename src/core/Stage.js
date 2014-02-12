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
    * @property {string} game - Background color of the stage (defaults to black). Set via the public backgroundColor property.
    * @private
    */
    this._backgroundColor = 'rgb(0,0,0)';

    /**
    * @property {Phaser.Point} offset - Get the offset values (for input and other things).
    */
    this.offset = new Phaser.Point();
    
    /**
    * @property {HTMLCanvasElement} canvas - Reference to the newly created `canvas` element.
    */
    this.canvas = null;

    /**
    * @property {PIXI.Stage} _stage - The Pixi Stage which is hooked to the renderer.
    * @private
    */
    // this._stage = new PIXI.Stage(0x000000, false);
    // this._stage.name = '_stage_root';
    // this._stage.interactive = false;

    PIXI.Stage.call(this, 0x000000, false);

    this.name = '_stage_root';
    this.interactive = false;

    /**
    * @property {number} scaleMode - The current scaleMode.
    */
    this.scaleMode = Phaser.StageScaleMode.NO_SCALE;

    /*
    * @property {number} fullScreenScaleMode - Scale mode to be used in fullScreen
     */
    this.fullScreenScaleMode = Phaser.StageScaleMode.NO_SCALE;

    /**
    * @property {Phaser.StageScaleMode} scale - The scale of the current running game.
    */
    // this.scale = new Phaser.StageScaleMode(this.game, width, height);

    /**
    * @property {number} aspectRatio - Aspect ratio.
    */
    this.aspectRatio = width / height;

    /**
    * @property {boolean} disableVisibilityChange - By default if the browser tab loses focus the game will pause. You can stop that behaviour by setting this property to true.
    * @default
    */
    this.disableVisibilityChange = false;

    /**
    * @property {number} _nextOffsetCheck - The time to run the next offset check.
    * @private
    */
    this._nextOffsetCheck = 0;

    /**
    * @property {number|false} checkOffsetInterval - The time (in ms) between which the stage should check to see if it has moved.
    * @default
    */
    this.checkOffsetInterval = 2500;

    if (game.config)
    {
        this.parseConfig(game.config);
    }
    else
    {
        this.canvas = Phaser.Canvas.create(width, height);
        this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
    }

};

Phaser.Stage.prototype = Object.create(PIXI.Stage.prototype);
Phaser.Stage.prototype.constructor = Phaser.Stage;

/**
* Parses a Game configuration object.
*
* @method Phaser.Stage#parseConfig
* @protected
*/
Phaser.Stage.prototype.parseConfig = function (config) {

    if (config['canvasID'])
    {
        this.canvas = Phaser.Canvas.create(this.game.width, this.game.height, config['canvasID']);
    }
    else
    {
        this.canvas = Phaser.Canvas.create(this.game.width, this.game.height);
    }

    if (config['canvasStyle'])
    {
        this.canvas.stlye = config['canvasStyle'];
    }
    else
    {
        this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
    }

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

}

/**
* Initialises the stage and adds the event listeners.
* @method Phaser.Stage#boot
* @private
*/
Phaser.Stage.prototype.boot = function () {

    Phaser.Canvas.getOffset(this.canvas, this.offset);

    this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, this.game.width, this.game.height);

    var _this = this;

    this._onChange = function (event) {
        return _this.visibilityChange(event);
    }

    Phaser.Canvas.setUserSelect(this.canvas, 'none');
    Phaser.Canvas.setTouchAction(this.canvas, 'none');

    // this.backgroundColor = '#000000';

    document.addEventListener('visibilitychange', this._onChange, false);
    document.addEventListener('webkitvisibilitychange', this._onChange, false);
    document.addEventListener('pagehide', this._onChange, false);
    document.addEventListener('pageshow', this._onChange, false);

    window.onblur = this._onChange;
    window.onfocus = this._onChange;

}

/**
* Runs Stage processes that need periodic updates, such as the offset checks.
* @method Phaser.Stage#update
*/
Phaser.Stage.prototype.update = function () {

    if (this.checkOffsetInterval !== false)
    {
        if (this.game.time.now > this._nextOffsetCheck)
        {
            Phaser.Canvas.getOffset(this.canvas, this.offset);
            this._nextOffsetCheck = this.game.time.now + this.checkOffsetInterval;
        }

    }

}

/**
* This method is called when the document visibility is changed.
* @method Phaser.Stage#visibilityChange
* @param {Event} event - Its type will be used to decide whether the game should be paused or not.
*/
Phaser.Stage.prototype.visibilityChange = function (event) {

    if (this.disableVisibilityChange)
    {
        return;
    }

    if (this.game.paused === false && (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] === true || document['webkitHidden'] === true))
    {
        this.game.paused = true;
    }
    else
    {
        this.game.paused = false;
    }

}

/**
* @name Phaser.Stage#backgroundColor
* @property {number|string} backgroundColor - Gets and sets the background color of the stage. The color can be given as a number: 0xff0000 or a hex string: '#ff0000'
*/
Object.defineProperty(Phaser.Stage.prototype, "NEWbackgroundColor", {

    get: function () {
        return this._backgroundColor;
    },

    set: function (color) {

        this._backgroundColor = color;

        if (this.game.transparent === false)
        {
            if (typeof color === 'string')
            {
                color = Phaser.Color.hexToRGB(color);
            }

            this.setBackgroundColor(color);
        }

    }

});
