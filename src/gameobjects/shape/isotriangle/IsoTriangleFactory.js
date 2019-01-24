/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../../GameObjectFactory');
var IsoTriangle = require('./IsoTriangle');

/**
 * Creates a new IsoTriangle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the IsoTriangle Game Object has been built into Phaser.
 * 
 * The IsoTriangle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports only fill colors and cannot be stroked.
 * 
 * An IsoTriangle is an 'isometric' triangle. Think of it like a pyramid. Each face has a different
 * fill color. You can set the color of the top, left and right faces of the triangle respectively
 * You can also choose which of the faces are rendered via the `showTop`, `showLeft` and `showRight` properties.
 * 
 * You cannot view an IsoTriangle from under-neath, however you can change the 'angle' by setting
 * the `projection` property. The `reversed` property controls if the IsoTriangle is rendered upside
 * down or not.
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
