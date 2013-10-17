/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Graphics
*/

/**
* Description.
* 
* @class Phaser.Graphics
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} [x] X position of Description.
* @param {number} [y] Y position of Description.
*/
Phaser.Graphics = function (game, x, y) {

    this.game = game;

    PIXI.Graphics.call(this);

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.GRAPHICS;

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

//  Add our own custom methods

/**
* Description.
* 
* @method Phaser.Sprite.prototype.destroy
*/
Phaser.Graphics.prototype.destroy = function() {

    this.clear();

    if (this.group)
    {
        this.group.remove(this);
    }

    this.game = null;

}

Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

Object.defineProperty(Phaser.Graphics.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

Object.defineProperty(Phaser.Graphics.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});
