/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * @param {object} [config] - The config options for the Tilemap.
 * @param {string} [config.key] - The key in the Phaser cache that corresponds to the loaded tilemap
 * data.
 * @param {integer[][]} [config.data] - Instead of loading from the cache, you can also load
 * directly from a 2D array of tile indexes.
 * @param {integer} [config.tileWidth=32] - The width of a tile in pixels.
 * @param {integer} [config.tileHeight=32] - The height of a tile in pixels.
 * @param {integer} [config.width=10] - The width of the map in tiles.
 * @param {integer} [config.height=10] - The height of the map in tiles.
 * @param {boolean} [config.insertNull=false] - Controls how empty tiles, tiles with an index of -1,
 * in the map data are handled. If `true`, empty locations will get a value of `null`. If `false`,
 * empty location will get a Tile object with an index of -1. If you've a large sparsely populated
 * map and the tile data doesn't need to change then setting this value to `true` will help with
 * memory consumption. However if your map is small or you need to update the tiles dynamically,
 * then leave the default value set.
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

//  When registering a factory function 'this' refers to the GameObjectCreator context.
