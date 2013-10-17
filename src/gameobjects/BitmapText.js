/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.BitmapText
*/

/**
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager, consists of Animation.Frame objects and belongs to a single Game Object such as a Sprite.
*
* @class Phaser.BitmapText
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - X position of Description.
* @param {number} y - Y position of Description.
* @param {string} text - Description.
* @param {string} style - Description.
*/
Phaser.BitmapText = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;

    text = text || '';
    style = style || '';

	/** 
	* @property {boolean} exists - If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all.
	* @default
	*/
    this.exists = true;

	/**
    * @property {boolean} alive - This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering.
	* @default
	*/
    this.alive = true;

	/**
    * @property {Description} group - Description.
 	* @default
 	*/
    this.group = null;

	/**
    * @property {string} name - Description.
  	* @default
  	*/
    this.name = '';

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    PIXI.BitmapText.call(this, text, style);

    /**
    * @property {Description} type - Description.
    */
    this.type = Phaser.BITMAPTEXT;

	/**
	* @property {number} position.x - Description.
	*/
    this.position.x = x;
    
	/**
	* @property {number} position.y - Description.
	*/
    this.position.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
	/**
	* @property {Phaser.Point} anchor - Description.
	*/
    this.anchor = new Phaser.Point();
    
	/**
	* @property {Phaser.Point} scale - Description.
	*/
    this.scale = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
	/**
	* @property {function} _cache - Description.
	* @private
	*/
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  The previous calculated position
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1

    };

    this._cache.x = this.x;
    this._cache.y = this.y;

	/**
	* @property {boolean} renderable - Description.
	* @private
	*/
    this.renderable = true;

};

Phaser.BitmapText.prototype = Object.create(PIXI.BitmapText.prototype);
// Phaser.BitmapText.prototype = Phaser.Utils.extend(true, PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

/**
* Automatically called by World.update
* @method Phaser.BitmapText.prototype.update
*/
Phaser.BitmapText.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x;
    this._cache.y = this.y;

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

    this.pivot.x = this.anchor.x*this.width;
    this.pivot.y = this.anchor.y*this.height;

}

/**
* @method Phaser.Text.prototype.destroy
*/
Phaser.BitmapText.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    if (this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    this.exists = false;

    this.group = null;

}

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

/**
* Get
* @returns {Description}
*//**
* Set
* @param {Description} value - Description
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});
