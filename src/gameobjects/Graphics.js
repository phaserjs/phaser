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

/**
* Indicates the rotation of the Button in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the rotation property instead. Working in radians is also a little faster as it doesn't have to convert the angle.
* 
* @name Phaser.Button#angle
* @property {number} angle - The angle of this Button in degrees.
*/
