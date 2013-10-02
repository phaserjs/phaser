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

    PIXI.Graphics.call(this);

    /**
	* @property {Description} type - Description.
	*/
    this.type = Phaser.GRAPHICS;

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;
Phaser.Graphics.prototype = Phaser.Utils.extend(true, Phaser.Graphics.prototype, Phaser.Sprite.prototype);

//  Add our own custom methods

Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});
