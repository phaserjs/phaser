/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new <code>Graphics</code> object.
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
	* @property {Description} type - Description.
	*/
    this.type = Phaser.GRAPHICS;

    this.position.x = x;
    this.position.y = y;    

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

/*
* Draws a {Phaser.Polygon} or a {PIXI.Polygon} filled
*/
Phaser.Graphics.prototype.drawPolygon = function (poly) {

    graphics.moveTo(poly.points[0].x, poly.points[0].y);

    for (var i = 1; i < poly.points.length; i += 1)
    {
        graphics.lineTo(poly.points[i].x, poly.points[i].y);
    }

    graphics.lineTo(poly.points[0].x, poly.points[0].y);
    
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
