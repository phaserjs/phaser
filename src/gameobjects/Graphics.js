/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new `Graphics` object.
* 
* @class Phaser.Graphics
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} x - X position of the new graphics object.
* @param {number} y - Y position of the new graphics object.
*/
Phaser.Graphics = function (game, x, y) {

    this.game = game;

    PIXI.Graphics.call(this);

    /**
    * @property {number} type - The Phaser Object Type.
	*/
    this.type = Phaser.GRAPHICS;

    this.position.x = x;
    this.position.y = y;

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

/**
* Destroy this Graphics instance.
* 
* @method Phaser.Sprite.prototype.destroy
*/
Phaser.Graphics.prototype.destroy = function() {

    this.clear();

    if (this.parent)
    {
        this.parent.remove(this);
    }

    this.game = null;

}

/*
* Draws a {Phaser.Polygon} or a {PIXI.Polygon} filled
* 
* @method Phaser.Sprite.prototype.drawPolygon
*/
Phaser.Graphics.prototype.drawPolygon = function (poly) {

    this.moveTo(poly.points[0].x, poly.points[0].y);

    for (var i = 1; i < poly.points.length; i += 1)
    {
        this.lineTo(poly.points[i].x, poly.points[i].y);
    }

    this.lineTo(poly.points[0].x, poly.points[0].y);
    
}
