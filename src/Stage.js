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
 */
Phaser.Stage = function (game) {
	
	this.game = game;

	this.bounds = new Phaser.Rectangle;
	this.offset = new Phaser.Point;

};

Phaser.Stage.prototype = {

	_onChange: null,
	_s: null,

	bounds: null,
	offset: null,
	
	boot: function () {

		//	Get the offset values (for input and other things)
		Phaser.Canvas.getOffset(this.game.renderer.view, this.offset);
		this.bounds.setTo(this.offset.x, this.offset.y, this.game.width, this.game.height);

		this._s = new PIXI.Stage(0x000000);

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
	        console.log('visibilityChange - hidden', event);
	        this.game.paused = true;
        }
        else
        {
	        console.log('visibilityChange - shown', event);
	        this.game.paused = false;
        }

    },

};