/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Stage controls the canvas on which everything is displayed. It handles display within the browser,
* focus handling, game resizing, scaling and the pause, boot and orientation screens.
*
* @class Phaser.Stage
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
	* @default 'rgb(0,0,0)'
	*/
    this._backgroundColor = 'rgb(0,0,0)';

    /**
	* @property {Phaser.Point} offset - Get the offset values (for input and other things).
	*/
	this.offset = new Phaser.Point;
    
    /**
    * @property {HTMLCanvasElement} canvas - Reference to the newly created &lt;canvas&gt; element.
    */
    this.canvas = Phaser.Canvas.create(width, height); 
    this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
    
    /**
    * @property {PIXI.Stage} _stage - The Pixi Stage which is hooked to the renderer.
    * @private
    */
    this._stage = new PIXI.Stage(0x000000, false);
    this._stage.name = '_stage_root';

    /**
    * @property {number} scaleMode - The current scaleMode.
    */    
    this.scaleMode = Phaser.StageScaleMode.NO_SCALE;

    /**
    * @property {Phaser.StageScaleMode} scale - The scale of the current running game.
    */
    this.scale = new Phaser.StageScaleMode(this.game, width, height);

    /**
     * @property {number} aspectRatio - Aspect ratio.
     */
    this.aspectRatio = width / height;

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

};

Phaser.Stage.prototype = {

    /**
    * Initialises the stage and adds the event listeners.
    * @method Phaser.Stage#boot
    * @private
    */
    boot: function () {

        Phaser.Canvas.getOffset(this.canvas, this.offset);

        this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, this.game.width, this.game.height);

        var _this = this;

        this._onChange = function (event) {
            return _this.visibilityChange(event);
        }

        Phaser.Canvas.setUserSelect(this.canvas, 'none');
        Phaser.Canvas.setTouchAction(this.canvas, 'none');

        document.addEventListener('visibilitychange', this._onChange, false);
        document.addEventListener('webkitvisibilitychange', this._onChange, false);
        document.addEventListener('pagehide', this._onChange, false);
        document.addEventListener('pageshow', this._onChange, false);

        window.onblur = this._onChange;
        window.onfocus = this._onChange;

    },

    /**
    * Runs Stage processes that need periodic updates, such as the offset checks.
    * @method Phaser.Stage#update
    */
    update: function () {

        if (this.checkOffsetInterval !== false)
        {
            if (this.game.time.now > this._nextOffsetCheck)
            {
                Phaser.Canvas.getOffset(this.canvas, this.offset);
                this._nextOffsetCheck = this.game.time.now + this.checkOffsetInterval;
            }

        }

    },

	/**
    * This method is called when the document visibility is changed.
    * @method Phaser.Stage#visibilityChange
    * @param {Event} event - Its type will be used to decide whether the game should be paused or not.
    */
    visibilityChange: function (event) {

        if (this.disableVisibilityChange)
        {
            return;
        }

        if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true)
        {
	        this.game.paused = true;
        }
        else
        {
	        this.game.paused = false;
        }

    },

};

/**
* @name Phaser.Stage#backgroundColor
* @property {number|string} paused - Gets and sets the background color of the stage. The color can be given as a number: 0xff0000 or a hex string: '#ff0000'
*/
Object.defineProperty(Phaser.Stage.prototype, "backgroundColor", {

    get: function () {
        return this._backgroundColor;
    },

    set: function (color) {

        this._backgroundColor = color;

        if (typeof color === 'string')
        {
            color = Phaser.Color.hexToRGB(color);
        }

        this._stage.setBackgroundColor(color);

    }

});
