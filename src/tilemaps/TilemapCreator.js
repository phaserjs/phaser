/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectCreator = require('../gameobjects/GameObjectCreator');
var ParseToTilemap = require('./ParseToTilemap');

/**
 * Creates a Tilemap from the given key or data, or creates a blank Tilemap if no key/data provided.
 * When loading from CSV or a 2D array, you should specify the tileWidth & tileHeight. When parsing
 * from a map from Tiled, the tileWidth, tileHeight, width & height will be pulled from the map
 * data. For an empty map, you should specify tileWidth, tileHeight, width & height.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tilemap
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tilemaps.TilemapConfig} [config] - The config options for the Tilemap.
 *
 * @return {Phaser.Tilemaps.Tilemap}
 */
GameObjectCreator.register('tilemap', function (config)
{
    // Defaults are applied in ParseToTilemap
    var c = (config !== undefined) ? config : {};

    return ParseToTilemap(
        this.scene,
        c.key,
        c.tileWidth,
        c.tileHeight,
        c.width,
        c.height,
        c.data,
        c.insertNull
    );
});
