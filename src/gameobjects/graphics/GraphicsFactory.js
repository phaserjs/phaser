/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObjects.Graphics.FACTORY_KEY = 'graphics';

/**
* Creates a new Graphics object.
*
* @method Phaser.GameObjectFactory#graphics
* @param {number} [x=0] - The x coordinate of the Graphic. The coordinate is relative to any parent container this object may be in.
* @param {number} [y=0] - The y coordinate of the Graphic. The coordinate is relative to any parent container this object may be in.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Graphics} The newly created graphics object.
*/
Phaser.GameObjects.Graphics.FACTORY_ADD = function (x, y, group) {

    if (group === undefined) { group = this.world; }

    return group.add(new Phaser.GameObjects.Graphics(this.game, x, y));

};

/**
* Creates a new Graphics object.
*
* @method Phaser.GameObjectFactory#graphics
* @param {number} [x=0] - The x coordinate of the Graphic. The coordinate is relative to any parent container this object may be in.
* @param {number} [y=0] - The y coordinate of the Graphic. The coordinate is relative to any parent container this object may be in.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Graphics} The newly created graphics object.
*/
Phaser.GameObjects.Graphics.FACTORY_MAKE = function (x, y) {

    return new Phaser.GameObjects.Graphics(this.game, x, y);

};
