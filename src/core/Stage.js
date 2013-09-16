/**
 * Stage
 *
 * The Stage controls the canvas on which everything is displayed. It handles display within the browser,
 * focus handling, game resizing, scaling and the pause, boot and orientation screens.
 *
 * @package    Phaser.Stage
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License


* @class Phaser.Camera
* @constructor
* @param game {Phaser.Game} game reference to the currently running game.
* @param width {number} width of the canvas element
* @param height {number} height of the canvas element
 */
Phaser.Stage = function (game, width, height) {
	
	this.game = game;

    /**
    * Background color of the stage (defaults to black). Set via the public backgroundColor property.
    * @type {string}
    */
    this._backgroundColor = 'rgb(0,0,0)';

	//	Get the offset values (for input and other things)
	this.offset = new Phaser.Point;

    this.canvas = Phaser.Canvas.create(width, height);    
    this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';

    //  The Pixi Stage which is hooked to the renderer
    this._stage = new PIXI.Stage(0x000000, false);
    this._stage.name = '_stage_root';
    
    this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
    this.scale = new Phaser.StageScaleMode(this.game, width, height);
    this.aspectRatio = width / height;

};

Phaser.Stage.prototype = {

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
