/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
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
* @param {Phaser.FlexGrid} manager - The FlexGrid that owns this FlexLayer.
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

    /**
    * @property {Phaser.Point} position
    */
    this.position = position;

    /**
    * @property {Phaser.Rectangle} bounds
    */
    this.bounds = bounds;

    /**
    * @property {Phaser.Point} scale
    */
    this.scale = scale;

    /**
    * @property {Phaser.Point} topLeft
    */
    this.topLeft = bounds.topLeft;

    /**
    * @property {Phaser.Point} topMiddle
    */
    this.topMiddle = new Phaser.Point(bounds.halfWidth, 0);

    /**
    * @property {Phaser.Point} topRight
    */
    this.topRight = bounds.topRight;

    /**
    * @property {Phaser.Point} bottomLeft
    */
    this.bottomLeft = bounds.bottomLeft;

    /**
    * @property {Phaser.Point} bottomMiddle
    */
    this.bottomMiddle = new Phaser.Point(bounds.halfWidth, bounds.bottom);

    /**
    * @property {Phaser.Point} bottomRight
    */
    this.bottomRight = bounds.bottomRight;

};

Phaser.FlexLayer.prototype = Object.create(Phaser.Group.prototype);
Phaser.FlexLayer.prototype.constructor = Phaser.FlexLayer;

/**
 * Resize.
 *
 * @method Phaser.FlexLayer#resize
 */
Phaser.FlexLayer.prototype.resize = function () {
};

/**
 * Debug.
 *
 * @method Phaser.FlexLayer#debug
 */
Phaser.FlexLayer.prototype.debug = function () {

    this.game.debug.text(this.bounds.width + ' x ' + this.bounds.height, this.bounds.x + 4, this.bounds.y + 16);
    this.game.debug.geom(this.bounds, 'rgba(0,0,255,0.9', false);

    this.game.debug.geom(this.topLeft, 'rgba(255,255,255,0.9');
    this.game.debug.geom(this.topMiddle, 'rgba(255,255,255,0.9');
    this.game.debug.geom(this.topRight, 'rgba(255,255,255,0.9');

};
