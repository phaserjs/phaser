/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks for intersection between the given tile rectangle-like object and an Arcade Physics body.
 *
 * @function Phaser.Physics.Arcade.Tilemap.TileIntersectsBody
 * @since 3.0.0
 *
 * @param {{ left: number, right: number, top: number, bottom: number }} tileWorldRect - A rectangle object that defines the tile placement in the world.
 * @param {Phaser.Physics.Arcade.Body} body - The body to check for intersection against.
 *
 * @return {boolean} Returns `true` of the tile intersects with the body, otherwise `false`.
 */
var TileIntersectsBody = function (tileWorldRect, body)
{
    // Currently, all bodies are treated as rectangles when colliding with a Tile.

    return !(
        body.right <= tileWorldRect.left ||
        body.bottom <= tileWorldRect.top ||
        body.position.x >= tileWorldRect.right ||
        body.position.y >= tileWorldRect.bottom
    );
};

module.exports = TileIntersectsBody;
