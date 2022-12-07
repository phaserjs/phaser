/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NineSlice = require('./NineSlice');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Nine Slice Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Nine Slice Game Object and WebGL support have been built into Phaser.
 *
 * A Nine Slice Game Object allows you to have a Sprite that can be stretched
 * both horizontally and vertically but that retains fixed-sized corners.
 * This is useful for UI and Button-like elements.
 *
 *      A                          B
 *    +---+----------------------+---+
 *  C | 1 |          2           | 3 |
 *    +---+----------------------+---+
 *    |   |                      |   |
 *    | 4 |          5           | 6 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *  D | 7 |          8           | 9 |
 *    +---+----------------------+---+
 *
 *  When changing this objects width and/or height:
 *
 *     areas 1, 3, 7 and 9 will remain unscaled.
 *     areas 2 and 8 will be stretched horizontally
 *     areas 4 and 6 will be stretched vertically
 *     area 5 will be stretched both horizontally and vertically
 *
 * You can also have a 3 slice:
 *
 * This works in a similar way, except you can only stretch it horizontally.
 * Therefore, it requires less configuration:
 *
 *      A                          B
 *    +---+----------------------+---+
 *    |   |                      |   |
 *  C | 1 |          2           | 3 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *
 *  When changing this objects width:
 *
 *     areas 1 and 3 will remain unscaled.
 *     area 2 will be stretched horizontally
 *
 * To create a 3 slice object set `topHeight` and `bottomHeight` to zero, or leave them undefined.
 *
 * @method Phaser.GameObjects.GameObjectFactory#nineslice
 * @webglOnly
 * @since 3.60.0
 *
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number} [width=256] - The width of the NineSlice Game Object in pixels. This is the width you want it displayed as, in game.
 * @param {number} [height=256] - The height of the NineSlice Game Object in pixels. This is the height you want it displayed as, in game.
 * @param {number} [leftWidth=0] - The size of the left vertical column (A). Set to zero to disable this column.
 * @param {number} [rightWidth=0] - The size of the right vertical column (B). Set to zero to disable this column.
 * @param {number} [topHeight=0] - The size of the top horiztonal row (C). Set to zero to disable this row.
 * @param {number} [bottomHeight=0] - The size of the bottom horiztonal row (D). Set to zero to disable this row.
 *
 * @return {Phaser.GameObjects.NineSlice} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('nineslice', function (x, y, texture, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight)
    {
        return this.displayList.add(new NineSlice(this.scene, x, y, texture, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight));
    });
}
