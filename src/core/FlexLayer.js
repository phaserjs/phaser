/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A responsive grid layer.
*
* @class Phaser.FlexLayer
* @extends Phaser.Group
* @constructor
* @param {Phaser.ScaleManager} manager - The ScaleManager.
*/
Phaser.FlexLayer = function (manager, position, bounds, scale) {

    Phaser.Group.call(this, manager.game, null, '__flexLayer' + manager.game.rnd.uuid(), false);

    /**
    * @property {Phaser.ScaleManager} scale - A reference to the ScaleManager.
    */
    this.manager = manager;

    /**
    * @property {Phaser.FlexGrid} grid - A reference to the FlexGrid that owns this layer.
    */
    this.grid = manager.grid;

    //  Bound to the grid
    this.position = position;
    this.bounds = bounds;
    this.scale = scale;

    this.topLeft = bounds.topLeft;
    this.topMiddle = new Phaser.Point(bounds.halfWidth, 0);
    this.topRight = bounds.topRight;

    this.bottomLeft = bounds.bottomLeft;
    this.bottomMiddle = new Phaser.Point(bounds.halfWidth, bounds.bottom);
    this.bottomRight = bounds.bottomRight;

};

Phaser.FlexLayer.prototype = Object.create(Phaser.Group.prototype);
Phaser.FlexLayer.prototype.constructor = Phaser.FlexLayer;

Phaser.FlexLayer.prototype.resize = function () {

};

Phaser.FlexLayer.prototype.debug = function () {

    this.game.debug.text(this.bounds.width + ' x ' + this.bounds.height, this.bounds.x + 4, this.bounds.y + 16);
    this.game.debug.geom(this.bounds, 'rgba(0,0,255,0.9', false);

    this.game.debug.geom(this.topLeft, 'rgba(255,255,255,0.9');
    this.game.debug.geom(this.topMiddle, 'rgba(255,255,255,0.9');
    this.game.debug.geom(this.topRight, 'rgba(255,255,255,0.9');


};

