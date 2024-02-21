/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NineSlice = require('./NineSlice');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * A Nine Slice Game Object allows you to display a texture-based object that
 * can be stretched both horizontally and vertically, but that retains
 * fixed-sized corners. The dimensions of the corners are set via the
 * parameters to this class.
 *
 * This is extremely useful for UI and button like elements, where you need
 * them to expand to accommodate the content without distorting the texture.
 *
 * The texture you provide for this Game Object should be based on the
 * following layout structure:
 *
 * ```
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
 * ```
 *
 * When changing this objects width and / or height:
 *
 *     areas 1, 3, 7 and 9 (the corners) will remain unscaled
 *     areas 2 and 8 will be stretched horizontally only
 *     areas 4 and 6 will be stretched vertically only
 *     area 5 will be stretched both horizontally and vertically
 *
 * You can also create a 3 slice Game Object:
 *
 * This works in a similar way, except you can only stretch it horizontally.
 * Therefore, it requires less configuration:
 *
 * ```
 *      A                          B
 *    +---+----------------------+---+
 *    |   |                      |   |
 *  C | 1 |          2           | 3 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 * ```
 *
 * When changing this objects width (you cannot change its height)
 *
 *     areas 1 and 3 will remain unscaled
 *     area 2 will be stretched horizontally
 *
 * The above configuration concept is adapted from the Pixi NineSlicePlane.
 *
 * To specify a 3 slice object instead of a 9 slice you should only
 * provide the `leftWidth` and `rightWidth` parameters. To create a 9 slice
 * you must supply all parameters.
 *
 * The _minimum_ width this Game Object can be is the total of
 * `leftWidth` + `rightWidth`.  The _minimum_ height this Game Object
 * can be is the total of `topHeight` + `bottomHeight`.
 * If you need to display this object at a smaller size, you can scale it.
 *
 * In terms of performance, using a 3 slice Game Object is the equivalent of
 * having 3 Sprites in a row. Using a 9 slice Game Object is the equivalent
 * of having 9 Sprites in a row. The vertices of this object are all batched
 * together and can co-exist with other Sprites and graphics on the display
 * list, without incurring any additional overhead.
 *
 * As of Phaser 3.60 this Game Object is WebGL only.
 *
 * @method Phaser.GameObjects.GameObjectFactory#nineslice
 * @webglOnly
 * @since 3.60.0
 *
 * @param {number} x - The horizontal position of the center of this Game Object in the world.
 * @param {number} y - The vertical position of the center of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number} [width=256] - The width of the Nine Slice Game Object. You can adjust the width post-creation.
 * @param {number} [height=256] - The height of the Nine Slice Game Object. If this is a 3 slice object the height will be fixed to the height of the texture and cannot be changed.
 * @param {number} [leftWidth=10] - The size of the left vertical column (A).
 * @param {number} [rightWidth=10] - The size of the right vertical column (B).
 * @param {number} [topHeight=0] - The size of the top horiztonal row (C). Set to zero or undefined to create a 3 slice object.
 * @param {number} [bottomHeight=0] - The size of the bottom horiztonal row (D). Set to zero or undefined to create a 3 slice object.
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
