/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Stage
*/

/**
*
* The Stage controls the canvas on which everything is displayed. It handles display within the browser,
* focus handling, game resizing, scaling and the pause, boot and orientation screens.
*
* @class Stage
* @constructor
* @param game {Phaser.Game} game reference to the currently running game.
* @param width {number} width of the canvas element
* @param height {number} height of the canvas element
 */
Phaser.Stage = function (game, width, height) {

	/**
    * A reference to the currently running Game.
    * @property game
    * @public
    * @type {Phaser.Game}
    */
	this.game = game;

    /**
    * Background color of the stage (defaults to black). Set via the public backgroundColor property.
    * @property _backgroundColor
    * @private
    * @type {string}
    */
    this._backgroundColor = 'rgb(0,0,0)';

    /**
    * Get the offset values (for input and other things)
    * @property offset
    * @public
    * @type {Phaser.Point}
    */
	this.offset = new Phaser.Point;
    
    /**
    * reference to the newly created <canvas> element
    * @property canvas
    * @public
    * @type {HTMLCanvasElement}
    */
    this.canvas = Phaser.Canvas.create(width, height);    
    this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
    
    /**
    * The Pixi Stage which is hooked to the renderer
    * @property _stage
    * @private
    * @type {PIXI.Stage}
    */
    this._stage = new PIXI.Stage(0x000000, false);
    this._stage.name = '_stage_root';

    /**
    * The current scaleMode
    * @property scaleMode
    * @public
    * @type {Phaser.StageScaleMode}
    */
    this.scaleMode = Phaser.StageScaleMode.NO_SCALE;

    /**
    * The scale of the current running game
    * @property scale
    * @public
    * @type {Phaser.StageScaleMode}
    */
    this.scale = new Phaser.StageScaleMode(this.game, width, height);

    /**
    * aspect ratio
    * @property aspectRatio
    * @public
    * @type {number}
    */
    this.aspectRatio = width / height;

};

Phaser.Stage.prototype = {

    /**
    * Initialises the stage and adds the event listeners
    * @method boot
    */
    boot: function () {

        Phaser.Canvas.getOffset(this.canvas, this.offset);

        this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, this.game.width, this.game.height);

        var _this = this;

        this._onChange = function (event) {
            return _this.visibilityChange(event);
        }

        document.addEventListener('visibilitychange', this._onChange, false);
        document.addEventListener('webkitvisibilitychange', this._onChange, false);
        document.addEventListener('pagehide', this._onChange, false);
        document.addEventListener('pageshow', this._onChange, false);

        window.onblur = this._onChange;
        window.onfocus = this._onChange;

    },

	/**
    * This method is called when the document visibility is changed.
    * @method visibilityChange
    * @param event [Event] its type will be used to decide whether the game should be paused or not
    */
    visibilityChange: function (event) {

        if (this.disableVisibilityChange)
        {
            return;
        }

        if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true)
        {
	        // console.log('visibilityChange - hidden', event);
	        this.game.paused = true;
        }
        else
        {
	        // console.log('visibilityChange - shown', event);
	        this.game.paused = false;
        }

    },

};

Object.defineProperty(Phaser.Stage.prototype, "backgroundColor", {

    /**
    * @method backgroundColor
    * @return {string} returns the background color of the stage
    */
    get: function () {
        return this._backgroundColor;
    },

    /**
    * @method backgroundColor
    * @param {string} the background color you want the stage to have
    * @return {string} returns the background color of the stage
    */
    set: function (color) {

        this._backgroundColor = color;

        if (typeof color === 'string')
        {
            color = Phaser.Color.hexToRGB(color);
        }

        this._stage.setBackgroundColor(color);

    }

});
