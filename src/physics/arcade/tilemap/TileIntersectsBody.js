/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Physics.Arcade.Tilemap.TileIntersectsBody
 * @since 3.0.0
 *
 * @param {{ left: number, right: number, top: number, bottom: number }} tileWorldRect - [description]
 * @param {Phaser.Physics.Arcade.Body} body - [description]
 *
 * @return {boolean} [description]
 */
var TileIntersectsBody = function (tileWorldRect, body)
{
    // Currently, all bodies are treated as rectangles when colliding with a Tile. Eventually, this
    // should support circle bodies when those are less buggy in v3.

    return !(
        body.right <= tileWorldRect.left ||
        body.bottom <= tileWorldRect.top ||
        body.position.x >= tileWorldRect.right ||
        body.position.y >= tileWorldRect.bottom
    );
};

module.exports = TileIntersectsBody;
