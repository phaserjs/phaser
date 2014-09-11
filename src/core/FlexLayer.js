/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* WARNING: This is an EXPERIMENTAL class. The API will change significantly in the coming versions and is incomplete.
* Please try to avoid using in production games with a long time to build.
* This is also why the documentation is incomplete.
* 
* A responsive grid layer.
*
* @class Phaser.FlexLayer
* @extends Phaser.Group
* @constructor
* @param {Phaser.ScaleManager} manager - The ScaleManager.
* @param {Phaser.Point} position - A reference to the Point object used for positioning.
* @param {Phaser.Rectangle} bounds - A reference to the Rectangle used for the layer bounds.
* @param {Phaser.Point} scale - A reference to the Point object used for layer scaling.
*/
Phaser.FlexLayer = function (manager, position, bounds, scale) {

    Phaser.Group.call(this, manager.game, null, '__flexLayer' + manager.game.rnd.uuid(), false);

    /**
    * @property {Phaser.ScaleManager} scale - A reference to the ScaleManager.
    */
    this.manager = manager.manager;

    /**
    * @property {Phaser.FlexGrid} grid - A reference to the FlexGrid that owns this layer.
    */
    this.grid = manager;

    /**
     * Should the FlexLayer remain through a State swap?
     *
     * @type {boolean}
     */
    this.persist = false;

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
