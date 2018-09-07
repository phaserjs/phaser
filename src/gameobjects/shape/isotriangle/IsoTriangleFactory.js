/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var IsoTriangle = require('./IsoTriangle');

/**
 * Creates a new IsoTriangle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the IsoTriangle Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#isotriangle
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [size=48] - The width of the iso triangle in pixels. The left and right faces will be exactly half this value.
 * @param {number} [height=32] - The height of the iso triangle. The left and right faces will be this tall. The overall height of the iso triangle will be this value plus half the `size` value.
 * @param {boolean} [reversed=false] - Is the iso triangle upside down?
 * @param {number} [fillTop=0xeeeeee] - The fill color of the top face of the iso triangle.
 * @param {number} [fillLeft=0x999999] - The fill color of the left face of the iso triangle.
 * @param {number} [fillRight=0xcccccc] - The fill color of the right face of the iso triangle.
 *
 * @return {Phaser.GameObjects.IsoTriangle} The Game Object that was created.
 */
GameObjectFactory.register('isotriangle', function (x, y, size, height, reversed, fillTop, fillLeft, fillRight)
{
    return this.displayList.add(new IsoTriangle(this.scene, x, y, size, height, reversed, fillTop, fillLeft, fillRight));
});
